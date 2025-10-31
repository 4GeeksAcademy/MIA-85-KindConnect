
import { useEffect, useState } from 'react'
// import { listProjects } from '../api'

export default function FoodDonationsPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState("")

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                //     setItems(await listProjects({ category: 'food', status: 'open', kind: 'donation' }))
                // } catch (e) {
                setErr(e.message)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) return <p className="m-4">Loading…</p>
    if (err) return <p className="text-danger m-4">{err}</p>

    return (
        <div className="row g-3">
            {items.map(p => (
                <div key={p.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{p.title}</h5>
                            <p className="card-text small flex-grow-1">{p.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="badge text-bg-primary">{p.status}</span>
                                <a className="btn btn-outline-primary" href={`/projects/${p.id}`}>View</a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {items.length === 0 && <p>No donations available right now.</p>}
        </div>
    )
}
