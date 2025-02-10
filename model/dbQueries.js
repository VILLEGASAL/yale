import { db } from "./dbConnection.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

db.connect();

const algorithm = process.env.ALGORITHM;

//Creates key that can be used by the encryption algorithm to encrypt and decrypt data.  
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

//Creates Initialization Vector to ensure that the same plaintext encrypted with the same key will produce different ciphertexts.
const iv = crypto.randomBytes(16);

export class System{

    // Signup a user
    static async signupUser(firstName, lastName, email, password){

        try {

            const query = `INSERT INTO keep_safe_users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`;

            const values = [firstName, lastName, email, password];

            return await db.query(query, values);
            
        } catch (error) {

            console.error(error);

            throw error;
        }
    }

    // Get a user by email
    static async getUserByEmail(email){

        try {
            const query = `SELECT * FROM keep_safe_users WHERE email = $1`;

            const values = [email];

            const result = await db.query(query, values);

            return result.rows[0] || null;
            
        } catch (error) {

            console.error(error);

            throw error;
        }

    }

    // Get a user by id
    static async getUserById(id){

        try {

            const query = `SELECT * FROM keep_safe_users WHERE id = $1`;

            const values = [id];

            const result = await db.query(query, values);

            return result.rows[0];
            
        } catch (error) {
            
        }
    }

    static getPasswordById = async (id) => {

        try {

            const query = `SELECT * FROM passwords WHERE id = $1`;
            const value = [id];

            const password = await db.query(query, value);            
            
            return password.rows[0];

        } catch (error) {
            
            console.log(`Error getting password: ${error}`);

            throw error;
        }
    }

    static encryptPassword = (password) => {
        
        //Creates cipher object. Specify what algorithm, key, and iv will be used.
        const cipher = crypto.createCipheriv(process.env.ALGORITHM, key, iv);
        
        //Encrypt the plain text into hexadecimal value.
        let encrypted = cipher.update(password, 'utf8', 'hex');
        
        //Finalizes the encryption process and concatenates any remaining encrypted data.
        encrypted += cipher.final('hex');
      
        return { encryptedPassword: encrypted, iv: iv.toString('hex') };
    };

    static decryptPassword = (encryptedPassword, iv) => {

        
        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
        
        let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
        
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }

    static async savePassword(userId, serviceName, password) {

        try {
            const { encryptedPassword, iv } = System.encryptPassword(password);
            
            const query = `
                INSERT INTO passwords (user_id, service_name, encrypted_password, iv)
                VALUES ($1, $2, $3, $4)`;
            
            const result = await db.query(query, [userId, serviceName, encryptedPassword, iv]);
            
            return result.rows[0];

        } catch (error) {

            console.error('Error saving password:', error);
            throw error;
        }
    }

    static async getAllPasswords(id) {

        try {

            const query = `SELECT * FROM passwords WHERE user_id = $1`;

            const value = [id]
            
            const result = await db.query(query, value);
                        
            return result.rows;

        } catch (error) {
            
            console.error('Error getting all passwords:', error);
            throw error;
        }
    }

    static async getUserPassword(id){

        try{

            const query = `SELECT * FROM keep_safe_users WHERE id = $1`;

            const value = [id];

            const user = await db.query(query, value);

            return user.rows[0];


        }catch(error){

            console.log(error);
            throw error;
        }
    }


    static async deletePassword(id){

        try {

            const query = `DELETE FROM passwords WHERE id = $1`;
            const value = [id];

            return db.query(query, value);

            
        } catch (error) {

            console.log(`Error deleting password: ${error}`);
            
            throw error
            
        }
    }
}