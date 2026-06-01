import { cloneElement, isValidElement } from 'react'
import { Spinner } from '../Spinner'

const variantClasses = {
  primary:
    'border-transparent bg-gradient-to-r from-primary to-primary-dark text-primary-foreground shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:from-primary/40 disabled:to-primary/40 disabled:shadow-none disabled:active:scale-100',
  secondary:
    'border-border/50 bg-card/80 backdrop-blur-sm text-foreground shadow-sm hover:bg-muted hover:shadow-md active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:active:scale-100',
  danger:
    'border-transparent bg-gradient-to-r from-error to-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:from-destructive/40 disabled:to-destructive/40 disabled:shadow-none disabled:active:scale-100',
  ghost:
    'border-transparent bg-transparent text-foreground hover:bg-muted active:scale-[0.98] disabled:text-muted-foreground disabled:active:scale-100',
}

export function Button({
  asChild = false,
  children,
  className = '',
  disabled = false,
  isLoading = false,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const composedClassName = `inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`
  const content = (
    <>
      {isLoading ? <Spinner size="sm" tone={variant === 'secondary' ? 'blue' : 'white'} /> : null}
      {children}
    </>
  )

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: `${composedClassName} ${children.props.className ?? ''}`,
      ...props,
    })
  }

  return (
    <button
      className={composedClassName}
      type={type}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  )
}
