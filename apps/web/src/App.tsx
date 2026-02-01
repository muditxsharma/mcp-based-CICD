import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ReleaseConsole from './pages/ReleaseConsole'
import WorkflowBuilder from './pages/WorkflowBuilder'
import Policies from './pages/Policies'
import Approvals from './pages/Approvals'

const Nav: React.FC = () => (
  <div style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee'}}>
    <strong>MCP Release Console</strong>
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/release">Release</Link>
    <Link to="/builder">Workflow Builder</Link>
    <Link to="/policies">Policies</Link>
    <Link to="/approvals">Approvals</Link>
  </div>
)

export default function App() {
  return (
    <div style={{fontFamily:'ui-sans-serif, system-ui', height:'100vh', display:'flex', flexDirection:'column'}}>
      <Nav />
      <div style={{flex:1, overflow:'auto'}}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/release" element={<ReleaseConsole />} />
          <Route path="/builder" element={<WorkflowBuilder />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/approvals" element={<Approvals />} />
        </Routes>
      </div>
    </div>
  )
}
