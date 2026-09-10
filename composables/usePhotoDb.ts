const DB_NAME = 'micasaestuya'
const DB_VERSION = 1
const STORE_NAME = 'ad-photos'

// Una sola conexión para toda la sesión: abrirla en cada operación deja
// conexiones vivas que bloquean el upgrade de la siguiente versión.
let connection: Promise<IDBDatabase> | null = null

const openDatabase = () => {
  if (connection) return connection

  connection = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this environment'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    // El único sitio donde se puede crear el almacén.
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      // Se olvida la conexión fallida: si no, la promesa rechazada se queda
      // cacheada y ningún intento posterior vuelve a abrir la base.
      connection = null
      reject(request.error)
    }
  })

  return connection
}

const runInStore = async <T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const database = await openDatabase()

  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    const request = run(transaction.objectStore(STORE_NAME))

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// `crypto.randomUUID` solo existe en contexto seguro. Al abrir el dev server
// desde el móvil por IP (http://192.168.x.x:3000) no está, y ahí es justo donde
// se prueban las fotos.
const newId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const usePhotoDb = () => {
  const savePhoto = async (photo: Blob) => {
    const id = newId()
    await runInStore('readwrite', (store) => store.put(photo, id))
    return id
  }

  const getPhoto = (id: string) =>
    runInStore<Blob | undefined>('readonly', (store) => store.get(id))

  const deletePhoto = (id: string) =>
    runInStore<undefined>('readwrite', (store) => store.delete(id))

  const clearPhotos = () =>
    runInStore<undefined>('readwrite', (store) => store.clear())

  return { savePhoto, getPhoto, deletePhoto, clearPhotos }
}
