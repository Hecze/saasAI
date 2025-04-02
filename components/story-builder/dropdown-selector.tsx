"use client"

import React, { ReactNode } from "react"
import { Plus } from "lucide-react"

interface DropdownOption {
  id: string
  name: string
}

interface DropdownSelectorProps {
  title: string
  options: DropdownOption[]
  selectedId: string
  onSelect: (id: string) => void
  onCreateNew: () => void
  createNewText: string
  open: boolean
  onClose: () => void
  className?: string
}

export function DropdownSelector({
  title,
  options,
  selectedId,
  onSelect,
  onCreateNew,
  createNewText,
  open,
  onClose,
  className = "",
}: DropdownSelectorProps) {
  if (!open) return null;
  
  return (
    <div 
      className={`absolute right-0 mt-1 w-60 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2">
        <div className="text-xs text-gray-400 mb-2 font-medium">{title}</div>
        <div className="max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                onClose();
              }}
              className={`w-full text-left px-2 py-1.5 text-sm rounded ${
                option.id === selectedId 
                  ? "bg-purple-900/30 text-purple-300" 
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
            onCreateNew();
          }}
          className="w-full mt-2 flex items-center text-purple-400 hover:text-purple-300 text-sm px-2 py-1.5 rounded hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-1" /> {createNewText}
        </button>
      </div>
    </div>
  );
}
