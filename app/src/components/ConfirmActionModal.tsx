import React from "react";
import Modal from "./Modal";

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  isDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      header={title}
      action={onCancel}
      body={
        <>
          <div>{message}</div>
          <div
            className="Flex-row Margin-top--20 Justify-content--end"
            style={{ gap: "10px" }}
          >
            <div
              className="Button Button-color--gray-1000"
              onClick={onCancel}
              style={{ flexGrow: 1 }}
            >
              Cancel
            </div>
            <div
              className={`Button Button--hollow ${
                isDanger ? "Button-color--red-1000" : "Button-color--blue-1000"
              }`}
              onClick={onConfirm}
              style={{ flexGrow: 1 }}
            >
              {confirmLabel}
            </div>
          </div>
        </>
      }
    />
  );
};

export default ConfirmActionModal;
