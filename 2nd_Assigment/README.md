# The Mirror of Attention — FIFO Algorithmic Art

A p5.js sketch that uses the **First In, First Out (FIFO)** principle to generate radial, time-based visual art.

## Concept

- A **queue** holds a fixed number of radial bands (lines emanating from the center).
- **New bands enter at the back** of the queue (`enqueue`).
- When the queue is **full**, the **oldest band (front)** is removed — first in, first out.
- What you see is the **current FIFO buffer**: oldest to newest, drawn as rotating radial strokes.

**Age in the queue** is mapped to appearance:

- **Oldest** (first in): more transparent, shorter, thinner.
- **Newest** (last in): more opaque, longer, thicker.

So the FIFO algorithm directly controls what appears, how each band ages visually, and what disappears.

## How it works

- **Radial bands**: Each band is a line from the center of the canvas outward, with a random initial angle, length (80–200 px), and stroke weight (30–70 px).
- **Colors**: Drawn from an HSB palette (light blue, lavender, pink, peach, mint) with small random variation and a slow hue shift over time.
- **Rotation**: All bands rotate together around the center; their angle is `initialAngle + time`, giving a unified “mirror of attention” motion.

## Controls

- **Spacebar** — Clear the queue and start over.

## Parameters (in `sketch.js`)


- `bufferSize`:  Maximum number of bands in the queue 
- `spawnIntervalFrames`: Frames between adding a new band (higher = slower) 
- `rotationSpeedMultiplier`: Speed of rotation (lower = slower) 

## How to run

1. Ensure `index.html` references `sketch.js` and loads p5.js (e.g. from CDN).
2. Open `index.html` in a browser (the canvas is placed in an element with id `canvas-container`).
3. The canvas resizes with the window.


