import { Component, OnInit, NgZone } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations'
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('enterIcon', [
      transition(':enter', [
        style({ 
          opacity: 0,
          transform: 'translateX(-50%) translateY(-100%)' 
        }),
        animate('400ms', style({ 
          opacity: 1,
          transform: 'translateX(-50%) translateY(-50%)' 
        })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('enterWrap', [
      transition(':enter', [
        style({ 
          opacity: 0,
          transform: 'translateY(50%)' 
        }),
        animate('400ms', style({ 
          opacity: 1,
          transform: 'translateY(0%)' 
        })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),]
})
export class LoginComponent implements OnInit {

  username: string

  constructor(
    public chatSrv: ChatService,
    public authService: LoginService,
    public router: Router,
    public ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
  }

  onLoginUser() {
    this.chatSrv.newUser(this.username, res => {
      if (res) {
        this.authService.storeUserData(this.username)
        this.ngZone.run(()=>this.router.navigate(['/chat']))
      } else {
        $.toaster("The nickname already exists.", '<i class="fa fa-times"></i>', 'info');
      }
    })
  }

}
