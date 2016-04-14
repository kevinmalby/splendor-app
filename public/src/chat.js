import { inject } from 'aurelia-framework';
import { Socket } from './services/socket-service';
import { User } from './services/user-service';

@inject(Socket, User)
export class Chat {
  messages = [];
  messageText = '';
  scrollPosition = 10000;

  constructor(socket, user) {
    this.io = socket;
    this.user = user;
    this.io.socket.on('chat message', message => this.receiveMessage(message));
  }

  /**
   * Sends the current message for the user to the server to then
   * broadcast to all other clients
   */
  sendMessage() {
    if (this.messageText) {
      let chatText = `${this.user.data.username}: ${this.messageText}`;
      this.messages.push(chatText);

      // TODO: For now hard-code room, but that will need to change
      this.io.socket.emit('chat message',
      {room: 'mainLobby', text: chatText});

      // Keep the chat window fixed to the bottom
      this.scrollToBottom();
      this.messageText = '';
    }
  }

  /**
   * Receives a chat message from the server and adds it to the list
   * of messages
   * @param  {String} message [A message from another client sent by the server]
   */
  receiveMessage(message) {
    if (message) {
      this.messages.push(message);
      this.scrollToBottom();
    }
  }

  /**
   * Scroll to the bottom of the div to show most recent
   */
  scrollToBottom() {
    // TODO: 2000 is currently some arbitrary large number
    // but it should be set more logically
    this.scrollPosition = this.messages.length * 2000;
  }
}