export interface LuaCompletion {
  label: string
  kind: "function" | "keyword" | "variable" | "property" | "method" | "class" | "constant"
  detail?: string
  documentation?: string
  insertText?: string
}

export const luaKeywords: LuaCompletion[] = [
  { label: "and", kind: "keyword", detail: "Logical AND operator" },
  { label: "break", kind: "keyword", detail: "Break statement" },
  { label: "do", kind: "keyword", detail: "Do block" },
  { label: "else", kind: "keyword", detail: "Else statement" },
  { label: "elseif", kind: "keyword", detail: "Else if statement" },
  { label: "end", kind: "keyword", detail: "End block" },
  { label: "false", kind: "constant", detail: "Boolean false" },
  { label: "for", kind: "keyword", detail: "For loop", insertText: "for i = 1, 10 do\n    \nend" },
  { label: "function", kind: "keyword", detail: "Function declaration", insertText: "function name()\n    \nend" },
  { label: "if", kind: "keyword", detail: "If statement", insertText: "if condition then\n    \nend" },
  { label: "in", kind: "keyword", detail: "In operator" },
  { label: "local", kind: "keyword", detail: "Local variable declaration" },
  { label: "nil", kind: "constant", detail: "Nil value" },
  { label: "not", kind: "keyword", detail: "Logical NOT operator" },
  { label: "or", kind: "keyword", detail: "Logical OR operator" },
  { label: "repeat", kind: "keyword", detail: "Repeat loop", insertText: "repeat\n    \nuntil condition" },
  { label: "return", kind: "keyword", detail: "Return statement" },
  { label: "then", kind: "keyword", detail: "Then keyword" },
  { label: "true", kind: "constant", detail: "Boolean true" },
  { label: "until", kind: "keyword", detail: "Until keyword" },
  { label: "while", kind: "keyword", detail: "While loop", insertText: "while condition do\n    \nend" },
]

export const luaBuiltins: LuaCompletion[] = [
  {
    label: "print",
    kind: "function",
    detail: "print(...)",
    documentation: "Prints values to the console",
    insertText: "print()",
  },
  { label: "type", kind: "function", detail: "type(v)", documentation: "Returns the type of a value" },
  { label: "tostring", kind: "function", detail: "tostring(v)", documentation: "Converts a value to string" },
  { label: "tonumber", kind: "function", detail: "tonumber(e [, base])", documentation: "Converts a value to number" },
  { label: "pairs", kind: "function", detail: "pairs(t)", documentation: "Returns an iterator for table traversal" },
  { label: "ipairs", kind: "function", detail: "ipairs(t)", documentation: "Returns an iterator for array traversal" },
  {
    label: "next",
    kind: "function",
    detail: "next(table [, index])",
    documentation: "Returns the next index and value",
  },
  {
    label: "getmetatable",
    kind: "function",
    detail: "getmetatable(object)",
    documentation: "Returns the metatable of an object",
  },
  {
    label: "setmetatable",
    kind: "function",
    detail: "setmetatable(table, metatable)",
    documentation: "Sets the metatable for a table",
  },
  {
    label: "rawget",
    kind: "function",
    detail: "rawget(table, index)",
    documentation: "Gets a table value without metamethods",
  },
  {
    label: "rawset",
    kind: "function",
    detail: "rawset(table, index, value)",
    documentation: "Sets a table value without metamethods",
  },
  { label: "rawlen", kind: "function", detail: "rawlen(v)", documentation: "Returns the length without metamethods" },
  { label: "select", kind: "function", detail: "select(index, ...)", documentation: "Returns selected arguments" },
  {
    label: "unpack",
    kind: "function",
    detail: "unpack(list [, i [, j]])",
    documentation: "Unpacks a table into multiple values",
  },
  {
    label: "pcall",
    kind: "function",
    detail: "pcall(f [, arg1, ...])",
    documentation: "Protected call - catches errors",
  },
  {
    label: "xpcall",
    kind: "function",
    detail: "xpcall(f, msgh [, arg1, ...])",
    documentation: "Extended protected call",
  },
  { label: "error", kind: "function", detail: "error(message [, level])", documentation: "Raises an error" },
  { label: "assert", kind: "function", detail: "assert(v [, message])", documentation: "Asserts a condition" },
  {
    label: "load",
    kind: "function",
    detail: "load(chunk [, chunkname [, mode [, env]]])",
    documentation: "Loads a chunk",
  },
  {
    label: "loadstring",
    kind: "function",
    detail: "loadstring(string [, chunkname])",
    documentation: "Loads a string as code",
  },
]

