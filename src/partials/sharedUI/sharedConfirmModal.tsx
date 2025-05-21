import React from 'react';
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import { KeenIcon } from '@/components';

export const SharedConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="container-fixed p-0 [&>button]:hidden">
        <DialogHeader className="modal-rounded-t p-0 border-0 relative min-h-20 flex flex-col items-stretch justify-end bg-center bg-cover bg-no-repeat modal-bg">
          <DialogTitle className="absolute top-0 text-1.5xl ml-4 mt-3">{title}</DialogTitle>
          <button
            className="btn btn-sm btn-icon btn-light btn-outline absolute top-0 end-0 me-3 mt-3 lg:me-3 shadow-default"
            data-modal-dismiss="true"
            onClick={onCancel}
          >
            <KeenIcon icon="cross" />
          </button>
        </DialogHeader>
        <DialogBody className="py-0 mb-5 ps-5 pe-3 me-3">
          <DialogDescription className="">{message}</DialogDescription>
          <div className="flex justify-end mt-2">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
