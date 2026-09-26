<script setup lang="ts">
import { array, boolean, mixed, number, object, string } from 'yup'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { CollaborationTask } from '~/core/types'
import type { IAdRegion } from '~/core/types'
import { useListingDraftStore } from '~/stores/listingDraft'
import { useAuthStore } from '~/stores/auth'

defineI18nRoute({
  paths: {
    'es-CU': '/publicar-alojamiento',
    'es-DO': '/publicar-alojamiento',
    'en-CU': '/publish-listing',
    'en-DO': '/publish-listing'
  }
})

// No protege la página: se rellena sin cuenta. Está para restaurar la sesión
// desde el token guardado; sin él, un usuario ya logueado vería el modal.
definePageMeta({
  layout: 'minimal',
  middleware: ['auth']
})

const TITLE_MAX = 100
const CAPACITY_MIN = 1
const CAPACITY_MAX = 20
const MAX_PHOTOS = 10
// "+", código de país y el número; se admiten espacios y guiones al escribir.
const WHATSAPP_PATTERN = /^\+[1-9][\d\s-]{6,18}\d$/
const TASKS = Object.values(CollaborationTask)

const { t } = useI18n()
const localePath = useLocalePath()
const listingDraftStore = useListingDraftStore()
const authStore = useAuthStore()
const { isLogged } = storeToRefs(authStore)

// En el setup y antes de useForm: los valores iniciales salen del borrador.
listingDraftStore.hydrate()
const { draft } = storeToRefs(listingDraftStore)

// Lo decide RegionCascade (evento `complete`): la región sola no dice si
// quedaban niveles por elegir.
const isRegionComplete = ref(false)

const capacityRangeMessage = () =>
  t('publish_listing.errors.capacity_range', {
    min: CAPACITY_MIN,
    max: CAPACITY_MAX
  })

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: object({
    title: string()
      .trim()
      .required(() => t('publish_listing.errors.title_required'))
      .max(TITLE_MAX, () =>
        t('publish_listing.errors.title_max', { max: TITLE_MAX })
      ),
    region: mixed<IAdRegion>()
      .nullable()
      .test(
        'complete',
        () => t('publish_listing.errors.region_required'),
        (value) => !!value && isRegionComplete.value
      ),
    description: string()
      .trim()
      .required(() => t('publish_listing.errors.description_required')),
    tasks: array()
      .of(string())
      .min(1, () => t('publish_listing.errors.tasks_required')),
    capacity: number()
      .typeError(() => t('publish_listing.errors.capacity_required'))
      .required(() => t('publish_listing.errors.capacity_required'))
      .integer(() => capacityRangeMessage())
      .min(CAPACITY_MIN, () => capacityRangeMessage())
      .max(CAPACITY_MAX, () => capacityRangeMessage()),
    whatsapp: string()
      .trim()
      .required(() => t('publish_listing.errors.whatsapp_required'))
      .matches(WHATSAPP_PATTERN, () =>
        t('publish_listing.errors.whatsapp_invalid')
      ),
    accepted: boolean().isTrue(() => t('publish_listing.errors.terms_required'))
  }),
  initialValues: {
    title: draft.value.title,
    region: draft.value.region,
    description: draft.value.description,
    tasks: [...draft.value.tasks],
    // BaseInput trabaja con texto, también con type="number".
    capacity: draft.value.capacity === null ? '' : String(draft.value.capacity),
    whatsapp: draft.value.whatsapp,
    accepted: false
  }
})

const [title, titleAttrs] = defineField('title')
const [region] = defineField('region')
const [description, descriptionAttrs] = defineField('description')
const [tasks] = defineField('tasks')
const [capacity, capacityAttrs] = defineField('capacity')
const [whatsapp, whatsappAttrs] = defineField('whatsapp')
const [accepted] = defineField('accepted')

// El formulario es la vista; el store, lo que sobrevive a una recarga.
watch(title, (value) => listingDraftStore.update({ title: value ?? '' }))
watch(region, (value) => listingDraftStore.update({ region: value ?? null }))
watch(description, (value) =>
  listingDraftStore.update({ description: value ?? '' })
)
watch(tasks, (value) => listingDraftStore.update({ tasks: [...value] }))
watch(capacity, (value) => {
  const parsed = Number(value)
  listingDraftStore.update({
    capacity: value !== '' && Number.isInteger(parsed) ? parsed : null
  })
})
watch(whatsapp, (value) => listingDraftStore.update({ whatsapp: value ?? '' }))

// El orden de los chips es el del enum, no el del clic: así el dato guardado
// no depende de en qué orden se pulsaron.
const toggleTask = (task: CollaborationTask, checked: boolean) => {
  const next = checked
    ? [...tasks.value, task]
    : tasks.value.filter((selected: CollaborationTask) => selected !== task)
  tasks.value = TASKS.filter((option) => next.includes(option))
}

