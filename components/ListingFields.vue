<script setup lang="ts">
import { useField } from 'vee-validate'
import { CollaborationTask } from '~/core/types'
import type { IAdRegion } from '~/core/types'

// Los campos que comparten Publicar y Editar. Van dentro de un formulario
// creado con `useListingForm`: cada campo se enlaza a él por su nombre. Las
// fotos, que cambian según la página, entran por el slot.
const emit = defineEmits<{ 'region-complete': [isComplete: boolean] }>()

const TASKS = Object.values(CollaborationTask)

const { t } = useI18n()

const {
  value: title,
  errorMessage: titleError,
  handleBlur: titleBlur
} = useField<string>('title')
const { value: region, errorMessage: regionError } = useField<IAdRegion | null>(
  'region'
)
const {
  value: description,
  errorMessage: descriptionError,
  handleBlur: descriptionBlur
} = useField<string>('description')
const { value: tasks, errorMessage: tasksError } =
  useField<CollaborationTask[]>('tasks')
const {
  value: capacity,
  errorMessage: capacityError,
  handleBlur: capacityBlur
} = useField<string>('capacity')
const {
  value: whatsapp,
  errorMessage: whatsappError,
  handleBlur: whatsappBlur
} = useField<string>('whatsapp')

// El orden de los chips es el del enum, no el del clic: así el dato guardado
// no depende de en qué orden se pulsaron.
const toggleTask = (task: CollaborationTask, checked: boolean) => {
  const next = checked
    ? [...tasks.value, task]
    : tasks.value.filter((selected) => selected !== task)
  tasks.value = TASKS.filter((option) => next.includes(option))
}
</script>

<template>
  <BaseInput
    id="listing-title"
    v-model="title"
    :label="t('publish_listing.fields.title')"
    :placeholder="t('publish_listing.fields.title_placeholder')"
    :error-message="titleError"
    @focusout="titleBlur"
  />

  <fieldset class="listing-fields__group">
    <legend class="listing-fields__legend">
      {{ t('publish_listing.fields.region') }}
    </legend>
    <RegionCascade
      v-model="region"
      @complete="(value: boolean) => emit('region-complete', value)"
    />
    <p v-if="regionError" class="listing-fields__error">{{ regionError }}</p>
  </fieldset>

  <slot />

  <BaseTextarea
    id="listing-description"
    v-model="description"
    :rows="4"
    :label="t('publish_listing.fields.description')"
    :placeholder="t('publish_listing.fields.description_placeholder')"
    :error-message="descriptionError"
    @focusout="descriptionBlur"
  />

  <fieldset class="listing-fields__group">
    <legend class="listing-fields__legend">
      {{ t('publish_listing.fields.tasks') }}
    </legend>
    <div class="listing-fields__tasks">
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
    <p v-if="tasksError" class="listing-fields__error">{{ tasksError }}</p>
  </fieldset>

  <BaseInput
    id="listing-capacity"
    v-model="capacity"
    type="number"
    :label="t('publish_listing.fields.capacity')"
    :error-message="capacityError"
    @focusout="capacityBlur"
  />

  <BaseInput
    id="listing-whatsapp"
    v-model="whatsapp"
    type="tel"
    autocomplete="tel"
    :label="t('publish_listing.fields.whatsapp')"
    :placeholder="t('publish_listing.fields.whatsapp_placeholder')"
    :error-message="whatsappError"
    @focusout="whatsappBlur"
  />
</template>

<style lang="scss" scoped>
// Un fieldset trae borde y padding del navegador: aquí agrupa, no decora.
.listing-fields__group {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

// Mismo aspecto que la etiqueta de BaseInput, para que todos los campos se
// lean igual aunque unos sean un input y otros un grupo.
.listing-fields__legend {
  @include font-outfit-light;
  color: var(--input-text-color);
  font-size: $font-size-md;
  padding: 0;
  margin: 0 0 $gap-small;
}

.listing-fields__error {
  color: var(--text-color-error);
  font-size: $font-size-sm;
  margin: $gap-small 0 0;
}

.listing-fields__tasks {
  display: flex;
  flex-wrap: wrap;
  gap: $gap-small;
}
</style>
