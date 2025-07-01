import { forwardRef, useState, useMemo } from "react"
import PropTypes from "prop-types"
import { HexColorPicker } from "react-colorful"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Custom hook to handle forwarded refs
const useForwardedRef = (ref) => {
  const innerRef = useRef(null)
  useEffect(() => {
    if (!ref) return
    if (typeof ref === "function") {
      ref(innerRef.current)
    } else {
      ref.current = innerRef.current
    }
  })
  return innerRef
}

const ColorPicker = forwardRef(
  (
    { disabled, value, onChange, onBlur, name, className, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef)
    const [open, setOpen] = useState(false)

    const parsedValue = useMemo(() => {
      return value || '#FFFFFF'
    }, [value])

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            {...props}
            className={cn('block', className)}
            name={name}
            onClick={() => {
              setOpen(true)
            }}
            size='icon'
            style={{
              backgroundColor: parsedValue,
            }}
            variant='outline'
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full'>
          <div className="flex flex-col gap-4">
            <HexColorPicker color={parsedValue} onChange={onChange} />
            <Input
              maxLength={7}
              onChange={(e) => {
                onChange(e?.currentTarget?.value)
              }}
              ref={ref}
              value={parsedValue}
            />
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

ColorPicker.displayName = 'ColorPicker'

ColorPicker.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  className: PropTypes.string,
}

export { ColorPicker } 