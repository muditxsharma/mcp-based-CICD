import React, { useState } from 'react'
import { apiPost } from '../api/http'

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
    <div style={{padding:16, display:'grid', gridTemplateColumns:'420px 1fr', gap:16}}>
      <div style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
        <h2>Prepare Release</h2>
        <label>Repo<br/>
          <input value={repo} onChange={e=>setRepo(e.target.value)} style={{width:'100%'}}/>
        </label>
        <br/><br/>
        <label>Environment<br/>
          <select value={env} onChange={e=>setEnv(e.target.value)} style={{width:'100%'}}>
            <option value="staging">staging</option>
            <option value="prod">prod</option>
          </select>
        </label>
        <br/><br/>
        <label>Shared workflow repo<br/>
          <input value={sharedRepo} onChange={e=>setSharedRepo(e.target.value)} style={{width:'100%'}}/>
        </label>
        <br/><br/>
        <button onClick={run} style={{padding:'10px 12px'}}>Prepare Release</button>
        {err && <p style={{color:'crimson'}}>{err}</p>}
        <p style={{opacity:0.8}}>
          UI is dumb on purpose. All logic lives in the agent + MCP tools.
        </p>
      </div>

      <div style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
        <h2>Release Readiness Report</h2>
        {!out && <p>Run “Prepare Release” to generate a decision.</p>}
        {out && (
          <pre style={{background:'#f7f7f7', padding:12, borderRadius:8, overflow:'auto'}}>
            {JSON.stringify(out, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
