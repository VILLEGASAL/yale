import { System } from "../model/dbQueries.js";

export const addPassword = (req, res) => {
    
    const userId = req.user.id;
    
    const serviceName = req.body["serviceName"];
    
    const password = req.body["servicePassword"];
    
    System.savePassword(userId, serviceName, password);
    
    res.redirect("/home");
    
}

export const decryptPassword = async(req, res) => {

    try {

        
        const passwordId = req.params.id;
        
        const { encrypted_password, iv } = await System.getPasswordById(passwordId);        

        const password = System.decryptPassword(encrypted_password, iv);
        
        
        res.json({password: password});
        
    } catch (error) {

        console.log(error);
        throw error;
        
    }

    
}

export const deletePassword = async(req, res) => {

    try {
        
        await System.deletePassword(req.params.id);

        res.redirect("/home");

    } catch (error) {

        console.log(`Error deleting password in Controller: ${error}`);
        
        throw error;
    }
}
