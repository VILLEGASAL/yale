import express from "express";
import { addPassword, decryptPassword, deletePassword } from "../controller/homeController.js";
import { checkAuthenticated } from "../controller/authenticationController.js";


export const homeRouter = express.Router();

homeRouter.post("/add-password", addPassword);

homeRouter.get("/decrypt-password/:id", checkAuthenticated, decryptPassword);

homeRouter.delete("/delete-password/:id", checkAuthenticated, deletePassword);