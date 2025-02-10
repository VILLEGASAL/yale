document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {

        button.addEventListener('click', () => {
            
            const verificationModal = document.getElementById('verificationModal');

            const verificationForm = document.getElementById('verificationForm');

            const passwordId = button.value;

            const passwordCard = button.closest('.password-card');

            const passwordNotMatchError = document.querySelector(".password-not-match");

            // Show verification modal
            verificationModal.style.display = 'flex';

            // Handle verification form submission
            verificationForm.onsubmit = async (e) => {

                try {

                    e.preventDefault();

                    const userPasswordInput = document.getElementById('userPassword').value;

                    const result = await axios.post(`/verify-user`, new URLSearchParams({

                        userPassword: userPasswordInput
                    }), {

                        heades: {

                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    

                    if(result.status === 200){

                        const response = await axios.get(`/home/decrypt-password/${passwordId}`);

                        console.log(response.data);

                        const passwordInput = passwordCard.querySelector('input');
                        const toggleButton = passwordCard.querySelector('.toggle-password');
                        const icon = toggleButton.querySelector('i');

                        passwordInput.type = 'text';
                        passwordInput.value = response.data.password;
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');

                        // Change back the input elemnt type to password type after 5 seconds
                        setTimeout(() => {

                            passwordInput.type = 'password';

                            passwordInput.value = '***';

                            icon.classList.remove('fa-eye-slash');

                            icon.classList.add('fa-eye');

                        }, 5000);

                        // Close the verification modal and reset the form
                        verificationModal.style.display = 'none';
                        verificationForm.reset();
                        
                    }
                    
                } catch (error) {

                    if (error.response && error.response.status === 401) {

                        passwordNotMatchError.style.display = "block";

                        passwordNotMatchError.innerText = "Password Incorrect!";
                        

                        setTimeout(() => {
                            
                            passwordNotMatchError.style.display = "none";

                        }, 2000);
                        
                    } else {

                        console.error('Error during verification:', error);
                    }

                    verificationForm.reset();
                    
                }
                
            };
        });
    });

    // Toggle the passwor visibility in verification modal
    const verifyForm = document.querySelector('#verificationForm');

    const toggleVisibilityBtn = document.querySelector('#verificationForm .toggle-visibility-btn');

    const passwordInput = document.querySelector('#verificationForm #userPassword');

    toggleVisibilityBtn.addEventListener('click', () => {

        const icon = document.querySelector('i');
        
        if (passwordInput.type === 'password') {

            passwordInput.type = 'text';

            icon.classList.remove('fa-eye');

            icon.classList.add('fa-eye-slash');

        } else {

            passwordInput.type = 'password';

            icon.classList.remove('fa-eye-slash');

            icon.classList.add('fa-eye');
        }
    });

    // Password Generation Functionality
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');

    const servicePasswordInput = document.getElementById('servicePassword');

    const generatePassword = () =>{

        const length = 20; // Fixed length

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const lowercase = 'abcdefghijklmnopqrstuvwxyz';

        const numbers = '0123456789';

        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        const allChars = uppercase + lowercase + numbers + symbols;
        
        // Generate initial password
        let password = '';

        for (let i = 0; i < length; i++) {

            const randomIndex = Math.floor(Math.random() * allChars.length);

            password += allChars[randomIndex];
        }

        // Ensure that at least one character from each type
        let finalPassword = password;

        finalPassword = replaceRandomChar(finalPassword, uppercase);

        finalPassword = replaceRandomChar(finalPassword, lowercase);

        finalPassword = replaceRandomChar(finalPassword, numbers);

        finalPassword = replaceRandomChar(finalPassword, symbols);

        return finalPassword;
    }

    const replaceRandomChar = (str, charSet) => {

        const pos = Math.floor(Math.random() * str.length);

        const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
        
        return str.substring(0, pos) + randomChar + str.substring(pos + 1);
    }

    generatePasswordBtn.addEventListener('click', function() {

        const password = generatePassword();

        servicePasswordInput.type = 'text';

        servicePasswordInput.value = password;
        
        // Change back to password type after 3 seconds
        setTimeout(() => {
            servicePasswordInput.type = 'password';
        }, 3000);
    });

    // Modal functionality
    const modal = document.getElementById('addPasswordModal');
    const addPasswordBtn = document.querySelector('.add-password-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    addPasswordBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close verification modal function
    window.closeVerificationModal = function() {
        const verificationModal = document.getElementById('verificationModal');
        const verificationForm = document.getElementById('verificationForm');
        verificationModal.style.display = 'none';
        verificationForm.reset();
    }

    // Close verification modal when clicking outside
    const verificationModal = document.getElementById('verificationModal');
    window.addEventListener('click', (e) => {
        if (e.target === verificationModal) {
            closeVerificationModal();
        }
    });

    // Add these functions to handle the profile modal
    const profileModal = document.getElementById('profileModal');
    const profileBtn = document.getElementById('profileBtn');
    const profileModalCloseBtn = profileModal.querySelector('.cancel-btn');

    profileBtn.addEventListener('click', () => {
        profileModal.style.display = 'block';
    });

    profileModalCloseBtn.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });
});
