/* eslint-disable no-console */
(function () {

    window.addEventListener('load', function () {

        function handleError(err) {
            console.log('An error occured: ' + err);
        }

        function handleResponse(resp) {
            console.log(resp);
            return resp.json();
        }

        function handleSucces(data) {
            console.log(data);
            for (let i = 0; i < data.rates.length; i++) {
                
            }
        }

        fetch('http://ophalvens.net/mi2/examen/vat.php?m=all')
            .then(handleResponse)
            .then(handleSucces)
            .catch(handleError);
    });
})();