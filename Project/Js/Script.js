(function () {

    window.addEventListener('load', function () {
        let form = document.querySelector('form');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let isCorrect = true;

            let inpName = document.getElementById('inpName');
            let errName = document.getElementById('errName');
            
            errName.classList.add('hidden');
            errName.classList.add('collapsed');

            if (inpName.value.length < 3) {
                errName.classList.remove('hidden');
                errName.classList.remove('collapsed');

                errName.innerText = 'Please enter a name of at least 3 characters';
                
                isCorrect &= false;
            }

            let inpRows = document.getElementById('inpRowSize');
            let errRows = document.getElementById('errRows');
            
            errRows.classList.add('hidden');
            errRows.classList.add('collapsed');
            console.log(inpRows.value);
            
            if (inpRows.value === '') {
                errRows.classList.remove('hidden');
                errRows.classList.remove('collapsed');

                errRows.innerText = 'Please input a value'
            }
            
        });
    }); 
})();