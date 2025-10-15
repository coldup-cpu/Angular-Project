import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FreelancerService {
  private apiUrl = 'http://localhost:5000/api/freelancer';

  constructor(private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getDashboard() {
    try {
      const response = await fetch(`${this.apiUrl}/dashboard`, {
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getGigs() {
    try {
      const response = await fetch(`${this.apiUrl}/gigs`, {
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch gigs');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async sendRequest(gigId: string, requestMessage: string = '') {
    try {
      const response = await fetch(`${this.apiUrl}/request`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ gigId, requestMessage })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send request');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getOrders() {
    try {
      const response = await fetch(`${this.apiUrl}/orders`, {
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${this.apiUrl}/profile`, {
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData: any) {
    try {
      const response = await fetch(`${this.apiUrl}/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}
