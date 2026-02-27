/**
 * Movement — one patient per canvas, each recording as a wave at a random position. Click or SPACE = next patient.
 */

// Global variables
let movementData = null;
let patientsData = null;
let patientWords = [];
let bySubject = [];
let subjectIndex = 0;
const CH_AX = 1;
const CH_AY = 2;
const CH_AZ = 3;
const CH_GX = 4;
const CH_GY = 5;
const CH_GZ = 6;
const BG_FONTS = ['Georgia', 'Palatino', 'Times New Roman', 'Arial', 'Helvetica', 'Verdana', 'Courier New', 'serif', 'sans-serif'];
const DEFAULT_CONDITION = 'Other Movement Disorders';

const CONDITION_STYLES = {
  "Parkinson's": {
    bgStops: ['#3a2a58', '#2f2248', '#241a3d'], // purple range
    bokehCount: 50,
    ampScale: 0.7,
    motionSpeed: 2.2,
    wiggleScale: 0.12,
    dotProb: 0.7,
    glowProb: 0.5,
    rungProb: 0.65,
    accelHues: [5, 18, 30, 345, 355, 22, 40],
    gyroHueShift: 26,
  },
  'Other Movement Disorders': {
    bgStops: ['#264f70', '#1e3f5f', '#18324b'], // blue range
    bokehCount: 40,
    ampScale: 0.5,
    motionSpeed: 1.6,
    wiggleScale: 0.09,
    dotProb: 0.5,
    glowProb: 0.3,
    rungProb: 0.5,
    accelHues: [25, 35, 0, 45, 15, 330, 280],
    gyroHueShift: 28,
  },
  Healthy: {
    bgStops: ['#235544', '#1b4637', '#14372b'], // green range
    bokehCount: 28,
    ampScale: 0.3,
    motionSpeed: 1.1,
    wiggleScale: 0.05,
    dotProb: 0.2,
    glowProb: 0.18,
    rungProb: 0.2,
    accelHues: [160, 145, 175, 130, 190, 120, 205],
    gyroHueShift: 20,
  },
};

function getCurrentSubjectId() {
  if (!bySubject.length || !bySubject[subjectIndex] || !bySubject[subjectIndex].length) return null;
  return bySubject[subjectIndex][0].subjectId || null;
}

function normalizeCondition(raw) {
  if (!raw) return DEFAULT_CONDITION;
  if (raw === "Parkinson's") return "Parkinson's";
  if (raw === 'Other Movement Disorders') return 'Other Movement Disorders';
  if (raw === 'Healthy') return 'Healthy';
  // Any extra labels are grouped as OMD for styling consistency.
  return DEFAULT_CONDITION;
}

function getConditionStyle() {
  const id = getCurrentSubjectId();
  const patient = (id && patientsData) ? patientsData[id] : null;
  const condition = normalizeCondition(patient ? patient.condition : null);
  return { condition, ...(CONDITION_STYLES[condition] || CONDITION_STYLES[DEFAULT_CONDITION]) };
}

function seeded(seed) {
  const x = sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - floor(x);
}


function preload() { //load the data before the sketch starts
  movementData = loadJSON('data/movement.json');
  patientsData = loadJSON('data/patients.json');
}

function setup() { //set up the canvas and the data
  // Canvas: full window, 60 FPS, HSB color mode (Hue 0–360, Saturation/Brightness/Alpha 0–100)
  createCanvas(max(100, windowWidth), max(100, windowHeight));
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(60);

  // Build bySubject:
  // Loop over movementData.recordings.
  // Group by rec.subjectId.
  // bySubject[i] = array of all recordings for subject i.
  if (movementData && movementData.recordings) {
    const map = {};
    movementData.recordings.forEach(rec => {
      const id = rec.subjectId;
      if (!map[id]) map[id] = [];
      map[id].push(rec);
    });
    bySubject = Object.keys(map).sort().map(id => map[id]);
  }

  // Build patientWords:
  // Loop over patientsData.
  // For each patient, add their age, height, weight, gender, and condition to patientWords.
  // patientWords = array of all patient words.
  if (patientsData && typeof patientsData === 'object') {
    patientWords = [];
    const labels = ['age', 'height', 'weight', 'gender', 'condition'];
    for (const id of Object.keys(patientsData)) {
      const p = patientsData[id];
      if (!p) continue;
      for (const key of labels) {
        if (p[key] !== undefined && p[key] !== null) {
          patientWords.push(String(p[key]));
          patientWords.push(key);
        }
      }
    }
    patientWords = [...new Set(patientWords)].filter(w => w.length > 0);
  }
}

