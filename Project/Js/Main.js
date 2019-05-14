(function () {
    'use strict';
    //////////////////////
    ///GLOBAL VARIABLES///
    //////////////////////
    let minefieldData = null;

    ///////////////
    ///FUNCTIONS///
    ///////////////

    let checkInput = function (input, errorElem) {
        if (input.value.length === 0) {
            errorElem.innerText = 'Please input a value';
            errorElem.classList.remove('hidden', 'collapsed');
            return false;
        } else if (input.value.length < 3 && input.name === 'inpName') {
            errorElem.innerText = 'Please use a username of atleast 3 characters';
            errorElem.classList.remove('hidden', 'collapsed');
            return false;
        }

        return true;
    };

    let cellClicked = function (e) {
        let cell = e.path[0];
        let cellId = parseInt(cell.getAttribute('data-id'));        

        if (minefieldData[cellId].hasBomb) {
            cell.classList.add('bomb');
            alert('Boom!');
        }
    };

    let removeField = function () {
        let tbody = document.getElementById('minefield');

        while (tbody.childNodes.length > 0) {
            tbody.childNodes[0].remove();
        }

        document.querySelector('table').classList.add('hidden', 'collapsed');
    };

    let populateWithBombs = function () {
        let cellAmount = minefieldData.length;
        let bombAmount = 0;

        if (cellAmount <= 16) {
            bombAmount = 4;
        } else if (cellAmount <= 25) {
            bombAmount = 6;
        } else if (cellAmount <= 36) {
            bombAmount = 9;
        } else if (cellAmount <= 49) {
            bombAmount = 13;
        } else if (cellAmount <= 64) {
            bombAmount = 18;
        } else if (cellAmount <= 81) {
            bombAmount = 24;
        } else {
            bombAmount = 32;
        }

        let bombsPlaced = 0;
        while (bombsPlaced < bombAmount) {
            let index = Math.floor(Math.random() * cellAmount);
            if (minefieldData[index].hasBomb === false) {
                minefieldData[index].hasBomb = true;
                bombsPlaced++;
            }
        }
    };

    let createField = function (rows, columns) {
        let minefield = document.getElementById('minefield');
        removeField();

        minefieldData = [];
        let id = 0;

        for (let i = 0; i < rows; i++) {
            let newRow = minefield.insertRow(i);

            for (let j = 0; j < columns; j++) {

                let newCell = newRow.insertCell(j);

                minefieldData[id] = {
                    hasBomb: false,
                    bombAmount: 0
                };
                newCell.setAttribute('data-id', id++);
                newCell.addEventListener('click', cellClicked);
            }
        }

        populateWithBombs();

        document.querySelector('table').classList.remove('hidden', 'collapsed');
    };

    /////////////////////
    ///EVENT LISTENERS///
    /////////////////////
    window.addEventListener('load', function () {
        let form = document.querySelector('form');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let inpName = document.getElementById('inpName');
            let inpRows = document.getElementById('inpRowSize');
            let inpColumns = document.getElementById('inpColumnSize');

            let errName = document.getElementById('errName');
            let errRows = document.getElementById('errRows');
            let errColumns = document.getElementById('errColumns');

            let isCorrect = true;

            errName.classList.add('hidden', 'collapsed');
            errRows.classList.add('hidden', 'collapsed');
            errColumns.classList.add('hidden', 'collapsed');

            isCorrect &= checkInput(inpName, errName);
            isCorrect &= checkInput(inpRows, errRows);
            isCorrect &= checkInput(inpColumns, errColumns);

            if (!isCorrect) {
                return;
            }

            createField(parseInt(inpRows.value), parseInt(inpColumns.value));
        });
    });
})();