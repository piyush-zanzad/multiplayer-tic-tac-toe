# 🎮 Multiplayer Tic Tac Toe Game

A real-time, WebSocket-based **multiplayer Tic Tac Toe** game built with Node.js and vanilla JS. Supports both **random matchmaking** and **custom room codes**. 🎯

---

## 🌟 Features

- 🔁 Join Random Room
- 🔐 Create & Join Custom Room
- 🕹️ Real-time gameplay using WebSocket
- 🔄 Replay / Exit options after match
- 🎨 Responsive UI

---

## 🖼️ Preview

<img src="https://i.imgur.com/2YrHqZK.png" width="400" />

---

## 🗂️ Project Structure
tic-tac-toe/
├── client/ # Frontend (HTML, CSS, JS)
│ ├── index.html
│ ├── style.css
│ └── app.js
├── server/ # WebSocket backend (Node.js)
│ └── index.js
└── README.md

## 🚀 How to Run Locally

### Prerequisites:
- [Node.js](https://nodejs.org/) installed

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/multiplayer-tic-tac-toe.git
cd multiplayer-tic-tac-toe
```
### 2. To start web socket server
```bash
cd server
npm install
node index.js
# You should see:
WebSocket server running on ws://localhost:8080
```


### 3.Serve Frontend
In a new terminal tab:
```bash
cd client
npx http-server -p 8000
# Then open your browser at:
http://localhost:8000
```

🧠 Tech Stack
Node.js + WebSocket (ws)
Vanilla JS
HTML + CSS
No frameworks, no database!

### 🤝 Contributing

Contributions are welcome!  
If you find a bug, have a feature request, or want to enhance the project in any way — **feel free to fork the repo and submit a pull request**.

> This project is open for learning and collaboration.  
> Whether it's UI improvements, adding features, or code cleanup — **you're welcome to make changes!** 🙌
