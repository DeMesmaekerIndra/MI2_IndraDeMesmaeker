(function () {
    'use strict';

    /**
     * A method that allows us to check an attribute of an element.
     * Thumbnails that didn't pass the condition will be hidden by adding a CSS class 'thumb__hidden'
     * Thumbnails that did pass will have have the CSS class 'thumb__hidden' removed, and be shown.
     * @param {*} conditionalValue Value you want to check against
     * @param {string} attribute  The attribute name you want to get checked
     * @param {string} selectors A string that defines the selectors of the element you want to be checked
     */
    let applyFilters = function (conditionalValue, attribute, selectors) {
        let thumbs = document.querySelectorAll('.main__thumbs>figure'); //Collection of thumbnails. This is needed to hide the entire thumbnail     
        let wantedElements = document.querySelectorAll(selectors); //Collection where the lowest child element has to be checked for a certain condition
        
        for (let i = 0; i < wantedElements.length; i++) {
            if (!wantedElements[i].getAttribute(attribute).toLowerCase().includes(conditionalValue.toLowerCase())) {
                thumbs[i].classList.add('thumb__hidden');
            } else {
                thumbs[i].classList.remove('thumb__hidden'); 
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

    /**
     * A simple method that unselects all of the checkboxes 
     */
    let resetChk = function () {
       let checkboxFilters = document.querySelectorAll('.filters__years>label>input');
        for (const chk of checkboxFilters) {
            chk.checked = false;
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
                //Do stuff with the login information                
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

            //change large image to selected small image, change alt & description
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
        let btnReset = document.getElementById('btnReset');
        let inpSearch = document.getElementById('inpSearch');

        //Filter based on dropdown menu
        dropDownFilter.addEventListener('input', function () {

            if (dropDownFilter.value == -1) {
                resetFilters();
                return;
            }

            //Reset all other filters
            resetChk();
            inpSearch.value = '';

            applyFilters(dropDownFilter.value, 'data-albumId', '.main__thumbs>figure');
        });

        //Filter based on checkboxes
        for (let chkBox of checkboxFilters) {
            chkBox.addEventListener('input', function () {
                //Show all thumbnails if no checkbox is selected                           
                if (!chkBox.checked) {
                    resetFilters();
                    return; //Stop executing the method
                }
                //Reset of all other filters
                dropDownFilter.value = -1; 
                inpSearch.value = '';

                applyFilters(chkBox.value, 'data-year', '.main__thumbs>figure');
            });
        }

        //Filter based on search field
        btnFilter.addEventListener('click', function () {
            //Show all thumbnails if the searchfield is empty
            if (inpSearch.value == '') {
                resetFilters();
                return; //Stop executing the method
            }

            //Reset of all other filters
            dropDownFilter.value = -1;
            resetChk();          

            applyFilters(inpSearch.value, 'alt', '.main__thumbs>figure img');
        });

        //Reset all filters, show thumbnails
        btnReset.addEventListener('click', function () {
            dropDownFilter.value = -1;
            inpSearch.value = '';
            resetChk();
            resetFilters();
        });
    });
})();