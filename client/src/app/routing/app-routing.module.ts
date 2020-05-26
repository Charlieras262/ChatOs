import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { ChatComponent } from '../components/chat/chat.component';
import { NoLoginGuard } from '../guards/no-login/no-login.guard';
import { LoginGuard } from '../guards/login/login.guard';

const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full', 
    redirectTo: 'login'
  },
  {
    path: 'login', 
    component: LoginComponent, 
    canActivate: [NoLoginGuard]
  },
  {
    path: 'chat', 
    component: ChatComponent, 
    canActivate: [LoginGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
