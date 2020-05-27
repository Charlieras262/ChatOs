import { Injectable, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LoginService } from '../login/login.service';
import { Message } from 'src/app/models/Message';

@Injectable({
  providedIn: 'root'
})
export class ChatService{

  private msgs: Message[]
  private users: string[]
  private ready: boolean;

  constructor(
    private socket: Socket,
    private authService: LoginService
  ) { }

  updateMessages() {
  }

  connectUser(username: string) {

  }

  sendMessage(message: string): Message {
    const user = this.authService.getUser()
    const chat = { nick: user.username, msg: message, date: new Date().toString() };
    this.socket.emit('sendMessage', {chat, token: user.token})
    return chat
  }

  sendPrivateMessage(message: string, to: string): Message {
    const user = this.authService.getUser()
    const chat = { nick: user.username, msg: message, date: new Date().toString() };
    this.socket.emit('sendPrivateMessage', {chat, token: user.token, to})
    return chat
  }

  newUser(username, callback) {
    this.socket.emit("newUser", username, callback);
  }

  pageReloaded(): void {
    this.socket.emit('logout', this.authService.getUser())
    this.authService.logout()
  }

  setMessages(msgs): void {
    this.msgs = msgs;
  }

  getMessages(): Message[] {
    return this.msgs;
  }

  setUsers(users): void {
    if (users.length == 0) this.authService.logout();
    else {
      this.users = users.filter(user => user != this.authService.getUser().username);
      this.users.unshift(this.authService.getUser().username);
    }
    this.ready = true;
  }

  getUsers(): string[] {
    return this.users;
  }

  isReady(): boolean {
    return this.ready;
  }
}
