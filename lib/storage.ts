export async function uploadAppIcon(
  file: File,
  slug: string
): Promise<string> {
  const fileBase64 = await fileToBase64(file);

  const response = await fetch('/api/upload-icon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: `${slug}-${Date.now()}.${getExtension(file.name)}`,
      fileBase64,
      contentType: file.type || 'image/png',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to upload app icon.');
  }

  if (!data?.iconUrl) {
    throw new Error(
      'GitHub upload succeeded but no icon URL was returned.'
    );
  }

  return data.iconUrl;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== 'string') {
        reject(new Error('Could not read the icon file.'));
        return;
      }

      const base64 = result.split(',')[1];

      if (!base64) {
        reject(new Error('Could not convert the icon to Base64.'));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error('Could not read the icon file.'));
    };

    reader.readAsDataURL(file);
  });
}

function getExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();

  return extension && /^[a-z0-9]+$/.test(extension)
    ? extension
    : 'png';
}