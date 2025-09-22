import React from "react";
import Modal from "./Modal";

type Props = {
  open?: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
};

export default function Confirm({
  open,
  title = "Confirm",
  onCancel,
  onConfirm,
  children,
}: Props) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn danger"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            Delete
          </button>
        </>
      }
    >
      {children || <p>Are you sure?</p>}
    </Modal>
  );
}
