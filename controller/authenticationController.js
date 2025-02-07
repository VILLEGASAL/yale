import { System } from "../model/dbQueries.js";
import bcrypt from "bcrypt";

export const getSignupPage = (req, res) => {
  
    res.render("signup.ejs");
};

export const getLoginPage = (req, res) => {

    res.render("login.ejs");
};

export const getHomePage = async(req, res) => {
    
    try {

        const passwords = await System.getAllPasswords(req.user.id);
        const userName = req.user.first_name.toUpperCase();
        const userEmail = req.user.email;
        const userFullName = `${req.user.first_name.toUpperCase()}  ${req.user.last_name.toUpperCase()}`;

        res.render("home.ejs", { 
        
            passwords: passwords,
            userName: userName,
            userEmail: userEmail,
            userFullName: userFullName
        });

    } catch (error) {

        console.error(error);
    }
}

export const signupUser = async (req, res) => {

    try {
        
        // Get the user's input
        const firstName = req.body.firstName;

        const lastName = req.body.lastName;

        const email = req.body.email;

        const password = req.body.password;

        // Hash the password entered by the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Signup the user
        await System.signupUser(firstName, lastName, email, hashedPassword);

        res.redirect("/login");

    } catch (error) {
        
        console.error(error);

        res.status(500).send("Internal server error");
    }
};

//Check if the user is already authenticated.
export const checkAuthenticated = (req, res, next) => {

    if(req.isAuthenticated()){

        return next();
    }

    res.redirect("/login");
}

// Prevent the user from accessing a route using back button in the browser if he/she is already logged in.
export const preventAccessIfAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) {

        return res.redirect("/home");
    }

    // Set heaDEers to prevent caching.
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    res.set('Pragma', 'no-cache');

    res.set('Expires', '0');

    next();
};

// VErify user password before they can see their password.
export const verifyUser = async(req, res, next) => {

    try {
        const userPassword = await System.getUserPassword(req.user.id);

        const enteredPass = req.body.userPassword;

        console.log(enteredPass);
        

        if(await bcrypt.compare(enteredPass, userPassword.password)){

            res.status(200).send();
            
        }else{

            res.status(401).send();
        }    

    } catch (error) {

        console.log(`ERROR VERIFYING THE USER: ${error}`);

        res.status(500).redirect("/home");

        throw error;
    }
}

