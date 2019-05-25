(function () {
    'use strict';
    let minefieldData = [];

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

    //////////////////////////
    ///Interaction with UI///

    /**
     * Function that receives a collection of cells 
     * and determines what class should be added to them
     * @param {Array} cellDataCollection Arrays of cells to be updated
     */
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

    /**
     * Function that receives the clicked cell and finds surrounding non-bomb cells.
     * @param {cell} startCell 
     */
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

                    let cellData = minefieldData[i][j];

                    if (cellData.getBomb || contourCellCollection.includes(cellData)) {
                        continue;
                    }

                    if (cellData.getCorrespondingTd.classList.contains('clickedCell')) {
                        continue;
                    }

                    contourCellCollection.push(cellData);
                }
            }

            currentCellIndex++;
        } while (currentCellIndex < contourCellCollection.length);

        updateCells(contourCellCollection);
    };

    /**
     * function responsible that contains the logic of what should happen if a cell is clicked
     * @param {number} yPos row position of the clicked cell
     * @param {number} xPos column position of the clicked cell
     */
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

    ///////////////////////////////////////
    ///Creation & deletion of the field///

    /**
     * Function receives the position of a recently placed bomb
     * All 8 surrounding cells need to have their surroundingbomb count incremented
     * @param {number} bombYPos Row position of the bomb
     * @param {number} bombXpos Column position of the bomb
     */
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

    /**
     *  Function responsible for activating the bombs in the minefieldData array
     * @param {number} rows Amount of eows 
     * @param {number} columns Amount of columns
     */
    let populateWithBombs = function (rows, columns) {
        let cellAmount = rows * columns;
        let bombsPlaced = 0;
        let totalBombAmount = 0;

        //16-17% of all cells are bombs in the original minesweeper. The same ratio is going to be kept for this version
        totalBombAmount = Math.ceil(cellAmount * 0.17);

        console.log(totalBombAmount);
        
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

    /**
     * Resets the minefieldData array
     * clears & hides the table
     */
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

    /**
     * Function responsible for creating td elements & cell objects
     * Pushes the cell objects into a multidimensional array minefieldData
     * @param {number} rows Amount of rows
     * @param {number} columns Amount of columns
     */
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

    ///////////////////
    ///Form checking///

    /**
     * Checks form inputs for errors
     * @param {number} input Input value of input element
     * @param {Element} errorElem Span element used for showing error
     */
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
        let minefield = document.getElementById('minefield');

        /**
         * Activates when user submits form, validates input, setup playingfield
         */
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

        /** 
         * Activates if the tbody has been clicked, Acts accordingly if a td element was clicked
         */
        minefield.addEventListener('click', function (e) {
            if (e.path[0].tagName === 'TD') {
                cellClicked(e.path[1].rowIndex, e.path[0].cellIndex);
            }
        });

        /**
         * Activates when user tries to open contextmenu (rightclick) in minefield
         * Stops context menu from actually showing up
         */
        minefield.addEventListener('contextmenu', function (e) {
            if (e.path[0].tagName === 'TD') {
                e.returnValue = false;
                e.path[0].classList.add('flag');
            }
        });
    });
})();