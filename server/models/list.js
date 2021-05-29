const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  position: { type: Number },
});

module.exports = mongoose.model("List", listSchema);
