document.addEventListener('DOMContentLoaded', function () {
    let nameInput = document.getElementById('name');
    let nameError = document.getElementById('nameError');
    let emailInput = document.getElementById('email'); 
    let emailError = document.getElementById('emailError');
    let commentsInput = document.getElementById('comments');
    let commentsError = document.getElementById('commentsError');

    let errorOutput = document.getElementById('errorOutput');
    let infoOutput = document.getElementById('infoOutput');
    

    nameInput.addEventListener('input', function() {
        let nameValue = nameInput.value.trim();
        if(nameValue.length > 0) {
            nameInput.setCustomValidity('');
            nameError.textContent = '';
            errorOutput.textContent = '';
        }
        else {
            nameInput.setCustomValidity('Please enter your name.');
            showError(nameError, nameInput.validationMessage);
            // errorOutput.textContent = 'Please fix errors in the form.';
        }
        // validate();
    });

    emailInput.addEventListener('input', function () {
        let emailValue = emailInput.value.trim();
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(emailValue)) {
            // The email format is valid, clear any previous error message
            emailInput.setCustomValidity('');
            emailError.textContent = '';
            errorOutput.textContent = '';
        } 
        else {
            // The email format is invalid, set a custom error message
            emailInput.setCustomValidity('Please enter a valid email address.');
            showError(emailError, emailInput.validationMessage);
            // errorOutput.textContent = 'Please fix errors in the form.';
        }
        // validate();
    });

    commentsInput.addEventListener('input', function() {
        let commentsValue = commentsInput.value.trim();
        if(commentsValue.length > 0) {
            commentsInput.setCustomValidity('');
            commentsError.textContent = '';
            errorOutput.textContent = '';
        }
        else {
            commentsInput.setCustomValidity('Please enter some comments.');
            showError(commentsError, commentsInput.validationMessage);
            // errorOutput.textContent = 'Please fix errors in the form.';
        }
        // validate();
    });

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

    function showError(target, message) {
        // Display the error message
        target.textContent = message;
    }

    function mask(element, regex, error) {
        element.addEventListener('input', function() {
            let input = element.value.trim();
            let masked = input.replace(regex, '');
            if(input !== masked) {
                element.value = masked;
                error.textContent = 'Illegal character.';
                error.style.opacity = '1';
                setTimeout(function () {
                    error.style.opacity = '0';
                }, 2000);
            }
            else {
                error.textContent = '';
                error.style.opacity = '0';
            }
        });
    }
    mask(nameInput, /[^a-zA-Z\s]/, nameError);

    let contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(event) {
        let valid = validate();
        if(!valid) {
            event.preventDefault();
            errorOutput.textContent = 'Please fix the errors in the form.';
        }
        else {
            errorOutput.textContent = '';
        }
    });


});
