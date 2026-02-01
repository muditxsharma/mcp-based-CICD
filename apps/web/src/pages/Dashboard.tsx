import React, { useEffect, useMemo, useState } from "react"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { apiGet } from "../api/http"

export default function Dashboard() {
  const [audit, setAudit] = useState<any[]>([])
  useEffect(() => {
    apiGet<any[]>('/audit?limit=50').then(setAudit).catch(() => setAudit([]))
  }, [])

  const latestType = useMemo(() => {
    if (!audit.length) return "None yet"
    return audit[0]?.type || "Unknown"
  }, [audit])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Live signals from your release control plane.</p>
        </div>
        <Badge variant="outline">Audit Stream</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Events (tail)</CardTitle>
            <CardDescription>Last 50 entries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{audit.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Type</CardTitle>
            <CardDescription>Most recent audit record</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{latestType}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Safety Mode</CardTitle>
            <CardDescription>Writes are simulated</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">SAFE</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Tail</CardTitle>
          <CardDescription>Streaming view (most recent first)</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[360px] rounded-md border bg-black text-green-300">
            <pre className="p-4 text-xs leading-relaxed">
              {audit.map(e => JSON.stringify(e)).join('\n')}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
