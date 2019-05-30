(function () {
    'use strict';

    /**
     * Function responsible for adding text to the scoreboard
     * @param {Element} cells td Elements that need to be filled
     * @param {Array} data highscore information
     */
    let showData = function (cells, data) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = data[i];
        }
    };

    /**
     * When the page loads, get the highscore information from storage.
     */
    window.addEventListener('load', function () {
        //Get all highscores from localStorage
        let array = ['small', 'medium', 'large'];

        for (let type of array) {
            let highscoreData = JSON.parse(localStorage.getItem(type));
            if (highscoreData !== null) {
                showData(document.querySelectorAll('#' + type + 'Highscore>td'), highscoreData);
            }
        }

        //Get currentscore from sessionStorage
        let currentData = JSON.parse(sessionStorage.getItem('currentScore'));
        if (currentData !== null) {
            showData(document.querySelectorAll('#' + currentData[3] + 'CurrentScore>td'), currentData);
        }
    });
})();