export const robloxGlobals: LuaCompletion[] = [
  {
    label: "game",
    kind: "variable",
    detail: "DataModel",
    documentation: "The root object of the Roblox game hierarchy",
  },
  {
    label: "workspace",
    kind: "variable",
    detail: "Workspace",
    documentation: "The workspace service - contains all 3D objects",
  },
  { label: "script", kind: "variable", detail: "Script", documentation: "Reference to the current script" },
  {
    label: "wait",
    kind: "function",
    detail: "wait([time])",
    documentation: "Yields the current thread for the specified time",
    insertText: "wait()",
  },
  { label: "spawn", kind: "function", detail: "spawn(function)", documentation: "Runs a function in a new thread" },
  { label: "delay", kind: "function", detail: "delay(time, function)", documentation: "Runs a function after a delay" },
  { label: "tick", kind: "function", detail: "tick()", documentation: "Returns the current time in seconds" },
  { label: "time", kind: "function", detail: "time()", documentation: "Returns the current game time" },
  {
    label: "warn",
    kind: "function",
    detail: "warn(...)",
    documentation: "Prints a warning message",
    insertText: "warn()",
  },
]

export const robloxServices: LuaCompletion[] = [
  {
    label: "Players",
    kind: "class",
    detail: "Players Service",
    documentation: "Manages player objects and connections",
  },
  { label: "RunService", kind: "class", detail: "RunService", documentation: "Manages game loop events and timing" },
  { label: "UserInputService", kind: "class", detail: "UserInputService", documentation: "Handles user input events" },
  {
    label: "TweenService",
    kind: "class",
    detail: "TweenService",
    documentation: "Creates smooth animations and transitions",
  },
  { label: "HttpService", kind: "class", detail: "HttpService", documentation: "Makes HTTP requests and handles JSON" },
  { label: "DataStoreService", kind: "class", detail: "DataStoreService", documentation: "Persistent data storage" },
  {
    label: "ReplicatedStorage",
    kind: "class",
    detail: "ReplicatedStorage",
    documentation: "Shared storage between client and server",
  },
  { label: "ServerStorage", kind: "class", detail: "ServerStorage", documentation: "Server-only storage" },
  { label: "StarterGui", kind: "class", detail: "StarterGui", documentation: "Contains GUI elements for players" },
  { label: "StarterPack", kind: "class", detail: "StarterPack", documentation: "Contains tools given to players" },
  { label: "Lighting", kind: "class", detail: "Lighting", documentation: "Controls game lighting and atmosphere" },
  { label: "SoundService", kind: "class", detail: "SoundService", documentation: "Manages game audio" },
  {
    label: "PathfindingService",
    kind: "class",
    detail: "PathfindingService",
    documentation: "AI pathfinding functionality",
  },
  {
    label: "MarketplaceService",
    kind: "class",
    detail: "MarketplaceService",
    documentation: "Handles game passes and developer products",
  },
  {
    label: "TeleportService",
    kind: "class",
    detail: "TeleportService",
    documentation: "Teleports players between places",
  },
]

