import React from 'react';
import { LogOut, X } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message,
  confirmText = "Logout",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <div style={styles.modalIcon}>
            <LogOut size={24} />
          </div>
          <button style={styles.closeButton} onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        
        <div style={styles.modalContent}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <p style={styles.modalMessage}>{message}</p>
        </div>
        
        <div style={styles.modalActions}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>
          <button style={styles.confirmBtn} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalCard: {
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    maxWidth: '400px',
    width: '90%',
    margin: '20px',
    position: 'relative',
    animation: 'slideUp 0.3s ease-out',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 24px 16px 24px',
    borderBottom: '1px solid #f0f0f0',
  },
  modalIcon: {
    width: '48px',
    height: '48px',
    background: '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#001affff',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#000000ff',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: '16px 24px 24px 24px',
  },
  modalTitle: {
    margin: '0 0 12px 0',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#000',
    fontFamily: "'sohne', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    letterSpacing: '-0.011em',
    lineHeight: '1.25',
  },
  modalMessage: {
    margin: 0,
    fontSize: '1rem',
    color: '#000000ff',
    lineHeight: '1.58',
    fontFamily: "'source-serif-pro', Georgia, serif",
    letterSpacing: '-0.003em',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    padding: '0 24px 24px 24px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #ddd',
    background: '#fff',
    color: '#000000ff',
    transition: 'all 0.2s ease',
    fontFamily: "'sohne', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    letterSpacing: '-0.003em',
    minWidth: '80px',
  },
  confirmBtn: {
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #dc2626',
    background: '#dc2626',
    color: '#fff',
    transition: 'all 0.2s ease',
    fontFamily: "'sohne', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    letterSpacing: '-0.003em',
    minWidth: '80px',
  },
};

export default ConfirmationModal;