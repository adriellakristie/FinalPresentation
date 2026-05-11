//MEET WAYAN
//Balinese Barong Character Interactive Animation!
//by Adriella Kristie


//I wanted to make a fun interactive animation that also introduces people to
//the Balinese Folklore character Barong. I made it a character with a little name
//and provided a bit of an activity to make it more fun!
//Hope you enjoy meeting Wayan, playing with the kaleidoscope and getting your sticker at the end! :))

//ps. make sure you have your volume up! 

//these are all the global variables, declared outside of any function
//so that every function can access and change them
let images = []; //array to store all images
let showImg = []; //array to track which images to show
let img21JustAppeared = false; //flag to detect the exact frame barong first shows up
let hueValue = 0; //color for kaleidoscope lines, cycles through 0-360
let kaleidoscopeLines = []; //storing lines for kaleidoscope
let hasStarted = false; //has the user clicked to start?
let imageAnimations = []; //rotation and position data for each image
let animationStartTime = 0; //when did the animation start
let img21Rotation = 0; //rotation angle for image 21
let img21Scale = 0.3; //starts at 0.3
let ringRadius = 0; //radius of ring around image 21
let img21IntroStartTime = 0; //when image 21 intro animation starts
let kaleidoscopeEnabled = false; //can the user draw yet
let ringImg; //the decorative ring image
let ringRotation = 0; //how much the ring has spun
let ringOpacity = 0; //opacity of ring where 0 = invisible, slowly more visible to 255
let ringScale = 0.3; //ring starts smaller than barong
let flowerImg; //decorative flower for kaleidoscope
let kaleidoscopeFlowers = []; //flower positions in the kaleidoscope
let kaleidoscopeStartTime = 0; //when kaleidoscope mode started
let kaleidoscopeTimeLimit = 10000; //10 seconds in milliseconds
let showStickerButton = false; //show the "Get your Wayan sticker" button?
let showStickerOptions = false; //show color or black and white options?
let stampstickerImg, idcardImg; //placeholder images for stickers
let showStickers = ''; //which placeholder to show: '', 'stamp', or 'id'
let rotationStopped = false; //has spinning stopped
let showInstructions = false; //show the drawing instructions?
let instructionsStartTime = 0; //when did instructions start showing
let ornamentLeftImg, ornamentRightImg; //side decorations
let song; //variable for background music


//preload runs once before setup() and draw() start
function preload() {

  //load images 1-20 (they are uppercase, they are .PNG files)
  for (let i = 1; i <= 20; i++) { //loops through 1 to 20
    images[i] = loadImage(i + '.PNG');
  }

  //image 21 is lowercase .png / i did this to differentiate between the
  //first sequence and the next (where the barong is complete and spinning)
  images[21] = loadImage('21.png');

  //load the ring around the circular barong for second sequence
  ringImg = loadImage('RING.png');

  //load the balinese flower used in the kaleidoscope
  flowerImg = loadImage('FLOWER.png');

  //load the sticker images
  stampstickerImg = loadImage('sticker.png');
  idcardImg = loadImage('idcard.png');

  //load left and right ornaments
  ornamentLeftImg = loadImage('ORNAMENTS_LEFT.png');
  ornamentRightImg = loadImage('ORNAMENTS_RIGHT.png');

  //load song for background music
  song = loadSound('song.mp3');

  //start all images hidden
  for (let i = 1; i <= 21; i++) {
    showImg[i] = false; //goes to image in array but it's false so it's hidden
  }

  //give each image a random starting rotation, speed, and position offset
  //this runs once so each image always has the same random values
  for (let i = 1; i <= 21; i++) {
    imageAnimations[i] = {
      rotation: random(-15, 15), //random tilt between -15 and 15 degrees
      rotationSpeed: random(-0.5, 0.5), //how fast it spins (saved for potential use)
      offsetX: random(-200, 200), //random horizontal offset
      offsetY: random(-200, 200), //random vertical offset
      shakeX: 0, //shake values start at 0, get calculated in draw
      shakeY: 0,
      scale: random(0.95, 1.05) //slight size variation so they dont all look identical
    };
  }
}