function drawGradientBackground(style) { // linear gradient from top-left to bottom-right with 3 colors
  const g = drawingContext.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, style.bgStops[0]);
  g.addColorStop(0.5, style.bgStops[1]);
  g.addColorStop(1, style.bgStops[2]);
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, width, height);
}

function drawBokeh(style) { //draw out-of-focus blur in background (small white circles).
  const n = style.bokehCount;
  const seed = subjectIndex * 113;
  noStroke();
  push();
  colorMode(RGB, 255, 255, 255, 100); // switch to RGB for white
  for (let i = 0; i < n; i++) {
    const x = (seeded(seed + i * 5) * width);
    const y = (seeded(seed + i * 7 + 1) * height);
    const r = 1.5 + seeded(seed + i * 11) * 3;
    fill(255, 255, 255, 4 + seeded(seed + i * 13) * 8); //white with random opacity
    ellipse(x, y, r * 2, r * 2); //random position with the random radius
  }
  pop();
  colorMode(HSB, 360, 100, 100, 100); // switch back to HSB
}

function draw() { 
  /*
  Draw the sketch with movement recordings + patient info in background.
  - Draw a gradient background.
  - Draw a bokeh effect.
  - Draw patient info in background.
  - Draw the movement recordings.
  - Draw the highlight on top of one random signal.
  - Draw the title.
  */

  if (!movementData || !bySubject.length) {
    background(0, 0, 98); //if there are no subjects, draw light background and stop
    return;
  }

  const recordings = bySubject[subjectIndex]; //get the recordings for the current subject
  const time = millis() * 0.001;
  const style = getConditionStyle();

  drawGradientBackground(style); //draw a gradient background 
  drawBokeh(style); //draw a bokeh effect 

  if (width !== windowWidth || height !== windowHeight) {
    resizeCanvas(max(100, windowWidth), max(100, windowHeight)); //resize the canvas if the window size changes
  }

  drawBackgroundWords(); // draw patient info in background

  // for the current subject, compute the canvas layout:
  const margin = 80;
  const W = width - 1.5 * margin;
  const H = height - 1.5 * margin;
  const cy = margin + H / 2;
  const amp = H * style.ampScale;
  noStroke();

  // Randomly pick one signal to highlight
  const period = floor(time / 5); //change every 5 seconds
  const highlightSeed = subjectIndex * 31 + period;
  const highlightedIdx = recordings.length > 0
    ? floor(seeded(highlightSeed) * recordings.length) % recordings.length
    : -1;

  // Draw all waves for the current subject
  for (let idx = 0; idx < recordings.length; idx++) {
    const showDots = seeded(subjectIndex * 13 + idx) < style.dotProb; //show dots on the wave if the random number is less than the condition threshold
    drawWave(recordings[idx], margin, cy, W, amp, idx, time, showDots, style);
  }

  // Faded highlight on top of one random signal (thick pale stroke, width varies)
  if (highlightedIdx >= 0) {
    let drawn = false;
    for (let k = 0; k < recordings.length && !drawn; k++) {
      const idx = (highlightedIdx + k) % recordings.length;
      if (getWavePointsAndHue(recordings[idx], margin, cy, W, amp, idx, time, 'accel', style)) {
        drawWaveHalo(recordings[idx], margin, cy, W, amp, idx, time, style);
        drawn = true;
      }
    }
  }

  // Title
  textAlign(CENTER, TOP);
  textSize(min(28, width * 0.04));
  fill(0, 0, 92, 95);
  noStroke();
  text('The Beauty of Instability', width / 2, 24);
}

