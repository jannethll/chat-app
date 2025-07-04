import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard'; // Asegúrate que es la versión con CanActivateFn

export const routes: Routes = [
{
path: '',
redirectTo: 'login',
pathMatch: 'full'
},
{
path: 'login',
loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
},
{
path: 'chat',
loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent),
canActivate: [AuthGuard]
}
];