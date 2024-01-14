import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import { useEffect, useState } from "react";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Income from "./components/Income";
import Expense from "./components/Expense";
import PrivateRoutes from "./PrivateRoutes";
import About from "./components/About";

function App() {
  const token = localStorage.getItem("token");
  const { isExpired } = useJwt("token");
  let temp = false;

  if (token) {
    temp = true;
    if (isExpired) {
      temp = false;
    }
  }

  const [logged, setLogged] = useState(temp);

  const logStatus = (status) => {
    setLogged(status);
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setLogged(false);
    navigate("/login");
  };

  return (
    <div>
      <style></style>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "#CEE1FF" }}
      >
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            Savings Calculator
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link active">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/about" className="nav-link active">
                  About
                </Link>
              </li>
              {logged ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Cost breakdown
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/income" className="dropdown-item">
                        Income List
                      </Link>
                    </li>
                    <li>
                      <Link to="/expense" className="dropdown-item">
                        Expense List
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : (
                ""
              )}
            </ul>
            {logged ? (
              <button className="btn btn-primary" onClick={logout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary mx-3">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login logStatus={logStatus} />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;
