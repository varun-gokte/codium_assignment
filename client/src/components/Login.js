import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../index";

function Login({ logStatus }) {
  const [un, setUN] = useState("");
  const [pw, setPW] = useState("");
  const [valid, setValid] = useState("");

  const [logged, setLogged] = useState(false);

  const URL = useContext(Context);

  const login = (e) => {
    e.preventDefault();
    if (un === "" || pw === "") {
      setValid(
        <p className="form-text text-danger">
          Please enter username and password.
        </p>
      );
      return;
    }
    fetch(`${URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: un, password: pw }),
    })
      .then((res) => {
        res.json().then((obj) => {
          if (obj.logged === false) {
            setValid(
              <p className="form-text text-danger">
                Invalid username or password.
              </p>
            );
          } else {
            localStorage.setItem("token", obj.token);
            setLogged(true);
            logStatus(true);
          }
        });
      })
      .catch((err) => {
        setLogged(false);
        logStatus(false);
        setValid(
          <p className="form-text text-warning">
            Unable to log in. Please try again.
          </p>
        );
      });
  };

  return (
    <div>
      {logged}
      {logged ? <Navigate to="/" /> : ""}
      <form
        onSubmit={login}
        style={{ width: "25%", margin: "auto" }}
        className="auth_form"
      >
        <h3 className="m-5 ">Log in to your account</h3>
        <label htmlFor="username" className="form-label">
          User Name:
        </label>
        <br />
        <input
          type="text"
          id="username"
          name="username"
          className="form-control"
          onChange={(e) => {
            setUN(e.target.value);
            setValid();
          }}
        />
        <br />

        <label htmlFor="password" className="form-label">
          Password:
        </label>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          className="form-control"
          onChange={(e) => {
            setPW(e.target.value);
            setValid();
          }}
        />
        <br />
        {valid}

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
export default Login;
