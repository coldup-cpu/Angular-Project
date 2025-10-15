import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer'
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup(): void {
    if (!this.signupData.firstName || !this.signupData.lastName || 
        !this.signupData.email || !this.signupData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { confirmPassword, ...signupPayload } = this.signupData;

    this.authService.signup(signupPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirect based on user role
        if (response.user.role === 'freelancer') {
          this.router.navigate(['/dashboard/home']);
        } else {
          this.router.navigate(['/client/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Signup failed';
      }
    });
  }

  selectUserType(type: 'freelancer' | 'client'): void {
    this.signupData.role = type;
  }

}
