import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';

const Main = () => {

    if (! import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "") return (
        <React.StrictMode>
            <BackendURL />
        </React.StrictMode>
    );
    return (
        <React.StrictMode>
            {/* Provide global state to all components */}
            <StoreProvider>
                {/* Set up routing for the application */}
                <RouterProvider router={router} future={{
                    v7_startTransition: true
                }}>
                </RouterProvider>
            </StoreProvider>
        </React.StrictMode>
    );
};

// createRoot(document.getElementById('root')).render(
//     <React.StrictMode>
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/*" element={<App />} />
//             </Routes>
//         </BrowserRouter>
//     </React.StrictMode>
// )

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
