
import { useState } from 'react'

export default function PostComposer({ defaultKind = 'need', onCreated }) {
    const api = import.meta.env.VITE_API || 'http://localhost:5000/api'
    const [f, setF] = useState({ title: '', description: '', requester_name: '', requester_email: '', city: '', state: 'TX', category: 'food', kind: defaultKind, image_url: '' })
    const [loading, setLoading] = useState(false)

    function change(e) { setF({ ...f, [e.target.name]: e.target.value }) }

    async function submit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${api}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            })
            if (!res.ok) throw new Error('create failed')
            const data = await res.json()
            onCreated?.(data.id)
            setF({ ...f, title: '', description: '', image_url: '' })
        } finally { setLoading(false) }
    }

    return (
        <form className="card shadow-sm mb-3" onSubmit={submit}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Post a {f.kind === 'need' ? 'Need' : 'Donation'}</h6>
                    <select name="kind" className="form-select form-select-sm w-auto" value={f.kind} onChange={change}>
                        <option value="need">Need</option>
                        <option value="donation">Donation</option>
                    </select>
                </div>
                <input name="title" className="form-control mb-2" placeholder="Title" value={f.title} onChange={change} required />
                <textarea name="description" className="form-control mb-2" placeholder="What's needed or being offered?" value={f.description} onChange={change} required />
                <input name="image_url" className="form-control mb-2" placeholder="Image URL (optional)" value={f.image_url} onChange={change} />
                {f.image_url && <div className="mb-2"><img src={f.image_url} alt="" className="img-fluid rounded" /></div>}
                <div className="row g-2 mb-2">
                    <div className="col-md-6"><input name="requester_name" className="form-control" placeholder="Your name" value={f.requester_name} onChange={change} required /></div>
                    <div className="col-md-6"><input type="email" name="requester_email" className="form-control" placeholder="Your email" value={f.requester_email} onChange={change} required /></div>
                </div>
                <div className="row g-2">
                    <div className="col-md-6"><input name="city" className="form-control" placeholder="City" value={f.city} onChange={change} /></div>
                    <div className="col-md-2"><input name="state" className="form-control" placeholder="State" value={f.state} onChange={change} /></div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" disabled={loading}>{loading ? 'Posting…' : 'Post'}</button>
                </div>
            </div>
        </form>
    )
}
