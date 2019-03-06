(function () {
    'use strict';

    /**
     * A method that allows us to check an attribute of an element.
     * Thumbnails that didn't pass the condition will be hidden by adding a CSS class 'thumb__hidden'
     * Thumbnails that did pass will have have the CSS class 'thumb__hidden' removed, and be shown.
     * @param {*} conditionalValue Value you want to check against
     * @param {string} attribute  The attribute name you want to get checked
     * @param {string} selectors A string that defines the selectors of the items you want in collection that has to be checked
     */
    let applyFilters = function (conditionalValue, attribute, selectors) {
        let thumbs = document.querySelectorAll('.main__thumbs>figure'); //Collection of thumbnails. This is needed to hide the entire thumbnail     
        let wantedElements = document.querySelectorAll(selectors); //Collection where the lowest child element has to be checked for a certain condition

        for (let i=0; i< wantedElements.length; i++) {
            if (!wantedElements[i].getAttribute(attribute).toLowerCase().includes(conditionalValue.toLowerCase())) {
                thumbs[i].classList.add('thumb__hidden'); //All of the thumbnails without a matching album-dataId will be hidden
            } else {
                thumbs[i].classList.remove('thumb__hidden'); //All matching thumbnails will be set as visible, could be hidden because of previous filter 
            }
        }
    }

    /**
     * A method that removes the CSS class 'thumb__hidden' from all thumbnails, basically resetting every filter
     */
    let resetFilters = function () {
        let thumbs = document.querySelectorAll('.main__thumbs>figure');
        for (const thumb of thumbs) {
            thumb.classList.remove('thumb__hidden');
        }
    }

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
        let btnFilter = document.getElementById('btnSearch');
        let inpSearch = document.getElementById('inpSearch');

        //Filteren op basis van de drop down menu
        dropDownFilter.addEventListener('input', function () {

            if (dropDownFilter.value != -1) {
                applyFilters(dropDownFilter.value, 'data-albumId', '.main__thumbs>figure');

            } else {
                resetFilters(); //Show all of the thumbnails if no filter hs been chosen        
            }
        });

        //Filtereren op basis van checkboxen
        for (let chkBox of checkboxFilters) {
            chkBox.addEventListener('input', function () {
                //Toon alle thumbnails wanneer de checkbox niet geselecteerd is                           
                if (!chkBox.checked) {
                    resetFilters();
                    return; //Stoppen met het uitvoeren van de rest van de methode
                }

                dropDownFilter.value = -1; //Zet dropdown filter terug naar alle albums, we gaan niet per album per jaar filteren. De albums zijn al op jaar georderd.
                applyFilters(chkBox.value, 'data-year', '.main__thumbs>figure');
            });
        }

        btnFilter.addEventListener('click', function () {
            if (inpSearch.value == '') {
                resetFilters();
                return;
            }
            for (const chk of checkboxFilters) {
                chk.checked = false;
            }
            dropDownFilter.value = -1;

            applyFilters(inpSearch.value, 'alt', '.main__thumbs>figure img');
        });
    });
})();