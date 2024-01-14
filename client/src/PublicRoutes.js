import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";

const PublicRoutes = () => {
  const [valid, setValid] = useState(false);
  useEffect(() => {
    fetch("http://localhost:8000/verify", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => {
        res.json().then((obj) => {
          if (obj.message === "INVALID") setValid(false);
          else setValid(true);
        });
      })
      .catch((err) => {
        setValid(false);
      });
  }, []);

  return !valid ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;
