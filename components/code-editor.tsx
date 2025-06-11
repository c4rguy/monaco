"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Prism from "prismjs"
import "prismjs/components/prism-lua"
import { AutocompletePopup } from "./autocomplete-popup"
import { getCompletions, type LuaCompletion } from "@/lib/lua-autocomplete"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  lineWrapping?: boolean
  tabSize?: number
  onLintErrors?: (errors: LuaError[]) => void
}

export interface LuaError {
  line: number
  message: string
  type: "error" | "warning"
}

export function CodeEditor({ value, onChange, lineWrapping = false, tabSize = 2, onLintErrors }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 0 })
  const [isFocused, setIsFocused] = useState(false)
  const [showTypingEffect, setShowTypingEffect] = useState(true)

  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompletePosition, setAutocompletePosition] = useState({ x: 0, y: 0 })
  const [completions, setCompletions] = useState<LuaCompletion[]>([])
  const [selectedCompletionIndex, setSelectedCompletionIndex] = useState(0)
  const [autocompleteStartPos, setAutocompleteStartPos] = useState(0)

  const autoCompletePairs: { [key: string]: string } = {
    "(": ")",
    "[": "]",
    "{": "}",
    '"': '"',
    "'": "'",
    "`": "`",
  }

  useEffect(() => {
    if (editorRef.current) {
      Prism.languages.lua = {
        comment: /--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/,
        string: {
          pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[^z]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
          greedy: true,
        },
        number: /\b0x[a-f\d]+(?:\.[a-f\d]*)?(?:p[+-]?\d+)?\b|\b\d+(?:\.\d*)?(?:e[+-]?\d+)?\b/i,
        keyword:
          /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
        "roblox-global": /\b(?:game|workspace|script|wait|spawn|delay|tick|time|warn)\b/,
        "roblox-service":
          /\b(?:Players|RunService|UserInputService|TweenService|HttpService|DataStoreService|ReplicatedStorage|ServerStorage|StarterGui|StarterPack|Lighting|SoundService|PathfindingService|MarketplaceService|TeleportService)\b/,
        function: /\b[a-zA-Z_]\w*(?=\s*(?:[({]|\.\w+\s*[({]))/,
        boolean: /\b(?:true|false)\b/,
        operator: [
          /[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/,
          {
            pattern: /(^|[^.])\.\.(?!\.)/,
            lookbehind: true,
          },
        ],
        punctuation: /[[\](){},;]|\.+|:+/,
      }

      Prism.highlightElement(editorRef.current)
    }
  }, [value])

  useEffect(() => {
    updateLineNumbers()
  }, [value])

  useEffect(() => {
    if (onLintErrors) {
      const errors: LuaError[] = []
      const lines = value.split("\n")

      let openParens = 0
      let openBrackets = 0
      let openBraces = 0
      let inString = false
      let stringChar = ""
      let inComment = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        inComment = false

        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          const nextChar = line[j + 1]

          if (!inString && char === "-" && nextChar === "-") {
            inComment = true
            break
          }

          if (inComment) break

          if (!inString && (char === '"' || char === "'")) {
            inString = true
            stringChar = char
            continue
          }

          if (inString && char === stringChar && line[j - 1] !== "\\") {
            inString = false
            stringChar = ""
            continue
          }

          if (inString) continue

          if (char === "(") openParens++
          if (char === ")") openParens--
          if (char === "[") openBrackets++
          if (char === "]") openBrackets--
          if (char === "{") openBraces++
          if (char === "}") openBraces--

          if (openParens < 0) {
            errors.push({
              line: i + 1,
              message: "Unexpected closing parenthesis ')'",
              type: "error",
            })
            openParens = 0
          }

          if (openBrackets < 0) {
            errors.push({
              line: i + 1,
              message: "Unexpected closing bracket ']'",
              type: "error",
            })
            openBrackets = 0
          }

          if (openBraces < 0) {
            errors.push({
              line: i + 1,
              message: "Unexpected closing brace '}'",
              type: "error",
            })
            openBraces = 0
          }
        }

        const trimmedLine = line.trim()

        if (trimmedLine.includes("function") && !trimmedLine.includes("end") && !trimmedLine.endsWith(")")) {
          const nextLines = lines.slice(i + 1, i + 10)
          const hasEnd = nextLines.some((nextLine) => nextLine.trim() === "end" || nextLine.includes("end"))
          if (!hasEnd) {
            errors.push({
              line: i + 1,
              message: "Function declaration should end with 'end'",
              type: "warning",
            })
          }
        }

        if (trimmedLine.startsWith("if ") && !trimmedLine.includes("then")) {
          errors.push({
            line: i + 1,
            message: "If statement should include 'then'",
            type: "error",
          })
        }

        if (trimmedLine.startsWith("for ") && !trimmedLine.includes("do")) {
          errors.push({
            line: i + 1,
            message: "For loop should include 'do'",
            type: "error",
          })
        }

        if (trimmedLine.startsWith("while ") && !trimmedLine.includes("do")) {
          errors.push({
            line: i + 1,
            message: "While loop should include 'do'",
            type: "error",
          })
        }

        const undefinedVarMatch = trimmedLine.match(/(\w+)\s*=/)
        if (undefinedVarMatch && !trimmedLine.includes("local") && !trimmedLine.includes("function")) {
          const varName = undefinedVarMatch[1]
          if (
            !["game", "workspace", "script", "wait", "spawn", "delay", "tick", "time", "warn", "print"].includes(
              varName,
            )
          ) {
            errors.push({
              line: i + 1,
              message: `Consider using 'local ${varName}' for better performance`,
              type: "warning",
            })
          }
        }
      }

      if (openParens > 0) {
        errors.push({
          line: lines.length,
          message: `Missing ${openParens} closing parenthesis ')'`,
          type: "error",
        })
      }

      if (openBrackets > 0) {
        errors.push({
          line: lines.length,
          message: `Missing ${openBrackets} closing bracket ']'`,
          type: "error",
        })
      }

      if (openBraces > 0) {
        errors.push({
          line: lines.length,
          message: `Missing ${openBraces} closing brace '}'`,
          type: "error",
        })
      }

      onLintErrors(errors)
    }
  }, [value, onLintErrors])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const updateCursorFromTextarea = () => {
      const cursorPos = textarea.selectionStart
      const lines = value.substring(0, cursorPos).split("\n")
      const line = lines.length
      const column = lines[lines.length - 1].length

      setCursorPosition({ line, column })
    }

    textarea.addEventListener("selectionchange", updateCursorFromTextarea)
    textarea.addEventListener("click", updateCursorFromTextarea)
    textarea.addEventListener("keyup", updateCursorFromTextarea)

    return () => {
      textarea.removeEventListener("selectionchange", updateCursorFromTextarea)
      textarea.removeEventListener("click", updateCursorFromTextarea)
      textarea.removeEventListener("keyup", updateCursorFromTextarea)
    }
  }, [value])

  useEffect(() => {
    if (showTypingEffect) {
      const timer = setTimeout(() => {
        setShowTypingEffect(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showTypingEffect])

  const updateLineNumbers = () => {
    if (!lineNumbersRef.current) return

    const lines = value.split("\n")
    const lineCount = lines.length

    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)
      .map((num) => `<div class="line-number">${num}</div>`)
      .join("")

    lineNumbersRef.current.innerHTML = lineNumbers
  }

  const showAutocompletePopup = useCallback(
    (cursorPos: number) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const completionList = getCompletions(value, cursorPos)
      if (completionList.length === 0) {
        setShowAutocomplete(false)
        return
      }

      setCompletions(completionList)
      setSelectedCompletionIndex(0)
      setAutocompleteStartPos(cursorPos)

      const rect = textarea.getBoundingClientRect()
      const lines = value.substring(0, cursorPos).split("\n")
      const lineHeight = 24
      const charWidth = 8.4

      const x = rect.left + lines[lines.length - 1].length * charWidth
      const y = rect.top + (lines.length - 1) * lineHeight + lineHeight

      setAutocompletePosition({ x, y })
      setShowAutocomplete(true)
    },
    [value],
  )

  const hideAutocomplete = useCallback(() => {
    setShowAutocomplete(false)
    setCompletions([])
    setSelectedCompletionIndex(0)
  }, [])

  const insertCompletion = useCallback(
    (completion: LuaCompletion) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const cursorPos = textarea.selectionStart
      const beforeCursor = value.substring(0, autocompleteStartPos)
      const afterCursor = value.substring(cursorPos)

      const beforeMatch = beforeCursor.match(/(\w+)$/)
      const wordStart = beforeMatch ? beforeCursor.length - beforeMatch[1].length : beforeCursor.length

      const insertText = completion.insertText || completion.label
      const newValue = value.substring(0, wordStart) + insertText + afterCursor

      onChange(newValue)
      hideAutocomplete()

      setTimeout(() => {
        const newCursorPos = wordStart + insertText.length
        textarea.selectionStart = textarea.selectionEnd = newCursorPos
        textarea.focus()
      }, 0)
    },
    [value, autocompleteStartPos, onChange, hideAutocomplete],
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = textarea.value

    if (showAutocomplete) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedCompletionIndex((prev) => (prev < completions.length - 1 ? prev + 1 : 0))
        return
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedCompletionIndex((prev) => (prev > 0 ? prev - 1 : completions.length - 1))
        return
      }

      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault()
        if (completions[selectedCompletionIndex]) {
          insertCompletion(completions[selectedCompletionIndex])
        }
        return
      }

      if (e.key === "Escape") {
        e.preventDefault()
        hideAutocomplete()
        return
      }
    }

    if (e.ctrlKey && e.key === " ") {
      e.preventDefault()
      showAutocompletePopup(start)
      return
    }

    if (e.key === "Tab") {
      e.preventDefault()
      const spaces = " ".repeat(tabSize)
      const newValue = currentValue.substring(0, start) + spaces + currentValue.substring(end)
      onChange(newValue)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tabSize
      }, 0)
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      const lines = currentValue.substring(0, start).split("\n")
      const currentLine = lines[lines.length - 1]
      const indent = currentLine.match(/^(\s*)/)?.[1] || ""

      const shouldIndent = /\b(function|if|for|while|repeat|do|then)\s*$/.test(currentLine.trim())
      const extraIndent = shouldIndent ? " ".repeat(tabSize) : ""

      const newValue = currentValue.substring(0, start) + "\n" + indent + extraIndent + currentValue.substring(end)
      onChange(newValue)

      setTimeout(() => {
        const newCursorPos = start + 1 + indent.length + extraIndent.length
        textarea.selectionStart = textarea.selectionEnd = newCursorPos
      }, 0)
      return
    }

    if (e.key === "Backspace" && start === end && start > 0) {
      const charBefore = currentValue[start - 1]
      const charAfter = currentValue[start]

      if (autoCompletePairs[charBefore] === charAfter) {
        e.preventDefault()
        const newValue = currentValue.substring(0, start - 1) + currentValue.substring(start + 1)
        onChange(newValue)

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 1
        }, 0)
        return
      }
    }

    const char = e.key
    if (autoCompletePairs[char] && start === end) {
      e.preventDefault()
      const closingChar = autoCompletePairs[char]

      if ((char === '"' || char === "'" || char === "`") && currentValue[start] === char) {
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1
        }, 0)
        return
      }

      const newValue = currentValue.substring(0, start) + char + closingChar + currentValue.substring(end)
      onChange(newValue)

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
      }, 0)
      return
    }

    if (Object.values(autoCompletePairs).includes(char) && currentValue[start] === char) {
      e.preventDefault()
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
      }, 0)
      return
    }

    if (["Escape", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      hideAutocomplete()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const cursorPos = textarea.selectionStart

    setTimeout(() => {
      const beforeCursor = textarea.value.substring(0, cursorPos)
      const shouldShow = /[\w.]$/.test(beforeCursor) && beforeCursor.length > 0

      if (shouldShow) {
        showAutocompletePopup(cursorPos)
      } else {
        hideAutocomplete()
      }
    }, 100)
  }

  return (
    <div
      className="relative h-full overflow-hidden text-zinc-300 font-mono text-sm"
      style={{ backgroundColor: "hsl(var(--lua-bg))" }}
    >
      <div className="flex h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          ref={lineNumbersRef}
          className="line-numbers py-2 pr-2 text-right select-none flex flex-col overflow-hidden"
          style={{
            minWidth: "3rem",
            backgroundColor: "hsl(var(--lua-line-numbers-bg))",
            color: "hsl(var(--lua-line-numbers-text))",
          }}
        />
        <div className="relative flex-1 overflow-auto">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              setTimeout(hideAutocomplete, 150)
            }}
            className="absolute top-0 left-0 w-full h-full p-2 bg-transparent text-transparent caret-white resize-none outline-none z-10 font-mono"
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            style={{
              whiteSpace: lineWrapping ? "pre-wrap" : "pre",
              wordWrap: lineWrapping ? "break-word" : "normal",
              fontSize: "14px",
              lineHeight: "1.5",
              letterSpacing: "0",
            }}
          />
          <pre
            className="h-full p-2 m-0 overflow-auto pointer-events-none"
            style={{
              whiteSpace: lineWrapping ? "pre-wrap" : "pre",
              wordWrap: lineWrapping ? "break-word" : "normal",
              fontSize: "14px",
              lineHeight: "1.5",
              letterSpacing: "0",
            }}
          >
            {showTypingEffect ? (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center"
                style={{ backgroundColor: "hsl(var(--lua-bg))" }}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
                  >
                    P
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ color: "hsl(var(--ui-text-muted))" }}
                  >
                    Loading Lua executor...
                  </motion.p>
                </div>
              </motion.div>
            ) : null}
            <code ref={editorRef} className="language-lua">
              {value}
            </code>
          </pre>
        </div>
      </div>

      <AnimatePresence>
        {showAutocomplete && (
          <AutocompletePopup
            completions={completions}
            selectedIndex={selectedCompletionIndex}
            position={autocompletePosition}
            onSelect={insertCompletion}
            onClose={hideAutocomplete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
