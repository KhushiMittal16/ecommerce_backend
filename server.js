require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const { readdirSync } = require("fs");

const app = express();
mongoose.connect(process.env.DATABASE, {
    useNewURLParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

app.use(morgan("dev"));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit:'200mb'}));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Backend");
});

readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

app.get("*",(req,res)=>{
  res.send("Sorry... You came to the wrong address!!! Please enter a correct address")
}) 

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
