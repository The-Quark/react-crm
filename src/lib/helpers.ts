// eslint-disable-next-line no-unused-vars
export const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastFunc: any;
  let lastRan: number;
  return function (this: any, ...args: any[]) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan)
      );
    }
  };
};

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

export function deepMerge(obj1: any, obj2: any): any {
  const output = Object.assign({}, obj1);

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
        output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }

  return output;
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
