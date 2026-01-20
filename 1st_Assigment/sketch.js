// Art Algorithmique - Reproduction of geometric artwork

function setup() {
    // CANVAS DIMENSIONS 
    // createCanvas(width, height)
    createCanvas(800, 930);
    noLoop(); // Static drawing 
}

function draw() {
   
    background(25, 25, 112); 
    
    // OTHER COLORS 
    const cream = color(255, 204, 153);
    const beige = color(76, 153, 0); 
    const darkBrown = color(102, 102, 0); 
    const black = color(101, 67, 33); 
    const lightGray = color(204, 102, 0); 
    const BlueGray = color(255, 153, 51); 
    const paleBlue = color(204, 204, 0); 
    const white = color(255, 255, 102); 
    const terracotta = color(204, 85, 0); 
    const bronze = color(51, 36, 33); 
    const silver = color(51, 36, 33); 
    
    // ARTWORK POSITION AND SIZE 
    const panelWidth = 600; 
    const panelHeight = 730; 
    const panelX = 95; // X position from left edge
    const panelY = 100; // Y position from top edge
    
    
    // Draw frame 
    fill(silver);
    noStroke(); // No border

    // rect(x position, y position, width, height)
    rect(panelX - 5, panelY - 5, panelWidth + 10, panelHeight + 10);
    
    // Draw background 
    fill(white);
    rect(panelX, panelY, panelWidth, panelHeight);



    
    // VERTICAL SECTION WIDTHS 
    const leftStripWidth = 150; // Left vertical section width
    const rightStripWidth = 120; // Right vertical section width
    const centerWidth = panelWidth - leftStripWidth - rightStripWidth; // Center section width 
    
    // Left vertical separator
    fill(silver);
    rect(panelX + leftStripWidth, panelY, 2, panelHeight);
    
    // Right vertical separator
    fill(silver);
    rect(panelX + leftStripWidth + centerWidth, panelY, 2, panelHeight);



    
    // LEFT SECTION PANELS 
    const leftX = panelX; // X position of left section 
    
    // Randomize bands heights 
    const topHeight = random(10, 320); 
    const space1 = random(1, 40); 
    const middleHeight = random(50, 350); 
    const space2 = random(1, 40); 
    const bottomHeight = panelHeight - topHeight - space1 - middleHeight - space2; // Remaining space
    
    // Top: 
    fill(cream);
    rect(leftX, panelY, leftStripWidth, topHeight);

    // Space: 
    fill(lightGray);
    rect(leftX, panelY + topHeight, leftStripWidth, space1);
    
    // Middle: 
    fill(beige);
    rect(leftX, panelY + topHeight + space1, leftStripWidth, middleHeight);

    // Space: 
    fill(lightGray);
    rect(leftX, panelY + topHeight + space1 + middleHeight, leftStripWidth, space2);
    
    // Bottom: 
    fill(cream);    
    rect(leftX, panelY + topHeight + space1 + middleHeight + space2, leftStripWidth, bottomHeight);



    
    // RIGHT SECTION PANELS 
    const rightX = panelX + leftStripWidth + centerWidth + 2; // X position of right section 
    
    // Randomize bands heights 
    const rightTopHeight = random(10, 220); 
    const rightSpace1 = random(1, 20);
    const rightMiddleUpperHeight = random(50, 250);
    const rightSpace2 = random(1, 2);
    const rightMiddleLowerHeight = random(25, 250);
    const rightSpace3 = random(1, 20);
    const rightBottomHeight = panelHeight - rightTopHeight - rightSpace1 - rightMiddleUpperHeight - rightSpace2 - rightMiddleLowerHeight - rightSpace3;
    
    // Top: 
    fill(cream);
    rect(rightX, panelY, rightStripWidth, rightTopHeight);

    // Space: 
    fill(lightGray);
    rect(rightX, panelY + rightTopHeight, rightStripWidth, rightSpace1);
    
    // Middle upper: 
    fill(paleBlue);
    rect(rightX, panelY + rightTopHeight + rightSpace1, rightStripWidth, rightMiddleUpperHeight);
    
    // Space: 
    fill(lightGray);
    rect(rightX, panelY + rightTopHeight + rightSpace1 + rightMiddleUpperHeight, rightStripWidth, rightSpace2);

    // Middle lower: 
    fill(paleBlue);
    rect(rightX, panelY + rightTopHeight + rightSpace1 + rightMiddleUpperHeight + rightSpace2, rightStripWidth, rightMiddleLowerHeight);

    // Space: 
    fill(lightGray);
    rect(rightX, panelY + rightTopHeight + rightSpace1 + rightMiddleUpperHeight + rightSpace2 + rightMiddleLowerHeight, rightStripWidth, rightSpace3);

    // Bottom: 
    fill(cream);
    rect(rightX, panelY + rightTopHeight + rightSpace1 + rightMiddleUpperHeight + rightSpace2 + rightMiddleLowerHeight + rightSpace3, rightStripWidth, rightBottomHeight);

    


    // CENTER SECTION PANELS 
    const centerX = panelX + leftStripWidth + 2; // X position of center section
    
    // Randomize top band heights
    const topBandHeight = random(10, 110);
    const secondUpperHeight = random(10, 80);
    const secondLowerHeight = random(50, 120);
    
    // Top: 
    fill(darkBrown);
    rect(centerX, panelY, centerWidth - 2, topBandHeight);
    
    // Second upper: 
    fill(black);
    rect(centerX, panelY + topBandHeight, centerWidth - 2, secondUpperHeight);
    //stroke(0);

    // Second lower: 
    fill(black);
    rect(centerX, panelY + topBandHeight + secondUpperHeight, centerWidth - 2, secondLowerHeight);
    
    
    // Third band with circles
    const thirdBandY = panelY + topBandHeight + secondUpperHeight + secondLowerHeight;
    const thirdBandHeight = random(80, 220); 
    
    // Band on left:
    const darkBrownPanelWidth = random(10, 200);
    fill(darkBrown);
    rect(centerX, thirdBandY, darkBrownPanelWidth, thirdBandHeight);

    
    // Band with circles
    const grayPanelX = centerX + darkBrownPanelWidth;
    const grayPanelWidth = centerWidth - darkBrownPanelWidth - 2;
    fill(BlueGray);
    rect(grayPanelX, thirdBandY, grayPanelWidth, thirdBandHeight);

    
    // Circle positions and sizes
    const leftCircleX = grayPanelX + random(grayPanelWidth * 0.15, grayPanelWidth * 0.35); // Random offset from the panels left edge
    const leftCircleY = thirdBandY + random(thirdBandHeight * 0.3, thirdBandHeight * 0.7);
    const leftCircleSize = random(90, 240);
    fill(cream);
    // ellipse(x position, y position, width, height)
    ellipse(leftCircleX, leftCircleY, leftCircleSize, leftCircleSize);
    
    const rightCircleX = grayPanelX + random(grayPanelWidth * 0.65, grayPanelWidth * 0.85);
    const rightCircleY = thirdBandY + random(thirdBandHeight * 0.3, thirdBandHeight * 0.7);
    const rightCircleSize = random(50, 180);
    fill(bronze);
    ellipse(rightCircleX, rightCircleY, rightCircleSize, rightCircleSize);
    
    
    // Fourth band: 
    const fourthBandY = thirdBandY + thirdBandHeight;
    const fourthBandHeight = random(80, 120);
    fill(black);
    rect(centerX, fourthBandY, centerWidth - 2, fourthBandHeight);

    // Space: 
    const centerSpace = random(1, 20);
    fill(lightGray);
    rect(centerX, fourthBandY + fourthBandHeight, centerWidth - 2, centerSpace);
    
    // Fifth band: 
    const fifthBandHeight = random(60, 100);
    fill(darkBrown);
    rect(centerX, fourthBandY + fourthBandHeight + centerSpace, centerWidth - 2, fifthBandHeight);
    
    // Sixth band: 
    const sixthBandHeight = random(40, 60);
    fill(white);
    rect(centerX, fourthBandY + fourthBandHeight + centerSpace + fifthBandHeight, centerWidth - 2, sixthBandHeight);
    
    // Bottom band: 
    const bottomBandHeight = panelHeight - (fourthBandY - panelY) - fourthBandHeight - centerSpace - fifthBandHeight - sixthBandHeight;
    fill(terracotta);
    rect(centerX, fourthBandY + fourthBandHeight + centerSpace + fifthBandHeight + sixthBandHeight, centerWidth - 2, bottomBandHeight);
}