export const commonMethods: LuaCompletion[] = [
  {
    label: "GetService",
    kind: "method",
    detail: "GetService(serviceName)",
    documentation: "Gets a Roblox service by name",
    insertText: 'GetService("")',
  },
  {
    label: "FindFirstChild",
    kind: "method",
    detail: "FindFirstChild(name)",
    documentation: "Finds the first child with the given name",
  },
  {
    label: "WaitForChild",
    kind: "method",
    detail: "WaitForChild(name)",
    documentation: "Waits for a child with the given name to exist",
  },
  { label: "GetChildren", kind: "method", detail: "GetChildren()", documentation: "Returns an array of all children" },
  {
    label: "GetDescendants",
    kind: "method",
    detail: "GetDescendants()",
    documentation: "Returns an array of all descendants",
  },
  { label: "Clone", kind: "method", detail: "Clone()", documentation: "Creates a copy of the object" },
  {
    label: "Destroy",
    kind: "method",
    detail: "Destroy()",
    documentation: "Destroys the object and removes it from the game",
  },
  {
    label: "IsA",
    kind: "method",
    detail: "IsA(className)",
    documentation: "Checks if the object is of a specific class",
  },
  { label: "Connect", kind: "method", detail: "Connect(function)", documentation: "Connects a function to an event" },
  { label: "Disconnect", kind: "method", detail: "Disconnect()", documentation: "Disconnects an event connection" },
]

export const luaLibraries = {
  string: [
    {
      label: "string.byte",
      kind: "function" as const,
      detail: "string.byte(s [, i [, j]])",
      documentation: "Returns byte values of characters",
    },
    {
      label: "string.char",
      kind: "function" as const,
      detail: "string.char(...)",
      documentation: "Creates string from byte values",
    },
    {
      label: "string.find",
      kind: "function" as const,
      detail: "string.find(s, pattern [, init [, plain]])",
      documentation: "Finds pattern in string",
    },
    {
      label: "string.format",
      kind: "function" as const,
      detail: "string.format(formatstring, ...)",
      documentation: "Formats string with placeholders",
    },
    {
      label: "string.gmatch",
      kind: "function" as const,
      detail: "string.gmatch(s, pattern)",
      documentation: "Iterator for pattern matches",
    },
    {
      label: "string.gsub",
      kind: "function" as const,
      detail: "string.gsub(s, pattern, repl [, n])",
      documentation: "Global substitution",
    },
    { label: "string.len", kind: "function" as const, detail: "string.len(s)", documentation: "Returns string length" },
    {
      label: "string.lower",
      kind: "function" as const,
      detail: "string.lower(s)",
      documentation: "Converts to lowercase",
    },
    {
      label: "string.match",
      kind: "function" as const,
      detail: "string.match(s, pattern [, init])",
      documentation: "Matches pattern in string",
    },
    {
      label: "string.rep",
      kind: "function" as const,
      detail: "string.rep(s, n)",
      documentation: "Repeats string n times",
    },
    {
      label: "string.reverse",
      kind: "function" as const,
      detail: "string.reverse(s)",
      documentation: "Reverses string",
    },
    {
      label: "string.sub",
      kind: "function" as const,
      detail: "string.sub(s, i [, j])",
      documentation: "Returns substring",
    },
    {
      label: "string.upper",
      kind: "function" as const,
      detail: "string.upper(s)",
      documentation: "Converts to uppercase",
    },
  ],
  table: [
    {
      label: "table.concat",
      kind: "function" as const,
      detail: "table.concat(list [, sep [, i [, j]]])",
      documentation: "Concatenates table elements",
    },
    {
      label: "table.insert",
      kind: "function" as const,
      detail: "table.insert(list, [pos,] value)",
      documentation: "Inserts element into table",
    },
    {
      label: "table.remove",
      kind: "function" as const,
      detail: "table.remove(list [, pos])",
      documentation: "Removes element from table",
    },
    {
      label: "table.sort",
      kind: "function" as const,
      detail: "table.sort(list [, comp])",
      documentation: "Sorts table elements",
    },
  ],
  math: [
    { label: "math.abs", kind: "function" as const, detail: "math.abs(x)", documentation: "Absolute value" },
    { label: "math.acos", kind: "function" as const, detail: "math.acos(x)", documentation: "Arc cosine" },
    { label: "math.asin", kind: "function" as const, detail: "math.asin(x)", documentation: "Arc sine" },
    { label: "math.atan", kind: "function" as const, detail: "math.atan(x)", documentation: "Arc tangent" },
    { label: "math.atan2", kind: "function" as const, detail: "math.atan2(y, x)", documentation: "Arc tangent of y/x" },
    { label: "math.ceil", kind: "function" as const, detail: "math.ceil(x)", documentation: "Ceiling function" },
    { label: "math.cos", kind: "function" as const, detail: "math.cos(x)", documentation: "Cosine" },
    { label: "math.deg", kind: "function" as const, detail: "math.deg(x)", documentation: "Radians to degrees" },
    { label: "math.exp", kind: "function" as const, detail: "math.exp(x)", documentation: "e^x" },
    { label: "math.floor", kind: "function" as const, detail: "math.floor(x)", documentation: "Floor function" },
    {
      label: "math.fmod",
      kind: "function" as const,
      detail: "math.fmod(x, y)",
      documentation: "Floating point remainder",
    },
    { label: "math.huge", kind: "constant" as const, detail: "math.huge", documentation: "Positive infinity" },
    { label: "math.log", kind: "function" as const, detail: "math.log(x)", documentation: "Natural logarithm" },
    { label: "math.max", kind: "function" as const, detail: "math.max(x, ...)", documentation: "Maximum value" },
    { label: "math.min", kind: "function" as const, detail: "math.min(x, ...)", documentation: "Minimum value" },
    {
      label: "math.modf",
      kind: "function" as const,
      detail: "math.modf(x)",
      documentation: "Integer and fractional parts",
    },
    { label: "math.pi", kind: "constant" as const, detail: "math.pi", documentation: "Pi constant" },
    { label: "math.pow", kind: "function" as const, detail: "math.pow(x, y)", documentation: "x^y" },
    { label: "math.rad", kind: "function" as const, detail: "math.rad(x)", documentation: "Degrees to radians" },
    {
      label: "math.random",
      kind: "function" as const,
      detail: "math.random([m [, n]])",
      documentation: "Random number",
    },
    {
      label: "math.randomseed",
      kind: "function" as const,
      detail: "math.randomseed(x)",
      documentation: "Set random seed",
    },
    { label: "math.sin", kind: "function" as const, detail: "math.sin(x)", documentation: "Sine" },
    { label: "math.sqrt", kind: "function" as const, detail: "math.sqrt(x)", documentation: "Square root" },
    { label: "math.tan", kind: "function" as const, detail: "math.tan(x)", documentation: "Tangent" },
  ],
}

