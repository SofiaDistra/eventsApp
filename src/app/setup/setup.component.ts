import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  city: string = '';
  name: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('initJournal') != null) {
      // redirect to main
      this.router.navigate(['/home']);
    }
  }

  submit() {
    localStorage.setItem('city', this.city);
    localStorage.setItem('name', this.name);
    localStorage.setItem('initJournal', 'true');
    this.router.navigate(['/home']);
  }

}
