const ws = new WebSocket('ws://localhost:8080');
let mySymbol, boardState;

const menu = document.querySelector('.menu');
const gameDiv = document.querySelector('.game');
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const ctrlDiv = document.querySelector('.controls');
const replayBtn = document.getElementById('replay');
const exitBtn = document.getElementById('exit');

document.getElementById('join-random').onclick = () => {
  ws.send(JSON.stringify({ type:'join_random' }));
};
document.getElementById('create-room').onclick = () => {
  ws.send(JSON.stringify({ type:'create_custom' }));
};
document.getElementById('join-room').onclick = () => {
  document.getElementById('room-div').style.display = 'block';
};
document.getElementById('room-submit').onclick = () => {
  const code = document.getElementById('room-code').value.trim();
  if (code) ws.send(JSON.stringify({ type:'join_custom', code }));
};
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  switch(msg.type) {
    case 'created':
      document.getElementById('created-code').innerText = msg.code;
      document.getElementById('created-div').style.display = 'block';
      break;

    case 'start':
      mySymbol = msg.symbol || (msg.replay ? mySymbol : null);
      boardState = msg.board;
      showGame();
      break;

    case 'update':
      boardState = msg.board;
      renderBoard();
      if (msg.finished) {
        if (msg.winner) {
          statusEl.textContent = msg.winner === mySymbol ? 'You win!' :
            (msg.winner ? 'You lose.' : 'Draw.');
        }
        ctrlDiv.classList.remove('hidden');
      } else {
        statusEl.textContent = `Turn: ${msg.turn}`;;
      }
      break;

    case 'exit':
      alert('Opponent left. Returning to menu.');
      window.location.reload();
      break;

    case 'error':
      alert(msg.message);
      break;
  }
};

function showGame() {
  menu.classList.add('hidden');
  gameDiv.classList.remove('hidden');
  ctrlDiv.classList.add('hidden');
  document.getElementById('my-symbol').innerText = mySymbol || '';
  renderBoard();
}

function renderBoard() {
  boardEl.innerHTML = '';
  boardState.forEach((v,i) => {
    const c = document.createElement('div');
    c.className = 'cell';
    c.textContent = v || '';
    c.onclick = () => {
      if (!v && !ctrlDiv.classList.contains('hidden')===false && mySymbol && boardState[i] === null) {
        ws.send(JSON.stringify({ type:'move', idx: i }));
      }
    };
    boardEl.append(c);
  });
  statusEl.textContent = ctrlDiv.classList.contains('hidden') ? '' : statusEl.textContent;
}

replayBtn.onclick = () => { ws.send(JSON.stringify({ type:'replay' })); ctrlDiv.classList.add('hidden'); };
exitBtn.onclick = () => ws.send(JSON.stringify({ type:'exit' }));
