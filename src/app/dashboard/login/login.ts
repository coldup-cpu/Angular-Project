import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [],
  template: '',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigate(['/signup']);
  }
}
