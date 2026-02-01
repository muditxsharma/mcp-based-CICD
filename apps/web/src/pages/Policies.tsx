import React, { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Textarea } from "../components/ui/textarea"
import { apiGet, apiPost } from "../api/http"

export default function Policies() {
  const [policy, setPolicy] = useState<any>({})
  const [text, setText] = useState<string>('')

  useEffect(() => {
    apiGet('/policies').then((p:any) => {
      setPolicy(p)
      setText(JSON.stringify(p, null, 2))
    })
  }, [])

  async function save() {
    const obj = JSON.parse(text)
    await apiPost('/policies', obj)
    alert('Saved policy')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Policies</h2>
        <p className="text-sm text-muted-foreground">Policy-as-code editor (JSON in, YAML stored).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policy Draft</CardTitle>
          <CardDescription>Edit JSON and push to the policy service.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="min-h-[360px] font-mono text-xs"
          />
          <Button onClick={save}>Save Policy</Button>
        </CardContent>
      </Card>
    </div>
  )
}
