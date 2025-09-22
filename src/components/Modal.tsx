import React from "react";
import "../styles.css";

type Props = {
  title?: string;
  children?: React.ReactNode;
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
};

export default function Modal({
  title,
  children,
  open,
  isOpen,
  onClose,
  footer,
}: Props) {
  const visible = open ?? isOpen ?? true;
  if (!visible) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
