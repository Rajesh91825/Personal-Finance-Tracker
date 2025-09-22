import React from "react";
import Modal from "./Modal";

interface ConfirmProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const Confirm: React.FC<ConfirmProps> = ({ open, title = "Confirm", message = "Are you sure?", onConfirm, onCancel, confirmLabel = "Yes", cancelLabel = "Cancel" }) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button className="btn-secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
};

export default Confirm;
