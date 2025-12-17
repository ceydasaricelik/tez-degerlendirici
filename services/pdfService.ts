export const downloadTXT = (content: string, fileName: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], {type: 'text/plain;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download = `Rapor_${fileName}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
