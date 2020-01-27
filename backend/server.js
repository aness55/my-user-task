const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const mysqlConnection = require("./connection");
const jwt = require('./helpers/jwt');
const UsersRoutes = require("./routes/users");

var app = express();
app.use(cors());
app.use(jwt());

app.use(bodyParser.json());
app.use("/users", UsersRoutes);

app.listen(3000);