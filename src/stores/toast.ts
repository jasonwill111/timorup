import { atom } from 'nanostores';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const toasts = atom<Toast[]>([]);

let counter = 0;

export function addToast(message: string, type: ToastType = 'info', duration = 3000) {
  const id = `toast-${++counter}`;
  const $toasts = toasts.get() ?? undefined;
  toasts.set([...$toasts, { id, message, type, duration }]);

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }

  return id;
}

export function removeToast(id: string) {
  const $toasts = toasts.get() ?? undefined;
  toasts.set($toasts.filter(t => t.id !== id));
}

export function clearToasts() {
  toasts.set([]);
}

// Convenience functions
export function toast(message: string, type?: ToastType, duration?: number) {
  return addToast(message, type ?? 'info', duration);
}

export function toastSuccess(message: string, duration?: number) {
  return addToast(message, 'success', duration);
}

export function toastError(message: string, duration?: number) {
  return addToast(message, 'error', duration);
}

export function toastInfo(message: string, duration?: number) {
  return addToast(message, 'info', duration);
}

export function toastWarning(message: string, duration?: number) {
  return addToast(message, 'warning', duration);
}

// Attach convenience methods to main toast function
toast.success = toastSuccess;
toast.error = toastError;
toast.info = toastInfo;
toast.warning = toastWarning;