function drawBackgroundWords() { // patient-derived words, random position/font/size/angle, low opacity.
  if (!patientWords.length) return;
  const nWords = min(28, max(12, floor(width * 0.03))); //number of words to draw - between 12 and 28
  const seedBase = subjectIndex * 97;
  noStroke();
  textAlign(LEFT, BASELINE);
  for (let i = 0; i < nWords; i++) {
    // Word: random from patientWords (seeded)
    // Position: random x, y with margins (seeded)
    // Font: random from BG_FONTS
    // Size: random between 14 and ~38 px
    // Angle: small random rotation
    // Opacity: low
    const word = patientWords[floor(seeded(seedBase + i * 7) * patientWords.length) % patientWords.length];
    const x = (seeded(seedBase + i * 11 + 1) * (width - 120)) + 40;
    const y = (seeded(seedBase + i * 13 + 2) * (height - 80)) + 60;
    const fontIdx = floor(seeded(seedBase + i * 17) * BG_FONTS.length) % BG_FONTS.length;
    const fontSize = 14 + floor(seeded(seedBase + i * 19) * 24);
    const angle = (seeded(seedBase + i * 23) - 0.5) * 0.8;
    const alpha = 8 + floor(seeded(seedBase + i * 29) * 14);
    push();
    // Draws with translate + rotate + text so the words sit subtly behind the signals
    translate(x, y);
    rotate(angle);
    textFont(BG_FONTS[fontIdx]);
    textSize(fontSize);
    fill(0, 0, 72, alpha);
    text(word, 0, 0);
    pop();
  }
}

function smoothValues(arr, windowSize) { //smooth raw signal so the wave is less noisy
  const out = [];
  const half = floor(windowSize / 2);
  // Loop over the array and smooth the values using a moving average
  for (let i = 0; i < arr.length; i++) { 
    let sum = 0, count = 0;
    for (let k = -half; k <= half; k++) {
      const j = i + k;
      if (j >= 0 && j < arr.length) { sum += arr[j]; count++; }
    }
    out.push(sum / count); 
  }
  return out;
}

function getWavePointsAndHue(rec, x0, baseY, waveW, amp, recIdx, time, signalKind = 'accel', style = CONDITION_STYLES[DEFAULT_CONDITION]) { //calculate the x and y coordinates of the wave and the color of the wave
  const data = rec.data;
  if (!data || data.length < 2) return null;

  const nPoints = data.length;
  const phase = time * style.motionSpeed + recIdx * 0.8; // each wave moves and is offset from the others

  let raw = [];
  // Build one scalar per sample, but keep modalities separated:
  // - accel: magnitude of (ax, ay, az) in g
  // - gyro: magnitude of (gx, gy, gz) in rad/s
  for (let i = 0; i < nPoints; i++) {
    const row = data[i] || [];
    const ax = Number(row[CH_AX]) || 0;
    const ay = Number(row[CH_AY]) || 0;
    const az = Number(row[CH_AZ]) || 0;
    const gx = Number(row[CH_GX]) || 0;
    const gy = Number(row[CH_GY]) || 0;
    const gz = Number(row[CH_GZ]) || 0;
    const accelMag = sqrt(ax * ax + ay * ay + az * az);
    const gyroMag = sqrt(gx * gx + gy * gy + gz * gz);
    const v = signalKind === 'gyro' ? gyroMag : accelMag;
    raw.push(v);
  }
  const smoothed = smoothValues(raw, 40); // smooth the data to reduce noise
  let minV = Infinity, maxV = -Infinity; //find the minimum and maximum values in the smoothed data
  smoothed.forEach(v => { if (v < minV) minV = v; if (v > maxV) maxV = v; });
  const range = maxV - minV || 1; // normalize the data to the range 0-1


  const hues = style.accelHues; // colors for the waves
  const hue = hues[recIdx % hues.length]; // each wave has a different color

  const points = [];
  for (let i = 0; i < nPoints; i++) { //loop over the data and calculate the x and y coordinates of the wave
    const yWave = (smoothed[i] - minV) / range; //normalize the data to the range 0-1
    const move = style.wiggleScale * sin(phase + i * 0.015) * amp; //move the wave up and down (sinusoidal movement)
    const x = x0 + (i / (nPoints - 1)) * waveW; // map time to x-axis (time goes from 0 to right edge of the canvas)
    const y = baseY - amp * (yWave - 0.5) + move; // map the normalized data to the y-axis (height of the canvas)
    points.push({ x, y });
  }
  return { points, hue }; 
}

