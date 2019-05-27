(function () {
    'use strict';

    let showData = function (cells, data) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = data[i];
        }
    };

    window.addEventListener('load', function () {
        let array = ['small', 'medium', 'high'];

        for (let type of array) {
            let highscoreData = JSON.parse(localStorage.getItem(type + 'Highscore'));
            if (highscoreData !== null) {
                showData(document.querySelectorAll('#' + type + 'Highscore>td'), highscoreData);
            }
        }

        let currentData = JSON.parse(localStorage.getItem('currentScore'));

        showData(document.querySelectorAll('#'+ currentData[3] +'CurrentScore>td'), currentData);
    });
})();