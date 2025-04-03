import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LucideIcon } from "lucide-react"

interface ActionButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
  isLoading?: boolean
  disabled?: boolean
  className?: string
}

export function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
  isLoading = false,
  disabled = false,
  className = "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 h-9 w-9"
}: ActionButtonProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant={variant}
            size="icon"
            className={className}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
