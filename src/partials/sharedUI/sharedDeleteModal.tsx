import React from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircularProgress, DialogActions } from '@mui/material';
import { useIntl } from 'react-intl';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const SharedDeleteModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm deletion',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText,
  cancelText,
  isLoading = false
}) => {
  const { formatMessage } = useIntl();
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {title || formatMessage({ id: 'SYSTEM.CONFIRM_DELETE_TITLE' })}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <DialogBody className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <CircularProgress />
            </div>
          ) : (
            description || formatMessage({ id: 'SYSTEM.CONFIRM_DELETE_DESCRIPTION' })
          )}
        </DialogBody>
        <DialogActions>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText || formatMessage({ id: 'SYSTEM.DELETE_CANCEL' })}
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              {isLoading
                ? formatMessage({ id: 'SYSTEM.LOADING' })
                : confirmText || formatMessage({ id: 'SYSTEM.DELETE_CONFIRM' })}
            </Button>
          </div>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
