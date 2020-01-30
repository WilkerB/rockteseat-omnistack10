const mongoose = require("mongoose");
const PointSchema = require("./utils/PointSchema");

// Estrutura que deve ter no banco
const DevSchema = new mongoose.Schema({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String],
  location: {
    type: PointSchema,
    index: "2dsphere"
  }
});

// Informa ao DB o nome e o modelo do schema a ser salvo
module.exports = mongoose.model("Dev", DevSchema);
