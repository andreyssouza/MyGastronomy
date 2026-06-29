import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import styles from "./page.module.css";
import authServices from "../../services/auth.jsx";
import { useNavigate } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";

const loginInitialState = { email: "", password: "" };
const signupInitialState = { fullname: "", email: "", password: "", confirmPassword: "" };

export default function Auth() {
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState(loginInitialState);
  const { login, signup, authLoading } = authServices();

  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    if (authData) {
      navigate("/profile");
    }
  }, [authData, navigate]);

  const handleChangeFormType = () => {
    if (formType === "login") {
      setFormType("signup");
      setFormData(signupInitialState);
    } else {
      setFormType("login");
      setFormData(loginInitialState);
    }
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (formType === "login") {
      if (!formData.email || !formData.password) {
        alert("Email and password are required");
        return;
      }

      login({
        email: formData.email.trim(),
        password: formData.password,
      });
      return;
    }

    if (formType === "signup") {
      if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
        alert("All signup fields are required");
        return;
      }

      if (formData.password.length < 6) {
        alert("Password must have at least 6 characters");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      signup({
        fullname: formData.fullname.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
    }
  };

  if (authLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.authPageContainer}>
      {formType === "login" ? (
        <>
          <h1>Login</h1>
          <button onClick={handleChangeFormType}>Don't you have an account? Click here</button>
          <form onSubmit={handleSubmitForm}>
            <TextField required label="Email" type="email" name="email" value={formData.email} onChange={handleFormDataChange} />
            <TextField required label="Password" type="password" name="password" value={formData.password} onChange={handleFormDataChange} />

            <button type="submit">
              Login <LuLogIn />
            </button>
          </form>
        </>
      ) : null}

      {formType === "signup" ? (
        <div className={styles.authPageContainer}>
          <h1>Signup</h1>
          <button onClick={handleChangeFormType}>Already have an account? Click here</button>
          <form onSubmit={handleSubmitForm}>
            <TextField required label="Fullname" type="text" name="fullname" value={formData.fullname} onChange={handleFormDataChange} />
            <TextField required label="Email" type="email" name="email" value={formData.email} onChange={handleFormDataChange} />
            <TextField required label="Password" type="password" name="password" value={formData.password} onChange={handleFormDataChange} />
            <TextField required label="ConfirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormDataChange} />

            <button type="submit">
              Signup <LuLogIn />
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
