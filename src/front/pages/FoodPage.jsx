
import { useEffect, useState } from 'react'
// import { listProjects, claimProject } from '../api'

export default function FoodPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState("")

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                //     setItems(await listProjects({ category: 'food', status: 'open' }))
                // } catch (e) {
                setErr(e.message)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    async function onClaim(id) {
        const name = prompt('Your name')
        const email = prompt('Your email')
        if (!name || !email) return
        // const res = await claimProject(id, { volunteer_name: name, volunteer_email: email })
        if (res.conflict) { alert('Sorry, already claimed!'); return; }
        setItems(items => items.filter(x => x.id !== id))
    }

    if (loading) return <p className="m-4">Loading…</p>
    if (err) return <p className="text-danger m-4">{err}</p>

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3">Food Requests</h1>
                <a className="btn btn-primary" href="/food/new">Post a Request</a>
            </div>
            <div className="row g-3">
                {items.map(p => (
                    <div key={p.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{p.title}</h5>
                                <p className="card-text small flex-grow-1">{p.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge text-bg-success">{p.status}</span>
                                    <button className="btn btn-outline-success" onClick={() => onClaim(p.id)}>Claim</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p>No open requests yet.</p>}
            </div>
        </div>
    )
}


