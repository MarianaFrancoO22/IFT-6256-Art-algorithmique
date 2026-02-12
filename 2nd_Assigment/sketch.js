/**
 * TITLE: The Mirror of Attention — Algorithmic art using First In, First Out (FIFO)
 
 * Radial lines from the center. New bands are added at the back of the queue;
 * when the queue is full, the oldest (front) is removed.

 */


// FIFO queue class

class VisualQueue {
  constructor(maxSize) {
    this.items = [];      // List of bands: index 0 = front (oldest), last = back (newest)
    this.maxSize = maxSize; // Maximum number of bands (e.g. 60)
  }

  // Add a new band to the back of the queue.
  enqueue(item) {
    this.items.push(item);
    // if queue is full, remove from the oldest until we're not.
    while (this.items.length > this.maxSize) {
      this.items.shift();
    }
  }

  get all() {
    return this.items;
  }

  get size() {
    return this.items.length;
  }
}


// Global variables

let queue; 
let palette;  
let t; // Time value for rotation (all bands rotate together)

// How often a new band is added: frames between each new band (higher = slower)
const spawnIntervalFrames = 20; // 60 frames = 1 second

// How fast the bands rotate (lower = slower)
const rotationSpeedMultiplier = 1; // 0.01




function setup() {
  // Create the canvas and put it in the page 
  const w = windowWidth || 800;
  const h = windowHeight || 600;
  const canvas = createCanvas(w, h);
  canvas.parent('canvas-container');

  // Use HSB color mode 
  // (Hue 0–360, Saturation 0–100, Brightness 0–100, Alpha 0–100) 
  // Hue: angle on the color wheel, alpha: opacity

  colorMode(HSB, 360, 100, 100, 100);

  // Create queue (max bands)
  const bufferSize = 30;
  queue = new VisualQueue(bufferSize);

  // Initialize time 
  t = 0;

  // Color palette
  palette = [
    [200, 70, 95],  // light blue
    [280, 50, 90],  // lavender
    [340, 60, 95],  // pink
    [30, 70, 95],   // peach
    [160, 50, 90],  // mint
  ];
}





function draw() {
  // Main drawing loop, controls time, background, when to add, when to draw

  // Advance time every frame
  t += 0.01;

  // Semi-transparent background so previous bands leave a trail
  background(240, 10, 8, 25);

  if (frameCount % spawnIntervalFrames === 0) {
    addNewBand(); // Every spawnInterval frames, add one new band to the queue
  }

  // Draw bands in the queue 
  drawAllBands();
}



function addNewBand() {
  // Contains all the logic for creating a new band and enqueueing it

  // Pick a randomcolor from the palette 
  const baseHue = palette[floor(random(palette.length))][0];
  const hue = (baseHue + random(-20, 20) + frameCount * 0.5) % 360;
  const sat = 50 + random(30);
  const bright = 80 + random(20);

  // Create radial band 
  // - x, y: start of the line = center of the canvas
  // - angle: initial direction in radians (TAU = 2*PI, 0-360°)
  // - w: stroke weight (thickness of the line)
  // - len: length of the line from center
  const band = {
    x: width / 2,
    y: height / 2,
    angle: random(TAU), 
    w: 30 + random(40), 
    len: 80 + random(120), 
    hue: hue,
    sat: sat,
    bright: bright,
  };

  // Enqueue to the back
  queue.enqueue(band);
}



function drawAllBands() {

  // Walks the FIFO queue (oldest to newest),
  // computes age, opacity & scale for each band, and calls drawOneRadialBand()

  const items = queue.all; 
  const n = items.length; 

  for (let i = 0; i < n; i++) {
    const band = items[i];

    // Age in queue 
    const ageNorm = n > 1 ? i / (n - 1) : 1;

    // Older bands: more transparent and slightly shorter
    const opacity = 30 + ageNorm * 70;
    const scale = 0.5 + ageNorm * 0.5;

    // Draw this one radial band
    drawOneRadialBand(band, ageNorm, opacity, scale);
  }
}




function drawOneRadialBand(band, ageNorm, opacity, scale) {
  // Computes the angle, endpoint, stroke, and actually draws the line
  // Parameters:
  // band — band object (center x,y, angle, len, w, color hue,sat,bright)

  // Band angle = Initial random angle band.angle + same global rotation 
  const currentAngle = band.angle + (t * 0.2) * rotationSpeedMultiplier;


  // Length of the line from center outward
  const len = band.len * scale; 

  // (band.x, band.y) center, (x2, y2) endpoint 
  const x2 = band.x + cos(currentAngle) * len; 
  const y2 = band.y + sin(currentAngle) * len;

  // Stroke weight: oldest bands are half as thick, newest use full thickness
  const strokeW = band.w * (0.5 + ageNorm * 0.5);

  // Draw the line from center to endpoint with the band’s color and opacity
  stroke(band.hue, band.sat, band.bright, opacity * 0.6);
  strokeWeight(strokeW); 
  noFill(); // draw just a line
  line(band.x, band.y, x2, y2);
}



// Clear the queue (spacebar)
function keyPressed() {
  if (key === ' ') {
    queue = new VisualQueue(queue.maxSize);
    background(240, 10, 8);
  }
  return false;
}


// Resize canvas 
function windowResized() {
  const w = windowWidth || 800;
  const h = windowHeight || 600;
  resizeCanvas(w, h);
}
