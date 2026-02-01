import React, { useState } from "react"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { apiPost } from "../api/http"

export default function ReleaseConsole() {
  const [repo, setRepo] = useState('checkout-service')
  const [env, setEnv] = useState('staging')
  const [sharedRepo, setSharedRepo] = useState('org/shared-ci')
  const [out, setOut] = useState<any>(null)
  const [err, setErr] = useState<string>('')

  async function run() {
    setErr('')
    setOut(null)
    try {
      const res = await apiPost('/release', { repo, env, shared_repo: sharedRepo })
      setOut(res)
    } catch (e:any) {
      setErr(String(e?.message || e))
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Prepare Release</CardTitle>
          <CardDescription>Trigger the MCP-powered readiness checks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Repo</label>
            <Input value={repo} onChange={e => setRepo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Environment</label>
            <Select value={env} onValueChange={setEnv}>
              <SelectTrigger>
                <SelectValue placeholder="Select env" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staging">staging</SelectItem>
                <SelectItem value="prod">prod</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Shared workflow repo</label>
            <Input value={sharedRepo} onChange={e => setSharedRepo(e.target.value)} />
          </div>
          <Button onClick={run} className="w-full">Prepare Release</Button>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <p className="text-xs text-muted-foreground">
            UI stays lean. The agent + MCP tools carry the logic.
          </p>
          <Badge variant="secondary">SAFE mode enabled</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Release Readiness Report</CardTitle>
          <CardDescription>Decision payload from the orchestrator.</CardDescription>
        </CardHeader>
        <CardContent>
          {!out && <p className="text-sm text-muted-foreground">Run “Prepare Release” to generate a decision.</p>}
          {out && (
            <pre className="max-h-[480px] overflow-auto rounded-md border bg-muted/40 p-4 text-xs">
              {JSON.stringify(out, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
