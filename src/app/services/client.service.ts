import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:5000/api/client';

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

  async createGig(gigData: any) {
    try {
      const response = await fetch(`${this.apiUrl}/gigs`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(gigData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create gig');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getRequests() {
    try {
      const response = await fetch(`${this.apiUrl}/requests`, {
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch requests');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async acceptRequest(requestId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/requests/${requestId}/accept`, {
        method: 'PATCH',
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept request');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProjects() {
    try {
      const response = await fetch(`${this.apiUrl}/projects`, {
        headers: this.getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
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
