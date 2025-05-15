import { signUp } from "./script.js";

        const loginSection = document.getElementById('login-section');
        const registerSection = document.getElementById('register-section');
        const toRegisterLink = document.getElementById('to-register');
        const toLoginLink = document.getElementById('to-login');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        const loginPasswordToggle = document.getElementById('login-password-toggle');
        const loginError = document.getElementById('login-error');
        const forgotPassword = document.getElementById('forgot-password');
        const firstName = document.getElementById('first-name');
        const lastName = document.getElementById('last-name');
        const registerEmail = document.getElementById('register-email');
        const registerPassword = document.getElementById('register-password');
        const registerPasswordToggle = document.getElementById('register-password-toggle');
        const passwordStrength = document.getElementById('password-strength');
        const registerError = document.getElementById('register-error');
        const authContainer = document.querySelector('.auth-container');

        // Add loaded class for animation
        window.addEventListener('load', () => {
            authContainer.classList.add('loaded');
        });

        // Toggle between login and register sections
        toRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.classList.remove('active');
            registerSection.classList.add('active');
            loginError.textContent = '';
            loginError.classList.remove('show');
            registerError.textContent = '';
            registerError.classList.remove('show');
            passwordStrength.style.display = 'block';
        });

        toLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerSection.classList.remove('active');
            loginSection.classList.add('active');
            loginError.textContent = '';
            loginError.classList.remove('show');
            registerError.textContent = '';
            registerError.classList.remove('show');
            passwordStrength.style.display = 'none';
        });

        // Password visibility toggle for login
        loginPasswordToggle.addEventListener('click', () => {
            const isPassword = loginPassword.type === 'password';
            loginPassword.type = isPassword ? 'text' : 'password';
            loginPasswordToggle.classList.toggle('fa-eye', isPassword);
            loginPasswordToggle.classList.toggle('fa-eye-slash', !isPassword);
        });

        // Password visibility toggle for register
        registerPasswordToggle.addEventListener('click', () => {
            const isPassword = registerPassword.type === 'password';
            registerPassword.type = isPassword ? 'text' : 'password';
            registerPasswordToggle.classList.toggle('fa-eye', isPassword);
            registerPasswordToggle.classList.toggle('fa-eye-slash', !isPassword);
        });

        // Password strength indicator for register
        registerPassword.addEventListener('input', () => {
            const password = registerPassword.value;
            passwordStrength.style.display = 'block';
            if (password.length < 6) {
                passwordStrength.textContent = 'Weak: At least 6 characters';
                passwordStrength.className = 'password-strength weak';
            } else if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
                passwordStrength.textContent = 'Medium: Add uppercase or numbers';
                passwordStrength.className = 'password-strength medium';
            } else {
                passwordStrength.textContent = 'Strong';
                passwordStrength.className = 'password-strength strong';
            }
        });

        // Forgot password simulation
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            loginError.textContent = 'Password reset link sent! (Simulation)';
            loginError.classList.add('show');
        });

        // Login form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginEmail.value;
            const password = loginPassword.value;
            loginError.textContent = '';
            loginError.classList.remove('show');

            // Client-side validation
            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                loginError.textContent = 'Please enter a valid email address.';
                loginError.classList.add('show');
                return;
            }
            if (!password || password.length < 6) {
                loginError.textContent = 'Password must be at least 6 characters long.';
                loginError.classList.add('show');
                return;
            }

            // Simulate login
            console.log('Login attempt:', { email, password });
            alert('Login successful! (Simulation)');
        });

        // Register form submission
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstNameVal = firstName.value;
            const lastNameVal = lastName.value;
            const email = registerEmail.value;
            const password = registerPassword.value;
            const name = `${firstNameVal} ${lastNameVal}`;
            registerError.textContent = '';
            registerError.classList.remove('show');

            // Client-side validation
            if (!firstNameVal || firstNameVal.length < 2) {
                registerError.textContent = 'First name must be at least 2 characters long.';
                registerError.classList.add('show');
                return;
            }
            if (!lastNameVal || lastNameVal.length < 2) {
                registerError.textContent = 'Last name must be at least 2 characters long.';
                registerError.classList.add('show');
                return;
            }
            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                registerError.textContent = 'Please enter a valid email address.';
                registerError.classList.add('show');
                return;
            }
            if (!password || password.length < 6) {
                registerError.textContent = 'Password must be at least 6 characters long.';
                registerError.classList.add('show');
                return;
            }
            if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
                registerError.textContent = 'Password must include an uppercase letter and a number.';
                registerError.classList.add('show');
                return;
            }

            // Simulate registration
            // console.log('Registration attempt:', { firstName: firstNameVal, lastName: lastNameVal, email, password });
            // alert('Account created! (Simulation)'); 

         signUp(email, password, name); // Call the Firebase signUp function
});