// Art Algorithmique - p5.js Sketch
// Votre code artistique commence ici

function setup() {
    // Créer un canvas de 800x600 pixels
    createCanvas(800, 600);
    background(220);
}

function draw() {
    // Votre code d'animation/dessin ici
    // Cette fonction s'exécute en boucle (environ 60 fois par seconde)
    
    // Exemple simple: un cercle qui suit la souris
    fill(100, 150, 255);
    noStroke();
    ellipse(mouseX, mouseY, 50, 50);
}
