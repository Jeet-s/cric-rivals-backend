const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://jagjeet:jeet2019@cluster0.khwel.mongodb.net/cric-rivals?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected db");
  }
);
