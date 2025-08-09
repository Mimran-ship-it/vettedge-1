"use client"
 
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
    {toasts.map(function ({ id, title, description, action, variant, ...props }) {
  const textColor =
    variant === "destructive" ? "text-white" : "text-foreground"

  return (
    <Toast key={id} variant={variant} {...props}>
      <div className="grid gap-1">
        {title && (
          <ToastTitle asChild>
            <div className={`text-center ${textColor}`}>{title}</div>
          </ToastTitle>
        )}
        {description && (
          <ToastDescription asChild>
            <div className={`text-center ${textColor}`}>{description}</div>
          </ToastDescription>
        )}
      </div>
      {action}
      <ToastClose />
    </Toast>
  )
})}

      <ToastViewport />
    </ToastProvider>
  )
}
