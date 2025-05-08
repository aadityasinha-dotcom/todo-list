import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

// Safe parsing function
const safelyParseJSON = (json) => {
  try {
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error("Failed to parse JSON from localStorage:", e);
    return null;
  }
};

const initialState = {
  user: safelyParseJSON(localStorage.getItem("user")),
  token: localStorage.getItem("token") || null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    // Check if a token exists in local storage
    const token = localStorage.getItem("token");
    const userJSON = localStorage.getItem("user");
    
    if (token && userJSON) {
      try {
        const user = JSON.parse(userJSON);
        login(user, token);
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
