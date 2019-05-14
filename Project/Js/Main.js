(function () {
    'use strict';
    //////////////////////
    ///GLOBAL VARIABLES///
    //////////////////////    
    let minefieldData = [];
    let rows, columns = 0;

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
        } else if (minefieldData[cellId].bombAmount === 0) {
            cell.classList.add('emptycell');
        } else {
            cell.innerHTML = '<span>' + minefieldData[cellId].bombAmount + '</span>';
        }
    };

    let removeField = function () {
        let tbody = document.getElementById('minefield');

        while (tbody.childNodes.length > 0) {
            tbody.childNodes[0].remove();
        }

        document.querySelector('table').classList.add('hidden', 'collapsed');
    };

    let addBombAmount = function (index, offset) {
        let finalIndex = index + Math.abs(offset);

        if (finalIndex < minefieldData.length) {
            minefieldData[finalIndex].bombAmount++;
        }

        finalIndex = index + (Math.abs(offset) * -1);

        if (finalIndex >= 0) {
            minefieldData[finalIndex].bombAmount++;
        }
    };

    let populateWithBombs = function () {
        let cellAmount = minefieldData.length;
        let max = Math.ceil(cellAmount * 0.4);
        let min = Math.floor(cellAmount * 0.2);
        let totalBombAmount = Math.floor(Math.random() * (max - min)) + min;
        let bombsPlaced = 0;
        console.log(totalBombAmount + '/' + cellAmount);
        
        while (bombsPlaced < totalBombAmount) {
            let index = Math.floor(Math.random() * cellAmount);
            if (minefieldData[index].hasBomb === false) {
                minefieldData[index].hasBomb = true;
                bombsPlaced++;

                addBombAmount(index, 1);
                addBombAmount(index, columns);
            }
        }
    };

    let createField = function () {
        let minefield = document.getElementById('minefield');
        let id = 0;

        removeField();

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

        populateWithBombs(rows);

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

            rows = parseInt(inpRows.value);
            columns = parseInt(inpColumns.value);

            createField();
        });
    });
})();