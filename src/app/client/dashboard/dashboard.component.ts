import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ClientService, ClientDashboardData } from '../../services/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ClientDashboardComponent implements OnInit {
  dashboardData: ClientDashboardData | null = null;
  isLoading = true;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.clientService.getDashboardData().subscribe({
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