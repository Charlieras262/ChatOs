import { Injectable, OnInit } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Socket } from 'ngx-socket-io';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService{

  msgs: Message[]
  users: []

  constructor(private socket: Socket, public authService: LoginService) { 
  }

  updateMessages(){

  }

  connectUser(username: string){

  }

  sendMessage(username: string, message){

  }

  newUser(username, callback){
    this.socket.emit("newUser", username, callback)
  }
}
