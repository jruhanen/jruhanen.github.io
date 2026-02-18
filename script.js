// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  document.getElementById('clock').textContent = `${h12}:${m} ${ampm}`;
}
updateClock();
setInterval(updateClock, 10000);

// ===== START MENU =====
function toggleStart() {
  document.getElementById('start-menu').classList.toggle('hidden');
}

// Close start menu when clicking elsewhere
document.addEventListener('click', function(e) {
  const menu = document.getElementById('start-menu');
  const btn = document.querySelector('.start-btn');
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// ===== WINDOWS =====
function openWindow(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeWindow(id) {
  document.getElementById(id).classList.add('hidden');
}

// ===== DRAGGING =====
let dragEl = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function startDrag(e, windowId) {
  // Don't start drag if clicking a button (e.g. the X or fullscreen button)
  if (e.target.tagName === 'BUTTON') return;
  dragEl = document.getElementById(windowId);
  // Remove the centering transform on first drag
  dragEl.style.transform = 'none';
  // Disable iframe pointer events during drag so mouse isn't captured
  var iframe = dragEl.querySelector('iframe');
  if (iframe) iframe.style.pointerEvents = 'none';
  const rect = dragEl.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  dragEl.style.left = rect.left + 'px';
  dragEl.style.top = rect.top + 'px';
}

document.addEventListener('mousemove', function(e) {
  if (!dragEl) return;
  dragEl.style.left = (e.clientX - dragOffsetX) + 'px';
  dragEl.style.top = (e.clientY - dragOffsetY) + 'px';
});

document.addEventListener('mouseup', function() {
  if (dragEl) {
    var iframe = dragEl.querySelector('iframe');
    if (iframe) iframe.style.pointerEvents = '';
  }
  dragEl = null;
});

// ===== RESIZING =====
var resizeEl = null;
var resizeDir = '';
var resizeStartX = 0;
var resizeStartY = 0;
var resizeStartRect = null;

document.addEventListener('mousedown', function(e) {
  var handle = e.target.closest('.resize-handle');
  if (!handle) return;
  e.preventDefault();
  resizeEl = handle.closest('.app-window');
  resizeDir = handle.dataset.dir;
  resizeStartX = e.clientX;
  resizeStartY = e.clientY;
  resizeStartRect = resizeEl.getBoundingClientRect();
  var iframe = resizeEl.querySelector('iframe');
  if (iframe) iframe.style.pointerEvents = 'none';
});

document.addEventListener('mousemove', function(e) {
  if (!resizeEl) return;
  var dx = e.clientX - resizeStartX;
  var dy = e.clientY - resizeStartY;
  var r = resizeStartRect;
  var minW = 400;
  var minH = 300;

  var newTop = r.top;
  var newLeft = r.left;
  var newW = r.width;
  var newH = r.height;

  if (resizeDir.includes('r')) newW = Math.max(minW, r.width + dx);
  if (resizeDir.includes('b')) newH = Math.max(minH, r.height + dy);
  if (resizeDir.includes('l')) {
    newW = Math.max(minW, r.width - dx);
    if (newW > minW) newLeft = r.left + dx;
  }
  if (resizeDir.includes('t')) {
    newH = Math.max(minH, r.height - dy);
    if (newH > minH) newTop = r.top + dy;
  }

  resizeEl.style.left = newLeft + 'px';
  resizeEl.style.top = newTop + 'px';
  resizeEl.style.width = newW + 'px';
  resizeEl.style.height = newH + 'px';
});

document.addEventListener('mouseup', function() {
  if (resizeEl) {
    var iframe = resizeEl.querySelector('iframe');
    if (iframe) iframe.style.pointerEvents = '';
    resizeEl = null;
  }
});

// ===== APP WINDOWS (iframe) =====
function openAppWindow(id, title, url) {
  var win = document.getElementById('app-window');
  document.getElementById('app-window-title').textContent = title;
  document.getElementById('app-iframe').src = url;
  win.classList.remove('hidden');
}

function closeAppWindow() {
  var win = document.getElementById('app-window');
  win.classList.add('hidden');
  win.classList.remove('fullscreen');
  document.getElementById('app-iframe').src = '';
}

var savedRect = null;

function toggleFullscreen() {
  var win = document.getElementById('app-window');
  if (win.classList.contains('fullscreen')) {
    // Restore
    win.classList.remove('fullscreen');
    if (savedRect) {
      win.style.top = savedRect.top;
      win.style.left = savedRect.left;
      win.style.width = savedRect.width;
      win.style.height = savedRect.height;
    }
  } else {
    // Save current position/size
    savedRect = {
      top: win.style.top || '5vh',
      left: win.style.left || '7.5vw',
      width: win.style.width || '85vw',
      height: win.style.height || '80vh'
    };
    win.classList.add('fullscreen');
    win.style.top = '0';
    win.style.left = '0';
    win.style.width = '100vw';
    win.style.height = 'calc(100vh - 40px)';
  }
}

// ===== CONTACT FORM -> GOOGLE FORM =====
// Replace these with your actual Google Form field entry IDs.
// To find them:
//   1. Create a Google Form with fields: Name, Subject, Message
//   2. Click the 3-dot menu -> "Get pre-filled link"
//   3. Fill in dummy data, click "Get link"
//   4. The URL will have entry.XXXXXXX=yourdata for each field
//   5. Paste those entry IDs below

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdRzjSPPEfCoKSNbtC1K71eVkDNWfYp4sGjDKQj53QtkM-qpg/formResponse';
const FIELD_NAME    = 'emailAddress';       // Email field
const FIELD_SUBJECT = 'entry.1439820076';   // Subject
const FIELD_MESSAGE = 'entry.2131131103';   // Text/Message

function submitForm(e) {
  e.preventDefault();

  const name    = document.getElementById('name').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  const status  = document.getElementById('form-status');

  const formData = new URLSearchParams();
  formData.append(FIELD_NAME, name);
  formData.append(FIELD_SUBJECT, subject);
  formData.append(FIELD_MESSAGE, message);

  fetch(GOOGLE_FORM_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  }).then(function() {
    // no-cors always resolves — trust that it went through
    status.textContent = 'Message sent!';
    status.className = 'success';
    status.classList.remove('hidden');
    document.getElementById('contact-form').reset();
    setTimeout(function() { status.classList.add('hidden'); }, 3000);
  }).catch(function() {
    status.textContent = 'Failed to send. Try again.';
    status.className = 'error';
    status.classList.remove('hidden');
  });
}
