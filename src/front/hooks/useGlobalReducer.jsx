// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.
import { useEffect } from "react";

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const intialToken = localStorage.getItem("token", undefined)
    const [store, dispatch] = useReducer(storeReducer, initialStore())
    useEffect(() => {
        async function fetchProfile() {
            if (store.token && !store.user) {
                try {
                    const res = await fetch(`${store.API_BASE_URL}/api/profile`, {
                        headers: { Authorization: `Bearer ${store.token}` },
                    });
                    if (res.ok) {
                        const user = await res.json();
                        dispatch({ type: "update_user", payload: user });
                    }
                } catch (err) {
                    console.error("Profile fetch failed:", err);
                }
            }
        }
        fetchProfile();
    }, [store.token]);
    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const context = useContext(StoreContext);
    return context;
}