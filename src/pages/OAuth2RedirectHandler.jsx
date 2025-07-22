import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Optionally decode token to get user email
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload?.sub || payload?.email;

      const user = { email };
      login(user, token);
      navigate("/home"); // Redirect after login
    } else {
      console.error("OAuth2 token missing from URL");
      navigate("/login");
    }
  }, [navigate, login]);

  return <div className="text-center mt-20">Logging in with Google...</div>;
};

export default OAuth2RedirectHandler;
