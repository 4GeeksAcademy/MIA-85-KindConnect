
import { NavLink, Outlet } from 'react-router-dom'

export default function FoodHub() {
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 mb-0">Food</h1>
                <div>
                    <NavLink to="/food/new" className="btn btn-primary">Post a Need</NavLink>
                </div>
            </div>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/food/needs">Needs</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/food/donations">Donations</NavLink>
                </li>
            </ul>
            <Outlet />
        </div>
    )
}
