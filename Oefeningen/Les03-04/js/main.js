(function () {
    'use strict';

    const thumbs = document.querySelectorAll('.main__thumbs>figure'); //Collection of all the thumbnails

    /**
     * A function that allows us to check an attribute of an element.
     * Thumbnails that didn't pass the condition will be hidden by adding a CSS class 'thumb__hidden'
     * Thumbnails that did pass will have have the CSS class 'thumb__hidden' removed, and be shown.
     * @param {string} conditionalValue Value you want to check against
     * @param {string} attribute  The attribute name you want to get checked
     * @param {string} selectors A string that defines the selectors of the element you want to be checked
     */
    let applyFilters = function (conditionalValue, attribute, selectors) {        
        const wantedElements = document.querySelectorAll(selectors); //Collection where the lowest child element has to be checked for a certain condition

        for (let i = 0; i < wantedElements.length; i++) {
            if (!wantedElements[i].getAttribute(attribute).toLowerCase().includes(conditionalValue.toLowerCase())) {
                thumbs[i].classList.add('thumb__hidden');
            } else {
                thumbs[i].classList.remove('thumb__hidden');
            }
        }
    }

    /**
     * A function that removes the CSS class 'thumb__hidden' from all thumbnails, basicaly resetting every filter
     */
    let resetFilters = function () {      
        for (const thumb of thumbs) {
            thumb.classList.remove('thumb__hidden');
        }
    }

    /**
     * Function that checks the validity of an email address
     * @param {string} email 
     * @returns {boolean} Returns true or false wether or not the given mail has passed the test
     */
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * A function that will change the large image, desc, alt on the page with that of the selected thumbnail
     * @param {Element} thumb The thumbnail (figure) that has to replace the large image
     */
    let changeLargeImage = function (thumb) {
        const largeImg = document.querySelector('#large__figure>img')
        const LargeImgDesc = document.getElementsByClassName('large__title')[0];
        const activeThumb = document.getElementsByClassName('active')[0];
        const img = thumb.querySelector('img');
        const link = thumb.querySelector('a');

        activeThumb.classList.remove('active');
        thumb.classList.add('active');

        largeImg.src = link.href;
        LargeImgDesc.innerHTML = img.alt;
        largeImg.alt = img.alt;
    }

    /**
     * Function that unselects all of the checkboxes 
     */
    let resetChk = function () {
        const checkboxFilters = document.querySelectorAll('.filters__years>label>input');
        for (const chk of checkboxFilters) {
            chk.checked = false;
        }
    }

    /**
     * Function that find the first previous thumbnail that has not been hidden
     */
    let previousThumb = function () {
        let currentImg = document.getElementsByClassName('active')[0];

        do {
            currentImg = currentImg.previousElementSibling;
            //If currentImg doesn't contain an element, stop executing the function. There are no previous element siblings left
            if (currentImg == null) {
                return;
            }

        } while (currentImg.classList.contains('thumb__hidden'));

        changeLargeImage(currentImg);
    }

    /*interval is where setInterval is stored for the slideshow, It's not defined in the window load event function
    Because the function nextThumb() needs to acces it as well.*/
    let interval = null;

    /**
     * Function that finds the first next thumbnails that has not been hidden
     */
    let nextThumb = function () {
        let currentImg = document.getElementsByClassName('active')[0];

        do {
            currentImg = currentImg.nextElementSibling;
            //If currentImg doesn't contain an element, stop executing the function. There are no next element siblings left.
            if (currentImg == null) {
                clearInterval(interval);
                interval = null;
                return;
            }
        } while (currentImg.classList.contains('thumb__hidden'));
        changeLargeImage(currentImg);
    }

    window.addEventListener('load', function () {
        ///////////////
        //LOGIN FORM//
        //////////////

        //Form variables
        const loginfrm = document.getElementById('login__form');
        const loginmodal = document.getElementById('loginmodal');
        const inpEmail = document.getElementById('inpUname');
        const inpPassword = document.getElementById('inpPass');
        const errEmail = document.getElementById('errUname');
        const errPassword = document.getElementById('errPass');

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
            if (inpEmail.value === '') {
                errEmail.innerHTML = 'login kan niet leeg zijn';
                isValid &= false;
            } else if (!validateEmail(inpEmail.value)) {
                errEmail.innerHTML = 'ongeldige login';
                isValid &= false;
            } else {
                errEmail.innerHTML = '';
                isValid &= true;
            }

            //Check password field
            if (inpPassword.value === '') {
                errPassword.innerHTML = 'paswoord kan niet leeg zijn';
                isValid &= false;
            } else {
                errPassword.innerHTML = '';
                isValid &= true;
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

        //////////
        //IMAGES//
        //////////

        //Add eventlistener to every link from a thumbnail
        for (const thumb of thumbs) {
            thumb.querySelector('a').addEventListener('click', function (e) {
                e.preventDefault();
                clearInterval(interval);
                interval = null;

                changeLargeImage(thumb);
            });
        }

        ///////////
        //FILTERS//
        ///////////

        //Filter variables
        const dropDownFilter = document.getElementById('selAlbum');
        const checkboxFilters = document.querySelectorAll('.filters__years>label>input');
        const inpSearch = document.getElementById('inpSearch');

        //Filter based on dropdown menu
        dropDownFilter.addEventListener('input', function () {

            if (dropDownFilter.value === '-1') {
                resetFilters();
                return;
            }

            //Reset all other filters
            resetChk();
            inpSearch.value = '';

            applyFilters(dropDownFilter.value, 'data-albumId', '.main__thumbs>figure');
        });

        //Filter based on checkboxes
        for (const chkBox of checkboxFilters) {
            chkBox.addEventListener('input', function () {
                //Show all thumbnails if no checkbox is selected                           
                if (!chkBox.checked) {
                    resetFilters();
                    return; //Stop executing the method
                }
                //Reset of all other filters
                dropDownFilter.value = -1;
                inpSearch.value = '';
                resetChk();

                this.checked = true;
                applyFilters(chkBox.value, 'data-year', '.main__thumbs>figure');
            });
        }

        //Filter based on search field
        document.getElementById('btnSearch').addEventListener('click', function () {
            //Show all thumbnails if the searchfield is empty
            if (inpSearch.value === '') {
                resetFilters();
                return; //Stop executing the method
            }

            //Reset of all other filters
            dropDownFilter.value = -1;
            resetChk();

            applyFilters(inpSearch.value, 'alt', '.main__thumbs>figure img');
        });

        //Reset all filters, show thumbnails
        document.getElementById('btnReset').addEventListener('click', function () {
            dropDownFilter.value = -1;
            inpSearch.value = '';
            resetChk();
            resetFilters();
        });

        /////////////
        //NAVIGATIE//
        /////////////

        //Select the first image of the current set of shown images, and change the large image
        document.getElementById('lnkFirst').addEventListener('click', function (e) {
            e.preventDefault();

            changeLargeImage(document.querySelectorAll('.main__thumbs>figure:not(.thumb__hidden)')[0])
        });

        //Select the last image of the current set of shown images, and change the large image
        document.getElementById('lnkLast').addEventListener('click', function (e) {
            e.preventDefault();

            const shownThumbs = document.querySelectorAll('.main__thumbs>figure:not(.thumb__hidden)');
            changeLargeImage(shownThumbs[shownThumbs.length - 1]);
        });

        //Show the previous not hidden thumbnail
        document.getElementById('lnkPrev').addEventListener('click', function (e) {
            e.preventDefault();
            previousThumb();
        });

        //show the next thumbnail after clicking the next link
        document.getElementById('lnkNext').addEventListener('click', function (e) {
            e.preventDefault();
            nextThumb();
        });

        //Show the first, previous, next, last thumbnails when an arrowkey (with/without shift) has been pressed
        document.onkeydown = function (e) {
            const keyCode = e.keyCode;
            const shiftPressed = e.shiftKey;

            if (keyCode === 37 && !shiftPressed) {
                clearInterval(interval);
                interval = null;
                previousThumb();
            } else if (keyCode === 37 && shiftPressed) {
                clearInterval(interval);
                interval = null;
                changeLargeImage(document.querySelectorAll('.main__thumbs>figure:not(.thumb__hidden)')[0]);
            }

            if (keyCode === 39 && !shiftPressed) {
                clearInterval(interval);
                interval = null;
                nextThumb();
            } else if (keyCode === 39 && shiftPressed) {
                clearInterval(interval);
                interval = null;
                const shownThumbs = document.querySelectorAll('.main__thumbs>figure:not(.thumb__hidden)');
                changeLargeImage(shownThumbs[shownThumbs.length - 1]);
            }
        }

        document.getElementById('lnkPlay').addEventListener('click', function (e) {
            e.preventDefault();
            if (interval === null) {
                interval = setInterval(nextThumb, 1000);
            } else {
                clearInterval(interval);
                interval = null;
            }
        });
    });
})();