function drawWaveHalo(rec, x0, baseY, waveW, amp, recIdx, time, style) { // draws the pale highlight around selected signal
  const result = getWavePointsAndHue(rec, x0, baseY, waveW, amp, recIdx, time, 'accel', style);
  if (!result) return;
  const { points, hue } = result;
  const n = points.length;
  if (n < 2) return;

  // Faded highlight: subtle pale band (not dominant)
  noFill();
  strokeCap(ROUND);
  strokeJoin(ROUND);
  const haloScale = style.condition === "Parkinson's" ? 1.1 : (style.condition === 'Healthy' ? 0.8 : 1.0);
  const baseWidth = (10 + 6 * sin(time * 1.5)) * haloScale; //width of the highlight
  const layers = 3; //number of layers of the highlight
  for (let L = layers; L >= 1; L--) { 
    // each layer draws the same path with increasing stroke width and a bit more opacity
    const w = (L / layers) * baseWidth;
    const alpha = 12 + 6 * (L / layers);
    stroke(hue, 10, 98, alpha);
    strokeWeight(w);
    beginShape();
    if (n >= 4) {
      // Draw a smooth curve through the points
      curveVertex(points[0].x, points[0].y);
      curveVertex(points[0].x, points[0].y);
      for (let i = 1; i < n - 1; i++) curveVertex(points[i].x, points[i].y);
      curveVertex(points[n - 1].x, points[n - 1].y);
      curveVertex(points[n - 1].x, points[n - 1].y);
    } else {
      for (let i = 0; i < n; i++) vertex(points[i].x, points[i].y);
    }
    endShape();
  }
  noStroke();
}

