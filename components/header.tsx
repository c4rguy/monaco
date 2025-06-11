"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SettingsMenu } from "@/components/settings-menu"
import { UserMenu } from "@/components/user-menu"
import { Search, Play, PanelLeft, PlugZap } from "lucide-react" // ← Added PlugZap icon

interface HeaderProps {
  toggleCommandPalette: () => void
  toggleSidebar: () => void
  isSidebarCollapsed: boolean
  executeScript: () => void
}

export function Header({ toggleCommandPalette, toggleSidebar, isSidebarCollapsed, executeScript }: HeaderProps) {
  return (
    <header
      className="h-12 border-b backdrop-blur-sm flex items-center px-2 justify-between"
      style={{
        backgroundColor: "hsl(var(--ui-bg-secondary) / 0.5)",
        borderColor: "hsl(var(--ui-border))",
      }}
    >
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} style={{ color: "hsl(var(--ui-text-secondary))" }}>
          <PanelLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center ml-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-6 h-6 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-md flex items-center justify-center text-white font-bold text-xs mr-2"
          >
            P
          </motion.div>
          <span className="font-semibold" style={{ color: "hsl(var(--ui-text-primary))" }}>
            Pure
          </span>
          <span className="ml-2 text-xs" style={{ color: "hsl(var(--ui-text-muted))" }}>
            nextgen skibid utility
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCommandPalette}
          className="flex items-center gap-1"
          style={{ color: "hsl(var(--ui-text-secondary))" }}
        >
          <Search className="h-4 w-4" />
          <span>Scripts</span>
          <kbd
            className="ml-1 px-1.5 py-0.5 text-xs rounded"
            style={{
              backgroundColor: "hsl(var(--ui-bg-tertiary))",
              color: "hsl(var(--ui-text-muted))",
            }}
          >
            Ctrl+P
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={executeScript}
          style={{ color: "hsl(var(--ui-text-secondary))" }}
        >
          <Play className="h-4 w-4 mr-1" />
          <span>Execute</span>
          <kbd
            className="ml-1 px-1.5 py-0.5 text-xs rounded"
            style={{
              backgroundColor: "hsl(var(--ui-bg-tertiary))",
              color: "hsl(var(--ui-text-muted))",
            }}
          >
            Ctrl+↵
          </kbd>
        </Button>

        {/* god save my fucking soul */}
        {/*crguy u can fix ts bro ion know why it aint working*/}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => console.log("Inject clicked")}
          style={{ color: "hsl(var(--ui-text-secondary))" }}
        >
          <PlugZap className="h-4 w-4 mr-1" />
          <span>Inject</span>
        </Button>
      </div>
    </header>
  )
}
