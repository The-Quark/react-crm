import { KeenIcon } from '@/components';
import clsx from 'clsx';

interface MediaFile {
  id: number;
  name: string;
  size: number;
  mime_type: string;
  original_url: string;
}

interface SharedFileCardProps {
  file: MediaFile;
  onClick: () => void;
  isNew?: boolean;
}

export const SharedFileCard = ({ file, onClick, isNew = false }: SharedFileCardProps) => {
  const isImage = file.mime_type.startsWith('image/');
  const isPdf = file.mime_type === 'application/pdf';
  const fileSizeKB = (file.size / 1024).toFixed(2);

  return (
    <div
      className={clsx(
        'card p-3 cursor-pointer hover:bg-gray-50 flex flex-nowrap flex-row justify-between gap-4',
        isNew && 'border border-blue-200 '
      )}
      onClick={onClick}
    >
      <div className="content-center text-center bg-gray-100 p-2 rounded-lg min-w-[60px]">
        {isImage ? (
          <KeenIcon icon="colors-square" className="text-blue-500" />
        ) : isPdf ? (
          <KeenIcon icon="file-sheet" className="text-red-500" />
        ) : (
          <KeenIcon icon="document" className="text-gray-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{file.name}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{fileSizeKB} KB</p>
          {isNew && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">New</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 truncate">{file.mime_type}</p>
      </div>
    </div>
  );
};
