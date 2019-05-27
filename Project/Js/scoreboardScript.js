(function () {
    'use strict';

    let showData = function(cells, data){
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = data[i];
        }
    };

    window.addEventListener('load', function () {
        let smallFieldTable = document.getElementById('smallField');
        let mediumFieldTable = document.getElementById('mediumField');
        let largeFieldTable = document.getElementById('largeField');

        showData(smallFieldTable.querySelectorAll('td'), localStorage.getItem('smallHighScore'));
        showData(mediumFieldTable.querySelectorAll('td'), localStorage.getItem('mediumHighScore'));
        showData(largeFieldTable.querySelectorAll('td'), localStorage.getItem('highHighScore'));
    });
})();