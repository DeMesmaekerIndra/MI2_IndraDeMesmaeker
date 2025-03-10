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
    /**
     * Class that stores the data ((in)active bomb, surrounding bombs, matching td element on screen)
     */
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

    /**
     * This functions handles saving/overwriting highscores
     * Highscore are kept in localstorage. Previous score is kept in session storage.
     */
    let storeData = function () {
        //Save the currentscore in an array
        let highScoreData = [
            document.getElementById('inpName').value,
            internalTime.toLocaleTimeString(),
            new Date().toUTCString()
        ];

        //Check the field size and determine which previous highscore should be overwritten
        let cellAmount = minefieldData.length * minefieldData[0].length;
        let highscoreType = '';

        if (cellAmount < 65) {
            highscoreType = 'small';
        } else if (cellAmount < 257) {
            highscoreType = 'medium';
        } else {
            highscoreType = 'large';
        }

        //Get old highscore for the determined field size. 
        //If the new score is better, or there is no old score.Save current score as highscore
        let oldHighScore = JSON.parse(localStorage.getItem(highscoreType));

        if (oldHighScore === null) {
            localStorage.setItem(highscoreType, JSON.stringify(highScoreData));
        } else if (oldHighScore[1] >= highScoreData[1]) {
            localStorage.setItem(highscoreType, JSON.stringify(highScoreData));
        }

        //Add identifier for fieldsize to currentscore & add to session storage.
        highScoreData.push(highscoreType);
        sessionStorage.setItem('currentScore', JSON.stringify(highScoreData));
    };

    /**
     * Function that checks if the winning conditions (all flags placed, all safe cells clicked) have been met.
     * If they have, save the current score. And check wether it beats the previous highscore.
     * Then open the scoreboard window
     */
    let checkForWin = function () {
        if (!((remainingSafeCells === 0) && (flagsPlaced === totalBombAmount))) {
            return;
        }

        //Stop the timer, display fireworks
        clearInterval(timer);
        document.querySelector('body').classList.add('fireWorks');

        storeData();
        setTimeout(function () {
            window.open('scoreboard.html', '_blank');
        }, 1500);
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
     * @param {Cell} startCell 
     */
    let findContourCells = function (startCellData) {
        let contourCellCollection = [];
        let currentCellIndex = 0,
            yPosMaximum = minefieldData.length - 1,
            XposMaxium = minefieldData[0].length - 1;

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

                    let cellData = minefieldData[i][j],
                        cell = cellData.getCorrespondingTd;

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
        } while (currentCellIndex < contourCellCollection.length);

        //Check the winning conditions
        //Once all safe cells are shown, and all flags have been placed. The user wins
        remainingSafeCells -= contourCellCollection.length;

        updateCells(contourCellCollection);
        checkForWin();
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
        let yPosMaximum = minefieldData.length - 1,
            xPosMaxium = minefieldData[0].length - 1;

        //Increment the bombamount of all surrounding cells withing the outerbounds of the field
        for (let yPos = bombYPos - 1; yPos <= bombYPos + 1; yPos++) {
            if (yPos > yPosMaximum || yPos < 0) {
                continue;
            }

            for (let xPos = bombXpos - 1; xPos <= bombXpos + 1; xPos++) {
                if ((xPos > xPosMaxium || xPos < 0)) {
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
     * @param {number} rows Amount of rows 
     * @param {number} columns Amount of columns
     */
    let populateWithBombs = function (rows, columns) {
        let cellAmount = rows * columns,
            bombsPlaced = 0;

        //Like the original minesweeper +-17% of all cells are bombs
        totalBombAmount = Math.ceil(cellAmount * 0.17);
        remainingSafeCells = cellAmount - totalBombAmount;

        document.getElementById('bombsInfo').innerText = totalBombAmount;
        document.getElementById('flagsInfo').innerText = totalBombAmount;

        //Activate random bombs untill all bombs have been activated
        while (bombsPlaced < totalBombAmount) {
            let yPos = Math.floor(Math.random() * rows),
                xPos = Math.floor(Math.random() * columns);
            let cellData = minefieldData[yPos][xPos];

            if (cellData.getBomb !== true) {
                cellData.setBomb = true;
                bombsPlaced++;

                addBombAmount(yPos, xPos);
            }
        }
    };

    /**
     * Resets the minefieldData array
     * clears & hides the table
     */
    let resetField = function () {
        minefieldData.length = 0;
        flagsPlaced = 0;

        let tbody = document.getElementById('minefield');

        while (tbody.childNodes.length > 0) {
            tbody.childNodes[0].remove();
        }
    };

    /**
     * Function responsible for creating td elements & cell objects
     * Pushes the cell objects into a multidimensional array minefieldData
     * @param {number} rows Amount of rows
     * @param {number} columns Amount of columns
     */
    let createField = function (rows, columns) {
        resetField();

        let tbody = document.getElementById('minefield');

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
     * @param {*} input Input value of input element
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

        if (window.innerWidth <= 1280) {
            document.getElementById('maxColumns').innerText = '15';
            document.getElementById('inpColumnSize').setAttribute('max', '15');
        }

        if (window.innerHeight <= 720) {
            document.getElementById('maxRows').innerText = '15';
            document.getElementById('inpRowSize').setAttribute('max', '15');
        }

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
                form.classList.add('onScreen');
                document.querySelector('body').classList.remove('fireWorks');
                document.getElementById('btnDone').value = 'Start playing!';
                return;
            }

            //if a previous timer is still active, clear it
            //NOTE: clearInterval doesn't generate errors when it receives null//undefined
            clearInterval(timer);

            let inpName = document.getElementById('inpName'),
                inpRows = document.getElementById('inpRowSize'),
                inpColumns = document.getElementById('inpColumnSize');

            let errName = document.getElementById('errName'),
                errRows = document.getElementById('errRows'),
                errColumns = document.getElementById('errColumns');

            errName.classList.add('hidden', 'collapsed');
            errRows.classList.add('hidden', 'collapsed');
            errColumns.classList.add('hidden', 'collapsed');

            let isCorrect = checkInput(inpName, errName) && checkInput(inpRows, errRows) && checkInput(inpColumns, errColumns);

            if (!isCorrect) {
                return;
            }

            createField(parseInt(inpRows.value), parseInt(inpColumns.value));

            //Initialise the internalTime, remove the current
            //NOTE: The date isn't being used, only the time
            internalTime = new Date('1/01/2000 00:00:00');
            timer = setInterval(incrementTimer, 1000);

            form.classList.remove('onScreen');
            form.classList.add('offScreen');
            document.getElementById('btnDone').value = 'New game!';
        });

        /** 
         * Activates if the tbody has been clicked, Acts accordingly if a td element was clicked
         */
        minefield.addEventListener('click', function (e) {
            let clickedElement = e.target;

            if (clickedElement.tagName !== 'TD') {
                return;
            }

            let cellData = minefieldData[clickedElement.parentElement.rowIndex][clickedElement.cellIndex];
            let cell = cellData.getCorrespondingTd;

            //If the clicked cell has already been clicked before, cell contains a flag don't do anything
            //NOTE: Flag need too be removed before the cell can be activated
            if (cell.classList.contains('clickedCell') || cell.classList.contains('flag')) {
                return;
            }

            //If user clicks on bomb, then add/remove css of cell
            //Or find which cells should be shown
            if (cellData.getBomb) {
                clearInterval(timer);

                cell.classList.add('clickedBomb');
                cell.classList.remove('questionMark');

                //UpdateCells can only receive a one dimensional array, therefor we need to iterate row per row
                //Because minefieldData is a jagged array
                for (let row of minefieldData) {
                    updateCells(row);
                }

                sessionStorage.clear();
                setTimeout(function () {
                    window.open('scoreboard.html', '_blank');
                }, 1000);
            } else {
                findContourCells(cellData);
            }
        });

        /**
         * Activates when user tries to open contextmenu (rightclick) in minefield
         * Places/removes flags & questionMarks
         */
        minefield.addEventListener('contextmenu', function (e) {
            //block context menu & check if a td was clicked
            e.returnValue = false;

            let clickedElement = e.target;

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
                flagsInfo.innerText = parseInt(flagsInfo.innerText) + 1;

                flagsPlaced--;
            }
        });
    });
})();