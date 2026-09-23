import type { IAdRegion } from '../types'

// Las tareas de colaboración que un anfitrión puede pedir. El valor es el que
// se guarda y se envía; la etiqueta que ve el usuario sale de i18n
// (`publish_listing.tasks.<valor en minúsculas>`).
export enum CollaborationTask {
  Cooking = 'COOKING',
  Gardening = 'GARDENING',
  Cleaning = 'CLEANING',
  Childcare = 'CHILDCARE',
  PetCare = 'PET_CARE',
  Maintenance = 'MAINTENANCE',
  Other = 'OTHER'
}

// Lo que el usuario va rellenando, tal cual se persiste en localStorage.
export interface IListingDraft {
  title: string
  region: IAdRegion | null
  // Solo ids: los ficheros viven en IndexedDB, no en el borrador.
  photos: string[]
  description: string
  tasks: CollaborationTask[]
  capacity: number | null
  whatsapp: string
}

// Lo que se envía al crear. Sin fotos: todavía no hay dónde subirlas.
export interface IListingCreateInput {
  title: string
  region: IAdRegion
  description: string
  tasks: CollaborationTask[]
  capacity: number
  whatsapp: string
}

export interface IListing extends IListingCreateInput {
  id: string
  owner: string
  // URLs públicas. Vacío hasta que exista la subida de fotos.
  photos: string[]
  createdAt: string
}

export interface IListingModule {
  create(input: IListingCreateInput): Promise<IListing>
}
