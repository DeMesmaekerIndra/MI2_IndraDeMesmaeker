(function () {
    'use strict';
    let minefieldData;

    //////////////
    ///CLASSES///
    /////////////
    class cell {
        constructor(td, y, x) {
            this.correspondingTdElement = td;
            this.y = y;
            this.x = x;

            this.bomb = false;
            this.surroundingBombs = 0;
        }

        get getBomb() {
            return this.bomb;
        }

        get xPos() {
            return this.x;
        }

        get yPos() {
            return this.y;
        }

        get getCorrespondingTd() {
            return this.correspondingTdElement;
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

    ///Interaction with UI///
    let updateCells = function name(cellDataCollection) {

        for (let cellData of cellDataCollection) {
            let cell = cellData.getCorrespondingTd;

            if (cell.classList.contains('clickedBomb')) {
                continue;
            }

            if (cellData.getBomb) {
                cell.classList.add('bomb');
            } else if (cellData.getSurroundingBombs > 0) {
                cell.classList.add('clickedCell', 'surroundingBomb__' + cellData.getSurroundingBombs);
            } else {
                cell.classList.add('clickedCell');
            }
        }
    };

    let showContourCells = function (startCell) {
        let contourCellCollection = [];
        let currentCellIndex = 0;
        let XposMaxium = minefieldData[0].length - 1;
        let yPosMaximum = minefieldData.length - 1;

        contourCellCollection.push(startCell);

        do {
            let currentCell = contourCellCollection[currentCellIndex];

            for (let i = currentCell.yPos - 1; i <= currentCell.yPos + 1; i++) {
                if (i > yPosMaximum || i < 0) {
                    continue;
                }

                for (let j = currentCell.xPos - 1; j <= currentCell.xPos + 1; j++) {
                    if ((j > XposMaxium || j < 0)) {
                        continue;
                    }

                    if (minefieldData[i][j].getBomb || contourCellCollection.includes(minefieldData[i][j])) {
                        continue;
                    }

                    if (minefieldData[i][j].getCorrespondingTd.classList.contains('clickedCell')) {
                        continue;
                    }

                    contourCellCollection.push(minefieldData[i][j]);
                }
            }
            currentCellIndex++;
        } while (currentCellIndex < contourCellCollection.length);

        updateCells(contourCellCollection);
    };

    let cellClicked = function (yPos, xPos) {
        let cellData = minefieldData[yPos][xPos];

        if (cellData.getBomb) {
            cellData.correspondingTdElement.classList.add('clickedBomb');

            for (let row of minefieldData) {
                updateCells(row);
            }

        } else if (!cellData.getCorrespondingTd.classList.contains('clickedCell')) {
            showContourCells(cellData);
        }
    };

    ///Creation & deletion of the field///
    let addBombAmount = function (bombYPos, bombXpos) {
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
        let cellAmount = rows * columns;
        let bombsPlaced = 0;

        //Determine outerbounds
        let max = Math.ceil(cellAmount * 0.55);
        let min = Math.ceil(cellAmount * 0.4);
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

            addBombAmount(yPos, xPos);
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
                let newCell = newRow.insertCell(j);

                cells.push(new cell(newCell, i, j));
            }

            minefieldData.push(cells);
        }

        populateWithBombs(rows, columns);
        document.querySelector('table').classList.remove('hidden', 'collapsed');
    };

    ///Form checking//
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
                cellClicked(e.path[1].rowIndex, e.path[0].cellIndex);
            }
        });
    });
})();