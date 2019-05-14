(function () {
    'use strict';
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

    let removeField = function(){
        let tbody = document.getElementById('minefield');

        while (tbody.childNodes.length > 0) {
            tbody.childNodes[0].remove();
        }
    };

    let createField = function(rows, columns){
        let minefield = document.getElementById('minefield');
        removeField();

        for (let i = 0; i < rows; i++) {
            let newRow = minefield.insertRow(i);

            for (let j = 0; j < columns; j++) {
                newRow.insertCell(j);                
            }
            
        }
    };    

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

            if (isCorrect) {
                createField(inpRows.value, inpColumns.value);
            }
        });
    });
})();