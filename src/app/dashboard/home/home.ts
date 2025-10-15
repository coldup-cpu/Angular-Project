import { Component } from '@angular/core';
// import { RouterOutlet } from "@angular/router/router_module.d";
import { RouterLink } from "@angular/router";
import { OnInit } from '@angular/core';
import { FreelancerService, DashboardData } from '../../services/freelancer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = true;

  constructor(private freelancerService: FreelancerService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.freelancerService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

}
