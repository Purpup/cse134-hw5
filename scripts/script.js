document.addEventListener('DOMContentLoaded', function () {
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
    mask(nameInput, /[^a-zA-Z\s]/, errorOutput);
    mask(emailInput, /[^\w@.]/, errorOutput);
    mask(commentsInput, /[^a-zA-Z\s\d.,?!]/, errorOutput);
    

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
        }
    });

    emailInput.addEventListener('input', function () {
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
    });

    commentsInput.addEventListener('input', function() {
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
        }
        if(remaining >= 0) {
            infoOutput.textContent = 'Characters remaining: ' + remaining;
            if(remaining > 25) {
                infoOutput.style.color = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color');
            }
            else {
                infoOutput.style.color = 'red';
            }
        }
        else {
            commentsInput.setCustomValidity('Character limit exceeded.');
            showError(commentsError, commentsInput.validationMessage);
            commentsInput.readOnly = true;
        }
    });

    function validate() {
        let nameValue = nameInput.value.trim();
        let emailValue = emailInput.value.trim();
        let commentsValue = commentsInput.value.trim();
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(nameValue.length > 0 && emailPattern.test(emailValue) && commentsValue.length > 0) {
            formErrors = [];
            submitErrors();
            return true;
        }
        else {
            submitErrors();
            return false;
        }
    }

    function submitErrors() {
        if(formErrors.length > 0) {
            let data = JSON.stringify(formErrors);
            let hidden = document.createElement('input');

            hidden.type = 'hidden';
            hidden.name = 'form-errors';
            hidden.value = data;

            document.getElementsById('contactForm').appendChild(hidden);
        }
    }

    function addError(target, message) {
        formErrors.push({ field: target.previousElementSibling.getAttribute('for'), message: message });
    }    

    function addError(target, message) {
        formErrors.push({ field: target.previousElementSibling.getAttribute('for'), message: message });
    }

});
