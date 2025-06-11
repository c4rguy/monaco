"use client"

import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Files, BookOpen } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
  children: ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "hsl(var(--ui-bg-secondary) / 0.3)" }}>
      <Tabs defaultValue="scripts" className="flex-1 flex flex-col">
        <TabsList
          className="border-b rounded-none justify-start px-2 h-10"
          style={{
            backgroundColor: "hsl(var(--ui-bg-secondary) / 0.5)",
            borderColor: "hsl(var(--ui-border))",
          }}
        >
          <TabsTrigger
            value="scripts"
            className="rounded-md"
            style={{
              color: "hsl(var(--ui-text-secondary))",
            }}
          >
            <Files className="h-4 w-4 mr-1" />
            <span>Scripts</span>
          </TabsTrigger>
          <TabsTrigger
            value="docs"
            className="rounded-md"
            style={{
              color: "hsl(var(--ui-text-secondary))",
            }}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            <span>Docs</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="scripts" className="h-full p-0 m-0 data-[state=inactive]:hidden overflow-hidden">
            {children}
          </TabsContent>
          <TabsContent value="docs" className="h-full p-0 m-0 data-[state=inactive]:hidden overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="text-sm" style={{ color: "hsl(var(--ui-text-muted))" }}>
                  <h3 className="font-medium mb-2" style={{ color: "hsl(var(--ui-text-primary))" }}>
                    Lua Documentation
                  </h3>
                  <p className="mb-2">Quick reference for Roblox Lua functions:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        print()
                      </code>{" "}
                      - Output text to console
                    </li>
                    <li>
                      <code className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        wait()
                      </code>{" "}
                      - Pause execution
                    </li>
                    <li>
                      <code className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        game:GetService()
                      </code>{" "}
                      - Access Roblox services
                    </li>
                    <li>
                      <code className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        Instance.new()
                      </code>{" "}
                      - Create new instances
                    </li>
                    <li>
                      <code className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        workspace
                      </code>{" "}
                      - Access the game workspace
                    </li>
                    <li>
                      <code className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        Players
                      </code>{" "}
                      - Access player objects
                    </li>
                    <li>
                      <code className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        RunService
                      </code>{" "}
                      - Handle game loops and events
                    </li>
                    <li>
                      <code className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        UserInputService
                      </code>{" "}
                      - Handle user input
                    </li>
                  </ul>
                  <h4 className="font-medium mt-4 mb-2" style={{ color: "hsl(var(--ui-text-primary))" }}>
                    Common Patterns:
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="mb-1" style={{ color: "hsl(var(--ui-text-secondary))" }}>
                        Get a service:
                      </p>
                      <code
                        className="px-2 py-1 rounded block text-xs"
                        style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}
                      >
                        local Players = game:GetService("Players")
                      </code>
                    </div>
                    <div>
                      <p className="mb-1" style={{ color: "hsl(var(--ui-text-secondary))" }}>
                        Create a part:
                      </p>
                      <code
                        className="px-2 py-1 rounded block text-xs"
                        style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}
                      >
                        local part = Instance.new("Part")
                        <br />
                        part.Parent = workspace
                      </code>
                    </div>
                  </div>
                  <h4 className="font-medium mt-4 mb-2" style={{ color: "hsl(var(--ui-text-primary))" }}>
                    Keyboard Shortcuts:
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Execute Script:</span>
                      <kbd className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        Ctrl+Enter
                      </kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Command Palette:</span>
                      <kbd className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        Ctrl+P
                      </kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>New Script:</span>
                      <kbd className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        Ctrl+N
                      </kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Save Script:</span>
                      <kbd className="px-1 rounded" style={{ backgroundColor: "hsl(var(--ui-bg-tertiary))" }}>
                        Ctrl+S
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
