const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  title: { type: String, required: true },
  list: { type: Schema.Types.ObjectId, ref: "List", required: true },
  position: { type: Number },
});

module.exports = mongoose.model("Card", cardSchema);
