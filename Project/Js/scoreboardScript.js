(function () {
    'use strict';

    let showData = function (cells, data) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = data[i];
        }
    };

    window.addEventListener('load', function () {
        showData(document.querySelectorAll('#smallHighscore>td'), JSON.parse(localStorage.getItem('smallHighscore')));
        showData(document.querySelectorAll('#mediumHighscore>td'), JSON.parse(localStorage.getItem('mediumHighscore')));
        showData(document.querySelectorAll('#largeHighscore>td'), JSON.parse(localStorage.getItem('highHighscore')));

        let currentData = JSON.parse(localStorage.getItem('currentScore'));

        if (currentData[3] === 'small') {
            showData(document.querySelectorAll('#smallCurrentScore>td'), currentData);
        } else if (currentData[3] === 'medium') {
            showData(document.querySelectorAll('#mediumCurrentScore>td'), currentData);
        } else {
            showData(document.querySelectorAll('#largeCurrentScore>td'), currentData);
        }
    });
})();