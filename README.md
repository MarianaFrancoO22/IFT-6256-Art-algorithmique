# Art Algorithmique - Projet p5.js

Ce projet utilise la bibliothèque p5.js pour créer de l'art algorithmique.

## Structure du projet

- `index.html` - Page HTML qui charge p5.js et votre sketch
- `sketch.js` - Votre code JavaScript pour créer de l'art

## Pour commencer

1. Ouvrez `index.html` dans un navigateur web (Chrome, Firefox, Safari, etc.)
   
   **Sur macOS, utilisez une de ces méthodes :**
   - **Méthode 1 (recommandée)**: Faites glisser `index.html` dans une fenêtre de navigateur
   - **Méthode 2**: Clic droit sur `index.html` → "Ouvrir avec" → choisissez votre navigateur
   - **Méthode 3**: Utilisez un serveur local (voir ci-dessous)

2. Modifiez `sketch.js` pour créer votre art

## Utiliser un serveur local (optionnel mais recommandé)

Si vous rencontrez des problèmes avec les fichiers locaux, vous pouvez utiliser un serveur local :

### Option 1: Python
```bash
python3 -m http.server 8000
```
Puis ouvrez http://localhost:8000 dans votre navigateur

### Option 2: Node.js (si installé)
```bash
npx http-server
```

## Ressources p5.js

- Documentation: https://p5js.org/reference/
- Exemples: https://p5js.org/examples/
- Tutoriels: https://p5js.org/learn/

## Fonctions p5.js principales

- `setup()` - S'exécute une fois au démarrage
- `draw()` - S'exécute en boucle pour créer des animations
- `createCanvas(w, h)` - Crée un canvas de largeur w et hauteur h
- `background(couleur)` - Définit la couleur de fond
- `fill(couleur)` - Définit la couleur de remplissage
- `stroke(couleur)` - Définit la couleur du contour
- `ellipse(x, y, w, h)` - Dessine une ellipse
- `rect(x, y, w, h)` - Dessine un rectangle
- `line(x1, y1, x2, y2)` - Dessine une ligne
