import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../api/http'

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
    <div style={{padding:16}}>
      <h2>Approvals</h2>
      <p>When policy blocks a release, an approval record is created (demo gate).</p>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Release</th>
            <th align="left">Status</th>
            <th align="left">Reason</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(a => (
            <tr key={a.id} style={{borderTop:'1px solid #eee'}}>
              <td>{a.id}</td>
              <td style={{fontFamily:'monospace'}}>{a.release_id}</td>
              <td>{a.status}</td>
              <td style={{maxWidth:520, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={a.reason}>{a.reason}</td>
              <td>
                <button onClick={()=>setStatus(a.id,'APPROVED')}>Approve</button>{' '}
                <button onClick={()=>setStatus(a.id,'REJECTED')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <p>No approvals yet. Run a release that fails policy.</p>}
    </div>
  )
}
