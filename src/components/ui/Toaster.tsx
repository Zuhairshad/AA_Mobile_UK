import { Link } from "react-router-dom"
import { useCart } from "../../lib/cart"
import { useToast } from "../../lib/toast"
import Icon from "./Icon"

/**
 * Bottom-right toast stack. `role="status"` on the region rather than on each
 * toast so a burst of quick-adds is announced as one changing region instead of
 * three competing live regions.
 */
export default function Toaster() {
  const { toasts, dismiss } = useToast()
  const { drawerOpen } = useCart()

  // The open basket is a better confirmation than a toast, and the toast stack
  // would otherwise sit on top of the drawer's Checkout button.
  if (drawerOpen || toasts.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in pointer-events-auto flex w-full items-start gap-3 border border-line bg-white p-4 shadow-lg sm:w-80"
        >
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Icon name="check" className="size-4" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.detail ? (
              <p className="mt-0.5 truncate text-sm text-ink-500">
                {toast.detail}
              </p>
            ) : null}
            {toast.action ? (
              <Link
                to={toast.action.to}
                onClick={() => dismiss(toast.id)}
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                {toast.action.label} →
              </Link>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss"
            className="btn btn-ghost -mt-1 -mr-1 size-7 shrink-0 px-0"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
