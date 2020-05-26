import { OnInit } from '@angular/core';
import * as io from 'socket.io-client';

export class ProjectVariable implements OnInit {
  static serverLocation = "http://localhost:3000/";
  static socket = io(ProjectVariable.serverLocation);
  static secret = 'mgmY14dYnV4c!'
  constructor() {
  }

  ngOnInit() {

  }
}