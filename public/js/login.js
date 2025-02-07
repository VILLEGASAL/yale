document.querySelector('.toggle-password').addEventListener('click', () => {

    const passwordInput = document.querySelector('#password');

    const icon = this;
    
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

// Add auto-remove functionality for error message
const errorMessage = document.querySelector('.error-message');

if (errorMessage) {

    setTimeout(() => {

        errorMessage.remove();
        
    }, 4000); // Remove after 4s (2s delay + 2s animation)
}