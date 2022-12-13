document.addEventListener('DOMContentLoaded', (event) => {
    const audioCtx = new AudioContext();
    const oscillatorNode = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const finish = audioCtx.destination;
    const play = document.getElementById('play');
    const audioElement = document.getElementById('audio');
    const source = audioCtx.createMediaElementSource(audioElement);
    const trackWave = new TrackWave();
    trackWave.createRangeDial(event);
    //const canvas = document.getElementById('wave-canvas');
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    // Connect the source to be analysed
    source.connect(analyser);
    // Get a canvas defined with ID "oscilloscope"
    const canvas = document.getElementById("wave-canvas");
    const canvasCtx = canvas.getContext("2d");
    // draw an oscilloscope of the current audio source
    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = "rgb(200, 200, 200)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        canvasCtx.beginPath();
        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            }
            else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }
    draw();
    /*
    // define online and offline audio context
    
    
    const offlineCtx = new OfflineAudioContext(2,44100*40,44100);
    
    const source = offlineCtx.createBufferSource();
    
    // use XHR to load an audio track, and
    // decodeAudioData to decode it and OfflineAudioContext to render it
    
    function getData() {
      let request = new XMLHttpRequest();
    
      request.open('GET', 'Gotta Be Me.mp3', true);
    
      request.responseType = 'arraybuffer';
    
      request.onload = () => {
        const audioData = request.response;
    
        audioCtx.decodeAudioData(audioData, (buffer) => {
          let myBuffer = buffer;
          source.buffer = myBuffer;
          source.connect(offlineCtx.destination);
          source.start();
          //source.loop = true;
          offlineCtx.startRendering().then((renderedBuffer) => {
            console.log('Rendering completed successfully');
            const song = audioCtx.createBufferSource();
            song.buffer = renderedBuffer;
    
            song.connect(audioCtx.destination);
    
            play!.onclick = () => {
              song.start();
            }
          }).catch((err) => {
              console.error(`Rendering failed: ${err}`);
              // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
          });
        });
      }
    
      request.send();
    }
    
    // Run getData to start the process off
    
    getData(); */
});
class TrackWave {
    constructor() { }
    createRangeDial(event) {
    }
}
