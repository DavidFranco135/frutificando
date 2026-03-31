const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY!;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export interface ImgBBResponse {
  url: string;
  thumb_url: string;
  display_url: string;
  delete_url: string;
}

/**
 * Upload an image file to ImgBB and return the URLs.
 */
export async function uploadToImgBB(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ImgBBResponse> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  // Use XMLHttpRequest for progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          resolve({
            url: response.data.url,
            thumb_url: response.data.thumb?.url || response.data.url,
            display_url: response.data.display_url,
            delete_url: response.data.delete_url,
          });
        } else {
          reject(new Error(response.error?.message || 'Falha no upload da imagem'));
        }
      } else {
        reject(new Error(`Erro HTTP ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Erro de rede no upload')));
    xhr.open('POST', IMGBB_UPLOAD_URL);
    xhr.send(formData);
  });
}

/**
 * Validate image file before upload.
 */
export function validateImageFile(file: File): string | null {
  const MAX_SIZE = 32 * 1024 * 1024; // 32MB (ImgBB limit)
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP.';
  }
  if (file.size > MAX_SIZE) {
    return 'Arquivo muito grande. O tamanho máximo é 32MB.';
  }
  return null;
}
