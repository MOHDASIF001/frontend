const fs = require('fs');
const html = fs.readFileSync('current_flights_check.html', 'utf16le');

const startIdx = html.indexOf('HERO BANNER');
if (startIdx === -1) {
  // Try searching for the class names
  const classIdx = html.indexOf('from-[#1a1a2e]');
  if (classIdx === -1) {
    console.log('Could not find hero classes');
  } else {
    console.log('Found hero classes at index:', classIdx);
    console.log(html.substring(classIdx - 100, classIdx + 500));
  }
} else {
  console.log('Found HERO BANNER comment at index:', startIdx);
  console.log(html.substring(startIdx, startIdx + 1000));
}
