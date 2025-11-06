
import { Link } from 'react-router-dom'
export default function NotFound() {
    return (
        <div className="container py-5 text-center">
            <h1 className="display-6">Page not found</h1>
            <p>Let's get you back on track.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    )
}
