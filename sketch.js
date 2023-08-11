let mySound1, mySound2, mySound3, mySound4;
let playing = false;
let spaceBarWasPressed = false;
let shapeGenerationPaused = true;
let lines = [];
let thicknessSlider;
let lineColor;
let eraserButton;
let autonomousMode = false;
let lastPoint = null;



function preload() {
  mySound1 = loadSound("RullyShabaraSampleL13.mp3");
  mySound2 = loadSound("RullyShabaraSampleR02.wav");
  mySound3 = loadSound("RullyShabaraSampleT05.mp3");
  mySound4 = loadSound("RullyShabaraSampleL01.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(400);
  lineColor = color(55, 55, 55);

  let colorPicker = createInput();
  colorPicker.attribute("type", "color");
  colorPicker.position(10, 10);
  colorPicker.input(function () {
    lineColor = color(colorPicker.value());
  });

  eraserButton = createButton("Eraser");
  eraserButton.position(70, 12);
  eraserButton.mousePressed(function () {
    lineColor = color(400);
  });
  
  mySound1.setVolume(0);
  mySound2.setVolume(0);
  mySound3.setVolume(0);
  mySound4.setVolume(0);

  thicknessSlider = createSlider(1, 20, 5, 1);
  thicknessSlider.position(130, 15);

  strokeWeight(thicknessSlider.value());
  
  // Styling for eraser button
eraserButton.style('background-color', '#F9FCFC');
eraserButton.style('border', '1px solid #980606');
eraserButton.style('color', '#333333');
eraserButton.style('padding', '4px 9px');
eraserButton.style('font-size', '14px');
eraserButton.style('border-radius', '15px');
eraserButton.style('cursor', 'pointer');
eraserButton.position(70, 11);

// Styling for thickness slider
thicknessSlider.style('width', '150px');
thicknessSlider.style('height', '8px');
thicknessSlider.style('background-color', '#7F0B0B');
thicknessSlider.style('border-radius', '4px');
thicknessSlider.style('outline', 'none');
thicknessSlider.style('cursor', 'pointer');
thicknessSlider.position(140, 15);
  
let autonomousButton = createButton("XHABARABOT TAKEOVER");
autonomousButton.position(310, 12);
autonomousButton.mousePressed(() => {
  autonomousMode = !autonomousMode;
  autonomousButton.html(autonomousMode ? "STOP XHABARABOT MODE" : "XHABARABOT TAKEOVER");
});


  

}

function stopSounds() {
  playing = false;
  mySound1.stop();
  mySound2.stop();
  mySound3.stop();
  mySound4.stop();
}

function startSounds() {
  playing = true;
  mySound1.loop();
  mySound2.loop();
  mySound3.loop();
  mySound4.loop();
}

function keyPressed() {
  if (keyCode === 32) {
    // space bar
    spaceBarWasPressed = true;
    shapeGenerationPaused = !shapeGenerationPaused; // toggle shapeGenerationPaused
    if (spaceBarWasPressed) {
      if (!playing) {
        startSounds();
      }
    }
  } else if (keyCode === LEFT_ARROW) {
    // left arrow key
    if (lines.length > 0) {
      lines.pop();
      background(400);
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        stroke(line.color);
        strokeWeight(line.thickness);
        line(line.x1, line.y1, line.x2, line.y2);
      }
    }
  }
}

function drawLine(x1, y1, x2, y2) {
  let distance = dist(x1, y1, x2, y2);
  let thickness = map(distance, 1, 200, 2, 8);
  strokeWeight(thicknessSlider.value());
  stroke(lineColor);
  line(x1, y1, x2, y2);
  return { x1, y1, x2, y2, thickness: thicknessSlider.value(), color: lineColor };
}
function draw() {
  if (!shapeGenerationPaused) {
    drawLine(mouseX, mouseY, pmouseX, pmouseY);
  }

  // Draw all the lines in the lines array
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    stroke(line.color);
    strokeWeight(line.thickness);
  }

if (autonomousMode) {
  let x = noise(frameCount * 0.01) * width;
  let y = noise(frameCount * 0.01 + 1000) * height;

  if (lastPoint) {
    let speed = dist(x, y, lastPoint.x, lastPoint.y);

    // Trigger sounds based on speed
    if (speed > 5) { // Adjust the threshold as needed
      mySound1.setVolume(10);
      mySound2.setVolume(10);
      mySound3.setVolume(10);
      mySound4.setVolume(20);
    } else {
      mySound1.setVolume(0);
      mySound2.setVolume(2);
      mySound3.setVolume(1);
      mySound4.setVolume(0);
    }

    beginShape();
    strokeWeight(thicknessSlider.value());
    stroke(lineColor);
    vertex(lastPoint.x, lastPoint.y);
    vertex(x, y);
    endShape();
  }

  lastPoint = { x, y };

  mySound1.rate(map(x, 0, width, 0.5, 2));
  mySound2.rate(map(y, 0, height, 0, 1));
  mySound3.rate(map(x + y, 0, width + height, 0, 1));
  mySound4.rate(map(x - y, 0, width - height, 0, 1));
} else {
  lastPoint = null; 
  mySound1.rate(map(mouseX, 0, width, 0.5, 2));
  mySound1.setVolume(mouseIsPressed ? 10 : 0);
  mySound2.rate(map(mouseX, 0, width, 0, 1));
  mySound2.setVolume(mouseIsPressed ? 10 : 2);
  mySound3.rate(map(mouseX, 0.5, width, 0, 1));
  mySound3.setVolume(mouseIsPressed ? 10 : 1);
  mySound4.rate(map(mouseX, 0.5, width, 0, 1));
  mySound4.setVolume(mouseIsPressed ? 20 : 0);
}



function mousePressed() {
  if (!shapeGenerationPaused) {
    lines.push(drawLine(pmouseX, pmouseY, mouseX, mouseY));
  }
}

function mouseReleased() {
  if (!shapeGenerationPaused) {
    lines.push(drawLine(pmouseX, pmouseY, mouseX, mouseY));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(400);
  // Draw all the lines in the lines array
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    stroke(line.color);
    strokeWeight(line.thickness);
    line(line.x1, line.y1, line.x2, line.y2);
  }
}
}
