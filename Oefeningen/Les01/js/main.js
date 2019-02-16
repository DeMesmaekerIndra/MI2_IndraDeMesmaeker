(function () {
    'use strict';

    let van = document.getElementById('vanImg');

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
    })
})()