export function getCompletions(text: string, cursorPosition: number): LuaCompletion[] {
  const beforeCursor = text.substring(0, cursorPosition)
  const lines = beforeCursor.split("\n")
  const currentLine = lines[lines.length - 1]

  // Get the word being typed
  const wordMatch = currentLine.match(/(\w+)$/)
  const currentWord = wordMatch ? wordMatch[1] : ""

  // Check if we're after a dot (method/property access)
  const dotMatch = currentLine.match(/(\w+)\.(\w*)$/)
  if (dotMatch) {
    const objectName = dotMatch[1]
    const partialMethod = dotMatch[2]

    // Return methods for specific objects
    if (objectName === "game") {
      return [...commonMethods, ...robloxServices].filter((completion) =>
        completion.label.toLowerCase().includes(partialMethod.toLowerCase()),
      )
    }

    if (objectName === "string") {
      return luaLibraries.string.filter((completion) =>
        completion.label.toLowerCase().includes(partialMethod.toLowerCase()),
      )
    }

    if (objectName === "table") {
      return luaLibraries.table.filter((completion) =>
        completion.label.toLowerCase().includes(partialMethod.toLowerCase()),
      )
    }

    if (objectName === "math") {
      return luaLibraries.math.filter((completion) =>
        completion.label.toLowerCase().includes(partialMethod.toLowerCase()),
      )
    }

    return commonMethods.filter((completion) => completion.label.toLowerCase().includes(partialMethod.toLowerCase()))
  }

  // Regular completions
  const allCompletions = [...luaKeywords, ...luaBuiltins, ...robloxGlobals, ...robloxServices]

  if (!currentWord) {
    return allCompletions.slice(0, 20) // Limit initial suggestions
  }

  return allCompletions
    .filter((completion) => completion.label.toLowerCase().includes(currentWord.toLowerCase()))
    .slice(0, 20)
}
