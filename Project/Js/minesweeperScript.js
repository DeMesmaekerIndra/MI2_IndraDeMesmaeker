(function () {
    'use strict';
    let minefieldData = [];
    let timer = null,
        internalTime = null;
    let remainingSafeCells = 0,
        flagsPlaced = 0,
        totalBombAmount = 0;

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

    ///////////////////////////
    ///Winning & highscores///

    let storeData = function (highScoreData, highscoreSize) {
        let data = JSON.parse(localStorage.getItem(highscoreSize));

        if (data != undefined || data != null) {
            if (data[1] >= highScoreData[1]) {
                localStorage.setItem(highscoreSize, JSON.stringify(highScoreData));
            }
            
        } else {
            localStorage.setItem(highscoreSize, JSON.stringify(highScoreData));
        }
    };

    let checkForWin = function () {
        if (!((remainingSafeCells === 0) && (flagsPlaced === totalBombAmount))) {
            return;
        }

        clearInterval(timer);
        document.querySelector('body').classList.add('fireWorks');

        let highScoreData = [
            document.getElementById('inpName').value,
            internalTime.toLocaleTimeString(),
            new Date().toUTCString()
        ];

        let cellAmount = minefieldData.length * minefieldData[0].length;

        if (cellAmount < 65) {
            storeData(highScoreData, 'smallHighscore');
            highScoreData.push('small');
        } else if (cellAmount < 257) {
            storeData(highScoreData, 'mediumHighscore');
            highScoreData.push('medium');
        } else {
            storeData(highScoreData, 'highHighscore');
            highScoreData.push('large');
        }

        localStorage.setItem('currentScore', JSON.stringify(highScoreData));

        setTimeout(function () {
            window.open('scoreboard.html', '_blank');
        }, 2000);
    };

    //////////////////////////
    ///Interaction with UI///

    /**
     * Function that receives a collection of cells 
     * and determines what class should be added to them
     * @param {Array} cellDataCollection Arrays of cells to be updated
     */
    let updateCells = function (cellDataCollection) {
        for (let cellData of cellDataCollection) {
            let cell = cellData.getCorrespondingTd;

            //Don't overwrite the exploded bomb with a regular bomb
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
     * Function that receives the cellData of the cell clicked by the user
     * Based on a rule set it finds an array of cell(s) that should be updated in the UI
     * @param {cell} startCell 
     */
    let findContourCells = function (startCellData) {
        let contourCellCollection = [];
        let currentCellIndex = 0;
        let yPosMaximum = minefieldData.length - 1;
        let XposMaxium = minefieldData[0].length - 1;

        //Add the initial cell to the array & begin the loop
        contourCellCollection.push(startCellData);

        do {
            let currentCellData = contourCellCollection[currentCellIndex++];

            //If the current cell has bombs around it, then don't check this cell
            if (currentCellData.getSurroundingBombs > 0) {
                continue;
            }

            //Check 8 surrounding cells
            for (let i = currentCellData.yPos - 1; i <= currentCellData.yPos + 1; i++) {
                if (i > yPosMaximum || i < 0) {
                    continue;
                }

                for (let j = currentCellData.xPos - 1; j <= currentCellData.xPos + 1; j++) {
                    if ((j > XposMaxium || j < 0)) {
                        continue;
                    }

                    //Cache the cell that's being checked
                    let cellData = minefieldData[i][j];
                    let cell = cellData.getCorrespondingTd;

                    //If the cell has a bomb, is already in the array, then continue with the next cell
                    if (cellData.getBomb || contourCellCollection.includes(cellData)) {
                        continue;
                    }

                    //If the cell has been clicked before, has been flagged by the user, then continue with the next cell
                    if (cell.classList.contains('clickedCell') || cell.classList.contains('flag')) {
                        continue;
                    }

                    contourCellCollection.push(cellData);
                }
            }
        }
        while (currentCellIndex < contourCellCollection.length);

        //Check the winning conditions
        //Once all safe cells are shown, and all flags have been placed. The user wins
        remainingSafeCells -= contourCellCollection.length;
        checkForWin();

        updateCells(contourCellCollection);
    };

    /**
     * Increments the seconds on the internal time and displays the time
     */
    let incrementTimer = function () {
        internalTime.setSeconds(internalTime.getSeconds() + 1);

        document.getElementById('timerInfo').innerText = internalTime.toLocaleTimeString();
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
        //Determine the outerbounds of the field
        let yPosMaximum = minefieldData.length - 1;
        let XposMaxium = minefieldData[0].length - 1;

        //Increment the bombamount of all surrounding cells withing the outerbounds of the field
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

        //Like the original minesweeper +-17% of all cells are bombs
        totalBombAmount = Math.ceil(cellAmount * 0.17);
        totalBombAmount = 2;
        remainingSafeCells = cellAmount - totalBombAmount;

        document.getElementById('bombsInfo').innerText = totalBombAmount;
        document.getElementById('flagsInfo').innerText = totalBombAmount;

        //Set the bombs to active
        while (bombsPlaced < totalBombAmount) {

            //Determine a random cell to activate
            let yPos = Math.floor(Math.random() * rows);
            let xPos = Math.floor(Math.random() * columns);
            let cellData = minefieldData[yPos][xPos];

            //If the cell already has an active, find another
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
        //Clear all date from the previous game
        minefieldData.length = 0;
        flagsPlaced = 0;

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
         * Checks wether the form is hidden or shown.
         * Hidden: removes translate from form & stops.
         * shown: validate input, setup playing field & hide translate
         */
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (form.classList.contains('offScreen')) {
                form.classList.remove('offScreen');
                document.querySelector('body').classList.remove('fireWorks');
                document.getElementById('btnDone').value = 'Start playing!';
                return;
            }

            //if a previous timer is still active, clear it
            //NOTE: clearInterval doesn't generate errors when it receives nulls
            clearInterval(timer);

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

            //Initialise the internalTime
            //NOTE: The date isn't being used, only the time
            internalTime = new Date(0, 0, 0, 0, 0, 0, 0);
            timer = setInterval(incrementTimer, 1000);

            form.classList.add('offScreen');
            document.getElementById('btnDone').value = 'New game!';
        });

        /** 
         * Activates if the tbody has been clicked, Acts accordingly if a td element was clicked
         */
        minefield.addEventListener('click', function (e) {
            if (e.path[0].tagName !== 'TD') {
                return;
            }

            let cellData = minefieldData[e.path[1].rowIndex][e.path[0].cellIndex];
            let cell = cellData.getCorrespondingTd;

            //If the clicked cell has already been clicked before, cell contains a flag don't do anything
            //NOTE: Flag need too be removed before the cell can be activated
            if (cell.classList.contains('clickedCell') || cell.classList.contains('flag')) {
                return;
            }

            if (cellData.getBomb) {

                clearInterval(timer);

                //If a cell with a bomb was clicked, then add the corresponding CSS class
                cell.classList.add('clickedBomb');

                //Remove the questionMark class if the cell had been marked as one
                cell.classList.remove('questionMark');

                //UpdateCells can only receive a one dimensional array, therefor we need to iterate row per row
                //Because minefieldData is a jagged array
                for (let row of minefieldData) {
                    updateCells(row);
                }
            } else {

                //If a cell with/without surrounding bombs is clicked, let findContourCells determine which cells to show
                findContourCells(cellData);
            }
        });

        /**
         * Activates when user tries to open contextmenu (rightclick) in minefield
         * Places/removes flags & questionMarks
         */
        minefield.addEventListener('contextmenu', function (e) {
            //block context menu
            e.returnValue = false;

            let clickedElement = e.path[0];

            if (clickedElement.tagName !== 'TD') {
                return;
            }

            //Not allowed to place a flag on already activated cells, shown bombs or the exploded bomb
            //NOTE: this basically stops players from placing flags & questionmarks after the game has ended
            if (clickedElement.classList.contains('clickedCell') || clickedElement.classList.contains('bomb') || clickedElement.classList.contains('clickedBomb')) {
                return;
            }

            //Determine wether a flag or question mark should be place/removed
            //Every time a flag is placed the winning condition are checked
            let flagsInfo = document.getElementById('flagsInfo');

            if (clickedElement.classList.contains('questionMark')) {
                clickedElement.classList.remove('questionMark');

            } else if (!clickedElement.classList.contains('flag')) {
                clickedElement.classList.add('flag');
                flagsInfo.innerText = parseInt(flagsInfo.innerText) - 1;

                flagsPlaced++;
                checkForWin();

            } else {
                clickedElement.classList.remove('flag');
                clickedElement.classList.add('questionMark');
                flagsPlaced--;
                flagsInfo.innerText = parseInt(flagsInfo.innerText) + 1;
            }
        });
    });
})();