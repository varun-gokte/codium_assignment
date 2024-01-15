const express = require("express");
const app = express();

const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./Schema/User");

mongoose.connect(process.env.mongodbkey, console.log("Connected to database"));

const server = require("http").Server(app);

app.use(
  cors({
    origin: ["https://main--stellar-profiterole-61a26c.netlify.app"],
  })
);

app.use(express.json());

//PUT JWT SECRET IN .ENV
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) res.json({ message: "INVALID" });
  else {
    try {
      const decoded = jwt.verify(token, process.env.jwtsecret);
      console.log(process.env.jwtsecret);
      req.userid = decoded.userid;
      req.username = decoded.username;
      next();
    } catch (err) {
      res.json({ message: "INVALID" });
    }
  }
};

app.get("/verify", verifyJWT, (req, res) => {
  res.json({ message: "VALID" });
});

app.post("/signup", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  const result = await User.exists({ username: username });
  if (result) {
    res.json({ message: "DUPLICATE" });
  } else {
    const hashed_password = await bcrypt.hash(password, 10);
    User.create({
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: hashed_password,
    })
      .then((user) => {
        console.log("New User", user);
        res.json({ message: "SUCCESS" });
      })
      .catch((err) => {
        console.log("User creation error", err);
        res.json({ message: "FAILURE" });
      });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const createJwt = (obj) => {
    const token = jwt.sign(
      { userid: obj._id, username: obj.username },
      process.env.jwtsecret,
      { expiresIn: 3000 }
    );
    console.log(`${obj.username} has logged in`);
    return token;
  };

  const user = await User.findOne({ username: username });
  if (user) {
    const pass_compare = await bcrypt.compare(password, user.password);
    if (pass_compare) {
      const token = createJwt(user);
      res.json({ logged: true, token: token });
    } else {
      res.json({ logged: false });
    }
  } else {
    res.json({ logged: false });
  }
});

app.post("/income", verifyJWT, (req, res) => {
  const { itemName, itemCost } = req.body;
  const userid = req.userid;

  User.findById(userid)
    .then((user) => {
      if (user) {
        user.total_income += Number(itemCost);
        user.income_items.push({ name: itemName, cost: itemCost });
        user.save();
        res.json({ message: "SUCCESS" });
      } else {
        res.json({ message: "FAILURE" });
      }
    })
    .catch((err) => {
      res.json({ message: "FAILURE" });
    });
});

app.get("/income", verifyJWT, (req, res) => {
  const userid = req.userid;

  User.findById(userid)
    .then((user) => {
      if (user) {
        const income_items = user.income_items;
        const total_income = user.total_income;
        res.json({
          message: "SUCCESS",
          income_items: income_items,
          total_income: total_income,
        });
      } else {
        res.json({ message: "FAILURE" });
      }
    })
    .catch((err) => {
      res.json({ message: "FAILURE" });
    });
});

app.put("/income", verifyJWT, (req, res) => {
  if (req.body.newName) {
    const userId = req.userid;
    const newName = req.body.newName;
    const itemId = req.body.id;

    User.findById(userId).then((user) => {
      if (user) {
        const list = user.income_items;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item._id.toString() === itemId) item.name = newName;
        }
        user.save();
        res.json({ message: "SUCCESS" });
      } else res.json({ message: "FAILURE" });
    });
  } else if (req.body.newCost) {
    const userId = req.userid;
    const newCost = req.body.newCost;
    const itemId = req.body.id;

    User.findById(userId).then((user) => {
      if (user) {
        const list = user.income_items;
        let oldCost = 0;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item._id.toString() === itemId) {
            oldCost = item.cost;
            item.cost = Number(newCost);
          }
        }
        user.total_income =
          user.total_income - Number(oldCost) + Number(newCost);
        user.save();
        res.json({ message: "SUCCESS" });
      } else res.json({ message: "FAILURE" });
    });
  } else {
    res.json({ message: "FAILURE" });
  }
});

