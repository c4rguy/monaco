"use client"

import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { LuaCompletion } from "@/lib/lua-autocomplete"
import { FunctionSquare, Hash, Variable, Dot, Play, Box, Circle } from "lucide-react"

interface AutocompletePopupProps {
  completions: LuaCompletion[]
  selectedIndex: number
  position: { x: number; y: number }
  onSelect: (completion: LuaCompletion) => void
  onClose: () => void
}

export function AutocompletePopup({ completions, selectedIndex, position, onSelect, onClose }: AutocompletePopupProps) {
  if (completions.length === 0) return null

  const getIcon = (kind: string) => {
    switch (kind) {
      case "function":
        return <FunctionSquare className="h-4 w-4 text-blue-400" />
      case "keyword":
        return <Hash className="h-4 w-4 text-purple-400" />
      case "variable":
        return <Variable className="h-4 w-4 text-green-400" />
      case "property":
        return <Dot className="h-4 w-4 text-yellow-400" />
      case "method":
        return <Play className="h-4 w-4 text-cyan-400" />
      case "class":
        return <Box className="h-4 w-4 text-orange-400" />
      case "constant":
        return <Circle className="h-4 w-4 text-red-400" />
      default:
        return <Variable className="h-4 w-4 text-zinc-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 border rounded-lg shadow-xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        maxWidth: "400px",
        minWidth: "300px",
        backgroundColor: "hsl(var(--ui-bg-secondary))",
        borderColor: "hsl(var(--ui-border))",
      }}
    >
      <ScrollArea className="max-h-64">
        <div className="p-1">
          {completions.map((completion, index) => (
            <div
              key={`${completion.label}-${index}`}
              className={`flex items-center px-3 py-2 cursor-pointer rounded-md ${
                index === selectedIndex ? "text-white" : "hover:bg-opacity-50"
              }`}
              style={{
                backgroundColor: index === selectedIndex ? "hsl(var(--ui-bg-tertiary))" : "transparent",
                color: index === selectedIndex ? "hsl(var(--ui-text-primary))" : "hsl(var(--ui-text-secondary))",
              }}
              onClick={() => onSelect(completion)}
              onMouseEnter={() => {
                if (index !== selectedIndex) {
                  const element = document.elementFromPoint(0, 0) as HTMLElement
                  if (element) {
                    element.style.backgroundColor = "hsl(var(--ui-bg-tertiary) / 0.3)"
                  }
                }
              }}
              onMouseLeave={() => {
                if (index !== selectedIndex) {
                  const element = document.elementFromPoint(0, 0) as HTMLElement
                  if (element) {
                    element.style.backgroundColor = "transparent"
                  }
                }
              }}
            >
              <div className="mr-3 flex-shrink-0">{getIcon(completion.kind)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">{completion.label}</span>
                  <span className="text-xs ml-2 flex-shrink-0" style={{ color: "hsl(var(--ui-text-muted))" }}>
                    {completion.kind}
                  </span>
                </div>
                {completion.detail && (
                  <div className="text-xs truncate" style={{ color: "hsl(var(--ui-text-muted))" }}>
                    {completion.detail}
                  </div>
                )}
                {completion.documentation && index === selectedIndex && (
                  <div className="text-xs mt-1 whitespace-normal" style={{ color: "hsl(var(--ui-text-muted))" }}>
                    {completion.documentation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div
        className="border-t px-3 py-2"
        style={{
          borderColor: "hsl(var(--ui-border))",
          backgroundColor: "hsl(var(--ui-bg-primary) / 0.5)",
        }}
      >
        <div className="flex items-center justify-between text-xs" style={{ color: "hsl(var(--ui-text-muted))" }}>
          <span>↑↓ navigate</span>
          <span>Tab/Enter select</span>
          <span>Esc close</span>
        </div>
      </div>
    </motion.div>
  )
}
