import { createRoot } from 'react-dom/client';
import { SharedConfirmModal } from '@/partials/sharedUI/sharedConfirmModal.tsx';

export const confirm = async (options: { title: string; message: string }): Promise<boolean> => {
  return new Promise((resolve) => {
    const modalRoot = document.createElement('div');
    document.body.appendChild(modalRoot);
    const root = createRoot(modalRoot);

    const handleClose = (result: boolean) => {
      root.unmount();
      document.body.removeChild(modalRoot);
      resolve(result);
    };

    root.render(
      <SharedConfirmModal
        title={options.title}
        message={options.message}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    );
  });
};
