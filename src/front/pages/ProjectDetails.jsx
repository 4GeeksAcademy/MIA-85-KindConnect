
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ProjectDetails() {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [err, setErr] = useState("")

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API || 'http://localhost:5000/api'}/projects/${id}`)
                if (res.status === 404) { setErr('Not found'); return }
                const data = await res.json(); setItem(data)
            } catch (e) {
                setErr(e.message)
            }
        })()
    }, [id])

    if (err) return <div className="container py-4"><p className="text-danger">{err}</p><Link to="/food">Back</Link></div>
    if (!item) return <div className="container py-4"><p>Loading…</p></div>

    return (
        <div className="container py-4">
            <h1 className="h4">{item.title}</h1>
            <p>{item.description}</p>
            <p className="text-muted small">Kind: {item.kind} · Status: {item.status}</p>
            <Link to="/food" className="btn btn-secondary">Back to Food</Link>
        </div>
    )
}
