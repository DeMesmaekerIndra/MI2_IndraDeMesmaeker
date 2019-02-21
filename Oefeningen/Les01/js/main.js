(function () {
    'use strict';

    let van = document.getElementById('vanImg');
    let sldOpacity = document.getElementById('sldOpacity');

    window.addEventListener('load', function () {

        document.getElementById('btnNormal').addEventListener('click', function () {
            van.className = 'Normal';
        });
        document.getElementById('btnGrayscale').addEventListener('click', function () {
            van.className = 'Grayscale';
        });
        document.getElementById('btnSepia').addEventListener('click', function () {
            van.className = 'Sepia';
        });
        document.getElementById('btnHue').addEventListener('click', function () {
            van.className = 'Hue';
        });
        document.getElementById('btnBlur').addEventListener('click', function () {
            van.className = 'Blur';
        });
        sldOpacity.addEventListener('input', function () {
            van.style.opacity = sldOpacity.value;
            document.getElementById('lblValue').textContent = sldOpacity.value * 100 + '%';
        });
    })
})();