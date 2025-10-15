import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FreelancerService } from '../../services/freelancer.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  dashboardData = signal<any>(null);
  gigs = signal<any[]>([]);
  loading = signal(true);
  userName = signal('');

  constructor(
    private freelancerService: FreelancerService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.userName.set(user.firstName);
    }

    await this.loadDashboardData();
    await this.loadGigs();
  }

  async loadDashboardData() {
    try {
      const data = await this.freelancerService.getDashboard();
      this.dashboardData.set(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  }

  async loadGigs() {
    try {
      const data = await this.freelancerService.getGigs();
      this.gigs.set(data.gigs || []);
    } catch (error) {
      console.error('Failed to load gigs:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async sendRequest(gigId: string) {
    try {
      await this.freelancerService.sendRequest(gigId, 'I am interested in working on this project');
      alert('Request sent successfully!');
      await this.loadGigs();
    } catch (error: any) {
      alert(error.message || 'Failed to send request');
    }
  }

  formatBudget(budget: number): string {
    return `$${budget.toLocaleString()}`;
  }

  formatDate(date: string): string {
    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  }
}
