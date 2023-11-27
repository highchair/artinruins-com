// Let's use the 'active' variable to let us know when we're using it
let active = false;

// First, set up event listeners for mouse and touch events
document.querySelector('.thennow__resize').addEventListener('mousedown', function() {
  active = true;
});

document.querySelector('.thennow__resize').addEventListener('touchstart', function(e) {
  e.preventDefault(); // Prevent default behavior to avoid unexpected interactions
  active = true;
});

// Set up event listeners on the body for mouse and touch events
document.body.addEventListener('mouseup', function() {
  active = false;
});

document.body.addEventListener('mouseleave', function() {
  active = false;
});

document.body.addEventListener('touchend', function() {
  active = false;
});

document.body.addEventListener('touchcancel', function() {
  active = false;
});

// Function to handle the start of dragging
function handleDragStart(x) {
  x -= document.querySelector('.thennow').getBoundingClientRect().left;
  scrollIt(x);
}

// Function to handle dragging movement
function handleDragMove(x) {
  x -= document.querySelector('.thennow').getBoundingClientRect().left;
  scrollIt(x);
}

// Let's figure out where their mouse is at
document.body.addEventListener('mousemove', function(e) {
  if (!active) return;
  // Their mouse is here...
  let x = e.pageX;
  // but we want it relative to our wrapper
  handleDragMove(x);
});

document.body.addEventListener('touchmove', function(e) {
  if (!active) return;
  let x = e.touches[0].clientX;
  x -= document.querySelector('.thennow').getBoundingClientRect().left;
  handleDragMove(x);
});

// Let's use this function
function scrollIt(x) {
  let transform = Math.max(0, Math.min(x, document.querySelector('.juxtapose__wrap').offsetWidth));
  document.querySelector('.thennow__clip').style.width = transform + 'px';
  document.querySelector('.thennow__resize').style.left = transform + 'px';
}
