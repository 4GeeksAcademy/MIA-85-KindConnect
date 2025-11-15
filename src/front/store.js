export const initialStore = (initValues) => {
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
    ...initValues,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_posts":
      return {
        ...store,
        posts: action.payload,
      };
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
    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...store,
        token: null,
        user: null,
      };
    //Update user profile (used after /api/profile fetch)
    case "update_user":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...store,
        user: action.payload,
      };
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    default:
      throw Error("Unknown action.");
  }
}
