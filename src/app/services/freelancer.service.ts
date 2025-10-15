import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  skills: string[];
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    profile: {
      avatar?: string;
      rating?: number;
    };
  };
  status: string;
  priority: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  progress: number;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    profile: {
      avatar?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  activeProjects: number;
  totalEarnings: number;
  monthlyEarnings: number;
  recentProjects: Project[];
}

@Injectable({
  providedIn: 'root'
})
export class FreelancerService {
  private apiUrl = 'http://localhost:5000/api/freelancer';

  constructor(private http: HttpClient) {}

  getAvailableGigs(): Observable<Gig[]> {
    return this.http.get<Gig[]>(`${this.apiUrl}/gigs`);
  }

  applyToGig(gigId: string, application: { proposal: string; bidAmount: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/gigs/${gigId}/apply`, application);
  }

  getOrders(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/orders`);
  }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profileData);
  }
}