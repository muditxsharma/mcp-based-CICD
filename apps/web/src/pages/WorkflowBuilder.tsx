import React, { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge
} from 'reactflow'
import 'reactflow/dist/style.css'
import { apiPost } from '../api/http'

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
    <div style={{height:'calc(100vh - 56px)'}}>
      <div style={{padding:12, borderBottom:'1px solid #eee', display:'flex', gap:12, alignItems:'center'}}>
        <h2 style={{margin:0}}>Workflow Builder</h2>
        <button onClick={save}>Save</button>
        <span style={{opacity:0.8}}>n8n-style canvas (React Flow). Stored as JSON.</span>
      </div>
      <div style={{height:'100%'}}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <div style={{position:'absolute', right: 12, bottom: 12, width: 420}}>
        <details open>
          <summary style={{cursor:'pointer'}}>Workflow JSON</summary>
          <pre style={{background:'#f7f7f7', padding:12, borderRadius:8, maxHeight:240, overflow:'auto'}}>
            {JSON.stringify(definition, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}