function setup() {
  //setup() runs once at the very start, after preload() finishes
  angleMode(DEGREES); //sets angles to be in degrees instead of radians because easier to work with personally
  createCanvas(windowWidth, windowHeight); //width and height of the canvas match the window size
  imageMode(CENTER); //set image to center mode so I can position them by their center point
  background('#f2ecdc'); //beige background
}


//this function starts off the whole animation sequence
//it's called when the user clicks for the first time
function startAnimation() {
  song.play(); //plays song for background music
  hasStarted = true;
  animationStartTime = millis(); //millis() returns how many milliseconds since the sketch started

  //show image 1 right away
  showImg[1] = true;

  //show images 2-20 one by one with small delays between each
  //setTimeout to wait a certain number of milliseconds before doing something
  for (let i = 2; i <= 20; i++) {
    let baseDelay = (i - 1) * 400; //each image waits 400ms longer than the last
    let randomVariation = random(-80, 80); //add a tiny bit of randomness so they dont all feel too uniform in a way
    let delay = baseDelay + randomVariation;

    //the (index) => {} part is an arrow function to pass i into the setTimeout
    //without this, 'i' would always be 20 by the time setTimeout runs 
    setTimeout((index) => {
      showImg[index] = true;

      //when image 20 shows up, wait 1 second then show barong (image 21)
      if (index === 20) {
        setTimeout(() => {
          showImg[21] = true;
          img21JustAppeared = true;
          img21IntroStartTime = millis(); //save the time to track how long the intro has been running
        }, 1000);
      }
    }, delay, i);
  }

  //show drawing instructions after the barong intro finishes
  //image 20 appears around 7600ms, then 1s pause,then 4s intro so about 12600ms total
  setTimeout(() => {
    showInstructions = true;
    instructionsStartTime = millis();
  }, 12600);
}

//mousePressed() for when user clicks on the canvas
function mousePressed() {

  //first click starts the whole animation
  if (!hasStarted) {
    startAnimation();
    return; //return early so we dont run the rest of mousePressed
  }

  //check if user clicked the sticker button
  //this only runs if the button is visible AND the options screen isnt already open
  if (showStickerButton && !showStickerOptions) {
    let buttonY = height - 80;
    let buttonWidth = 300;
    let buttonHeight = 60;

    //check if the mouse is inside the button rectangle by testing all 4 edges
    //width/2 - buttonWidth/2 gives the left edge of a centered button (checking by borders)
    if (mouseX > width / 2 - buttonWidth / 2 &&
        mouseX < width / 2 + buttonWidth / 2 &&
        mouseY > buttonY - buttonHeight / 2 &&
        mouseY < buttonY + buttonHeight / 2) {
      showStickerButton = false; //hide the sticker button
      showStickerOptions = true; //show the stamp vs id card choice
    }
  }

  //check if user clicked the stamp or id button
  //showStickers === '' means no sticker is being shown yet, so the choice buttons are visible
  if (showStickerOptions && showStickers === '') {
    let buttonY = height / 2; //both buttons to be in the vertical middle of the screen
    let buttonWidth = 180;
    let buttonHeight = 50;
    let leftButtonX = width / 2 - 100; //stamp button is 100px left of center
    let rightButtonX = width / 2 + 100; //id button is 100px right of center

    //stamp button (left side)
    //same rectangle border test as above, just with leftButtonX as the center
    if (mouseX > leftButtonX - buttonWidth / 2 &&
        mouseX < leftButtonX + buttonWidth / 2 &&
        mouseY > buttonY - buttonHeight / 2 &&
        mouseY < buttonY + buttonHeight / 2) {
      showStickers = 'stamp'; //setting this string tells draw() which image to show
    }

    //id button (right side)
    if (mouseX > rightButtonX - buttonWidth / 2 &&
        mouseX < rightButtonX + buttonWidth / 2 &&
        mouseY > buttonY - buttonHeight / 2 &&
        mouseY < buttonY + buttonHeight / 2) {
      showStickers = 'id';
    }
  }

  //check if user clicked the back button
  //showStickers !== '' means a sticker is currently showing, so the back button is visible
  if (showStickerOptions && showStickers !== '') {
    let backButtonX = 80; //top left corner of the screen
    let backButtonY = 60;
    let backButtonWidth = 100;
    let backButtonHeight = 40;

    if (mouseX > backButtonX - backButtonWidth / 2 &&
        mouseX < backButtonX + backButtonWidth / 2 &&
        mouseY > backButtonY - backButtonHeight / 2 &&
        mouseY < backButtonY + backButtonHeight / 2) {
      showStickers = ''; //go back to showing the two choice buttons
    }
  }
}

