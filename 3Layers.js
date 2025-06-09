let sourceImg=null;
let maskImg=null;
let renderCounter=0;
let curLayer = 0;

// change these three lines as appropiate
let sourceFile = "Input_new4.jpg";
let maskFile   = "mask_new4.png";
let outputFile = "output_6.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(255);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  colorMode(HSB);
}

function draw () {
  if (curLayer == 0) {
    let num_lines_to_draw = 40;
    // get one scanline
    for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
      for(let i=0; i<1920; i++) {
        colorMode(RGB);
        let pixData = sourceImg.get(i, j);
        // create a color from the values (always RGB)
        let col = color(pixData);
        //let maskData = maskImg.get(i, j);

        colorMode(HSB, 360, 100, 100);
        // draw a "dimmed" version in gray
        let h = hue(col);
        let s = saturation(col);
        let b = brightness(col);

        let new_brt = map(b, 0, 100, 30, 50);
        let new_col = color(h, 0, new_brt);
        set(i, j, new_col);
      }
    }
    renderCounter = renderCounter + num_lines_to_draw;
    updatePixels();
    if(renderCounter > 1080) {
      curLayer = 1;
      renderCounter = 0;
      print("Switching to curLayer 1");
    }
  }
  else if (curLayer == 1) {
    for(let i=0; i<500; i++) {
      let x1 = random(0, width);
      let y1 = random(0, height);
      let maskData = maskImg.get(x1, y1);
      if(maskData[1] > 128) {
        let x2 = x1 + random(-20, 20);
        let y2 = y1 + random(-20, 20);
        colorMode(RGB);
        stroke(255, 255, 0);
        line(x1, y1, x2, y2);
      }
    }
    renderCounter = renderCounter + 1;
    if(renderCounter > 500) {
      curLayer = 2;
      renderCounter = 0;
      print("Switching to curLayer 2");
    }
  }
  else if (curLayer == 2) {
    rectMode(CORNERS);
    for(let i=0; i<100; i++) {
      let x1 = random(0, width);
      let y1 = random(0, height);
      let x2 = x1 + random(-10, 10);
      let y2 = y1 + random(-10, 10);
      colorMode(RGB);
      let pixData = sourceImg.get(x1, y1);
      let maskData = maskImg.get(x1, y1);
      let col = color(pixData);
      stroke(col);
      fill(col);
      if(maskData[1] < 128) {
        line(x1, y1, x2, y2);
      }
      else {
        rect(x1, y1, x2, y2);
      }
    }
    renderCounter = renderCounter + 1;
    if(renderCounter > 1500) {
      curLayer = 3;
      renderCounter = 0;
      print("Switching to curLayer 3");
    }
  }
  else if (curLayer == 3) {
    let totalDots = 20000;
    let dotsPerFrame = 10;
    for (let i = 0; i < dotsPerFrame; i++) {
      let x = random(width);
      let y = random(height);
      let maskData = maskImg.get(x, y);
      let d = random(2, 20);
      colorMode(RGB);
      noStroke();
      if (maskData[1] < 128) {
        fill(255, 0, 0);
      } else {
        fill(255, 192, 203);
      }
      ellipse(x, y, d, d);
      // tiny yellow square at center of each dot
      rectMode(CENTER);
      noStroke();
      fill(255, 255, 0);
      let squareSize = d * 0.3;
      rect(x, y, squareSize, squareSize);
      // restore ellipse mode if needed
      // (optional) rectMode(CORNER);
    }
    renderCounter += dotsPerFrame;
    if (renderCounter >= totalDots) {
      curLayer = 4;
      renderCounter = 0;
      print("Switching to curLayer 4");
    }
  }
  else if (curLayer == 4) {
    // Chuck Close–inspired cell grid over the masked area
    let blockSize = 20;
    rectMode(CORNER);
    colorMode(HSB, 360, 100, 100);
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        let mx = x + blockSize / 2;
        let my = y + blockSize / 2;
        let maskData = maskImg.get(mx, my);
        if (maskData[1] > 128) {
          let pix = sourceImg.get(mx, my);
          let col = color(pix);
          let h = hue(col) + random(-20, 20);
          let s = map(maskData[2], 0, 255, 60, 100);
          let b = map(brightness(col), 0, 100, 40, 90);
          fill(h, s, b);
          noStroke();
          rect(x, y, blockSize, blockSize);
          noFill();
          stroke(h, 100, 100);
          strokeWeight(1);
          rect(x, y, blockSize, blockSize);
          // draw centered inner pixel with opposite hue
          let innerSize = blockSize * 0.3;
          let offset = (blockSize - innerSize) / 2;
          let innerX = x + offset;
          let innerY = y + offset;
          let oppositeHue = (h + 180) % 360;
          noStroke();
          fill(oppositeHue, s, b);
          rect(innerX, innerY, innerSize, innerSize);
        }
      }
    }
    console.log("Done!");
    noLoop();
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
