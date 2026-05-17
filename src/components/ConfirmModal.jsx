import { useLanguage } from "../hooks/useLanguage";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="a-modal-overlay">
      <div className="a-modal-content">
        <p>{message}</p>
        <div className="a-modal-actions">
          <button className="btn-ghost" onClick={onCancel}>{t("logout_cancel")}</button>
          <button className="btn-primary" onClick={onConfirm}>{t("logout_confirm")}</button>
        </div>
      </div>
    </div>
  );
}
