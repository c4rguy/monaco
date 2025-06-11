"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import { useTheme } from "@/contexts/theme-context"
import { CodeEditor, type LuaError } from "@/components/code-editor"
import { FileExplorer } from "@/components/file-explorer"
import { OutputPanel } from "@/components/output-panel"
import { CommandPalette } from "@/components/command-palette"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatusBar } from "@/components/status-bar"
import { cn } from "@/lib/utils"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LuaScript {
  id: string
  name: string
  content: string
  lastModified: Date
}

export default function EditorPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { settings } = useSettings()
  const { theme } = useTheme()

  const [scripts, setScripts] = useState<LuaScript[]>([
    {
      id: "script1",
      name: "Pure",
      content: "// Welcome to Pure.",
      lastModified: new Date(),
    },
    {
      id: "script2",
      name: "ESP.lua",
      content:
        '-- ESP Script\nlocal ESP = {}\n\nfunction ESP:Enable()\n    print("ESP enabled")\nend\n\nfunction ESP:Disable()\n    print("ESP disabled")\nend\n\nreturn ESP',
      lastModified: new Date(),
    },
    {
      id: "script3",
      name: "Aimbot.lua",
      content:
        '-- Aimbot Script\nlocal Aimbot = {}\n\nfunction Aimbot:Toggle(enabled)\n    if enabled then\n        print("Aimbot enabled")\n    else\n        print("Aimbot disabled")\n    end\nend\n\nreturn Aimbot',
      lastModified: new Date(),
    },
  ])

  const [activeScriptId, setActiveScriptId] = useState("script1")
  const [openScripts, setOpenScripts] = useState<string[]>(["script1"])
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [outputVisible, setOutputVisible] = useState(true)
  const [output, setOutput] = useState<Array<{ type: string; content: string }>>([
    { type: "info", content: "Pure Lua Executor initialized." },
    { type: "info", content: "Ready to execute Lua scripts." },
  ])
  const [luaErrors, setLuaErrors] = useState<LuaError[]>([])

  const [dragActive, setDragActive] = useState(false)

  const handleFileOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          const newId = `script${Date.now()}_${Math.random()}`
          const newScript = {
            id: newId,
            name: file.name,
            content: content,
            lastModified: new Date(),
          }

          setScripts((prev) => [...prev, newScript])
          setOpenScripts((prev) => [...prev, newId])
          setActiveScriptId(newId)
        }
        reader.readAsText(file)
      })
    }
    event.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          const newId = `script${Date.now()}_${Math.random()}`
          const newScript = {
            id: newId,
            name: file.name,
            content: content,
            lastModified: new Date(),
          }

          setScripts((prev) => [...prev, newScript])
          setOpenScripts((prev) => [...prev, newId])
          setActiveScriptId(newId)
        }
        reader.readAsText(file)
      })
    }
  }

  const activeScript = scripts.find((script) => script.id === activeScriptId) || scripts[0]

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const updateScriptContent = (id: string, content: string) => {
    setScripts(scripts.map((script) => (script.id === id ? { ...script, content, lastModified: new Date() } : script)))
  }

  const executeScript = () => {
    if (!activeScript) return

    setOutput((prev) => [...prev, { type: "command", content: `Executing ${activeScript.name}...` }])

    setTimeout(() => {
      if (settings.autoInject) {
        setOutput((prev) => [...prev, { type: "info", content: "Auto-injecting code..." }])
      }

      if (luaErrors.some((error) => error.type === "error")) {
        setOutput((prev) => [
          ...prev,
          {
            type: "error",
            content: `Failed to execute ${activeScript.name}: Syntax errors detected.`,
          },
        ])
        return
      }

      setOutput((prev) => [...prev, { type: "success", content: `${activeScript.name} executed successfully.` }])

      if (activeScript.content.includes("print")) {
        const printStatements = activeScript.content.match(/print$$["'](.+?)["']$$/g)
        if (printStatements) {
          printStatements.forEach((statement) => {
            const match = statement.match(/print$$["'](.+?)["']$$/)
            if (match && match[1]) {
              setOutput((prev) => [...prev, { type: "info", content: match[1] }])
            }
          })
        }
      }
    }, 500)
  }

  const clearOutput = () => {
    setOutput([])
  }

  const toggleCommandPalette = () => {
    setIsCommandPaletteOpen(!isCommandPaletteOpen)
  }

  const openScript = (id: string) => {
    if (!openScripts.includes(id)) {
      setOpenScripts([...openScripts, id])
    }
    setActiveScriptId(id)
  }

  const closeScript = (id: string) => {
    if (openScripts.length > 1) {
      const newOpenScripts = openScripts.filter((scriptId) => scriptId !== id)
      setOpenScripts(newOpenScripts)

      if (activeScriptId === id) {
        setActiveScriptId(newOpenScripts[newOpenScripts.length - 1])
      }
    }
  }

  const addNewScript = () => {
    const newId = `script${Date.now()}`
    const newScript = {
      id: newId,
      name: "New Script.lua",
      content: '-- New Lua Script\n\nlocal function main()\n    print("Hello from Pure!")\nend\n\nmain()',
      lastModified: new Date(),
    }

    setScripts([...scripts, newScript])
    setOpenScripts([...openScripts, newId])
    setActiveScriptId(newId)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault()
        toggleCommandPalette()
      }

      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        executeScript()
      }

      if (e.ctrlKey && e.key === "n") {
        e.preventDefault()
        addNewScript()
      }

      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeScriptId, scripts])

  useEffect(() => {
    if (settings.autoExecute && activeScriptId) {
      executeScript()
    }
  }, [activeScriptId, settings.autoExecute])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div
      className={cn("h-screen flex flex-col text-zinc-200 overflow-hidden", `theme-${theme}`)}
      style={{ backgroundColor: "hsl(var(--ui-bg-primary))" }}
    >
      <Header
        toggleCommandPalette={toggleCommandPalette}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        executeScript={executeScript}
      />

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence initial={false}>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full border-r"
              style={{ borderColor: "hsl(var(--ui-border))" }}
            >
              <Sidebar>
                <FileExplorer
                  scripts={scripts}
                  activeScriptId={activeScriptId}
                  onSelectScript={openScript}
                  onAddScript={addNewScript}
                  onFileOpen={handleFileOpen}
                />
              </Sidebar>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex items-center border-b"
            style={{
              backgroundColor: "hsl(var(--ui-bg-secondary))",
              borderColor: "hsl(var(--ui-border))",
            }}
          >
            <ScrollArea className="w-full" orientation="horizontal">
              <div className="flex">
                {openScripts.map((scriptId) => {
                  const script = scripts.find((s) => s.id === scriptId)
                  if (!script) return null

                  return (
                    <div
                      key={script.id}
                      className={cn(
                        "flex items-center h-9 px-3 border-r cursor-pointer",
                        activeScriptId === script.id ? "text-white" : "hover:bg-opacity-30",
                      )}
                      style={{
                        backgroundColor: activeScriptId === script.id ? "hsl(var(--ui-bg-tertiary))" : "transparent",
                        borderColor: "hsl(var(--ui-border))",
                        color:
                          activeScriptId === script.id
                            ? "hsl(var(--ui-text-primary))"
                            : "hsl(var(--ui-text-secondary))",
                      }}
                      onClick={() => setActiveScriptId(script.id)}
                      onMouseEnter={(e) => {
                        if (activeScriptId !== script.id) {
                          e.currentTarget.style.backgroundColor = "hsl(var(--ui-bg-tertiary) / 0.3)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeScriptId !== script.id) {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }
                      }}
                    >
                      <span className="text-sm mr-2">{script.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full hover:bg-zinc-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          closeScript(script.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Close tab</span>
                      </Button>
                    </div>
                  )
                })}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none border-r"
                  style={{
                    borderColor: "hsl(var(--ui-border))",
                    color: "hsl(var(--ui-text-secondary))",
                  }}
                  onClick={addNewScript}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New script</span>
                </Button>
              </div>
            </ScrollArea>
          </div>

          <motion.div
            className={cn("flex-1 overflow-hidden relative", dragActive && "border-2 border-dashed border-blue-500")}
            style={{ backgroundColor: dragActive ? "hsl(var(--ui-bg-secondary) / 0.5)" : "transparent" }}
            layout
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {dragActive && (
              <div
                className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
                style={{ backgroundColor: "hsl(var(--ui-bg-primary) / 0.8)" }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📁</div>
                  <div className="font-medium" style={{ color: "hsl(var(--ui-text-primary))" }}>
                    Drop files here to open them
                  </div>
                  <div className="text-sm" style={{ color: "hsl(var(--ui-text-muted))" }}>
                    Supported: .lua, .txt, and other text files
                  </div>
                </div>
              </div>
            )}

            {scripts.map((script) => (
              <div key={script.id} className={cn("h-full", activeScriptId === script.id ? "block" : "hidden")}>
                <CodeEditor
                  value={script.content}
                  onChange={(content) => updateScriptContent(script.id, content)}
                  lineWrapping={settings.lineWrapping}
                  tabSize={settings.tabSize}
                  onLintErrors={setLuaErrors}
                />
              </div>
            ))}
          </motion.div>

          <AnimatePresence initial={false}>
            {outputVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 200, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t"
                style={{ borderColor: "hsl(var(--ui-border))" }}
              >
                <OutputPanel
                  output={output}
                  errors={luaErrors}
                  onClear={clearOutput}
                  onClose={() => setOutputVisible(false)}
                  onExecute={executeScript}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <StatusBar
        activeScript={activeScript}
        toggleOutput={() => setOutputVisible(!outputVisible)}
        outputVisible={outputVisible}
        errorCount={luaErrors.filter((e) => e.type === "error").length}
        warningCount={luaErrors.filter((e) => e.type === "warning").length}
      />

      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette
            onClose={() => setIsCommandPaletteOpen(false)}
            scripts={scripts}
            onSelectScript={(id) => {
              openScript(id)
              setIsCommandPaletteOpen(false)
            }}
            onExecute={() => {
              executeScript()
              setIsCommandPaletteOpen(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
