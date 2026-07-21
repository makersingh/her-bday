const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace src="child1.jpg" with data-secure-id="child1.jpg"
html = html.replace(/src="(child|sort|teen|now|collage)(\d+)\.jpg"/g, 'data-secure-id="$1$2.jpg"');

fs.writeFileSync('index.html', html);
console.log('Updated index.html to use data-secure-id');
