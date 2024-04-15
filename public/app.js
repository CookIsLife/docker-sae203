function sendMessage() {
  const username = localStorage.getItem('username');
  const message = document.getElementById('messageInput').value;
  const messageDisplay = `<p><strong>${username}</strong>: ${message}</p>`;
  document.getElementById('chatWindow').innerHTML += messageDisplay;
  document.getElementById('messageInput').value = '';
}

function login(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Failed to login: ' + response.statusText);
    }
  }).then(data => {
    localStorage.setItem('username', username);
    window.location.href = 'chat.html';
  }).catch(error => {
    alert(error.message);
  });
}

function register(event) {
  event.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  }).then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Failed to register: ' + response.statusText);
    }
  }).then(data => {
    document.getElementById('registerMessage').textContent = 'Registration successful!';
  }).catch(error => {
    document.getElementById('registerMessage').textContent = error.message;
  });
}
