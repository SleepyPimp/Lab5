// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
var synth = window.speechSynthesis;



// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');
  //ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  const dimensions = getDimmensions(canvas.width,canvas.height,img.width,img.height);
  ctx.drawImage(img,dimensions.startX,dimensions.startY,dimensions.width,dimensions.height);
  document.querySelector("[type='submit']").disabled = false;

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const input = document.getElementById('image-input');
input.addEventListener('change', () => {
  img.src = URL.createObjectURL(input.files[0]);
  img.alt = input.value.split('\\').pop().split('/').pop();
});

const form = document.getElementById('generate-meme');
form.addEventListener('submit',() => {
  const textTop = document.getElementById("text-top").value;
  const textBot = document.getElementById('text-bottom').value;
  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle='white';
  ctx.textAlign='center';
  ctx.fillText(textTop,canvas.width/2, 15);
  ctx.fillText(textBot,canvas.width/2, canvas.height - 15);
  document.querySelector("[type='submit']").disabled = true;
  document.querySelector("[type='reset']").disabled = false;
  document.querySelector("[type='button']").disabled = false;
  event.preventDefault();
});

const reset = document.querySelector("[type='reset']");
reset.addEventListener('click', () => {
  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;
  event.preventDefault();

});

function putVoices(){
  document.getElementById("voice-selection").disabled = false;
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  var voices = speechSynthesis.getVoices();

  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voice-selection").appendChild(option);
  }



};



putVoices();
document.getElementById("voice-selection").remove(0);

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = putVoices;
}

const read = document.querySelector("[type='button']");
read.addEventListener('click', () => {
  var volume = document.querySelector("[type='range']").value;
  var voices = speechSynthesis.getVoices();
  var voiceSelect = document.getElementById("voice-selection");
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  var text = document.getElementById('text-top').value + " " + document.getElementById('text-bottom').value;
  var speech = new SpeechSynthesisUtterance(text);
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      speech.voice = voices[i];
    }
  }
  speech.volume = volume/100;
  synth.speak(speech);
  


  event.preventDefault();

});

const vg = document.getElementById('volume-group');

vg.addEventListener('input', () => { 

  var range = document.querySelector("[type='range']").value;
  var icon = document.querySelector('div img');
  if(range >=67 && range <=100){
    synth.pitch = range; 
    icon.src = "icons/volume-level-3.svg"
  } else if(range >= 34 && range <= 66){
    synth.pitch = range;
    icon.src = "icons/volume-level-2.svg"
  }else if(range >= 1 && range <= 33){
    synth.pitch = range;
    icon.src = "icons/volume-level-1.svg"
  }else{
    synth.pitch = 0;
    icon.src = "icons/volume-level-0.svg"
  }



}
)





/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
