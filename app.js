import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import flash from "express-flash";
import ejs from "ejs";
import methodOverride from "method-override";
import { authenticationRouter } from "./routes/authenticationRoutes.js";
import { homeRouter } from "./routes/homeRoutes.js";
import { initialize } from "./controller/passport-config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(methodOverride("_method"));

initialize(passport);

// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies (if needed)
app.use(express.json());

app.set("view engine", "ejs");

// Middleware to serve static files
app.use(express.static("public"));

// Middleware to use session
app.use(session({

    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Middleware to use passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/", authenticationRouter);
app.use("/home", homeRouter);

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}.`);
});
