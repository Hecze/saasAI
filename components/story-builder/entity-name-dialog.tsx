import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface EntityNameDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateEntity: (name: string) => void
  isCreating: boolean
  title: string
  entityLabel: string
  placeholder: string
  createButtonText: string
  initialValue?: string
  maxLength?: number
}

export function EntityNameDialog({
  isOpen,
  onOpenChange,
  onCreateEntity,
  isCreating,
  title,
  entityLabel,
  placeholder,
  createButtonText,
  initialValue = "",
  maxLength = 30
}: EntityNameDialogProps) {
  const [entityName, setEntityName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Initialize with initialValue when dialog opens and focus the input
  useEffect(() => {
    if (isOpen) {
      setEntityName(initialValue)
      // Set a small timeout to ensure the input is in the DOM
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [isOpen, initialValue])
  
  const handleCreateEntity = () => {
    if (entityName.trim()) {
      onCreateEntity(entityName)
      setEntityName("")
    }
  }
  
  const handleCancel = () => {
    onOpenChange(false)
    setEntityName("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating && entityName.trim()) {
      handleCreateEntity()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none  disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="entity-name" className="text-gray-300">{entityLabel}</Label>
            <Input 
              id="entity-name"
              ref={inputRef}
              value={entityName} 
              onChange={(e) => setEntityName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder} 
              maxLength={maxLength}
              autoComplete="off" // Disable browser autocomplete
              autoCorrect="off" // Disable autocorrect
              spellCheck="false" // Disable spell check
              className="bg-gray-800 border-gray-700 focus:border-purple-500 text-white"
              // Random name attribute to further prevent autofill
              name={`entity-name-${Math.random().toString(36).substring(2, 9)}`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="border-gray-700 text-slate-700 hover:bg-slate-700 hover:text-gray-200 hover:border-gray-600"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateEntity}
            disabled={!entityName.trim() || isCreating}
            className={`${!entityName.trim() || isCreating ? 
              'bg-purple-700/50 cursor-not-allowed' : 
              'bg-purple-600 hover:bg-purple-700'}`}
          >
            {isCreating ? "Procesando..." : createButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
