// src/store.js

// Initial global store
export const initialStore = (initValues = {}) => {
  return {
    API_BASE_URL: import.meta.env.VITE_BACKEND_URL,
    token: localStorage.getItem("token") || undefined,
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: undefined,
    message: null,
    posts: [],
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],

    // Allow overrides
    ...initValues,
  };
};

// Global reducer
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    // 🔹 For your posts list (ZIP search, etc.)
    case "set_posts":
      return {
        ...store,
        posts: action.payload,
      };
    case "add_post":
      return {
        ...store,
        posts: [action.payload, ...store.posts], // newest first
      };

    case "update_post": {
      const updated = action.payload;
      return {
        ...store,
        posts: store.posts.map((p) =>
          p.id === updated.id ? { ...p, ...updated } : p
        ),
      };
    }

    // 🔹 For status / info messages in the UI
    case "set_message":
    case "set_hello": // keep old name working too
      return {
        ...store,
        message: action.payload,
      };

    // 🔹 Auth boilerplate (login)
    case "authenticate":
      if (typeof action.payload === "object") {
        const { token, user } = action.payload;
        localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        return {
          ...store,
          token,
          user: user || store.user,
        };
      } else {
        // Backward compatibility if only token is passed
        localStorage.setItem("token", action.payload);
        return { ...store, token: action.payload };
      }

    // 🔹 Auth boilerplate (logout)
    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...store,
        token: null,
        user: null,
      };

    // 🔹 Auth boilerplate (update user info)
    case "update_user":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...store,
        user: action.payload,
      };
    default:
      return store;
  }
}
