import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function authServices() {
  const [authLoading, setAuthLoading] = useState(false);

  const extractErrorMessage = (result, fallback = "Something went wrong") => {
    return result?.body?.text || result?.message || fallback;
  };

  const login = async ({ email, password }) => {
    try {
      setAuthLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(extractErrorMessage(result, "Erro ao fazer login"));
        return;
      }

      if (result.success && result.body?.token && result.body?.user) {
        localStorage.setItem("auth", JSON.stringify({ token: result.body.token, user: result.body.user }));
        window.location.href = "/profile";
      } else {
        alert(extractErrorMessage(result, "Erro ao fazer login"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Erro ao fazer login");
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async ({ fullname, email, password, confirmPassword }) => {
    try {
      setAuthLoading(true);

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password, confirmPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(extractErrorMessage(result, "Erro ao criar conta"));
        return;
      }

      if (result.success && result.body?.token && result.body?.user) {
        localStorage.setItem("auth", JSON.stringify({ token: result.body.token, user: result.body.user }));
        window.location.href = "/profile";
      } else {
        alert(extractErrorMessage(result, "Erro ao criar conta"));
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Erro ao criar conta");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
  };

  return { signup, login, logout, authLoading };
}
