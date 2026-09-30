<script setup lang="ts">
import { CollaborationTask } from '~/core/types'
import type { IListingCreateInput, IListingFormValues } from '~/core/types'
import { toCreateInput } from '~/core/listingForm'
import { useListingForm } from '~/composables/useListingForm'

// El formulario que comparten Publicar y Editar. Quien lo usa pone los valores
// de partida y las fotos (en el slot `photos`), y decide qué hacer al enviar.
const props = defineProps<{
  initialValues: IListingFormValues
  submitLabel: string
  submitting: boolean
  error: string
  requireTerms?: boolean
}>()

const emit = defineEmits<{
  submit: [input: IListingCreateInput]
  change: [values: IListingFormValues]
}>()

const TASKS = Object.values(CollaborationTask)

const { t } = useI18n()

const {
  handleSubmit,
  errors,
  defineField,
  isRegionComplete,
  focusFirstInvalid
} = useListingForm(props.initialValues, !!props.requireTerms)

const [title, titleAttrs] = defineField('title')
const [region] = defineField('region')
const [description, descriptionAttrs] = defineField('description')
const [tasks] = defineField('tasks')
const [capacity, capacityAttrs] = defineField('capacity')
const [whatsapp, whatsappAttrs] = defineField('whatsapp')
const [accepted] = defineField('accepted')

// Publicar guarda el borrador con cada cambio.
watch([title, region, description, tasks, capacity, whatsapp], () =>
  emit('change', {
    title: title.value,
    region: region.value,
    description: description.value,
    tasks: tasks.value,
    capacity: capacity.value,
    whatsapp: whatsapp.value
  })
)

// El orden de los chips es el del enum, no el del clic: así el dato guardado
// no depende de en qué orden se pulsaron.
const toggleTask = (task: CollaborationTask, checked: boolean) => {
  const next = checked
    ? [...tasks.value, task]
    : tasks.value.filter((selected: CollaborationTask) => selected !== task)
  tasks.value = TASKS.filter((option) => next.includes(option))
}

const onSubmit = handleSubmit(
  (values) => emit('submit', toCreateInput(values as IListingFormValues)),
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

    <slot name="photos" />

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
