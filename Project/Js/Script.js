(function () {
    'use strict';
    let video = document.getElementById('RawFootage'); // video is the id of video tag
    let canvas = document.getElementById('playarea');
    window.addEventListener('load', function () {
               
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                setTimeout(processVideo, 0);
            })
            .catch(function(err) {
                console.log("An error occurred! " + err);
            });
    });  
    
    function processVideo() {
        let src = new cv.Mat(400, 400, cv.CV_8UC4);
        let dst = new cv.Mat(400, 400, cv.CV_8UC1);
        let cap = new cv.VideoCapture(video);
        const FPS = 60;
        let begin = Date.now();
        cap.read(src);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        cv.imshow('playarea', dst);
        // schedule next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    }    
})();   