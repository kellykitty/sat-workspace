const fs = require('fs');

// Read the text file
const content = fs.readFileSync('Top_Frequency_SAT_Words.txt', 'utf-8');

// Split into lines
const lines = content.split('\n');

// Parse words
const words = [];
let id = 1;

for (const line of lines) {
  // Match pattern: word...syn: synonym; definition
  const match = line.match(/^([a-z]+)\.\.\.syn:\s*([^;]+);\s*(.+)$/i);

  if (match) {
    const word = match[1].trim();
    const synonym = match[2].trim();
    const definition = match[3].trim();

    words.push({
      id: id++,
      word: word.charAt(0).toUpperCase() + word.slice(1),
      definition: definition.charAt(0).toUpperCase() + definition.slice(1),
      synonym: synonym
    });
  }
}

// Write to JSON file
fs.writeFileSync(
  'sat-vocab-app/data/words.json',
  JSON.stringify(words, null, 2)
);

console.log(`Successfully parsed ${words.length} words!`);
