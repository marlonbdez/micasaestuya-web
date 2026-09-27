const MAX_SIDE = 1600
const THUMB_SIDE = 400
const QUALITY = 0.82
const OUTPUT_TYPE = 'image/jpeg'
const WEBP_TYPE = 'image/webp'
const JPEG_TYPE = 'image/jpeg'

export interface IResizedPhoto {
  photo: Blob
  thumbnail: Blob
  contentType: string
}

const drawScaled = (
  bitmap: ImageBitmap,
  maxSide: number
): HTMLCanvasElement => {
  // Solo encoge, nunca agranda.
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Unable to get a 2d context from the canvas')
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

  return canvas
}

const encode = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality))

export const useImageResize = () => {
  // El reescalado de siempre: una sola imagen, JPEG. Lo sigue usando /post-ad
  // (modelo anterior al pivote) a través de useDraftPhotos.
  const resizeImage = async (file: File): Promise<Blob> => {
    // Sin `imageOrientation` las fotos verticales de móvil salen tumbadas: la
    // rotación vive en los metadatos EXIF y el canvas no los mira.
    const bitmap = await createImageBitmap(file, {
      imageOrientation: 'from-image'
    })

    try {
      const canvas = drawScaled(bitmap, MAX_SIDE)
      const blob = await encode(canvas, OUTPUT_TYPE, QUALITY)
      if (!blob) throw new Error('Unable to encode the image')
      return blob
    } finally {
      bitmap.close()
    }
  }

  // El de Publicar: la foto a 1600 px, su miniatura a 400 px (para Explorar)
  // y el tipo real que se pudo codificar.
  const resizePhoto = async (file: File): Promise<IResizedPhoto> => {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: 'from-image'
    })

    try {
      const fullCanvas = drawScaled(bitmap, MAX_SIDE)
      const thumbCanvas = drawScaled(bitmap, THUMB_SIDE)

      // Algunos navegadores (Safari viejo) no saben codificar WebP desde un
      // canvas: en vez de fallar, `toBlob` devuelve otro tipo o `null`. Se
      // detecta con la foto grande y se reutiliza para la miniatura, para no
      // repetir la comprobación dos veces por cada foto.
      let photo = await encode(fullCanvas, WEBP_TYPE, QUALITY)
      const contentType = photo?.type === WEBP_TYPE ? WEBP_TYPE : JPEG_TYPE
      if (contentType === JPEG_TYPE)
        photo = await encode(fullCanvas, JPEG_TYPE, QUALITY)
      const thumbnail = await encode(thumbCanvas, contentType, QUALITY)

      if (!photo || !thumbnail) throw new Error('Unable to encode the image')

      return { photo, thumbnail, contentType }
    } finally {
      // createImageBitmap reserva memoria de decodificación aparte del canvas.
      bitmap.close()
    }
  }

  return { resizeImage, resizePhoto }
}
