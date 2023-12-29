const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
    required: true,
  },
}, { timestamps: true });

const Logo = mongoose.model("Logo", logoSchema);

module.exports = Logo;
