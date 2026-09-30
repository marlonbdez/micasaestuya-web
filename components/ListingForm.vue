<script setup lang="ts">
import type { IListingPhoto } from './ListingPhotos.vue'
import { CollaborationTask } from '~/core/types'
import type { IListingCreateInput } from '~/core/types'
import type { DraftPhotoError } from '~/composables/useDraftPhotos'
import { MAX_PHOTOS, useListingForm } from '~/composables/useListingForm'
import type { IListingFormValues } from '~/composables/useListingForm'
import { toCreateInput } from '~/stores/listingDraft'

// El formulario que comparten Publicar y Editar. Quien lo usa pone los
// valores de partida y las fotos (cada pantalla las guarda a su manera) y
// decide qué hacer con lo que sale.
const props = defineProps<{
  initialValues: IListingFormValues
  photos: IListingPhoto[]
  photoSaving: boolean
  photoError: DraftPhotoError | null
  submitLabel: string
  submitting: boolean
  error: string
  requireTerms?: boolean
}>()

const emit = defineEmits<{
  submit: [input: IListingCreateInput]
  change: [values: IListingFormValues]
  'add-photos': [files: File[]]
  'remove-photo': [id: string]
}>()

const TASKS = Object.values(CollaborationTask)

const { t } = useI18n()

const {
  handleSubmit,
  errors,
  defineField,
  values,
  validateField,
  isRegionComplete,
  focusFirstInvalid
} = useListingForm(props.initialValues, {
  photoCount: () => props.photos.length,
  requireTerms: !!props.requireTerms
})

const [title, titleAttrs] = defineField('title')
const [region] = defineField('region')
const [description, descriptionAttrs] = defineField('description')
const [tasks] = defineField('tasks')
const [capacity, capacityAttrs] = defineField('capacity')
const [whatsapp, whatsappAttrs] = defineField('whatsapp')
const [accepted] = defineField('accepted')

watch(values, (current) => emit('change', current as IListingFormValues), {
  deep: true
})

// El aviso de "falta una foto" se quita en cuanto hay una.
watch(
  () => props.photos.length,
  () => errors.value.photos && validateField('photos')
)

// El orden de los chips es el del enum, no el del clic: así el dato guardado
// no depende de en qué orden se pulsaron.
const toggleTask = (task: CollaborationTask, checked: boolean) => {
  const next = checked
    ? [...tasks.value, task]
    : tasks.value.filter((selected: CollaborationTask) => selected !== task)
  tasks.value = TASKS.filter((option) => next.includes(option))
}

const photoMessage = computed(() =>
  props.photoError
    ? t(`publish_listing.errors.photos.${props.photoError}`, {
        max: MAX_PHOTOS
      })
    : errors.value.photos ?? ''
)

const onSubmit = handleSubmit(
  (form) =>
    emit(
      'submit',
      toCreateInput({
        title: form.title,
        region: form.region,
        photos: [],
        description: form.description,
        tasks: form.tasks,
        capacity: Number(form.capacity),
        whatsapp: form.whatsapp
      })
    ),
  ({ errors: invalid }) => focusFirstInvalid(invalid)
)
</script>

<template>
  <form class="listing-form" novalidate @submit.prevent="onSubmit">
    <BaseInput
      id="listing-title"
      v-model="title"
      v-bind="titleAttrs"
      :label="t('publish_listing.fields.title')"
      :placeholder="t('publish_listing.fields.title_placeholder')"
      :error-message="errors.title"
      @focusout="titleAttrs.onBlur"
    />

    <fieldset class="listing-form__group">
      <legend class="listing-form__legend">
        {{ t('publish_listing.fields.region') }}
      </legend>
      <RegionCascade
        v-model="region"
        @complete="(value: boolean) => (isRegionComplete = value)"
      />
      <p v-if="errors.region" class="listing-form__error">
        {{ errors.region }}
      </p>
    </fieldset>

    <ListingPhotos
      :photos="photos"
      :max="MAX_PHOTOS"
      :disabled="photos.length >= MAX_PHOTOS || photoSaving"
      :saving="photoSaving"
      :error-message="photoMessage"
      @select="(files: File[]) => emit('add-photos', files)"
      @remove="(id: string) => emit('remove-photo', id)"
    />

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

    <fieldset class="listing-form__group">
      <legend class="listing-form__legend">
        {{ t('publish_listing.fields.tasks') }}
      </legend>
      <div class="listing-form__tasks">
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
      <p v-if="errors.tasks" class="listing-form__error">{{ errors.tasks }}</p>
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
      v-if="requireTerms"
      id="listing-terms"
      v-model="accepted"
      :error-message="errors.accepted"
    >
      {{ t('publish_listing.terms') }}
    </BaseCheckbox>

    <BaseAlert v-if="error" variant="error">{{ error }}</BaseAlert>

    <div class="listing-form__submit">
      <BaseCta type="submit" size="lg" :disabled="submitting">
        <BaseSpinner v-if="submitting" />
        {{ submitLabel }}
      </BaseCta>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.listing-form {
  display: flex;
  flex-direction: column;
  gap: $gap-large;

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
