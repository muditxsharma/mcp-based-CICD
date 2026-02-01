import React, { useCallback, useMemo } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { apiPost } from "../api/http"

const initialNodes = [
  { id: '1', type: 'input', position: { x: 60, y: 60 }, data: { label: 'UI Trigger' } },
  { id: '2', position: { x: 280, y: 60 }, data: { label: 'GitHub MCP' } },
  { id: '3', position: { x: 520, y: 60 }, data: { label: 'Docker MCP' } },
  { id: '4', position: { x: 760, y: 60 }, data: { label: 'Kubernetes MCP' } },
  { id: '5', type: 'output', position: { x: 1000, y: 60 }, data: { label: 'Decision' } }
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' }
]

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const definition = useMemo(() => ({
    version: 1,
    nodes: nodes.map(n => ({ id: n.id, label: (n.data as any)?.label, type: n.type || 'default' })),
    edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target }))
  }), [nodes, edges])

  async function save() {
    await apiPost('/workflows', { name: 'demo-workflow', definition })
    alert('Saved workflow: demo-workflow')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Workflow Builder</h2>
          <p className="text-sm text-muted-foreground">n8n-style canvas stored as JSON.</p>
        </div>
        <Button onClick={save}>Save</Button>
      </div>

      <Tabs defaultValue="canvas">
        <TabsList>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="json">Workflow JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="canvas">
          <Card>
            <CardHeader>
              <CardTitle>Visual Graph</CardTitle>
              <CardDescription>Drag nodes and connections to define control flow.</CardDescription>
            </CardHeader>
            <CardContent className="h-[520px]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Definition Payload</CardTitle>
              <CardDescription>What gets persisted in the API.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[520px] overflow-auto rounded-md border bg-muted/40 p-4 text-xs">
                {JSON.stringify(definition, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
