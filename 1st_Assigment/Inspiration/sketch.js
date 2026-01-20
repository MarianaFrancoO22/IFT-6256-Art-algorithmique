// Art Algorithmique - Reproduction of geometric artwork

function setup() {
    // CANVAS DIMENSIONS 
    // Width: horizontal size of the canvas in pixels (1000)
    // Height: vertical size of the canvas in pixels (1200)
    createCanvas(1000, 1200);
    noLoop(); // Without animation, static drawing
}

function draw() {
    // BACKGROUND COLOR 
    // Format: background(red, green, blue)
    background(25, 25, 112); // Royal blue color
    
    // OTHER COLOR DEFINITIONS  
    const cream = color(250, 245, 235); // Cream color for panels
    const beige = color(210, 180, 140); // Beige color for middle left panel
    const darkBrown = color(101, 67, 33); // Dark brown for horizontal bands
    const black = color(20, 20, 20); // Black for horizontal bands
    const lightGray = color(200, 200, 210); // Light gray for space between panels
    const BlueGray = color(200, 210, 230); // Blue gray for center panel with circles
    const paleBlue = color(200, 220, 240); // Pale blue for right middle panel
    const white = color(255, 255, 255); // White for one horizontal band
    const terracotta = color(204, 85, 0); // Red/orange for bottom band
    const bronze = color(51, 36, 33); // Bronze color for right circle
    const silver = color(192, 192, 192); // Silver for border and dividers
    
    // MAIN PANEL POSITION AND SIZE - dimensions of the entire artwork
    const panelWidth = 600; // Width of the main panel 
    const panelHeight = 730; // Height of the main panel 
    const panelX = 200; // X position of the main panel from left edge
    const panelY = 100; // Y position of the main panel from top edge
    
    
    // Draw the silver frame
    fill(silver);
    noStroke();
    rect(panelX - 5, panelY - 5, panelWidth + 10, panelHeight + 10);
    
    // Draw a white background 
    fill(255);
    rect(panelX, panelY, panelWidth, panelHeight);
    
    // VERTICAL SECTION WIDTHS 
    const leftStripWidth = 120; // Left vertical section width
    const rightStripWidth = 120; // Right vertical section width
    const centerWidth = panelWidth - leftStripWidth - rightStripWidth; // Center section width 
    
    // Left vertical line
    fill(silver);
    rect(panelX + leftStripWidth, panelY, 2, panelHeight);
    
    // Right vertical line
    fill(silver);
    rect(panelX + leftStripWidth + centerWidth, panelY, 2, panelHeight);



    
    // LEFT SECTION PANELS 
    const leftX = panelX; // X position of left section (same as main panel)
    
    // Top: cream rectangle
    fill(cream);
    rect(leftX, panelY, leftStripWidth, 179); // Height: 179 pixels

    // Space: light gray rectangle
    fill(lightGray);
    rect(leftX, panelY + 179, leftStripWidth, 2); // Height: 2 pixels, starts at Y + 179
    
    // Middle: medium beige rectangle
    fill(beige);
    rect(leftX, panelY + 181, leftStripWidth, 200); // Height: 200 pixels, starts at Y + 181

    // Space: light gray rectangle
    fill(lightGray);
    rect(leftX, panelY + 379, leftStripWidth, 2); // Height: 2 pixels, starts at Y + 381
    
    // Bottom: cream rectangle
    fill(cream);    
    rect(leftX, panelY + 381, leftStripWidth, 350); // Height: 350 pixels, starts at Y + 381



    
    // RIGHT SECTION PANELS 
    const rightX = panelX + leftStripWidth + centerWidth + 2; // X position of right section 
    
    // Top: cream rectangle
    fill(cream);
    rect(rightX, panelY, rightStripWidth, 80); // Height: 80 pixels

    // Space: light gray rectangle
    fill(lightGray);
    rect(rightX, panelY + 80, rightStripWidth, 2); // Height: 2 pixels, starts at Y + 80
    
    // Middle upper: light blue rectangle
    fill(paleBlue);
    rect(rightX, panelY + 82, rightStripWidth, 200); // Height: 220 pixels, starts at Y + 82
    
    // Space: light gray rectangle
    fill(lightGray);
    rect(rightX, panelY + 282, rightStripWidth, 2); // Height: 2 pixels, starts at Y + 282

    // Middle lower: light blue rectangle
    fill(paleBlue);
    rect(rightX, panelY + 284, rightStripWidth, 197); // Height: 197 pixels, starts at Y + 284

    // Space: light gray rectangle
    fill(lightGray);
    rect(rightX, panelY + 481, rightStripWidth, 2); // Height: 2 pixels, starts at Y + 482

    // Bottom: cream rectangle
    fill(cream);
    rect(rightX, panelY + 484, rightStripWidth, 247); // Height: 247 pixels, starts at Y + 484

    


    // CENTER SECTION PANELS 
    const centerX = panelX + leftStripWidth + 2; // X position of center section
    
    // Top: dark brown rectangle
    fill(darkBrown);
    rect(centerX, panelY, centerWidth - 2, 30); // Height: 30 pixels
    
    // Second upper: black rectangle
    fill(black);
    rect(centerX, panelY + 30, centerWidth - 2, 50); // Height: 50 pixels, starts at Y + 30

    // Second lower: black rectangle
    fill(black);
    rect(centerX, panelY + 81, centerWidth - 2, 100); // Height: 100 pixels, starts at Y + 81
    
    // Third band with circles
    const thirdBandY = panelY + 181; // Y position where third band starts
    const thirdBandHeight = 200; // Height of the third band 
    
    // Dark brown panel on left
    fill(darkBrown);
    rect(centerX, thirdBandY, 80, thirdBandHeight); // Width: 80 pixels (dark brown panel on left)
    
    // Light gray panel with circles
    const grayPanelX = centerX + 80;  // X position of gray panel (after dark brown panel)
    const grayPanelWidth = centerWidth - 80 - 2;  // Width of gray panel 
    fill(BlueGray);
    rect(grayPanelX, thirdBandY, grayPanelWidth, thirdBandHeight);
    
    // Cream left circle
    fill(cream);
    noStroke();
    const leftCircleX = grayPanelX + grayPanelWidth * 0.25; // X position: 25% further from left of gray panel
    const leftCircleY = thirdBandY + thirdBandHeight / 2; // Y position: center of third band
    const leftCircleSize = 120; // Diameter
    ellipse(leftCircleX, leftCircleY, leftCircleSize, leftCircleSize);
    
    // Bronze right circle
    fill(bronze);
    noStroke();
    const rightCircleX = grayPanelX + grayPanelWidth * 0.75; // X position: 75% further from left of gray panel
    const rightCircleY = thirdBandY + thirdBandHeight / 2; // Y position: center of third band
    const rightCircleSize = 120; // Diameter
    ellipse(rightCircleX, rightCircleY, rightCircleSize, rightCircleSize);
    
    
    // Fourth band: black rectangle
    const fourthBandY = thirdBandY + thirdBandHeight; // Y position where fourth band starts
    fill(black);
    rect(centerX, fourthBandY, centerWidth - 2, 100); // Height: 100 pixels, starts at fourthBandY

    // Space: light gray rectangle
    fill(lightGray);
    rect(centerX, fourthBandY + 100, centerWidth - 2, 2); // Height: 2 pixels, starts at fourthBandY + 100
    
    // Fifth band: dark brown rectangle
    fill(darkBrown);
    rect(centerX, fourthBandY + 102, centerWidth - 2, 80); // Height: 80 pixels, starts at fourthBandY + 102
    
    // Sixth band: white rectangle
    fill(white);
    rect(centerX, fourthBandY + 182, centerWidth - 2, 50); // Height: 50 pixels, starts at fourthBandY + 182
    
    // Bottom band: terracotta rectangle
    fill(terracotta);
    rect(centerX, fourthBandY + 232, centerWidth - 2, 118); // Height: 120 pixels, starts at fourthBandY + 232
}
