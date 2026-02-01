import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../api/http'

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
    <div style={{padding:16}}>
      <h2>Policies</h2>
      <p>Policy-as-code (edit JSON; backend stores YAML).</p>
      <textarea value={text} onChange={e=>setText(e.target.value)} style={{width:'100%', height:320, fontFamily:'monospace'}} />
      <br/>
      <button onClick={save} style={{marginTop:8}}>Save</button>
    </div>
  )
}
