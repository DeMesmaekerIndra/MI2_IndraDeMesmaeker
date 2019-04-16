;
(function () {
    "use strict";
    let artisUrl = 'https://www.songsterr.com/a/ra/songs/byartists.json?artists=';
    let songUrl = 'https://www.songsterr.com/a/ra/songs.json?pattern=';   

    window.addEventListener('load', function () {        

        let table = document.getElementById('songs');

        function handleError(err) {            
            table.querySelector('thead').classList.add('hidden');
            console.log('Request failed: ' + err);
        }

        function handleResponse(resp) {
            console.log('Response status: ' + resp);
            return resp.json();
        }

        function handleSucces(data) {
            console.log('status: ' + data.status);
            
            let tbody = table.querySelector('tbody');
            
            //Clear the table
            while (tbody.hasChildNodes()) {
                tbody.removeChild(tbody.firstChild);
            }

            //Fill the table with the title & tabs
            for (let i = 0; i < data.length; i++) {   
                let newRow = tbody.insertRow(i);             
                newRow.insertCell(0).innerText = data[i].title;
                newRow.cells[0].setAttribute('data-artist', '');
                newRow.insertCell(1).innerText = data[i].tabTypes;
            }
        }

        document.getElementById('frmSearch').addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let inpArtist = document.getElementById('artist');
            document.querySelector('thead').classList.remove('hidden');
            document.querySelector('tbody').classList.add('table__loading');

            fetch(artisUrl + inpArtist.value)
                .then(handleResponse)
                .then(handleSucces)
                .catch(handleError);
        });
    });

})();