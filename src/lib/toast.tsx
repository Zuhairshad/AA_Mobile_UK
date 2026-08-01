import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ReactNode } from "react"

export type Toast = {
  id: number
  title: string
  detail?: string
  /** Optional follow-up, e.g. "View basket". */
  action?: { label: string; to: string }
}

type ToastValue = {
  toasts: Toast[]
  push: (toast: Omit<Toast, "id">) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastValue | null>(null)

const DISMISS_AFTER = 4500

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = nextId.current++
      // Cap the stack: three is enough to show a burst of quick-adds without
      // the column marching up the screen.
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }])
      timers.current.set(id, window.setTimeout(() => dismiss(id), DISMISS_AFTER))
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside a ToastProvider")
  return ctx
}
