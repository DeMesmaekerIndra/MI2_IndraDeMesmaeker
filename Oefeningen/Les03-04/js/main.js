(function () {
    'use strict';

    window.addEventListener('load', function () {
        //Setting up the log in form
        let loginfrm = document.getElementById('login__form');
        let loginmodal = document.getElementById('loginmodal');
        loginfrm.setAttribute('novalidate', 'novalidate');

        //Eventhandler for login button
        document.getElementById('btnLogin').addEventListener('click', function () {
            loginmodal.classList.remove('loginmodal__hidden');
            loginmodal.classList.add('loginmodal__shown');
        });

        //Eventhandler for the cancel button on the form
        document.getElementById('btnCancel').addEventListener('click', function () {
            loginmodal.classList.remove('loginmodal__shown');
            loginmodal.classList.add('loginmodal__hidden');
        })

        //Log in form checking
        loginfrm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let inpEmail = document.getElementById('inpUname');
            let inpPassword = document.getElementById('inpPass');
            let errEmail = document.getElementById('errUname');
            let errPassword = document.getElementById('errPass');
            let isValid = true;

            //Check username field
            if (inpEmail.value == '') {
                errEmail.innerHTML = 'login kan niet leeg zijn';
                isValid = false;
            } else if (!inpEmail.value.includes('@')) {
                errEmail.innerHTML = 'ongeldige login';
                isValid = false;
            } else {
                errEmail.innerHTML = '';
                isValid = true;
            }

            //Check password field
            if (inpPassword.value == null || inpPassword.value == '') {
                errPassword.innerHTML = 'paswoord kan niet leeg zijn'
                isValid = false;
            } else {
                errPassword.innerHTML = '';
                isValid = true;
            }

            //Final decision
            if (isValid) {
                loginmodal.classList.remove('loginmodal__shown');
                loginmodal.classList.add('loginmodal__hidden');
            }
        });
    });
})();