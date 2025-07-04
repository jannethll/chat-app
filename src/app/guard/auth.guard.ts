import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
const router = inject(Router);

if (typeof window !== 'undefined') {
const user = localStorage.getItem('username');
if (user) {
return true;
}
}

router.navigate(['/login']);
return false;
};