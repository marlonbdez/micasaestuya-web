const MAX_SIDE = 1600
const QUALITY = 0.82
const OUTPUT_TYPE = 'image/jpeg'

export const useImageResize = () => {
  const resizeImage = async (file: File): Promise<Blob> => {
    // Sin `imageOrientation` las fotos verticales de móvil salen tumbadas: la
    // rotación vive en los metadatos EXIF y el canvas no los mira.
    const bitmap = await createImageBitmap(file, {
      imageOrientation: 'from-image'
    })

    // Solo encoge, nunca agranda.
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)

    const context = canvas.getContext('2d')
    if (!context) {
      bitmap.close()
      throw new Error('Unable to get a 2d context from the canvas')
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Unable to encode the image'))
            return
          }
          resolve(blob)
        },
        OUTPUT_TYPE,
        QUALITY
      )
    })
  }

  return { resizeImage }
}
