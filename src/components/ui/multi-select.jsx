import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MultiSelect({ options, value, onChange, placeholder = "Select..." }) {
  const [open, setOpen] = React.useState(false)
  const handleSelect = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }
  const handleClear = (e) => {
    e.stopPropagation()
    onChange([])
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between flex items-center min-h-[40px] text-sm",
            value.length ? "" : "text-muted-foreground"
          )}
        >
          <div className="flex overflow-hidden gap-1 items-center">
            {value.length === 0 && <span>{placeholder}</span>}
            {value.length > 0 &&
              options
                .filter((opt) => value.includes(opt.value))
                .map((opt) => (
                  <span
                    key={opt.value}
                    className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs flex items-center gap-1"
                  >
                    {opt.label}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={e => {
                        e.stopPropagation()
                        onChange(value.filter((v) => v !== opt.value))
                      }}
                    />
                  </span>
                ))}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-2">
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const checked = value.includes(opt.value)
            return (
              <button
                type="button"
                key={opt.value}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded hover:bg-accent w-full text-left",
                  checked ? "bg-accent text-accent-foreground" : ""
                )}
                onClick={() => handleSelect(opt.value)}
              >
                <span className={cn("flex-1 text-sm", checked ? "font-semibold" : "")}>{opt.label}</span>
                {checked && <Check className="w-4 h-4 text-blue-500" />}
              </button>
            )
          })}
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-2 w-full"
          onClick={() => setOpen(false)}
        >
          Done
        </Button>
        {value.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={handleClear}
          >
            Clear All
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}