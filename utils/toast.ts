/**
 * Toast notification system
 * Simple toast context for displaying non-intrusive notifications
 */

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

let toastId = 0;
const toastListeners: Set<(toast: ToastMessage) => void> = new Set();

export function showToast(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info'): void {
  const id = String(toastId++);
  const toast: ToastMessage = { id, message, type };
  
  toastListeners.forEach(listener => listener(toast));
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    dismissToast(id);
  }, 3000);
}

export function dismissToast(id: string): void {
  // Toast will be removed by the Toast component when it receives null
  toastListeners.forEach(listener => listener({ id, message: '', type: 'info' }));
}

export function onToastChange(callback: (toast: ToastMessage) => void): () => void {
  toastListeners.add(callback);
  return () => toastListeners.delete(callback);
}

// Specific toast helpers
export function showSuccessToast(message: string): void {
  showToast(message, 'success');
}

export function showErrorToast(message: string): void {
  showToast(message, 'error');
}

export function showInfoToast(message: string): void {
  showToast(message, 'info');
}
