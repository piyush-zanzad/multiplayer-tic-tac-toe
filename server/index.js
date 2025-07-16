const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const rooms = {};
const randomPool = [];

function createRoom() {
  let code;
  do { code = Math.random().toString(36).substring(2, 8); }
  while (rooms[code]);
  rooms[code] = { players: [], board: Array(9).fill(null), turn: 'X', finished: false };
  return code;
}

wss.on('connection', ws => {
  ws.on('message', msgRaw => {
    const msg = JSON.parse(msgRaw);
    let room;

    switch(msg.type) {
      case 'join_random':
        if (randomPool.length > 0) {
          room = rooms[randomPool.shift()];
        } else {
          const code = createRoom();
          room = rooms[code];
          randomPool.push(code);
        }
        room.players.push(ws);
        ws.roomCode = Object.keys(rooms).find(c => rooms[c] === room);
        room.players.forEach((player, i) => {
  player.send(JSON.stringify({
    type: 'start',
    symbol: i === 0 ? 'X' : 'O',
    board: room.board
  }));
});

        break;

      case 'create_custom':
        const code = createRoom();
        room = rooms[code];
        room.players.push(ws);
        ws.roomCode = code;
        ws.send(JSON.stringify({ type:'created', code }));
        break;

      case 'join_custom':
        room = rooms[msg.code];
        if (!room || room.players.length >= 2) {
          ws.send(JSON.stringify({ type:'error', message:'Invalid room code or full.' }));
          return;
        }
        room.players.push(ws);
        ws.roomCode = msg.code;
        room.players.forEach((player, i) => {
  player.send(JSON.stringify({
    type: 'start',
    symbol: i === 0 ? 'X' : 'O',
    board: room.board
  }));
});

        break;

      case 'move':
        room = rooms[ws.roomCode];
        if (!room || room.finished) return;
        if (room.players[room.turn === 'X' ? 0 : 1] !== ws) return;
        if (room.board[msg.idx] !== null) return;
        room.board[msg.idx] = room.turn;
        room.finished = checkWin(room.board) || room.board.every(v=>v!==null);
        broadcast(room, { type:'update', board: room.board, turn: room.turn === 'X' ? 'O' : 'X', finished: room.finished, winner: room.finished ? room.turn : null });
        if (room.finished) room.turn = null;
        else room.turn = room.turn === 'X' ? 'O' : 'X';
        break;

      case 'replay':
        room = rooms[ws.roomCode];
        if (!room) return;
        room.ready = (room.ready || new Set()).add(ws);
        if ((room.ready.size || 0) === 2) {
          room.board = Array(9).fill(null);
          room.turn = 'X';
          room.finished = false;
          room.ready.clear();
          broadcast(room, { type:'start', board: room.board, symbol:'', replay:true });
        }
        break;

      case 'exit':
        room = rooms[ws.roomCode];
        if (!room) return;
        room.players.forEach(p => {
          if (p !== ws) p.send(JSON.stringify({ type:'exit' }));
        });
        cleanup(ws.roomCode);
        break;
    }
  });

  ws.on('close', () => {
    if (ws.roomCode) cleanup(ws.roomCode);
  });
});

function broadcast(room, obj) {
  room.players.forEach(p => p.send(JSON.stringify(obj)));
}

function cleanup(code) {
  const room = rooms[code];
  if (!room) return;
  room.players.forEach(p => {
    if (p.readyState === WebSocket.OPEN)
      p.send(JSON.stringify({ type:'exit' }));
  });
  delete rooms[code];
  const i = randomPool.indexOf(code);
  if (i >= 0) randomPool.splice(i,1);
}

function checkWin(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  return wins.some(([a,b2,c]) => b[a] && b[a] === b[b2] && b[a] === b[c]);
}

console.log('WebSocket server running on ws://localhost:8080');
