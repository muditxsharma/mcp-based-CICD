import React, { useEffect, useState } from 'react'
import { apiGet } from '../api/http'

export default function Dashboard() {
  const [audit, setAudit] = useState<any[]>([])
  useEffect(() => {
    apiGet<any[]>('/audit?limit=50').then(setAudit).catch(() => setAudit([]))
  }, [])
  return (
    <div style={{padding:16}}>
      <h2>Dashboard</h2>
      <p>Latest audit events (tail)</p>
      <pre style={{background:'#111', color:'#0f0', padding:12, borderRadius:8, overflow:'auto'}}>
        {audit.map(e => JSON.stringify(e)).join('\n')}
      </pre>
    </div>
  )
}
