const express = require("express");
require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const connectDB = require("./config/db");
const schema = require("./schema/schema");
const PORT = process.env.PORT || 5000;

const app = express();
connectDB();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(PORT, () => console.log("Server is running on PORT:" + PORT));
