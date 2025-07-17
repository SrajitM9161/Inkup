export const downloadImage = (base64: string, filename = 'result.png') => {
  const link = document.createElement('a');
  link.href = base64;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};