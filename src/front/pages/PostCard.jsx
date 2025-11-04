
import { useState, useEffect } from 'react'

export default function PostCard({ post, onFavorited }) {
    const [favLoading, setFavLoading] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const api = import.meta.env.VITE_API || 'http://localhost:5000/api'

    async function favorite() {
        try {
            setFavLoading(true)
            const res = await fetch(`${api}/projects/${post.id}/favorite`, { method: 'POST' })
            const data = await res.json()
            onFavorited?.(post.id, data.favorites_count)
        } finally {
            setFavLoading(false)
        }
    }

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="d-flex">
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                            <h6 className="mb-1">{post.title}</h6>
                            <span className="badge text-bg-secondary">{post.kind}</span>
                        </div>
                        <p className="mb-2 small">{post.description}</p>
                        {post.image_url && (
                            <div className="mb-2">
                                <img src={post.image_url} alt="" className="img-fluid rounded" />
                            </div>
                        )}
                        <div className="d-flex gap-3">
                            <button className="btn btn-sm btn-outline-danger" disabled={favLoading} onClick={favorite}>❤ {post.favorites_count || 0}</button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowComments(v => !v)}>
                                {showComments ? 'Hide' : 'Comments'}
                            </button>
                        </div>
                        {showComments && <CommentsThread projectId={post.id} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CommentsThread({ projectId }) {
    const api = import.meta.env.VITE_API || 'http://localhost:5000/api'
    const [items, setItems] = useState([])
    const [name, setName] = useState('')
    const [body, setBody] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${api}/projects/${projectId}/comments`)
                const data = await res.json()
                setItems(data)
            } finally { setLoading(false) }
        })()
    }, [projectId])

    async function onSubmit(e) {
        e.preventDefault()
        if (!name || !body) return
        const res = await fetch(`${api}/projects/${projectId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author_name: name, body })
        })
        if (res.ok) {
            setBody('')
            const r2 = await fetch(`${api}/projects/${projectId}/comments`)
            setItems(await r2.json())
        }
    }

    if (loading) return <div className="mt-2 small">Loading comments…</div>

    return (
        <div className="mt-2">
            <ul className="list-unstyled">
                {items.map(c => (
                    <li key={c.id} className="mb-2">
                        <div className="small"><strong>{c.author_name}</strong> <span className="text-muted">• {new Date(c.created_at).toLocaleString()}</span></div>
                        <div className="small">{c.body}</div>
                    </li>
                ))}
                {items.length === 0 && <li className="small text-muted">No comments yet.</li>}
            </ul>
            <form onSubmit={onSubmit} className="d-flex gap-2">
                <input className="form-control form-control-sm" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                <input className="form-control form-control-sm" placeholder="Write a comment…" value={body} onChange={e => setBody(e.target.value)} />
                <button className="btn btn-sm btn-primary">Post</button>
            </form>
        </div>
    )
}
