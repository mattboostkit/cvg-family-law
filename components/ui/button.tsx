import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variantClasses = {
      default: 'bg-blue-600 text-white shadow hover:bg-blue-700 focus-visible:ring-blue-500',
      destructive: 'bg-red-600 text-white shadow hover:bg-red-700 focus-visible:ring-red-500',
      outline: 'border border-gray-300 bg-white shadow-sm hover:bg-gray-50 focus-visible:ring-gray-500',
      secondary: 'bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300 focus-visible:ring-gray-500',
      ghost: 'hover:bg-gray-100 focus-visible:ring-gray-500',
      link: 'text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500'
    }

    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3 text-xs',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10'
    }

    const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()

    return (
      <button
        className={combinedClassName}
        ref={ref}
        type={props.type || 'button'}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }