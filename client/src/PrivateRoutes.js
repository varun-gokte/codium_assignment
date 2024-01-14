import { useEffect, useState, useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { Context } from "./index";

const PrivateRoutes = () => {
  const [valid, setValid] = useState();

  const URL = useContext(Context);

  const verifyUser = async () => {
    const res = await fetch(`${URL}/verify`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const obj = await res.json();
    if (obj.message === "VALID") return true;
    else return false;
  };

  useEffect(() => {
    setValid(verifyUser());
  }, []);

  if (valid === undefined) return <div>Loading</div>;
  else
    return (
      <div>
        {console.log(valid)}
        {valid ? <Outlet /> : <Navigate to="/login" />}
      </div>
    );
};

export default PrivateRoutes;
