import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientGig {
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
  status: string;
  priority: string;
  applicants: Array<{
    _id: string;
    freelancer: {
      _id: string;
      firstName: string;
      lastName: string;
      profile: {
        avatar?: string;
        rating?: number;
        skills?: string[];
      };
    };
    proposal: string;
    bidAmount: number;
    appliedAt: string;
  }>;
  createdAt: string;
}

export interface ClientProject {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  progress: number;
  freelancer: {
    _id: string;
    firstName: string;
    lastName: string;
    profile: {
      avatar?: string;
      rating?: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClientDashboardData {
  activeProjects: number;
  totalSpent: number;
  postedGigs: number;
  recentProjects: ClientProject[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:5000/api/client';

  constructor(private http: HttpClient) {}

  createGig(gigData: any): Observable<ClientGig> {
    return this.http.post<ClientGig>(`${this.apiUrl}/gigs`, gigData);
  }

  getMyGigs(): Observable<ClientGig[]> {
    return this.http.get<ClientGig[]>(`${this.apiUrl}/gigs`);
  }

  acceptApplication(gigId: string, freelancerId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/gigs/${gigId}/accept/${freelancerId}`, {});
  }

  getProjects(): Observable<ClientProject[]> {
    return this.http.get<ClientProject[]>(`${this.apiUrl}/projects`);
  }

  getDashboardData(): Observable<ClientDashboardData> {
    return this.http.get<ClientDashboardData>(`${this.apiUrl}/dashboard`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profileData);
  }
}