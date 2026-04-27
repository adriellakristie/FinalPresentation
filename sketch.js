let images = []; //array to store all images
let showImg = []; //array to track which images to show
let img21JustAppeared = false;
let hueValue = 0; //color for kaleidoscope lines
let kaleidoscopeLines = []; //storing line for kaleidos

function preload() {
  //load images 1-20 (uppercase .PNG)
  for (let i = 1; i <= 20; i++) {
    images[i] = loadImage(i + '.PNG');
  }
  //load image 21 (lowercase .png)
  images[21] = loadImage('21.png');
  
  //initialize showImg array
  for (let i = 1; i <= 21; i++) {
    showImg[i] = false;
  }
}

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  background(255); //set background to white
  
  //showing image1
  showImg[1] = true;
  
  //showing images 2 to 20 at 0.5s intervals
  for (let i = 2; i <= 20; i++) {
    let delay = (i - 1) * 1000 - 500; //calculating delay so 500, 1500, 2500, etc.
    setTimeout((index) => { showImg[index] = true; }, delay, i); //timeout to show each image at the right time
    //setTimeout schedules a function to run after a delay
    //parameter: (function, delay, argument)
    //(index) => {...} is an arrow function that takes 'index' as a parameter

  }
  
  // Show image 21 after 19.5 seconds
  setTimeout(() => { 
    showImg[21] = true;
    img21JustAppeared = true;
  }, 19500);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //clear background once when img21 first appears to remove images 1-20
  if (img21JustAppeared) {
    background(255);
    img21JustAppeared = false;
    kaleidoscopeLines = []; //clear any existing lines
  }
  
  //clear background during image sequence or when in kaleidoscope mode
  if (!showImg[21]) {
    background(255);
  } else {
    //also clear background when img21 is showing (so old lines disappear)
    background(255);
  }
  
  let scaleAmount = 0.3; //scale down to 30% of original size
  let centerX = width / 2;
  let centerY = height / 2;

  //draw images 1-20 when img21 is not showing
  if (!showImg[21]) {
    for (let i = 1; i <= 20; i++) {
      if (showImg[i]) {
        push();
        translate(centerX, centerY);
        scale(scaleAmount);
        image(images[i], 0, 0);
        pop();
      }
    }
  }
  
  //only allow kaleidoscope drawing when image 21 is showing
  if (!showImg[21]) {
    return;
  }

  //remove lines older than 5 seconds
  let currentTime = millis();
  kaleidoscopeLines = kaleidoscopeLines.filter(line => currentTime - line.timestamp < 5000);
  
  //draw all stored lines
  push();
  translate(width / 2, height / 2);
  colorMode(HSB);
  for (let storedLine of kaleidoscopeLines) {
    stroke(storedLine.hue, 80, 100);
    strokeWeight(10);
    
    for (let i = 0; i < storedLine.symmetry; i++) {
      rotate(storedLine.angle);
      line(storedLine.x1, storedLine.y1, storedLine.x2, storedLine.y2);
      
      push();
      scale(1, -1);
      line(storedLine.x1, storedLine.y1, storedLine.x2, storedLine.y2);
      pop();
    }
  }
  pop();
  colorMode(RGB);



//the symmetry variable will define how many reflective sections the canvas is split into.
let symmetry = 6;

//calculate the angle at which each section is rotated.
let angle = 360/ symmetry;


  //if the cursor is within the limits of the canvas
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    //translate the current position and the previous position of the
    //cursor to the new coordinates set with the translate() function above.
    let lineStartX = mouseX - width / 2;
    let lineStartY = mouseY - height / 2;
    let lineEndX = pmouseX - width / 2;
    let lineEndY = pmouseY - height / 2;

    //if the mouse is presse
    if (mouseIsPressed === true) {
      //cycle through colors
      hueValue = (hueValue + 2) % 360; //increment hue value

      //store the line data with timestamp
      kaleidoscopeLines.push({
        x1: lineStartX,
        y1: lineStartY,
        x2: lineEndX,
        y2: lineEndY,
        hue: hueValue,
        timestamp: millis(),
        symmetry: symmetry,
        angle: angle
      });
    }
  }
  
  //put image 21 on top of the kaleidoscope drawings
  push();
  resetMatrix(); //reset to original coordinate system
  translate(width / 2, height / 2);
  scale(scaleAmount);
  image(images[21], 0, 0);
  pop();
}