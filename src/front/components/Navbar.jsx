import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/img/logopng.png";
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
			<div className="container position-relative d-flex align-items-center">
				{/* LEFT: KC icon/logo */}
				<Link to="/" className="navbar-brand m-0 p-0 me-2">
					<img src={logo} alt="KC" className="brand__logo" />
				</Link>

				{/* CENTER: KindC❤️nnect — perfectly centered */}
				<Link
					to="/"
					className="brand-center text-decoration-none fw-bold"
					aria-label="KindConnect"
				>
					<span className="wm">
						Kind<span className="wm__c" aria-hidden="true">C</span>
						<span className="wm__heart" aria-hidden="true">
							<svg width="16" height="16" viewBox="0 0 24 24" role="img" aria-label="heart">
								<path fill="#E53935" d="M12 21s-6.7-4.35-9.33-7.03A6 6 0 1 1 11.98 6a6 6 0 1 1 9.35 7.97C18.7 16.65 12 21 12 21z" />
							</svg>
						</span>
						nnect
					</span>
				</Link>

				{/* RIGHT: buttons (unchanged) */}
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
									style={{ width: "40px", height: "40px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
								>
									{store.user?.first_name?.[0]?.toUpperCase() || "U"}
								</div>
							</Link>
							<button onClick={handleLogout} className="btn btn-danger">Logout</button>
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
