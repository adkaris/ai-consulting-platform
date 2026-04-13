export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  durationMs?: number
}

type Listener = (toast: Toast) => void

const listeners = new Set<Listener>()

export function subscribeToToasts(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function toast(message: string, type: ToastType = 'info', durationMs = 3500): void {
  const t: Toast = { id: crypto.randomUUID(), message, type, durationMs }
  listeners.forEach((l) => l(t))
}

export const toastSuccess = (msg: string) => toast(msg, 'success')
export const toastError   = (msg: string) => toast(msg, 'error', 5000)
export const toastInfo    = (msg: string) => toast(msg, 'info')
