import React, { useEffect } from "react";
import "../styles.css";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children, footer, width = "640px" }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ width }}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
