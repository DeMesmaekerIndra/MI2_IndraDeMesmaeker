(function () {
    "use strict";
    let artistUrl = 'https://www.songsterr.com/a/ra/songs/byartists.json?artists=';
    let songUrl = 'https://www.songsterr.com/a/ra/songs.json?pattern=';
    let songPageUrl = 'https://www.songsterr.com/a/wa/song?id='

    let tooltip = document.getElementById('tooltip');

    /**
     * Function that shows, fills and positions the tooltip
     * @param {String} text Text to be displayed in tooltip
     * @param {Event} e Event that activated the tooltip
     */
    let showTooltip = function (text, e) {
        tooltip.classList.remove('hidden');
        tooltip.innerText = text
        tooltip.style.left = e.clientX + 20 + 'px';
        tooltip.style.top = e.clientY + window.scrollY + 'px';
    };

    /**
     * Function that hides the tooltip
     */
    let hideTooltip = function () {       
        tooltip.classList.add('hidden');
    };

    window.addEventListener('load', function () {
        let table = document.getElementById('songs');

        ///AJAX FETCH FUNCTIONS///
        function handleError(err) {
            table.querySelector('thead').classList.add('hidden');
        }

        function handleResponse(resp) {
            return resp.json();
        }

        function handleSucces(data) {
            //Remove loader gif
            document.getElementById('loadAnimation').classList.add('hidden');

            //Fill the table with the title & tabs
            let tbody = table.querySelector('tbody');

            for (let i = 0; i < data.length; i++) {
                let newRow = tbody.insertRow(i);

                //insert title cell  
                let titleCell = newRow.insertCell(0);

                titleCell.innerHTML = '<a href="' + songPageUrl + data[i].id + '" target="_blank">' + data[i].title + '</a>';
                titleCell.setAttribute('data-artist', data[i].artist.nameWithoutThePrefix);

                //set up tooltip artist   
                titleCell.addEventListener('mousemove', function (e) {
                    showTooltip(titleCell.getAttribute('data-artist'), e);
                });

                titleCell.addEventListener('mouseleave', function () {
                    hideTooltip();
                });

                //insert tab cell, set up tooltop tabs
                let tabCell = newRow.insertCell(1);
                tabCell.innerText = data[i].tabTypes;

                //set up tooltip tabs
                tabCell.addEventListener('mousemove', function (e) {
                    showTooltip('Bekijk de partituur', e);
                });

                tabCell.addEventListener('mouseleave', function () {
                    hideTooltip();
                });

                //Stop adding new items when the length exceeds 25
                if (i === 25) {
                    break;
                }
            }
        }

        ///FORM///
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