document.addEventListener('DOMContentLoaded', main);

    function main() {
    
        // theme switcher
        let themeToggle = document.getElementById('themeToggle');
        let htmlTheme = document.getElementById('htmlTheme');
        let current = localStorage.getItem('theme');
        let contact = document.getElementById('contact-form');

        if(themeToggle) {
            themeToggle.style.display = 'block';
        }

        function setTheme(theme) {
            htmlTheme.classList.toggle('light-mode', theme === 'light');
            localStorage.setItem('theme', theme);

            if(theme === 'dark') {
                contact.style.backgroundColor = 'rgb(72, 72, 72)';
            }
            else {
                contact.style.backgroundColor = 'rgb(150, 150, 150)';
            }
        }

        if(current) {
            setTheme(current);
        }
        themeToggle.addEventListener('click', themeListener);
        function themeListener() {
            const isLightMode = htmlTheme.classList.contains('light-mode');
            if(isLightMode) {
                setTheme('dark');
            }
            else {
                setTheme('light');
            }
        }

        // contact form validation stuff
        let nameInput = document.getElementById('name');
        let nameError = document.getElementById('nameError');
        let emailInput = document.getElementById('email'); 
        let emailError = document.getElementById('emailError');
        let commentsInput = document.getElementById('comments');
        let commentsError = document.getElementById('commentsError');

        let errorOutput = document.getElementById('errorOutput');
        let infoOutput = document.getElementById('infoOutput');

        let formErrors = [];

        function mask(element, regex, error) {
            element.addEventListener('keydown', maskHelper);
            function maskHelper(event) {
                let key = event.key;
                if(regex.test(key)) {
                    event.preventDefault();
                    error.textContent = 'Illegal character.';
                    error.style.opacity = '1';
                    addError(element, 'Illegal character.');
                    setTimeout(function() {
                        error.style.opacity = '0';
                    }, 2000);
                }
            }
        }
        mask(nameInput, /[^a-zA-Z\s]/, errorOutput);
        mask(emailInput, /[^\w@.]/, errorOutput);
        mask(commentsInput, /[^a-zA-Z\s\d.,?!]/, errorOutput);
        

        nameInput.addEventListener('input', nameListener);
        function nameListener() {
            let nameValue = nameInput.value.trim();
            if(nameValue.length > 0) {
                nameInput.setCustomValidity('');
                nameError.textContent = '';
                errorOutput.textContent = '';
            }
            else {
                nameInput.setCustomValidity('Please enter your name.');
                showError(nameError, nameInput.validationMessage);
                addError(nameInput, nameInput.validationMessage);
            }
        }

        emailInput.addEventListener('input', emailListener);
        function emailListener() {
            let emailValue = emailInput.value.trim();
            let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailPattern.test(emailValue)) {
                emailInput.setCustomValidity('');
                emailError.textContent = '';
                errorOutput.textContent = '';
            } 
            else {
                emailInput.setCustomValidity('Please enter a valid email address.');
                showError(emailError, emailInput.validationMessage);
            }
            if(emailValue.length === 0) {
                addError(emailInput, emailInput.validationMessage);
            }
        }

        commentsInput.addEventListener('input', commentListener);
        function commentListener() {
            let commentsValue = commentsInput.value.trim();
            let remaining = 500 - commentsValue.length;
            if(commentsValue.length > 0) {
                commentsInput.setCustomValidity('');
                commentsError.textContent = '';
                errorOutput.textContent = '';
            }
            else {
                commentsInput.setCustomValidity('Please enter some comments.');
                showError(commentsError, commentsInput.validationMessage);
                addError(commentsInput, commentsInput.validationMessage);
            }
            if(remaining >= 0) {
                infoOutput.textContent = 'Characters remaining: ' + remaining;
                if(remaining > 25) {
                    infoOutput.style.color = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color');
                }
                else {
                    infoOutput.style.color = 'red';
                    if(remaining === 0) {
                        infoOutput.textContent = 'Character limit reached.';
                        addError(commentsInput, 'Character limit reached.');
                    }
                }
            }
            else {
                
                commentsInput.setCustomValidity('Character limit exceeded.');
                showError(commentsError, commentsInput.validationMessage);
                addError(commentsInput, commentsInput.validationMessage);
            }
        }

        function validate() {
            let nameValue = nameInput.value.trim();
            let emailValue = emailInput.value.trim();
            let commentsValue = commentsInput.value.trim();
            let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(nameValue.length > 0 && emailPattern.test(emailValue) && commentsValue.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }

        function submitErrors() {
            let json = JSON.stringify(formErrors);
            let form_errors = document.getElementById('form_errors');
            if(!form_errors) {
                form_errors = document.createElement('input');
                form_errors.type = 'hidden';
                form_errors.name = 'form_errors';
                form_errors.id = 'form_errors';
                document.getElementById('contactForm').appendChild(form_errors);
            }
            form_errors.value = json;
        }
        
        
        

        function showError(target, message) {
            target.textContent = message;
        }

        function addError(target, message) {
            formErrors.push({ field: target.previousElementSibling.getAttribute('for'), message: message });
            console.log(JSON.stringify(formErrors));
        }

        document.getElementById('contactForm').addEventListener('submit', formSubmission);
        function formSubmission(event) {
            if(!validate()) {
                event.preventDefault();
            }
            else {
                submitErrors();
            }
        }

    }
