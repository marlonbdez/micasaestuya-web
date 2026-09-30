import type { IListingCreateInput, IListingFormValues } from './types'

// El formulario admite huecos (región sin elegir, capacidad vacía); lo que se
// envía, no. Si falta algo, es que alguien envió sin validar.
export const toCreateInput = (
  values: IListingFormValues
): IListingCreateInput => {
  const capacity = Number(values.capacity)
  if (!values.region || values.capacity === '' || !Number.isInteger(capacity)) {
    throw new Error('The listing form is incomplete')
  }

  return {
    title: values.title.trim(),
    region: values.region,
    description: values.description.trim(),
    tasks: [...values.tasks],
    capacity,
    // Espacios y guiones fuera: el número tiene que servir tal cual para
    // abrir un chat de WhatsApp.
    whatsapp: values.whatsapp.replace(/[\s-]/g, '')
  }
}
