(function () {
    'use strict';

    window.addEventListener('load', function () {
        //LOGIN FORM

        //Form variables
        let loginfrm = document.getElementById('login__form');
        let loginmodal = document.getElementById('loginmodal');
        let inpEmail = document.getElementById('inpUname');               
        let inpPassword = document.getElementById('inpPass');
        let errEmail = document.getElementById('errUname');        
        let errPassword = document.getElementById('errPass'); 

        //Disable standard html form checking
        loginfrm.setAttribute('novalidate', 'novalidate');

        //Eventhandler for login button, show the loginmodal
        document.getElementById('btnLogin').addEventListener('click', function () {
            loginmodal.classList.remove('loginmodal__hidden');
            loginmodal.classList.add('loginmodal__shown');
        });

        //Eventhandler for the cancel button on the form. Hide the loginmodal, clear all errors and input field
        document.getElementById('btnCancel').addEventListener('click', function () {
            loginmodal.classList.remove('loginmodal__shown');
            loginmodal.classList.add('loginmodal__hidden');
            errEmail.innerHTML = '';
            errPassword.innerHTML = '';
            inpEmail.value = '';
            inpPassword.value = '';
        });

        //login form input checking
        loginfrm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let isValid = true;

            //Check username field
            if (inpEmail.value == '') {
                errEmail.innerHTML = 'login kan niet leeg zijn';
                isValid = isValid && false;
            } else if (!inpEmail.value.includes('@')) {
                errEmail.innerHTML = 'ongeldige login';
                isValid = isValid && false;
            } else {
                errEmail.innerHTML = '';
                isValid = isValid && true;
            }

            //Check password field
            if (inpPassword.value == '') {
                errPassword.innerHTML = 'paswoord kan niet leeg zijn';
                isValid = isValid && false;
            } else {
                errPassword.innerHTML = '';
                isValid = isValid && true;
            }
            
            //Final decision
            if (isValid) {
                loginmodal.classList.remove('loginmodal__shown');
                loginmodal.classList.add('loginmodal__hidden');
                //Do stuff with the login informationg                
                inpEmail.value = '';
                inpPassword.value = '';
            }
        });

        //IMAGES

        //Image variables
        let largeImg = document.querySelector('#large__figure>img');
        let LargeImgDesc = document.querySelector('.large__title');
        let thumbs = document.querySelectorAll('.main__thumbs>figure');

        //Find every small thumbnail, split up the link & img
        //Add an eventlistener to every link
        for (let i = 0; i < thumbs.length; i++) {
            let thumb = thumbs[i];
            let link = thumb.querySelector('a');
            let img = thumb.querySelector('img');

            //The large image will be changed to the clicked small image, the alt & description will also be changed
            link.addEventListener('click', function(e){
                e.preventDefault();

                largeImg.src = link.href;
                LargeImgDesc.innerHTML = img.alt;
                largeImg.alt = img.alt;
            });
        }
    });
})();