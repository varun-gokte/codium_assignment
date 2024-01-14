import { useState, useContext } from "react";
import { Navigate } from "react-router";
import { Context } from "../index";

function Signup() {
  const [fn, setFN] = useState("");
  const [ln, setLN] = useState("");
  const [un, setUN] = useState("");
  const [pw, setPW] = useState("");
  const [rpw, setRPW] = useState("");

  const [validUN, setValidUN] = useState("");
  const [validPW, setValidPW] = useState("");
  const [success, setSuccess] = useState(false);
  const [creationError, setCreationError] = useState("");

  const URL = useContext(Context);

  const submitDeets = (e) => {
    e.preventDefault();
    if (un === "" || pw === "" || fn === "") {
      setValidPW(
        <p className="form-text text-danger">
          Please fill all the required fields
        </p>
      );
      return;
    }
    if (!(rpw === pw)) {
      setValidPW(<p className="form-text text-danger">Password must match</p>);
      return;
    }
    setValidPW("");
    const details = {
      firstname: fn,
      lastname: ln,
      username: un,
      password: pw,
    };
    fetch(`${URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    })
      .then((res) => {
        res.json().then((obj) => {
          if (obj.message === "DUPLICATE") {
            setValidUN(
              <p className="form-text text-danger">Username already taken</p>
            );
          } else if (obj.message === "SUCCESS") {
            setSuccess(true);
          } else if (obj.message === "FAILURE") {
            setCreationError(
              <p className="form-text text-warning">
                Unable to create user. Please try again later.
              </p>
            );
          }
        });
      })
      .catch((err) => {
        setCreationError(
          <p className="form-text text-warning">
            Unable to create user. Please try again later.
          </p>
        );
      });
  };

  return (
    <div>
      {success ? (
        <Navigate to="/login" />
      ) : (
        <form onSubmit={submitDeets} className="form mx-5">
          <h3 className="my-3">Create a new account for free</h3>
          <h5 className="mx-1 mb-4 form-text">
            Fields marked with an * are required
          </h5>
          <label className="form-label" htmlFor="firstname">
            First Name <small className="req">*</small>
          </label>
          <input
            className="form-control mb-3"
            type="text"
            id="firstname"
            name="firstname"
            onChange={(e) => {
              setFN(e.target.value);
            }}
          />

          <label className="form-label" htmlFor="lastname">
            Last Name
          </label>
          <input
            className="form-control mb-3"
            type="text"
            id="lastname"
            name="lastname"
            onChange={(e) => {
              setLN(e.target.value);
            }}
          />

          <label className="form-label" htmlFor="username">
            User Name <small className="req">*</small>
          </label>
          <input
            className="form-control mb-3"
            type="text"
            id="username"
            name="username"
            onChange={(e) => {
              setUN(e.target.value);
            }}
          />
          {validUN}

          <label className="form-label" htmlFor="password">
            Password <small className="req">*</small>
          </label>
          <input
            className="form-control mb-3"
            type="password"
            id="password"
            name="password"
            onChange={(e) => {
              setPW(e.target.value);
            }}
          />

          <label className="form-label" htmlFor="confirm">
            Confirm Password <small className="req">*</small>
          </label>
          <input
            className="form-control mb-3"
            type="password"
            id="confirm"
            name="confirm"
            onChange={(e) => {
              setRPW(e.target.value);
            }}
          />
          {validPW}
          <button className="btn btn-primary mt-2" type="submit">
            Create Account
          </button>
          {creationError}
        </form>
      )}
    </div>
  );
}
export default Signup;
