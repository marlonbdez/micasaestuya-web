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

// Lo que se envía al crear. Las fotos se suben aparte, cuando el alojamiento ya existe.
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
  // URLs públicas de R2; la miniatura de cada una es `${url}-thumb`.
  photos: string[]
  createdAt: string
}

// Lo que pinta una tarjeta de Explorar (`GET /api/listings`).
export type IListingCard = Pick<
  IListing,
  'id' | 'title' | 'region' | 'tasks' | 'capacity' | 'photos'
>

export interface IListingPage {
  items: IListingCard[]
  total: number
}

// `GET /api/listings/:id`: el anfitrión llega solo con su nombre de pila.
export interface IListingDetail extends Omit<IListing, 'owner'> {
  owner: { id: string; firstName: string }
}

export interface IPhotoUploadRequest {
  contentType: string
}

// Lo que la api devuelve por cada foto pedida: el id que ella asigna y las
// dos URLs firmadas (foto y miniatura) para subir directo a R2.
export interface IPhotoUpload {
  photoId: string
  contentType: string
  uploadUrl: string
  thumbUploadUrl: string
}

export interface IListingModule {
  list(page: number): Promise<IListingPage>
  mine(): Promise<IListingCard[]>
  get(listingId: string): Promise<IListingDetail>
  create(input: IListingCreateInput): Promise<IListing>
  requestPhotoUploads(
    listingId: string,
    photos: IPhotoUploadRequest[]
  ): Promise<IPhotoUpload[]>
  confirmPhotos(listingId: string, photoIds: string[]): Promise<IListing>
  // Cambia los campos de texto; las fotos tienen sus propias llamadas.
  update(listingId: string, input: IListingCreateInput): Promise<IListing>
  removePhoto(listingId: string, photoId: string): Promise<void>
  remove(listingId: string): Promise<void>
}
