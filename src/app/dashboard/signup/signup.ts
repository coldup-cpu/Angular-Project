import { Component, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  showLogin = signal(true);
  userType = signal<'freelancer' | 'client'>('freelancer');
  loading = signal(false);
  errorMessage = signal('');

  loginEmail = signal('');
  loginPassword = signal('');

  signupFirstName = signal('');
  signupLastName = signal('');
  signupEmail = signal('');
  signupPassword = signal('');
  signupConfirmPassword = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  switchToSignup() {
    this.showLogin.set(false);
    this.errorMessage.set('');
  }

  switchToLogin() {
    this.showLogin.set(true);
    this.errorMessage.set('');
  }

  selectUserType(type: 'freelancer' | 'client') {
    this.userType.set(type);
  }

  async onLogin(event: Event) {
    event.preventDefault();
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const result = await this.authService.login(
        this.loginEmail(),
        this.loginPassword()
      );

      if (result.user.userType === 'freelancer') {
        this.router.navigate(['/dashboard/home']);
      } else {
        this.router.navigate(['/client/home']);
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Login failed');
    } finally {
      this.loading.set(false);
    }
  }

  async onSignup(event: Event) {
    event.preventDefault();
    this.loading.set(true);
    this.errorMessage.set('');

    if (this.signupPassword() !== this.signupConfirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      this.loading.set(false);
      return;
    }

    try {
      const result = await this.authService.signup(
        this.signupEmail(),
        this.signupPassword(),
        this.userType(),
        this.signupFirstName(),
        this.signupLastName()
      );

      if (result.user.userType === 'freelancer') {
        this.router.navigate(['/dashboard/home']);
      } else {
        this.router.navigate(['/client/home']);
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Signup failed');
    } finally {
      this.loading.set(false);
    }
  }
}
