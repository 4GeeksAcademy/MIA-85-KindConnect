
import { useState } from 'react'
// import { createProject } from '../api'

export default function CreateProjectForm() {
    // const [f, setF] = useState({ title: '', description: '', requester_name: '', requester_email: '', city: '', state: 'TX', category: 'food', kind: 'need' })
    // const [msg, setMsg] = useState('')
    // const [err, setErr] = useState('')

    // async function onSubmit(e) {
    //     e.preventDefault(); setMsg(''); setErr('')
    //     try {
    //         const r = await createProject(f); setMsg(`Created #${r.id}`)
    //         setF({ title: '', description: '', requester_name: '', requester_email: '', city: '', state: 'TX', category: 'food' })
    //     } catch (e) {
    //         setErr(e.message)
    //     }
    // }

    // function onChange(e) { setF({ ...f, [e.target.name]: e.target.value }) }

    return (
        <div className="container py-4">
            {/* <h1 className="h4">Post a Food Request</h1>
            <form onSubmit={onSubmit} className="row g-3">
                <div className="col-12">
                    <label className="form-label">Title</label>
                    <input name="title" className="form-control" required value={f.title} onChange={onChange} />
                </div>
                <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" required value={f.description} onChange={onChange} />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Your name</label>
                    <input name="requester_name" className="form-control" required value={f.requester_name} onChange={onChange} />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Your email</label>
                    <input type="email" name="requester_email" className="form-control" required value={f.requester_email} onChange={onChange} />
                </div>
                <div className="col-6 col-md-4">
                    <label className="form-label">City</label>
                    <input name="city" className="form-control" value={f.city} onChange={onChange} />
                </div>
                <div className="col-6 col-md-2">
                    <label className="form-label">State</label>
                    <input name="state" className="form-control" value={f.state} onChange={onChange} />
                </div>
                <div className="col-12">
                    <button className="btn btn-primary">Submit</button>
                </div>
                {msg && <div className="alert alert-success mt-3">{msg}</div>}
                {err && <div className="alert alert-danger mt-3">{err}</div>}
            </form> */}
        </div>
    )
}
