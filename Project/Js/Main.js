(function () {
    'use strict';
    let minefieldData;

    //////////////
    ///CLASSES///
    /////////////
    class cell {
        constructor() {
            this.bomb = false;
            this.surroundingBombs = 0;
        }

        get getBomb() {
            return this.bomb;
        }

        /**
         * @param {boolean} value
         */
        set setBomb(value) {
            this.bomb = value;
        }

        get getSurroundingBombs() {
            return this.surroundingBombs;
        }

        incrementSurroundingBombs() {
            this.surroundingBombs++;
        }
    }

    ///////////////
    ///FUNCTIONS///
    ///////////////
    let cellClicked = function (cell, yPos, xPos) {
        let cellData = minefieldData[yPos][xPos];

        if (cellData.getBomb) {
            cell.classList.add('bomb');
        } else if (cellData.getSurroundingBombs === 0) {
            cell.classList.add('clickedCell');
        } else {
            cell.classList.add('clickedCell');
            cell.innerHTML = '<span>' + cellData.getSurroundingBombs + '</span>';
        }
    };

    let addBombAmount = function (bombXpos, bombYPos) {
        let XposMaxium = minefieldData[0].length - 1;
        let yPosMaximum = minefieldData.length - 1;

        for (let yPos = bombYPos - 1; yPos <= bombYPos + 1; yPos++) {
            if (yPos > yPosMaximum || yPos < 0) {
                continue;
            }

            for (let xPos = bombXpos - 1; xPos <= bombXpos + 1; xPos++) {
                if ((xPos > XposMaxium || xPos < 0)) {
                    continue;
                }

                let cell = minefieldData[yPos][xPos];
                if (!cell.getBomb) {
                    cell.incrementSurroundingBombs();
                }
            }
        }
    };

    let populateWithBombs = function (rows, columns) {
        let cellAmount =  rows * columns;
        let bombsPlaced = 0;

        //Determine outerbounds
        let max = Math.ceil(cellAmount * 0.4);
        let min = Math.floor(cellAmount * 0.2);
        let totalBombAmount = Math.floor(Math.random() * (max - min)) + min;

        //Set the bombs to active
        while (bombsPlaced < totalBombAmount) {
            let yPos = Math.floor(Math.random() * rows);
            let xPos = Math.floor(Math.random() * columns);
            let cellData = minefieldData[yPos][xPos];

            if (cellData.getBomb === true) {
                continue;
            }

            cellData.setBomb = true;
            bombsPlaced++;

            addBombAmount(xPos, yPos);
        }
    };

    let resetField = function () {
        //Clear the array
        if (minefieldData !== undefined) {
            minefieldData.length = 0;
        }

        //Reset the actual playingfield
        let tbody = document.getElementById('minefield');

        while (tbody.childNodes.length > 0) {
            tbody.childNodes[0].remove();
        }

        document.querySelector('table').classList.add('hidden', 'collapsed');
    };

    let createField = function (rows, columns) {
        let tbody = document.getElementById('minefield');

        resetField();

        //Create new row & cell elements on the page.
        //Fill the jagged array with cell objects
        for (let i = 0; i < rows; i++) {
            let newRow = tbody.insertRow(i);
            let cells = [];

            for (let j = 0; j < columns; j++) {

                newRow.insertCell(j);
                cells.push(new cell());
            }

            minefieldData.push(cells);
        }

        populateWithBombs(rows, columns);
        document.querySelector('table').classList.remove('hidden', 'collapsed');
    };

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

            minefieldData = [];
            createField(parseInt(inpRows.value), parseInt(inpColumns.value));
        });

        document.getElementById('minefield').addEventListener('click', function (e) {
            if (e.path[0].tagName === 'TD') {
                cellClicked(e.path[0], e.path[0].cellIndex, e.path[1].rowIndex);
            }
        });
    });
})();