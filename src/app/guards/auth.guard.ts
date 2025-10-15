import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const currentUser = this.authService.getCurrentUserValue();
    const requiredRole = route.data['role'];

    if (requiredRole && currentUser?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      if (currentUser?.role === 'freelancer') {
        this.router.navigate(['/dashboard/home']);
      } else if (currentUser?.role === 'client') {
        this.router.navigate(['/client/dashboard']);
      }
      return false;
    }

    return true;
  }
}