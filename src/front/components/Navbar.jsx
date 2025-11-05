import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch({ type: "logout" });
		localStorage.removeItem("token");
		navigate("/login");
	};
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container">
				<div className="ms-auto d-flex align-items-center">
					{store.token ? (
						<>
							<Link to="/profile" className="btn btn-outline-secondary me-2">
								Profile
							</Link>
							<button
								onClick={handleLogout}
								className="btn btn-danger"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
							<Link to="/signup" className="btn btn-primary">Sign Up</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};