// View password when button is clicked
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