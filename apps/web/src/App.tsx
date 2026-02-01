import React, { useEffect, useState } from "react"
import { Routes, Route, NavLink, Navigate } from "react-router-dom"
import { Badge } from "./components/ui/badge"
import { Button } from "./components/ui/button"
import { Separator } from "./components/ui/separator"
import { Switch } from "./components/ui/switch"
import { cn } from "./lib/utils"
import Dashboard from "./pages/Dashboard"
import ReleaseConsole from "./pages/ReleaseConsole"
import WorkflowBuilder from "./pages/WorkflowBuilder"
import Policies from "./pages/Policies"
import Approvals from "./pages/Approvals"

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/release", label: "Release" },
  { to: "/builder", label: "Workflow Builder" },
  { to: "/policies", label: "Policies" },
  { to: "/approvals", label: "Approvals" },
]

type ControlsProps = {
  safetyEnabled: boolean
  onSafetyChange: (value: boolean) => void
  darkMode: boolean
  onDarkModeChange: (value: boolean) => void
}

const Sidebar: React.FC<ControlsProps> = ({
  safetyEnabled,
  onSafetyChange,
  darkMode,
  onDarkModeChange,
}) => (
  <aside className="hidden h-full w-64 flex-col border-r bg-white/70 p-6 backdrop-blur dark:bg-slate-950/60 md:flex">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">MCP</p>
        <h1 className="text-xl font-semibold">Release Control</h1>
      </div>
      <Badge variant={safetyEnabled ? "secondary" : "outline"}>
        {safetyEnabled ? "SAFE" : "LIVE"}
      </Badge>
    </div>
    <Separator className="my-6" />
    <nav className="flex flex-col gap-2">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to}>
          {({ isActive }) => (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "text-foreground")}
            >
              {link.label}
            </Button>
          )}
        </NavLink>
      ))}
    </nav>
    <Separator className="my-6" />
    <div className="space-y-4 text-xs text-muted-foreground">
      <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em]">Safety Mode</p>
          <p className="text-xs">{safetyEnabled ? "Simulate writes" : "Live actions"}</p>
        </div>
        <Switch checked={safetyEnabled} onCheckedChange={onSafetyChange} />
      </div>
      <div className="flex items-center justify-between rounded-md border bg-background/60 px-3 py-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em]">Dark Theme</p>
          <p className="text-xs">{darkMode ? "Enabled" : "Disabled"}</p>
        </div>
        <Switch checked={darkMode} onCheckedChange={onDarkModeChange} />
      </div>
      <p>Self-hosted control plane</p>
      <p>FastAPI + MCP tools</p>
    </div>
  </aside>
)

const TopNav: React.FC<ControlsProps> = ({
  safetyEnabled,
  onSafetyChange,
  darkMode,
  onDarkModeChange,
}) => (
  <header className="flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur dark:bg-slate-950/60 md:hidden">
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">MCP</p>
      <h1 className="text-lg font-semibold">Release Control</h1>
    </div>
    <div className="flex items-center gap-3">
      <Badge variant={safetyEnabled ? "secondary" : "outline"}>
        {safetyEnabled ? "SAFE" : "LIVE"}
      </Badge>
      <Switch checked={safetyEnabled} onCheckedChange={onSafetyChange} />
      <Switch checked={darkMode} onCheckedChange={onDarkModeChange} />
    </div>
  </header>
)

const MobileNav: React.FC = () => (
  <div className="flex gap-2 overflow-x-auto border-b bg-white/70 px-4 py-3 backdrop-blur dark:bg-slate-950/60 md:hidden">
    {links.map((link) => (
      <NavLink key={link.to} to={link.to}>
        {({ isActive }) => (
          <Button
            size="sm"
            variant={isActive ? "secondary" : "ghost"}
            className="whitespace-nowrap"
          >
            {link.label}
          </Button>
        )}
      </NavLink>
    ))}
  </div>
)

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    const stored = window.localStorage.getItem("theme")
    if (stored === "dark") return true
    if (stored === "light") return false
    return true
  })
  const [safetyEnabled, setSafetyEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    const stored = window.localStorage.getItem("safety_mode")
    if (stored === "live") return false
    return true
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add("dark")
      window.localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      window.localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  useEffect(() => {
    window.localStorage.setItem("safety_mode", safetyEnabled ? "safe" : "live")
  }, [safetyEnabled])

  return (
    <div className="min-h-screen">
      <TopNav
        safetyEnabled={safetyEnabled}
        onSafetyChange={setSafetyEnabled}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
      />
      <MobileNav />
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr]">
        <Sidebar
          safetyEnabled={safetyEnabled}
          onSafetyChange={setSafetyEnabled}
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
        />
        <main className="px-6 py-6 md:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/release" element={<ReleaseConsole />} />
              <Route path="/builder" element={<WorkflowBuilder />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/approvals" element={<Approvals />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
