(function () {
    "use strict";
    let artistUrl = 'https://www.songsterr.com/a/ra/songs/byartists.json?artists=';
    let songUrl = 'https://www.songsterr.com/a/ra/songs.json?pattern=';   
    let songPageUrl = 'https://www.songsterr.com/a/wa/song?id='

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
            console.log(data);
            //Remove loader gif
            document.getElementById('loadAnimation').classList.add('hidden');
            
            //Fill the table with the title & tabs
            let tbody = table.querySelector('tbody');    

            for (let i = 0; i < data.length; i++) {   
                let newRow = tbody.insertRow(i);        
                let artistCell = newRow.insertCell(0);
                
                artistCell.innerHTML = '<a href="' + songPageUrl + data[i].id + '" target="_blank">' + data[i].title + '</a>';
                artistCell.setAttribute('data-artist', '');

                newRow.insertCell(1).innerText = data[i].tabTypes;

                //Stop adding new items when the length exceeds 25
                if (i === 25) {
                    break;
                }
            }
        }

        document.getElementById('frmSearch').addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let tbody = table.querySelector('tbody');

            //Clear the table
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }           

            document.getElementById('loadAnimation').classList.remove('hidden');

            let inpArtist = document.getElementById('artist');
            fetch(artistUrl + '"' + inpArtist.value + '"')
                .then(handleResponse)
                .then(handleSucces)
                .catch(handleError);
        });
    });
})();