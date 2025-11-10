import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const user = JSON.parse(localStorage.getItem("user"));
		if (token && !store.token) {
			dispatch({ type: "authenticate", payload: { token, user } });
		}
	}, [dispatch, store.token]);
	useEffect(() => {
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map(
			(tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl)
		);
		return () => tooltipList.forEach((tooltip) => tooltip.dispose());
	}, [store.user]);

	const handleLogout = () => {
		dispatch({ type: "logout" });
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
			<div className="container">
				<Link to="/" className="navbar-brand fw-bold">
					KindConnect
				</Link>

				<div className="ms-auto d-flex align-items-center">
					{store.token ? (
						<>
							<Link
								to="/profile"
								className="text-decoration-none me-3"
								data-bs-toggle="tooltip"
								data-bs-placement="bottom"
								title={`${store.user?.first_name || ""} ${store.user?.last_name || ""}`}
							>
								<div
									className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
									style={{
										width: "40px",
										height: "40px",
										fontWeight: "bold",
										fontSize: "16px",
										cursor: "pointer",
									}}
								>
									{store.user?.first_name?.[0]?.toUpperCase() || "U"}
								</div>
							</Link>

							<button onClick={handleLogout} className="btn btn-danger">
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="btn btn-outline-primary me-2">
								Login
							</Link>
							<Link to="/signup" className="btn btn-primary">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
