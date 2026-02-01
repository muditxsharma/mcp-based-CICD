import React, { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { apiGet, apiPost } from "../api/http"

export default function Approvals() {
  const [items, setItems] = useState<any[]>([])
  async function refresh() {
    const res = await apiGet<any[]>('/approvals')
    setItems(res)
  }
  useEffect(() => { refresh() }, [])

  async function setStatus(id: number, status: string) {
    await apiPost(`/approvals/${id}`, { status })
    await refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Approvals</h2>
        <p className="text-sm text-muted-foreground">Policy-driven gates that require manual review.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
          <CardDescription>Approve or reject blocked releases.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Release</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(a => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell className="font-mono text-xs">{a.release_id}</TableCell>
                  <TableCell>{a.status}</TableCell>
                  <TableCell className="max-w-[420px] truncate" title={a.reason}>
                    {a.reason}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setStatus(a.id, "APPROVED")}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "REJECTED")}>
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!items.length && (
            <p className="mt-4 text-sm text-muted-foreground">
              No approvals yet. Run a release that fails policy.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
