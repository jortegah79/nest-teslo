import {  Manager, Socket } from 'socket.io-client';
let socket:Socket;
export const connectToServer = (token: string) => {

    const manager = new Manager('https://nest-teslo-sld4.onrender.com:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: "mundo",
            authentication: token
        }
    });
    
    socket?.removeAllListeners();
    socket = manager.socket('/');
    addListeners();
}

const addListeners = () => {

    const serverStatusLabel = document.querySelector<HTMLSpanElement>("#server-status")!;
    const clientsList = document.querySelector<HTMLUListElement>("#clients-ul")!;
    const messages = document.querySelector<HTMLUListElement>("#messages")!;

    const messageForm = document.querySelector<HTMLFormElement>("#form-message")!;
    const messageInput = document.querySelector<HTMLInputElement>("#message-input")!;


    socket.on('connect', () => {
        console.log("conected");
        serverStatusLabel.innerHTML = `<h2 style="color:lightgreen">ONLINE</h2>`;
    });
    socket.on('disconnect', () => {
        console.log("disconected");
        serverStatusLabel.innerHTML = `<h2 style="color:red">OFFLINE</h2>`;
    });
    socket.on("clients-updated", (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(cliendId => {
            clientsHtml += `<li>${cliendId}</li>`
        })
        clientsList.innerHTML = clientsHtml;
    })

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (messageInput.value.trim().length <= 0) return;

        socket.emit("message-from-client", {
            id: 'Juan',
            message: messageInput.value
        }), messageInput.value = "";
    })

    socket.on('messages-from-server', (payload: { fullname: string, message: string }) => {
        const newMessage = `
        <li>
            <strong>${payload.fullname}</strong>
            <span>${payload.message}</span>
        </li>`;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messages.prepend(li);
        //messages.scrollTop= messages.scrollHeight
    })
}
