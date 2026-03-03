const fs = require('fs');
const content = fs.readFileSync('dist/violet-pool-card.js', 'utf8');
console.log("Found '@customElement' in dist?", content.includes("@customElement"));
console.log("Found 'customElements.define' in dist?", content.includes("customElements.define"));
console.log("Found 'violet-pool-card' in dist?", content.includes("violet-pool-card"));
