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
        let activeThumb;

        //Find every small thumbnail, split up the link & img
        //Add an eventlistener to every link
        for (let thumb of thumbs) {
            let link = thumb.querySelector('a');
            let img = thumb.querySelector('img');

            //The large image will be changed to the clicked small image, the alt & description will also be changed
            link.addEventListener('click', function (e) {
                e.preventDefault();

                if (activeThumb != null) {
                    activeThumb.classList.remove('active');
                }
                img.classList.add('active');
                activeThumb = img;

                largeImg.src = link.href;
                LargeImgDesc.innerHTML = img.alt;
                largeImg.alt = img.alt;
            });
        }

        //FILTERS

        //Filter variables
        let dropDownFilter = document.getElementById('selAlbum');
        let checkboxFilters = document.querySelectorAll('.filters__years>label>input');

        //Filteren op basis van de drop down menu
        dropDownFilter.addEventListener('input', function () {

            if (dropDownFilter.value != -1) {
                for (let thumb of thumbs) {

                    if (thumb.getAttribute('data-albumId') != dropDownFilter.value) {
                        thumb.classList.add('thumb__hidden'); //All of the thumbnails without a matching album-dataId will be hidden
                    } else {
                        thumb.classList.remove('thumb__hidden'); //All matching thumbnails will be set as visible, could be hidden because of previous filter 
                    }
                }
            } else {
                for (let thumb of thumbs) {
                    thumb.classList.remove('thumb__hidden'); //Show all of the thumbnails if no filter hs been chosen
                }
            }
        });

        //Geef eventlisteners aan iedere checkbox filter toe
        for (let chkBox of checkboxFilters) {
            chkBox.addEventListener('input', function () {
                //Toon alle thumbnails wanneer de checkbox niet geselecteerd is                           
                if (!chkBox.checked) {
                    for (let thumb of thumbs) {
                        thumb.classList.remove('thumb__hidden');
                    }
                    return; //Stoppen met het uitvoeren van de rest van de methode
                }

                dropDownFilter.value = -1; //Zet dropdown filter terug naar alle albums, we gaan niet per album per jaar filteren. De albums zijn al op jaar georderd.
                for (let thumb of thumbs) {

                    if (chkBox.value != thumb.getAttribute('data-year')) {
                        thumb.classList.add('thumb__hidden');
                    } else {
                        thumb.classList.remove('thumb__hidden');
                    }
                }
            });
        }
    });
})();