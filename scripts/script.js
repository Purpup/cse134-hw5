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
            console.error(JSON.stringify(formErrors.slice(-1)));
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

        // rating widget stuff
        let ratingWidget = document.querySelector('rating-widget');
        let ratingForm = ratingWidget.querySelector('form');
        let ratingLabel = ratingForm.querySelector('label');
        let ratingNumber = ratingForm.querySelector('#rating');
        ratingLabel.textContent = 'Rating Widget';
        ratingNumber.style.display = 'none';
        ratingForm.querySelector('button').style.display = 'none';

        let minStars = Math.max(3, parseInt(ratingNumber.min));
        let maxStars = Math.min(10, parseInt(ratingNumber.max));
        let realMax = Math.max(minStars, maxStars);
        // console.log(minStars, maxStars);
        function generateStars() {
            let stars = document.getElementById('stars');
            stars.innerHTML = '';

            for(let i = 1; i <= realMax; i++) {
                let star = document.createElement('span');
                star.textContent = '\u2605';
                star.className = 'star';
                star.id = `star_${i}`;
                star.setAttribute('data-rating', i);
                star.addEventListener('mouseover', highlightStars);
                star.addEventListener('mouseleave', removeHighlight);
                star.addEventListener('click', submitRating);
                stars.appendChild(star);
            }
        }
        function highlightStars(event) {
            let hoveredStar = event.target;
            let selectedRating = hoveredStar.getAttribute('data-rating');
            let stars = document.querySelectorAll('#stars span');
            let starId = parseInt(hoveredStar.id.split('_')[1], 10);
            // console.log(stars);
            stars.forEach((s, i) => {
                s.classList.toggle('highlight', i < selectedRating);
                // console.log(s);
            });
            document.getElementById('rating').value = starId;
        }
        function removeHighlight() {
            let stars = document.querySelectorAll('#stars span');
            stars.forEach((s, i) => {
                s.classList.remove('highlight');
            });
            // document.getElementById('rating').value = '';
        }
        function submitRating(event) {
            let clickedStar = event.target;
            let starId = parseInt(clickedStar.id.split('_')[1], 10);
            let ratingInput = document.getElementById('rating');
            ratingInput.value = starId;

            let headers = new Headers();
            headers.append('X-Sent-By', 'JS');
            let formData = new FormData(ratingForm);
            formData.set('setBy', 'JS');

            fetch(ratingForm.action, {
                method: 'POST',
                body: formData,
                headers: headers,
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('stars').innerHTML = '';
                let response = document.createElement('p');
                if(starId / realMax >= .8) {
                    response.textContent = `Thank you for the ${starId} star rating!`;
                }
                else {
                    response.textContent = `Thank you for your feedback of ${starId} stars. We'll try to do better!`;
                }
                document.getElementById('response').appendChild(response);
            })
            .catch(error => {
                console.error('Error:', error);
            });

            // document.getElementById('stars').innerHTML = '';
            // let response = document.createElement('p');
            // if(starId / realMax >= .8) {
            //     response.textContent = `Thank you for the ${starId} star rating!`;
            // }
            // else {
            //     response.textContent = `Thank you for your feedback of ${starId} stars. We'll try to do better!`;
            // }
            // document.getElementById('response').appendChild(response);
        }
        generateStars();

        // weather widget stuff
        const weatherWidget = document.querySelector('weather-widget');
        // const latitude = '32.881130';
        // const longitude = '-117.237572';
        // const apiUrl = `https://api.weather.gov/points/${latitude},${longitude}`
        // fetch(apiUrl)
        // .then(response => response.json())
        // .then(data => {
        //     let forecastApi = data.properties.forecastHourly;
        //     // console.log(forecastApi);
        //     fetch(forecastApi)
        //     .then(res => res.json())
        //     .then(d => {
        //         let weatherData = d.properties.periods[0];
        //         console.log(weatherData);
        //         console.log(weatherData.temperature);
        //         const htmlContent = `
        //             <p id = "title">Current Weather</p>
        //             <p class = "caption">${weatherData.shortForecast} ${weatherData.temperature}</p>
        //             `;
        //         weatherWidget.innerHTML = htmlContent;
        //     })
        // })
        // .catch(error => {
        //     console.error('Error fetching weather data:', error);
        //     weatherWidget.innerHTML = 'Current Weather Conditions Unavailable';
        // });

        async function fetchAPI() {
            const latitude = '32.881130';
            const longitude = '-117.237572';
            const apiURL = `https://api.weather.gov/points/${latitude},${longitude}`;
            await fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                let forecastAPI = data.properties.forecastHourly;
                fetchWeather(forecastAPI);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherWidget.innerHTML = 'Current Weather Conditions Unavailable';
            })
        }
        async function fetchWeather(URL) {
            await fetch(URL)
            .then(response => response.json())
            .then(data => {
                let weatherData = data.properties.periods[0];
                let iconURL = weatherData.icon.replace(",0", "");
                const htmlContent = `
                    <p id = "title">Current Weather</p>
                    <p class = "caption"><img id = "weather_icon" src = ${iconURL}> ${weatherData.shortForecast} ${weatherData.temperature}\u00B0${weatherData.temperatureUnit}</p>
                `;
                weatherWidget.innerHTML = htmlContent;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherWidget.innerHTML = 'Current Weather Conditions Unavailable';
            })
        }
        fetchAPI();
    }
