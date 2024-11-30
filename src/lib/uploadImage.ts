import { cloudName, uploadPreset } from './cloudinary';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  // Asegurarse de que el uploadPreset esté definido
  if (uploadPreset) {
    formData.append('upload_preset', uploadPreset);
  } else {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not defined');
  }

  // Subir la imagen a Cloudinary
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  // Verificar que la respuesta sea correcta
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.secure_url; // Retorna la URL segura de la imagen
}
