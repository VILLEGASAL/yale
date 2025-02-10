
export const verifyUser = async(password) =>{

    try {

        const result = await axios.post(`/verify-user`, new URLSearchParams({

            userPassword: password
        }), {

            heades: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        if (result.status === 200) {
            
            return true;
        }else{

            return false;
        }
        
    } catch (error) {
        
        console.log(error);
        throw error;
    }
}