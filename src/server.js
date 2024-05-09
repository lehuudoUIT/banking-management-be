import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/webRoutes";
import initAPIRoutes from "./routes/api";
import connectDatabase from "./config/connectDatabase";
import cookieParser from "cookie-parser";

require("dotenv").config();

let app = express();

// app.use(cors({ origin: true, credentials: true }));
// Custom CORS middleware
//config cors
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  // Pass to next layer of middleware
  next();
});

// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// config cookie parser
app.use(cookieParser());

configViewEngine(app);

initWebRoutes(app);

initAPIRoutes(app);

connectDatabase();

let port = process.env.PORT || 1000;

//through 404 when route is invalid

app.use((req, res) => {
  res.send("404 not found");
});

app.listen(port, () => {
  console.log("Backend banking is running on the port: " + port);
});
