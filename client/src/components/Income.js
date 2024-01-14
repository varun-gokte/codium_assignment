import { useContext, useEffect, useState } from "react";
import { Context } from "../index";

function Income() {
  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState(0);

  const [errMsg, setErrMsg] = useState(<></>);
  const [tableDisplayErr, setTableDisplayErr] = useState(<></>);

  const [incomeList, setIncomeList] = useState([]);
  const [incomeVal, setIncomeVal] = useState(0);

  const [tableItemName, setTableItemName] = useState("disabled");
  const [tableNameSave, setTableNameSave] = useState("");

  const [tableItemCost, setTableItemCost] = useState("disabled");
  const [tableCostSave, setTableCostSave] = useState("");

  const [selectedIndex, setSelectedIndex] = useState("");
  const [selectedIndexDelete, setSelectedIndexDelete] = useState("");

  const [itemId, setItemId] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(true);

  const URL = useContext(Context);

  const getIncome = async () => {
    try {
      const response = await fetch(`${URL}/income`, {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      const obj = await response.json();
      setIncomeVal(obj.total_income);
      setIncomeList(obj.income_items);
    } catch (err) {
      setTableDisplayErr(
        <p className="form-text text-warning">
          Could not get table. Please try again later.
        </p>
      );
    }
  };

  useEffect(() => {
    getIncome();
  }, []);

  const editNameRequest = (e) => {
    e.preventDefault();
    fetch(`${URL}/income`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ id: itemId, newName: itemName }),
    })
      .then((res) => {
        res.json().then((obj) => {
          setTableItemName("disabled");
          setTableNameSave("");
          getIncome();
        });
      })
      .catch((err) => {
        setTableDisplayErr(
          <p className="form-text text-warning">
            Could not update data. Please try again
          </p>
        );
      });
  };

  const editName = (index, id) => {
    setSelectedIndex(index);
    setItemId(id);
    if (tableItemName === "disabled") {
      setTableItemName("");
      setTableNameSave(
        <button className="mx-2 btn btn-success btn-sm" type="submit">
          Save
        </button>
      );
    } else {
      setTableItemName("disabled");
      setTableNameSave("");
    }
  };

  const editCostRequest = (e) => {
    e.preventDefault();
    fetch(`${URL}/income`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ id: itemId, newCost: itemCost }),
    })
      .then((res) => {
        res.json().then((obj) => {
          setTableItemCost("disabled");
          setTableCostSave("");
          getIncome();
        });
      })
      .catch((err) => {
        setTableDisplayErr(
          <p className="form-text text-warning">
            Could not update data. Please try again
          </p>
        );
      });
  };

  const editCost = (index, id) => {
    setSelectedIndex(index);
    setItemId(id);
    if (tableItemCost === "disabled") {
      setTableItemCost("");
      setTableCostSave(
        <button className="mx-2 btn btn-success btn-sm" type="submit">
          Save
        </button>
      );
    } else {
      setTableItemCost("disabled");
      setTableCostSave("");
    }
  };

  const deleteRequest = (e, id) => {
    e.preventDefault();

    fetch(`${URL}/income`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        res.json().then((obj) => {
          getIncome();
          setTableDisplayErr("");
        });
      })
      .catch((err) => {
        setTableDisplayErr(
          <p className="form-text text-warning">
            Could not delete item. Please try again later.
          </p>
        );
      });
  };

  const sendIncome = (e) => {
    e.preventDefault();
    if (itemName === "") {
      setErrMsg(
        <p className="form-text text-danger mx-3">Please enter a name.</p>
      );
      return;
    }
    if (itemCost === "") {
      setErrMsg(
        <p className="form-text text-danger mx-3">Please enter a cost.</p>
      );
      return;
    }

    fetch(`${URL}/income`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ itemName: itemName, itemCost: itemCost }),
    })
      .then((res) => {
        res.json().then((obj) => {
          getIncome();
        });
      })
      .catch((err) => {
        setTableDisplayErr(
          <p className="form-text text-warning">
            Could not add item. Please try again.
          </p>
        );
      });
  };

  return (
    <div>
      <h4 className="mx-3 mt-4">Total Income: ₹{incomeVal}</h4>
      <p className="d-inline-flex gap-1">
        <a
          className="mx-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          See Full List
        </a>
      </p>
      <div className="collapse" id="collapseExample">
        <div className="card card-body bg-info-subtle">
          {incomeList && incomeList.length > 0 ? (
            <div className="mx-3">
              <table className="table table-info">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Item Name</th>
                    <th scope="col">Item Cost</th>
                    <th style={{ width: "30%" }} scope="col">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {incomeList.map((item, index) => {
                    return (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>
                          <form onSubmit={editNameRequest} className="row g-3">
                            <div className="col-auto">
                              <input
                                className="form-control"
                                type="text"
                                value={
                                  tableItemName !== "disabled" &&
                                  selectedIndex === index
                                    ? itemName
                                    : item.name
                                }
                                aria-label="Disabled input example"
                                disabled={
                                  selectedIndex === index
                                    ? tableItemName
                                    : "disabled"
                                }
                                onChange={(e) => setItemName(e.target.value)}
                              />
                            </div>
                            <div className="col-auto">
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                  setItemName(item.name);
                                  editName(index, item._id);
                                }}
                              >
                                Edit
                              </button>
                              {selectedIndex === index ? tableNameSave : ""}
                            </div>
                          </form>
                        </td>
                        <td>
                          <form onSubmit={editCostRequest} className="row g-3">
                            <div className="col-auto">
                              <input
                                className="form-control"
                                type="text"
                                value={
                                  tableItemCost !== "disabled" &&
                                  selectedIndex === index
                                    ? itemCost
                                    : item.cost
                                }
                                aria-label="Disabled input example"
                                disabled={
                                  selectedIndex === index
                                    ? tableItemCost
                                    : "disabled"
                                }
                                onChange={(e) => setItemCost(e.target.value)}
                              />
                            </div>
                            <div className="col-auto">
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                  setItemCost(item.cost);
                                  editCost(index, item._id);
                                }}
                              >
                                Edit
                              </button>
                              {selectedIndex === index ? tableCostSave : ""}
                            </div>
                          </form>
                        </td>
                        <td>
                          {!deleteConfirm && selectedIndexDelete === index ? (
                            <div>
                              <small>
                                This will permanently delete this item. Are you
                                sure?
                              </small>
                              <div className="row g-3">
                                <div className="col-auto">
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={(e) => {
                                      deleteRequest(e, item._id);
                                      setDeleteConfirm(!deleteConfirm);
                                    }}
                                  >
                                    Yes
                                  </button>
                                </div>
                                <div className="col-auto">
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={(op) => {
                                      setDeleteConfirm(!op);
                                      setSelectedIndexDelete("");
                                      setTableDisplayErr("");
                                    }}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(op) => {
                                setSelectedIndexDelete(index);
                                setDeleteConfirm(!op);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {tableDisplayErr}
            </div>
          ) : (
            <p className="text-success">No income items here! Add one below.</p>
          )}
        </div>
      </div>
      <h4 className="mt-4 mx-3">Add a new Item</h4>
      <form onSubmit={sendIncome}>
        <div className="row g-3 align-items-center m-3">
          <div className="col-auto">
            <label htmlFor="item_name" className="col-form-label">
              Item Name:
            </label>
          </div>

          <div className="col-auto">
            <input
              type="text"
              id="item_name"
              name="item_name"
              className="form-control"
              aria-describedby="nameinfo"
              onChange={(e) => {
                setItemName(e.target.value);
                setErrMsg("");
              }}
            />
          </div>

          <span id="nameinfo" className="form-text mx-1">
            Pick a name for this income item (like "Salary" or "Pension")
          </span>
        </div>

        <div className="row g-3 align-items-center m-3">
          <div className="col-auto">
            <label htmlFor="item_cost" className="col-form-label">
              Item Amount:
            </label>
          </div>

          <div className="col-auto">
            <input
              type="number"
              id="item_cost"
              name="item_cost"
              className="form-control"
              onChange={(e) => {
                setItemCost(e.target.value);
                setErrMsg("");
              }}
            />
          </div>
        </div>

        <button type="Submit" className="mx-4 my-2 btn btn-primary">
          Add
        </button>
        {errMsg}
      </form>
    </div>
  );
}

export default Income;
