const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://rafliaf:" + process.env.MONGO_ATLAS_PW + "@node-rest-raf.whc1ynz.mongodb.net/growplants?retryWrites=true&w=majority")
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log(error.message));
