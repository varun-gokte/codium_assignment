import { useContext, useEffect, useState } from "react";

import Savings from "./Savings";
import Hello from "./Hello";
import { Context } from "../index";

function Home() {
  const [valid, setValid] = useState(false);

  const URL = useContext(Context);

  useEffect(() => {
    fetch(`${URL}/verify`, {
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

  return (
    <div>
      {valid ? (
        <>
          <Savings />
        </>
      ) : (
        <Hello />
      )}
    </div>
  );
}

export default Home;