//func runs automatically whenever the browser window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); //keep the canvas the same size as the window
}

function draw() {
    
  //if barong just appeared this frame, wipe the screen clean
  //this removes all the images 1-20 that were showing before
  if (img21JustAppeared) {
    background('#f2ecdc');
    img21JustAppeared = false; //set back to false so this only happens once
    kaleidoscopeLines = []; //clear any lines too just in case
  }

  //redraw the background every frame so old drawings dont pile up
  background('#f2ecdc');

  let scaleAmount = 0.3; //show images at 30% of original size
  let centerX = width / 2;
  let centerY = height / 2;

  //welcome screen before user clicks
  if (!hasStarted) {
    push(); //push() saves the current drawing style so we can change it temporarily
    fill(80, 50, 150);
    textAlign(CENTER, CENTER);
    textSize(72);
    textStyle(BOLD);
    text('Meet Wayan', width/ 2, height / 2 - 60);
    textSize(36);
    textStyle(NORMAL); //between normal, italic, bold and bolditalic but i chose normal
    text('your friendliest Barong', width / 2, height / 2 + 20);
    textSize(20);
    fill(120);
    text('Click me!', width / 2, height / 2 + 100);
    pop(); //pop() restores the drawing style back to what it was before push()
    return; //stop drawing anything else until the user clicks
  }

  //draw images 1-20 flipping around before barong appears
  if (!showImg[21]) {

    //draw the side ornaments
    push();
    imageMode(CENTER);
    let ornamentScale = 0.4;
    //multiply the original image width/height by the scale to get the display size
    let leftOrnamentWidth= ornamentLeftImg.width * ornamentScale;
    let leftOrnamentHeight = ornamentLeftImg.height * ornamentScale;
    let rightOrnamentWidth = ornamentRightImg.width * ornamentScale;
    let rightOrnamentHeight = ornamentRightImg.height * ornamentScale;

    let ornamentY = height / 2; //vertically centered
    let distanceFromCenter = 350; //how far left and right the ornaments sit from center

    image(ornamentLeftImg, width / 2 - distanceFromCenter, ornamentY, leftOrnamentWidth, leftOrnamentHeight);
    image(ornamentRightImg, width / 2 + distanceFromCenter, ornamentY, rightOrnamentWidth, rightOrnamentHeight);
    pop();

    //draw each image with a shaky wobbly motion
    for (let i = 1; i <= 20; i++) {
      if (showImg[i]) { //only draw it if it's been revealed yet
        //sin() and cos() go back and forth between -1 and 1 as frameCount increases
        //multiplying by 5 makes the shake go 5 pixels in each direction
        //adding i * 1.2 offsets each image so they dont all shake in sync
        let shakeX = sin(frameCount * 0.8 + i * 1.2) * 5;
        let shakeY = cos(frameCount * 0.6 + i * 0.9) * 5;

        //extra small jitter on top of the main shake for a more chaotic motion (also based on sin and cos but with different speeds and offsets)
        let jitterX = sin(frameCount * 2 + i * 3) * 1.5;
        let jitterY = cos(frameCount * 1.8 + i * 2.5) * 1.5;

        //rotation also goes back and forth between -6 and +6 degrees
        let rotationAngle = sin(frameCount * 0.5 + i * 0.8) * 6;

        push();
        translate(centerX + shakeX + jitterX, centerY + shakeY + jitterY); //move to center + shake
        rotate(rotationAngle);
        scale(scaleAmount); //shrink to 30%
        image(images[i], 0, 0); //draw at 0,0 because already translated to where we want it
        pop();
      }
    }
  }

  //stop drawing here if barong hasnt shown up yet
  //everything below this point only runs once showImg[21] is true
  if (!showImg[21]) {
    return;
  }

  //barong intro animation lasts 4 seconds so 4000 ms
  let introDuration = 4000;
  let timeSinceImg21 = millis() - img21IntroStartTime; //how many ms since barong appeared
  //introProgress goes from 0 to 1 over 4 seconds, then stays at 1
  let introProgress = constrain(timeSinceImg21 / introDuration, 0, 1);
  //introease makes the animation start fast and slow down at the end to make it more smooth
  let introEase = introProgress * introProgress * (3 - 2 * introProgress);

  //starts the drawing sequence after intro finishes (so introProgress hits 1)
  if (introProgress >= 1 && !kaleidoscopeEnabled) {
    kaleidoscopeEnabled = true;
    kaleidoscopeStartTime = millis(); //start the 10 second drawing timer 
  }

  //keep spinning unless stopped
  if (!rotationStopped) {
    ringRotation += 0.5; //add 0.5 degrees every frame
    img21Rotation += 0.5;
  }

  //lerp smoothly moves from one value to another
  //lerp(start, end, amount) where amount goes from 0 to 1
  //so lerp(0.25, 0.27, introEase) starts at 0.25 and ends at 0.27
  img21Scale = lerp(0.25, 0.27, introEase);

  //ring grows slightly bigger than barong so there's a gap between them
  ringScale = lerp(0.32, 0.35, introEase);

  //ring fades from invisible (0) to fully visible (255)
  ringOpacity = lerp(0, 255, introEase);

  //ring radius grows from 0 to 150 during intro
  let maxRingRadius = 150;
  ringRadius = lerp(0, maxRingRadius, introEase);

  //remove lines older than 5 seconds so they fade away over time
  //filter() keeps only the lines where the condition is true
  //currentTime - line.timestamp gives us how old the line is in ms
  let currentTime = millis();
  kaleidoscopeLines = kaleidoscopeLines.filter(line => currentTime - line.timestamp < 5000);
  kaleidoscopeFlowers = kaleidoscopeFlowers.filter(flower => currentTime - flower.timestamp < 5000);

  //check if the 10 second drawing window is over
  let kaleidoscopeElapsed = currentTime - kaleidoscopeStartTime;
  let kaleidoscopeTimedOut = kaleidoscopeEnabled && kaleidoscopeElapsed > kaleidoscopeTimeLimit;

  //if time is up AND all drawings have faded away, stop spinning and show the sticker button
  //we wait for drawings to disappear so the transition feels clean
  if (kaleidoscopeTimedOut && kaleidoscopeLines.length === 0 && kaleidoscopeFlowers.length === 0 && !rotationStopped) {
    rotationStopped = true;

    if (!showStickerButton && !showStickerOptions && showStickers === '') {
      showStickerButton = true;
    }
  }

  //kaleidoscope drawing
  //the idea is basically translate to center, rotate for each section and scale(1,-1) to mirror
  //i took this inspiration based on the p5.js kaleidoscope example: https://p5js.org/examples/repetition-kaleidoscope/
  //i modified it to store lines in an array so they stay across frames and fade after 5 seconds
  //i also replaced the plain line() with a quadraticVertex curve and added my own balinese flower images

  //move to the center of the canvas first so 0,0 is in the middle
  push();
  translate(width / 2, height / 2);
  colorMode(HSB); //switch to HSB color mode instead of RGB so hue is easy to work with (0-360 = full rainbow)

  let storedLine;
  for (storedLine of kaleidoscopeLines) {
    stroke(storedLine.hue, 80, 100); //color using the stored hue value
    strokeWeight(3);
    fill(storedLine.hue, 60, 100, 30); //same color but more transparent for the fill

    //draw the line symmetry times, rotating a little each time
    //this is what creates the kaleidoscope mirror effect
    //for example with symmetry=6 we draw 6 copies each rotated 60 degrees apart
    //this rotate and repeat loop comes from the p5.js example I linked above
    for (let i = 0; i < storedLine.symmetry; i++) {
      rotate(storedLine.angle); //rotate the canvas by one section

      //find the midpoint between the two line endpoints
      let midX = (storedLine.x1 + storedLine.x2) / 2;
      let midY = (storedLine.y1 + storedLine.y2) / 2;
      let offsetAmount = 20;

      //instead of drawing a straight line like the original example, i used quadraticVertex
      //to make a curved shape instead
      //quadraticVertex takes a control point that pulls the line into a curve
      //the control point is offset using sin/cos of the hue so each color curves differently
      beginShape();
      vertex(storedLine.x1, storedLine.y1); //start point
      quadraticVertex(
        midX + offsetAmount * sin(storedLine.hue), //control point x, slightly offset using sin
        midY + offsetAmount * cos(storedLine.hue), //control point y, slightly offset using cos
        storedLine.x2, //end point x
        storedLine.y2  //end point y
      );
      //small circles at start and end just to add a bit of pattern in the kaleidoscope
      circle(storedLine.x1, storedLine.y1, 8);
      circle(storedLine.x2, storedLine.y2, 8);
      endShape();

      //this part also from the original example
      //scale(1, -1) flips the Y axis to mirror the shape, doubling the symmetry
      push();
      scale(1, -1);
      beginShape();
      vertex(storedLine.x1, storedLine.y1);
      quadraticVertex(
        midX + offsetAmount * sin(storedLine.hue),
        midY + offsetAmount * cos(storedLine.hue),
        storedLine.x2,
        storedLine.y2
      );
      circle(storedLine.x1, storedLine.y1, 8);
      circle(storedLine.x2, storedLine.y2, 8);
      endShape();
      pop();
    }
  }

  let flower; //flower variable to use in loop to draw stored flowers in same kaleidoscope pattern
  for (flower of kaleidoscopeFlowers) {
    //age is to figure out how old this flower is (0 = just appearing, 5000 = about to disappear)
    let age = currentTime - flower.timestamp;
    let fadeProgress = age / 5000; //0 to 1 over its lifetime
    //map the fade so full opacity until 70% of its life, then fade to 0
    let flowerOpacity = map(fadeProgress, 0, 0.7, 255, 0);
    flowerOpacity = constrain(flowerOpacity, 0, 255); //make sure opacity never goes below 0

    //tint changes the color of the next image we draw
    tint(flower.hue, 80, 100, flowerOpacity);

    //draw a copy of the flower at each symmetry angle, same as the lines
    for (let i = 0; i < flower.symmetry; i++) {
      rotate(flower.angle);

      push();
      translate(flower.x, flower.y); //move to where the flower should be
      rotate(flower.rotation); //rotate it randomly so they dont all look the same
      scale(flower.size); //make it the right size
      imageMode(CENTER);
      image(flowerImg, 0, 0);
      pop();
    }

    noTint(); //reset tint so other things dont get colored
  }

  pop();

  //symmetry = how many mirror sections the kaleidoscope has
  let symmetry = 6;
  //angle = how many degrees each section takes up (360/6 = 60 degrees each)
  let angle = 360 / symmetry;

  //record new lines while the user is dragging the mouse
  //the mouse position conversion and mouseIsPressed check are also from the p5.js example
  //i added the array storage, timestamp, and flower logic on top
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && kaleidoscopeEnabled && !kaleidoscopeTimedOut) {
    //subtract width/2 and height/2 to convert mouse position to be relative to center
    //this matters because we translated to center when drawing
    let lineStartX = mouseX - width / 2;
    let lineStartY = mouseY - height / 2;
    let lineEndX = pmouseX - width / 2; //pmouseX is where the mouse was last frame
    let lineEndY = pmouseY - height / 2;

    if (mouseIsPressed === true) {
      //cycle hue through 0 to 360 to get a rainbow effect
      hueValue = (hueValue + 2) % 360; //%360 wraps it back to 0 after it hits 360

      //save this line segment so we can redraw it every frame
      kaleidoscopeLines.push({
        x1: lineStartX,
        y1: lineStartY,
        x2: lineEndX,
        y2: lineEndY,
        hue: hueValue,
        timestamp: millis(), //save when it was drawn so we can fade it after 5 seconds
        symmetry: symmetry,
        angle: angle
      });

      //random(1) gives a number between 0 and 1
      //<0.015 means theres about a 1.5% chance each frame of adding a flower
      //so flowers appear occasionally but not constantly
      //also small number because i tried a larger number and it lagged more so this is a good balance between
      //the program performing well and still keeping it fun and visually appealing
      if (random(1) < 0.015) {
        kaleidoscopeFlowers.push({
          x: lineStartX,
          y: lineStartY,
          hue: hueValue,
          timestamp: millis(),
          symmetry: symmetry,
          angle: angle,
          size: random(0.08, 0.14), //random size so they look varied
          rotation: random(360) //random rotation so they dont all face the same way
        });
      }
    }
  }

  //draw the spinning ring, but hide it when sticker screens are showing
  if (ringOpacity > 0 && showStickers === '' && !showStickerOptions) {
    push();
    resetMatrix(); //reset transformations so the ring draws at the real center of the canvas
    translate(width / 2, height / 2);
    rotate(ringRotation);

    //during intro, clip the ring so it looks like it draws itself in gradually
    //drawingContext lets us access the underlying HTML canvas 2D API directly
    //references i used for this: 
    //https://p5js.org/reference/p5/drawingContext/
    //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
    if (introProgress < 1) {
      //clipAngle goes from -180 to 180 as intro plays, revealing the ring piece by piece
      let clipAngle = map(introProgress, 0, 1, -180, 180);
      drawingContext.save(); //save canvas state before clipping
      drawingContext.beginPath();
      drawingContext.arc(0, 0, 500, radians(-180), radians(clipAngle)); //draw a wedge shape
      drawingContext.lineTo(0, 0); //connect wedge back to center
      drawingContext.closePath();
      drawingContext.clip(); //everything outside this wedge gets cut off
    }

    tint(255, ringOpacity); //255 means no color change, just controls the transparency
    scale(ringScale);
    imageMode(CENTER);
    image(ringImg, 0, 0);

    if (introProgress < 1) {
      drawingContext.restore(); //restore canvas state so clipping only affects the ring
    }

    noTint(); //reset tint so nothing else gets affected
    pop();
  }

  //draw barong (image 21) on top of everything
  //resetMatrix() so that the ring's transformations wouldn't carry over
  if (showStickers === '' && !showStickerOptions) {
    push();
    resetMatrix();
    translate(width / 2, height / 2);
    rotate(img21Rotation);
    scale(img21Scale);
    imageMode(CENTER);
    image(images[21], 0, 0);
    pop();
  }

  //show sticker image when user picks stamp
  if (showStickers === 'stamp') {
    push();
    translate(width / 2, height / 2);
    scale(0.5); //show at 50% size
    imageMode(CENTER);
    image(stampstickerImg, 0, 0);
    pop();

    //back button
    push();
    fill(80, 50, 150);
    stroke(255);
    strokeWeight(2);
    rectMode(CENTER);
    rect(80, 60, 100, 40, 20); //x, y, width, height, corner radius
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    textStyle(BOLD);
    text('← Back', 80, 60);
    pop();
    
    //show sticker image when id card is picked
  } else if (showStickers === 'id') {
    push();
    translate(width / 2, height / 2);
    scale(0.5);
    imageMode(CENTER);
    image(idcardImg, 0, 0);
    pop();

    //back button
    push();
    fill(80, 50, 150);
    stroke(255);
    strokeWeight(2);
    rectMode(CENTER);
    rect(80, 60, 100, 40, 20);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    textStyle(BOLD);
    text('← Back', 80, 60);
    pop();
  }

  //show drawing instructions for 5 seconds when barong appears
  if (showInstructions) {
    let instructionsElapsed = millis() - instructionsStartTime;
    if (instructionsElapsed > 5000) {
      showInstructions = false; //hide after 5 seconds
    } else {
      push();
      fill(120); //grey color
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(28);
      textStyle(NORMAL);
      text('Drag your mouse to make art with Wayan!', width / 2, 60);
      pop();
    }
  }

  //show "Get your Wayan sticker" button
  if (showStickerButton) {
    push();
    fill(80, 50, 150);
    stroke(255);
    strokeWeight(3);
    rectMode(CENTER);
    rect(width / 2, height - 80, 300, 60, 30); //centered near the bottom of the screen
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    textStyle(BOLD);
    text('Get your Wayan sticker', width / 2, height - 80);
    pop();
  }

  //show color vs id card choice buttons
  if (showStickerOptions && showStickers === '') {
    push();

    //left button: Wayan Stamp
    fill(80, 50, 150);
    stroke(255);
    strokeWeight(3);
    rectMode(CENTER);
    rect(width / 2 - 100, height / 2, 180, 50, 25);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text('Wayan Stamp', width / 2 - 100, height / 2);

    //right button: ID Card
    fill(80, 50, 150);
    stroke(255);
    strokeWeight(3);
    rect(width / 2 + 100, height / 2, 180, 50, 25);
    fill(255);
    noStroke();
    text('ID Card', width / 2 + 100, height / 2);

    pop();
  }
}