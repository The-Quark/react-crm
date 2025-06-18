// eslint-disable-next-line no-unused-vars

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line no-undef
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function uniqueID(): string {
  return (Date.now() + Math.floor(Math.random() * 1000)).toString();
}

export const cleanValues = (values: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== 0 &&
        !(Array.isArray(value) && value.length === 0)
    )
  );
};

export const extToMime: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  txt: 'text/plain',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  html: 'text/html',
  htm: 'text/html',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
};