function drawWave(rec, x0, baseY, waveW, amp, recIdx, time, showDots, style) { // Draw each recording as a wave, optionally with glow, rungs, and dots
  /**
  Draw each recording as a wave, optionally with glow, rungs, and dots. Order of drawing (back to front)
  - Glow (if any): 3 thick, transparent strokes of the same path.
  - Rungs (if any): perpendicular segments along the path.
  - Main line: one solid, smooth curve.
  - Dots (if any): colored circles + highlight on top.
  */
  
  // Keep modalities separated: one curve for accel magnitude, one for gyro magnitude
  const accelResult = getWavePointsAndHue(rec, x0, baseY, waveW, amp, recIdx, time, 'accel', style);
  const gyroResult = getWavePointsAndHue(rec, x0, baseY, waveW, amp, recIdx, time, 'gyro', style);
  if (!accelResult || !gyroResult) return;
  const { points, hue } = accelResult;
  const gyroPoints = gyroResult.points;
  const nPoints = points.length;

  noFill(); //no fill for the wave
  strokeCap(ROUND); //round the ends 
  strokeJoin(ROUND); //round the corners

  // Calculate the start and end colors of the wave
  const hueStart = max(0, hue - 12); 
  const hueEnd = min(360, hue + 15);
  const midHue = (hueStart + hueEnd) / 2;

  // show the glow behind the wave (randomly)
  const showGlow = seeded(subjectIndex * 37 + recIdx) < style.glowProb; 
  if (showGlow) { 
    // If true: draw the same curve 3 times (back, middle, front) with increasing stroke weight and lower opacity 
    // Each layer is a bit more transparent and thicker than the last (like faded)
    for (let g = 3; g >= 1; g--) {
      stroke(hue, 50, 100, 4 * g);
      strokeWeight(8 + 6 * g);
      beginShape();
      if (points.length >= 4) { //draw a smooth curve through the points
        curveVertex(points[0].x, points[0].y);
        curveVertex(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) curveVertex(points[i].x, points[i].y);
        curveVertex(points[points.length - 1].x, points[points.length - 1].y);
        curveVertex(points[points.length - 1].x, points[points.length - 1].y);
      } else {
        for (let i = 0; i < points.length; i++) vertex(points[i].x, points[i].y);
      }
      endShape();
    }
  }

  // show the vertical lines (“rungs”) across the wave (helix look)
  const showRungs = seeded(subjectIndex * 41 + recIdx) < style.rungProb; 
  if (showRungs && nPoints >= 3) {
    // If true: at a subset of points along the path, compute the tangent (direction to next point), then the perpendicular (-dy, dx) normalized
    const rungStep = max(1, floor(nPoints / 36)); //step size for the rungs
    const rungLen = 12 + seeded(subjectIndex * 43 + recIdx) * 22;
    stroke(midHue, 70, 95, 52);
    strokeWeight(1.6);
    for (let i = rungStep; i < nPoints - rungStep; i += rungStep) {
      const p = points[i];
      // Tangent: from prev = points[i-1] to next = points[i+1] → vector (dx, dy)
      const prev = points[max(0, i - 1)];
      const next = points[min(nPoints - 1, i + 1)];
      const dx = next.x - prev.x; 
      const dy = next.y - prev.y; 
      const len = sqrt(dx * dx + dy * dy) || 1; //length of the rung
      // Perpendicular (unit): (nx, ny) = (-dy/len, dx/len). 
      // So the rung is perpendicular to the local direction of the wave.
      const nx = -dy / len; 
      const ny = dx / len; 
      const half = rungLen * 0.5;
      // Draw the rung as a line perpendicular to the tangent at the current point
      line(p.x - nx * half, p.y - ny * half, p.x + nx * half, p.y + ny * half); 
    }
    noStroke();
  }

  // Main wave
  stroke(midHue, 85, 100, 88);
  strokeWeight(2.8);
  beginShape();
  if (points.length >= 4) { //draw a smooth curve over the points (same as the glow)
    curveVertex(points[0].x, points[0].y);
    curveVertex(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) curveVertex(points[i].x, points[i].y);
    curveVertex(points[points.length - 1].x, points[points.length - 1].y);
    curveVertex(points[points.length - 1].x, points[points.length - 1].y);
  } else {
    for (let i = 0; i < points.length; i++) vertex(points[i].x, points[i].y);
  }
  endShape();
  noStroke();

  // Secondary curve for gyroscope magnitude (kept separate from accel)
  const gyroHue = (midHue + style.gyroHueShift) % 360;
  stroke(gyroHue, 70, 95, 70);
  strokeWeight(1.6);
  noFill();
  beginShape();
  if (gyroPoints.length >= 4) {
    curveVertex(gyroPoints[0].x, gyroPoints[0].y);
    curveVertex(gyroPoints[0].x, gyroPoints[0].y);
    for (let i = 1; i < gyroPoints.length - 1; i++) curveVertex(gyroPoints[i].x, gyroPoints[i].y);
    curveVertex(gyroPoints[gyroPoints.length - 1].x, gyroPoints[gyroPoints.length - 1].y);
    curveVertex(gyroPoints[gyroPoints.length - 1].x, gyroPoints[gyroPoints.length - 1].y);
  } else {
    for (let i = 0; i < gyroPoints.length; i++) vertex(gyroPoints[i].x, gyroPoints[i].y);
  }
  endShape();
  noStroke();

  // show dots over the wave (randomly)
  if (showDots) {
    const step = max(1, floor(nPoints / 55)); //step size for the dots
    for (let i = 0; i < points.length; i += step) {
      const p = points[i];
      const t = i / nPoints;
      const dotHue = hueStart + (hueEnd - hueStart) * t; //dot color varies from start to end of the wave
      const brightness = 92 + t * 8; 

      drawingContext.shadowBlur = 22; 
      drawingContext.shadowColor = `hsla(${dotHue}, 70%, 85%, 0.7)`; 
      fill(dotHue, 70, brightness, 98);
      ellipse(p.x, p.y, 10, 10); //draw the dot

      noStroke();
      fill(0, 0, 100, 55);
      ellipse(p.x - 2, p.y - 2, 3.5, 3.5); //draw inner dot (for glow effect)
      drawingContext.shadowBlur = 0;
    }
  }
}

function windowResized() { // resize the canvas if the window size changes
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() { // click or SPACE/Right arrow = next patient.
  if (bySubject.length > 1) {
    subjectIndex = (subjectIndex + 1) % bySubject.length;
  }
}

function keyPressed() { // click or SPACE/Right arrow = next patient.
  if (bySubject.length > 1 && (key === ' ' || key === 'ArrowRight' || keyCode === 32)) {
    subjectIndex = (subjectIndex + 1) % bySubject.length;
  }
}
