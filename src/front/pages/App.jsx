
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import FoodHub from './FoodHub'
import FoodNeedsPage from './FoodNeedsPage'
import FoodDonationsPage from './FoodDonationsPage'
import CreateProjectForm from './CreateProjectForm'
import ProjectDetails from './ProjectDetails'
import NotFound from './NotFound'

export default function App() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-light border-bottom">
                <div className="container">
                    <Link to="/" className="navbar-brand fw-bold">KindConnect</Link>
                    <div className="navbar-nav">
                        <Link to="/food" className="nav-link">Food</Link>
                        <Link to="/food/new" className="nav-link">Post a Need</Link>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<div className="container py-5"><h1 className="display-6">Welcome to KindConnect</h1><p className="lead">Where food, animal, and home projects get done — for free, by volunteers.</p></div>} />
                <Route path="/food" element={<FoodHub />}>
                    <Route index element={<Navigate to="needs" replace />} />
                    <Route path="needs" element={<FoodNeedsPage />} />
                    <Route path="donations" element={<FoodDonationsPage />} />
                </Route>
                <Route path="/food/new" element={<CreateProjectForm />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
}
