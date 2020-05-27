import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { trigger, style, transition, animate } from '@angular/animations'
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Message } from 'src/app/models/Message';

declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('enterUsers', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('400ms', style({
          opacity: 1
        })),
      ]),
      transition(':leave', [
        animate('400ms', style({
          opacity: 1
        }))
      ])
    ]),
    trigger('enterIcon', [
      transition(':enter', [
        style({
          position: 'absolute',
          left: '50%',
          bottom: '50%',
          transform: 'translateX(50%) translateY(50%)'
        }),
        animate('400ms', style({
          transform: 'translateX(0%) translateY(0%)',
          left: '30px',
          bottom: '30px',
        })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('enterWrap', [
      transition(':enter', [
        style({
          width: "350px",
          height: "350px",
          opacity: 0
        }),
        animate('400ms', style({
          width: "900px",
          height: "92vh",
          opacity: 1
        })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ChatComponent implements
  OnInit {

  private chat;
  username: string
  msg: string
  ready = false

  constructor(
    public authService: LoginService,
    public chatService: ChatService,
    public router: Router,
    public socket: Socket
  ) {
  }

  ngOnInit(): void {
    this.username = this.authService.getUser()
    this.chat = $('#chat');
    this.socket.emit('init')
    this.socket.on("usernames", users => {
      if (users.length == 0) this.authService.logout()
      else {
        users = users.filter((value, index, arr) => value != this.username)
        users.unshift(this.username)
        this.chatService.users = users
      }
      this.ready = true
    });
    this.socket.on('newMessage', (chat: Message) => {
      this.addMessage(chat)
    })
    this.socket.on('loadOldMgs', (chats) => {
      for (const chat of chats) {
        this.addMessage(chat)
      }
    })
    window.onload = () => {
      this.authService.logout()
      this.socket.emit('logout', this.authService.getUser())
    }
  }

  sendMessage() {
    if (this.ready) {
      const chat = { nick: this.username, msg: this.msg, date: new Date().toString() };
      this.addMessage(chat, true)
      this.socket.emit('sendMessage', chat)
      this.msg = ""
    }
  }

  private addMessage(chat: Message, updateOwner: boolean = false) {
    if (chat.nick == this.username) {
      if(!updateOwner) return
      this.chat.append(this.outcomingMessage(this.splitString(chat.msg, 12), this.getDate(chat.date)))
    } else {
      this.chat.append(this.incomingMessage(this.splitString(chat.msg, 12), chat.nick, this.getDate(chat.date)))
    }
    this.chat.animate({ scrollTop: this.chat.prop("scrollHeight")}, 1000);
  }

  private incomingMessage(message: string, username: string, date: string) {
    return `<div class="incoming_msg">
              <div class="received_msg">
                <div class="received_withd_msg">
                  <i class="fa fa-user"> <span class="received_msg_title">${username}</span></i>
                  <p> ${message} </p>
                  <span class="time_date"> ${date}</span>
                </div>
              </div>
            </div>`
  }

  private outcomingMessage(message: string, date: string) {
    return `<div class="outgoing_msg">
              <div class="sent_msg">
                <i class="fa fa-user"> <span class="received_msg_title">${this.username}</span></i>
                <p>${message}</p>
                <span class="time_date"> ${date} </span>
              </div>
            </div>`
  }

  private getDate(str: string) {
    const date = new Date(Date.parse(str))
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    return `${hours}:${minutes}`
  }

  private splitString(msg: string, size: number): string {
    const numChunks = Math.ceil(msg.length / size)
    var chunks = []

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks.push(msg.substr(o, size))
    }

    var joinedString = ""
    for (const chunk of chunks) {
      joinedString += `${chunk}`
    }
    return joinedString
  }

  isCurrentUser(user){
    return user == this.username ? "active_chat" : ""
  }
}