app.delete("/income", verifyJWT, (req, res) => {
  if (req.body.id) {
    const itemid = req.body.id;
    const userid = req.userid;
    let oldCost = 0;
    User.findById(userid).then((user) => {
      if (user) {
        const list = user.income_items;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item._id.toString() === itemid) {
            oldCost = item.cost;
            list.splice(i, 1);
          }
        }
        user.total_income -= oldCost;
        user.save();
        res.json({ message: "SUCCESS" });
      } else {
        res.json({ message: "FAILURE" });
      }
    });
  } else {
    console.log(err);
    res.json({ message: "FAILURE" });
  }
});

//Expense

app.get("/expense", verifyJWT, (req, res) => {
  const userid = req.userid;

  User.findById(userid)
    .then((user) => {
      if (user) {
        const expense_items = user.expense_items;
        const total_expense = user.total_expense;
        res.json({
          message: "SUCCESS",
          expense_items: expense_items,
          total_expense: total_expense,
        });
      } else {
        res.json({ message: "FAILURE" });
      }
    })
    .catch((err) => {
      res.json({ message: "FAILURE" });
    });
});

app.post("/expense", verifyJWT, (req, res) => {
  const { itemName, itemCost } = req.body;
  const userid = req.userid;

  User.findById(userid)
    .then((user) => {
      if (user) {
        user.total_expense += Number(itemCost);
        user.expense_items.push({ name: itemName, cost: itemCost });
        user.save();
        res.json({ message: "SUCCESS" });
      } else {
        res.json({ message: "FAILURE" });
      }
    })
    .catch((err) => {
      res.json({ message: "FAILURE" });
    });
});

app.put("/expense", verifyJWT, (req, res) => {
  if (req.body.newName) {
    const userId = req.userid;
    const newName = req.body.newName;
    const itemId = req.body.id;

    User.findById(userId).then((user) => {
      if (user) {
        const list = user.expense_items;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item._id.toString() === itemId) item.name = newName;
        }
        user.save();
        res.json({ message: "SUCCESS" });
      } else res.json({ message: "FAILURE" });
    });
  } else if (req.body.newCost) {
    const userId = req.userid;
    const newCost = req.body.newCost;
    const itemId = req.body.id;

    User.findById(userId).then((user) => {
      if (user) {
        const list = user.expense_items;
        let oldCost = 0;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item._id.toString() === itemId) {
            oldCost = item.cost;
            item.cost = Number(newCost);
          }
        }
        user.total_expense =
          user.total_expense - Number(oldCost) + Number(newCost);
        user.save();
        res.json({ message: "SUCCESS" });
      } else res.json({ message: "FAILURE" });
    });
  } else {
    res.json({ message: "FAILURE" });
  }
});

app.delete("/expense", verifyJWT, (req, res) => {
  if (req.body.id) {
    const itemid = req.body.id;
    const userid = req.userid;
    let oldCost = 0;
    User.findById(userid).then((user) => {
      if (user) {
        const list = user.expense_items;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item._id.toString() === itemid) {
            oldCost = item.cost;
            list.splice(i, 1);
          }
        }
        user.total_expense -= oldCost;
        user.save();
        res.json({ message: "SUCCESS" });
      } else {
        res.json({ message: "FAILURE" });
      }
    });
  } else {
    console.log(err);
    res.json({ message: "FAILURE" });
  }
});

//Savings

app.get("/savings", verifyJWT, (req, res) => {
  const userid = req.userid;
  User.findById(userid)
    .then((user) => {
      if (user) {
        const savings = user.total_income - user.total_expense;
        res.json({
          message: "SUCCESS",

          firstname: user.firstname,
          lastname: user.lastname,

          expense: user.total_expense,
          income: user.total_income,

          expenseItems: user.expense_items,
          incomeItems: user.income_items,
          savings: savings,
        });
      } else res.json({ message: "FAILURE" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "FAILURE" });
    });
});

server.listen(8000, () => {
  console.log("Server is active at port 8000");
});
