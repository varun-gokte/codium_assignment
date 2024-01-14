import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../index";

function Savings() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [income, setIncome] = useState(0);
  const [incomeItems, setIncomeItems] = useState([]);

  const [expense, setExpense] = useState(0);
  const [expenseItems, setExpenseItems] = useState([]);

  const [savings, setSavings] = useState(0);

  const [errMsg, setErrMsg] = useState(<></>);

  const URL = useContext(Context);

  useEffect(() => {
    fetch(`${URL}/savings`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => {
        res.json().then((obj) => {
          if (obj.message === "SUCCESS") {
            setFirstname(obj.firstname);
            setLastname(obj.lastname);

            setIncome(obj.income);
            setExpense(obj.expense);

            setIncomeItems(obj.incomeItems);
            setExpenseItems(obj.expenseItems);

            setSavings(obj.savings);
          } else {
            setErrMsg(
              <p className="form-text text-warning">
                Could not reach the server. Please try again later.
              </p>
            );
          }
        });
      })
      .catch((err) => {
        setErrMsg(
          <p className="form-text text-warning">
            Could not reach the server. Please try again later.
          </p>
        );
      });
  }, []);

  return (
    <div>
      <div className="m-3 fs-2 fw-semibold">
        Hello {firstname + " " + lastname}, here's your savings summary.
      </div>
      <div className="container text-center my-5">
        <div className="row row-cols-2">
          <div className="col">
            <div className="fs-3">Your total income:</div>
            <div className="fs-2 text-primary">₹{income}</div>
            <div className="fst-italic">
              See a breakdown of your income{" "}
              <Link to="/income" className="nav-liactive link-primary">
                here
              </Link>
            </div>
          </div>
          <div className="col">
            <div className="fs-3">Your total expenses:</div>
            <div className="fs-2 text-primary">₹{expense}</div>
            <div className="fst-italic">
              See a breakdown of your expenses{" "}
              <Link to="/expense" className="active link-primary ">
                here
              </Link>
            </div>
          </div>
        </div>
        <div className="col m-5">
          <div className="fs-3">Your total savings:</div>
          {savings > 0 ? (
            <div className="fs-1 text-success">₹{savings}</div>
          ) : (
            <div className="fs-1 text-danger">₹{savings}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Savings;
