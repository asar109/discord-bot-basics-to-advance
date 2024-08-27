const mongoose = require("mongoose");

const mongoConnector = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = mongoConnector;
