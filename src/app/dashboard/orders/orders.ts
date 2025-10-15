import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { OnInit } from '@angular/core';
import { FreelancerService, Project } from '../../services/freelancer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  allOrders: Project[] = [];
  activeOrders: Project[] = [];
  pendingOrders: Project[] = [];
  completedOrders: Project[] = [];
  isLoading = true;
  activeTab = 'active';

  constructor(private freelancerService: FreelancerService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.freelancerService.getOrders().subscribe({
      next: (orders) => {
        this.allOrders = orders;
        this.categorizeOrders();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  private categorizeOrders(): void {
    this.activeOrders = this.allOrders.filter(order => order.status === 'active');
    this.pendingOrders = this.allOrders.filter(order => order.status === 'pending_review');
    this.completedOrders = this.allOrders.filter(order => order.status === 'completed');
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  getOrdersByTab(): Project[] {
    switch (this.activeTab) {
      case 'active':
        return this.activeOrders;
      case 'pending':
        return this.pendingOrders;
      case 'completed':
        return this.completedOrders;
      default:
        return [];
    }
  }

}
