import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap'

// src/front/main.jsx
import "./styles/index.css";


import { RouterProvider } from "react-router-dom"
import { router } from "./routes"

// Store + BackendURL live one level up from /front
import { StoreProvider } from './hooks/useGlobalReducer'
import { BackendURL } from './components/BackendURL'

const Main = () => {
  if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "") {
    return (
      <React.StrictMode>
        <BackendURL />
      </React.StrictMode>
    )
  }

  return (
    <React.StrictMode>
      <StoreProvider>
        <RouterProvider
          router={router}
          future={{ v7_startTransition: true }}
        />
      </StoreProvider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />)
