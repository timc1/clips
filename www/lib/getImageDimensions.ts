export default async function getImageDimensions(
  file: File | Blob
): Promise<{ height: number; width: number }> {
  const blob = URL.createObjectURL(file);
  const image = await loadImageUrl(blob);

  return {
    height: image.height,
    width: image.width,
  };
}

async function loadImageUrl(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
