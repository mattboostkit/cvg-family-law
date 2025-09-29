import * as React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, onValueChange, onChange, ...props }, ref) => (
    <select
      ref={ref}
      className={`flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      onChange={(event) => {
        onValueChange?.(event.target.value)
        onChange?.(event)
      }}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className = '', placeholder, children, ...props }, ref) => (
    <span
      ref={ref}
      className={className}
      {...props}
    >
      {children ?? placeholder ?? ''}
    </span>
  )
)
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className = '', children, value, ...props }, ref) => (
    <div
      ref={ref}
      data-value={value}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm hover:bg-gray-100 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