const {
  previews,
  isSaving,
  error: photoError,
  canAddMore,
  load: loadPhotos,
  add: addPhotos,
  remove: removePhoto
} = useDraftPhotos({
  getIds: () => listingDraftStore.draft.photos,
  setIds: (ids) => listingDraftStore.update({ photos: ids }),
  max: MAX_PHOTOS
})

onMounted(loadPhotos)

// --- Publicar -------------------------------------------------------------
// Identificarse no es un paso del formulario: se pide solo al final, y solo si
// hace falta. AuthModal ya escucha `showAuthModal`; aquí se espera a que el
// login ocurra y se sigue solo.
const isPublishing = ref(false)
const publishFailed = ref(false)
const isWaitingForLogin = ref(false)

const publish = async () => {
  isWaitingForLogin.value = false
  isPublishing.value = true
  publishFailed.value = false
  try {
    await listingDraftStore.publish()
    await navigateTo(localePath('publish-listing-published'))
  } catch {
    publishFailed.value = true
  } finally {
    isPublishing.value = false
  }
}

watch(isLogged, (logged) => {
  if (logged && isWaitingForLogin.value) publish()
})

// Si el modal se cierra sin identificarse, se cancela la publicación
// pendiente: un login posterior desde el header no debe publicar por sorpresa.
// Tras un login correcto isLogged ya es true y no se cancela nada.
authStore.$onAction(({ name }) => {
  if (name === 'hideAuthModal' && !isLogged.value) {
    isWaitingForLogin.value = false
  }
})

// Al fallar la validación, se lleva al usuario al primer campo con error: en
// móvil el botón queda muy lejos de lo que hay que arreglar.
const FIELD_IDS: Record<string, string> = {
  title: 'listing-title',
  region: 'ad-region-1',
  description: 'listing-description',
  tasks: `listing-task-${TASKS[0]}`,
  capacity: 'listing-capacity',
  whatsapp: 'listing-whatsapp',
  accepted: 'listing-terms'
}

const onSubmit = handleSubmit(
  () => {
    if (isLogged.value) return publish()
    isWaitingForLogin.value = true
    authStore.showAuthModal()
  },
  ({ errors: invalid }) => {
    const first = Object.keys(FIELD_IDS).find((field) => invalid[field])
    if (!first) return
    const element = document.getElementById(FIELD_IDS[first])
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element?.focus({ preventScroll: true })
  }
)
</script>

<template>
  <main class="publish-listing">
    <h1 class="publish-listing__title">{{ t('publish_listing.title') }}</h1>
    <p class="publish-listing__intro">{{ t('publish_listing.intro') }}</p>

    <form class="publish-listing__form" novalidate @submit.prevent="onSubmit">
      <BaseInput
        id="listing-title"
        v-model="title"
        v-bind="titleAttrs"
        :label="t('publish_listing.fields.title')"
        :placeholder="t('publish_listing.fields.title_placeholder')"
        :error-message="errors.title"
        @focusout="titleAttrs.onBlur"
      />

      <fieldset class="publish-listing__group">
        <legend class="publish-listing__legend">
          {{ t('publish_listing.fields.region') }}
        </legend>
        <RegionCascade
          v-model="region"
          @complete="(value: boolean) => (isRegionComplete = value)"
        />
        <p v-if="errors.region" class="publish-listing__error">
          {{ errors.region }}
        </p>
      </fieldset>

      <fieldset class="publish-listing__group">
        <legend class="publish-listing__legend">
          {{ t('publish_listing.fields.photos') }}
        </legend>
        <BaseFileInput
          id="listing-photos"
          accept="image/*"
          multiple
          :disabled="!canAddMore || isSaving"
          :label="t('publish_listing.fields.photos_add')"
          :hint="t('publish_listing.fields.photos_hint', { max: MAX_PHOTOS })"
          :error-message="
            photoError
              ? t(`publish_listing.errors.photos.${photoError}`, {
                  max: MAX_PHOTOS
                })
              : ''
          "
          @select="addPhotos"
        />
        <p v-if="isSaving" class="publish-listing__status">
          <BaseSpinner />
          {{ t('publish_listing.fields.photos_saving') }}
        </p>
        <ul v-if="previews.length" class="publish-listing__photos">
          <li
            v-for="(preview, index) in previews"
            :key="preview.id"
            class="publish-listing__photo"
          >
            <img
              class="publish-listing__photo-image"
              :src="preview.url"
              :alt="
                t('publish_listing.fields.photos_alt', { position: index + 1 })
              "
            />
            <span v-if="index === 0" class="publish-listing__photo-badge">
              {{ t('publish_listing.fields.photos_main') }}
            </span>
            <BaseCta
              variant="ghost"
              size="sm"
              type="button"
              class="publish-listing__photo-remove"
              :aria-label="t('publish_listing.fields.photos_remove')"
              @click="removePhoto(preview.id)"
            >
              <BaseIcon icon="close" size="xs" />
            </BaseCta>
          </li>
        </ul>
      </fieldset>

      <BaseTextarea
        id="listing-description"
        v-model="description"
        v-bind="descriptionAttrs"
        :rows="4"
        :label="t('publish_listing.fields.description')"
        :placeholder="t('publish_listing.fields.description_placeholder')"
        :error-message="errors.description"
        @focusout="descriptionAttrs.onBlur"
      />

      <fieldset class="publish-listing__group">
        <legend class="publish-listing__legend">
          {{ t('publish_listing.fields.tasks') }}
        </legend>
        <div class="publish-listing__tasks">
          <BaseCheckbox
            v-for="task in TASKS"
            :id="`listing-task-${task}`"
            :key="task"
            button
            :model-value="tasks.includes(task)"
            @update:model-value="(checked: boolean) => toggleTask(task, checked)"
          >
            {{ t(`publish_listing.tasks.${task.toLowerCase()}`) }}
          </BaseCheckbox>
        </div>
        <p v-if="errors.tasks" class="publish-listing__error">
          {{ errors.tasks }}
        </p>
      </fieldset>

      <BaseInput
        id="listing-capacity"
        v-model="capacity"
        v-bind="capacityAttrs"
        type="number"
        :label="t('publish_listing.fields.capacity')"
        :error-message="errors.capacity"
        @focusout="capacityAttrs.onBlur"
      />

      <BaseInput
        id="listing-whatsapp"
        v-model="whatsapp"
        v-bind="whatsappAttrs"
        type="tel"
        autocomplete="tel"
        :label="t('publish_listing.fields.whatsapp')"
        :placeholder="t('publish_listing.fields.whatsapp_placeholder')"
        :error-message="errors.whatsapp"
        @focusout="whatsappAttrs.onBlur"
      />

      <BaseCheckbox
        id="listing-terms"
        v-model="accepted"
        :error-message="errors.accepted"
      >
        {{ t('publish_listing.terms') }}
      </BaseCheckbox>

      <BaseAlert v-if="publishFailed" variant="error">
        {{ t('publish_listing.errors.publish') }}
      </BaseAlert>

      <div class="publish-listing__submit">
        <BaseCta
          type="submit"
          size="lg"
          :disabled="isPublishing"
          :aria-label="t('publish_listing.submit')"
        >
          <BaseSpinner v-if="isPublishing" />
          {{ t('publish_listing.submit') }}
        </BaseCta>
      </div>
    </form>
  </main>
</template>

<style lang="scss" scoped>
.publish-listing {
  max-width: px-to-rem(680);
  margin: 0 auto;
  padding: $gap-huge $gap-medium $gap-extra-huge;

  &__title {
    @include font-outfit-semibold;
    font-size: px-to-rem(30);
    margin: 0 0 $gap-small;
  }

  &__intro {
    color: var(--text-2);
    line-height: 1.6;
    margin: 0 0 $gap-extra-large;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $gap-large;
  }

  // Un fieldset trae borde y padding del navegador: aquí agrupa, no decora.
  &__group {
    border: 0;
    margin: 0;
    padding: 0;
    min-width: 0;
  }

  // Mismo aspecto que la etiqueta de BaseInput, para que todos los campos se
  // lean igual aunque unos sean un input y otros un grupo.
  &__legend {
    @include font-outfit-light;
    color: var(--input-text-color);
    font-size: $font-size-md;
    padding: 0;
    margin: 0 0 $gap-small;
  }

  &__error {
    color: var(--text-color-error);
    font-size: $font-size-sm;
    margin: $gap-small 0 0;
  }

  &__status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $gap-small;
    color: var(--text-2);
    margin: $gap-medium 0 0;
  }

  &__photos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(px-to-rem(120), 1fr));
    gap: $gap-small;
    list-style: none;
    padding: 0;
    margin: $gap-medium 0 0;
  }

  &__photo {
    position: relative;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--bg-2);
  }

  // La proporción la fija la rejilla, no la foto: si no, cada miniatura
  // tendría una altura distinta.
  &__photo-image {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  &__photo-badge {
    position: absolute;
    left: $gap-extra-tiny;
    bottom: $gap-extra-tiny;
    padding: $gap-tiny $gap-small;
    border-radius: var(--radius-pill);
    background: var(--warm);
    color: var(--bg);
    font-size: $font-size-sm;
  }

  &__photo-remove {
    position: absolute;
    top: $gap-extra-tiny;
    right: $gap-extra-tiny;
    background: var(--bg);
    border-radius: var(--radius-pill);
  }

  &__tasks {
    display: flex;
    flex-wrap: wrap;
    gap: $gap-small;
  }

  &__submit {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $gap-medium;
  }
}
</style>
