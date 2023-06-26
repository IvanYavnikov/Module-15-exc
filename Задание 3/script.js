const wsUri = 'wss://echo-ws-service.herokuapp.com';

const chat = document.querySelector(".chat"),
      input = document.querySelector(".input"),
      btnSend = document.querySelector(".btn-send"),
      btnGeo = document.querySelector(".btn-geo");
  
let websocket = new WebSocket(wsUri);

websocket.onopen = () => {
  console.log("Соединение установлено");
};

websocket.onmessage = ({ data }) => {
  innerChat(data, true);
};

websocket.onerror = () => {
  console.log("Ошибка соединения с сервером");
};

btnSend.addEventListener("click", () => {
  const message = input.value.trim();
  if (!message || websocket.readyState !== WebSocket.OPEN) return;
  sendMessage(message);
  input.value = "";
});

btnGeo.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const link = `https://www.openstreetmap.org/#map=18/${coords.latitude},${coords.longitude}`;
        writeOutput(`<a class="geo-info" href="${link}">Геолокация</a>`);
      },
      ({ message }) => {
        console.error(`Ошибка геолокации: ${message}`);
        writeOutput("Определение местоположения заблокировано");
      }
    );
  }
});

function sendMessage(message) {
  websocket.send(message);
  innerChat(message, false);
}


function innerChat(message, Received) {
  let messageChat = `<div class="${Received ? "recieved" : "send"}">${message}</div>`;
  chat.insertAdjacentHTML("beforeend", messageChat);
}


function writeOutput(message) {
  let messageChat = `<p>${message}</p>`;
  chat.insertAdjacentHTML("beforeend", messageChat);
}