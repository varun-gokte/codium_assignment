const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  firstname: { type: String, default: "" },
  lastname: { type: String, default: "" },
  username: String,
  password: String,

  income_items: [
    {
      name: String,
      cost: Number,
    },
  ],

  expense_items: [
    {
      name: String,
      cost: Number,
    },
  ],

  total_income: { type: Number, default: 0 },
  total_expense: { type: Number, default: 0 },
  total_savings: { type: Number, default: 0 },
});

const Users = mongoose.model("User", userSchema);

module.exports = Users;
