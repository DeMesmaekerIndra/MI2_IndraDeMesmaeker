(function () {
    'use strict';
    let minefieldData;

    class cell {
        constructor(yPos, xPos, tdElement) {
            this.cssClass = '';
            this.hasBomb = false;
            this.surroundingBombs = 0;

            this.yPos = yPos;
            this.xPos = xPos;
            this.correspondingElement = tdElement;
        }

        get isBomb() {
            return this.hasBomb;
        }

        get getSurroundingBombs() {
            return this.surroundingBombs;
        }

        incrementSurroundingBombs() {
            this.surroundingBombs++;
        }

        setAsBomb() {
            this.hasBomb = true;
        }
    }

    //////////////////////
    ///GLOBAL VARIABLES///
    //////////////////////
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
            cell.classList.add('clickedCell');
        } else {
            cell.classList.add('clickedCell');
            cell.innerHTML = '<span>' + minefieldData[cellId].bombAmount + '</span>';
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

    let addBombAmount = function (bombXpos, bombYPos) {

        for (let yPos = bombYPos - 1; yPos < bombYPos + 1; yPos++) {
            for (let xPos = bombXpos - 1; xPos < bombXpos + 1; xPos++) {
                let cell = minefieldData[yPos][xPos];
                if (!cell.hasBomb) {
                    cell.incrementSurroundingBombs;
                }
            }
        }
    };

    let populateWithBombs = function () {
        let cellAmount = minefieldData.length;
        let bombsPlaced = 0;

        //Determin outerbounds
        let max = Math.ceil(cellAmount * 0.4);
        let min = Math.floor(cellAmount * 0.2);

        //Calculate the bomb amount
        let totalBombAmount = Math.floor(Math.random() * (max - min)) + min;

        //Set the bombs to active
        while (bombsPlaced < totalBombAmount) {
            let yPos = Math.floor(Math.random() * rows);
            let xPos = Math.floor(Math.random() * columns);

            if (minefieldData[yPos][xPos].hasBomb === true) {
                continue;
            }

            minefieldData[yPos][xPos].hasBomb = true;
            bombsPlaced++;

            addBombAmount(cellIndex, cellAmount);
        }
    };

    let createField = function () {
        let tbody = document.getElementById('minefield');

        resetField();

        //Create new row & cell elements on the page.
        //Fill the jagged array with cell objects
        for (let i = 0; i < rows; i++) {
            let newRow = tbody.insertRow(i);
            let cells = [];

            for (let j = 0; j < columns; j++) {

                let newCell = newRow.insertCell(j);

                newCell.setAttribute('data-Ypos', i);
                newCell.setAttribute('data-Xpos', j);

                newCell.addEventListener('click', cellClicked);

                cells.push(new cell(i, j, newCell));
            }
            minefieldData.push(cells);
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

            rows = parseInt(inpRows.value);
            columns = parseInt(inpColumns.value);
            minefieldData = [];

            createField();
        });
    });
})();