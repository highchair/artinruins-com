// Then / Now image comparison JS
// Inspiration and code from https://htmldom.dev/create-an-image-comparison-slider/

// Query the element
const resizer = document.getElementById('js--resize');
const leftSide = document.getElementById('js--clip');

// The current position of mouse
let x = 0;
let y = 0;

// The width of modified element
let leftWidth = 0;

// Handle the mousedown event
// that's triggered when user drags the resizer
const mouseDownHandler = function(e) {
  // Get the current mouse position
  x = e.clientX;
  y = e.clientY;
  leftWidth = leftSide.getBoundingClientRect().width;

  // Attach the listeners to `document`
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function(e) {
  // How far the mouse has been moved
  const dx = e.clientX - x;
  const dy = e.clientY - y;

  let newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
  newLeftWidth = Math.max(newLeftWidth, 0);
  newLeftWidth = Math.min(newLeftWidth, 100);

  // Set the width for modified and resizer elements
  leftSide.style.width = `${newLeftWidth}%`;
  resizer.style.left = `${newLeftWidth}%`;
};

const mouseUpHandler = function(e) {
  e = e || window.event;
  e.preventDefault();
  e.stopPropagation();
  this.removeEventListener('mousemove', mouseMoveHandler);
}

document.addEventListener("DOMContentLoaded", function() {
  // Attach the handler
  resizer.addEventListener('mousedown', mouseDownHandler);
});