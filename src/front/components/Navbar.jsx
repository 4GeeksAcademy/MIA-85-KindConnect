import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg bg-light border-bottom">
			<div className="container">
				<Link to="/" className="navbar-brand fw-bold">KindConnect</Link>
				<div className="navbar-nav">
					<Link to="/food" className="nav-link">Food</Link>
					<Link to="/food/new" className="nav-link">Post a Need</Link>
				</div>
			</div>
		</nav>
	);
	// return (
	// 	<nav className="navbar navbar-light bg-light">
	// 		<div className="container">
	// 			<Link to="/">
	// 				<span className="navbar-brand mb-0 h1">React Boilerplate</span>
	// 			</Link>
	// 			<div className="ml-auto">
	// 				<Link to="/demo">
	// 					<button className="btn btn-primary">Check the Context in action</button>
	// 				</Link>
	// 			</div>
	// 		</div>
	// 	</nav>
	// );
};