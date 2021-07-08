import { Component, OnInit } from '@angular/core';
import {EventData} from "../event-data";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  city: any = '';
  name: any = '';
  today: Date = new Date();
  todayNumber: number = 0;
  todayDay: string = '';
  todayMonth: string = '';
  todayYear: number = 0;
  colsShow: boolean[] = [];
  data: EventData[] = [];
  mostRecent: EventData[] = [];
  newEvent: EventData = new EventData();
  modalEvent: EventData = new EventData();
  maxDateStr: string = '';
  imageStr: string = '';
  asc: boolean = true;
  favType: string = '';
  favLocation: string = '';
  noTopRated: number = 0;

  typeFilter: string = '';
  titleFilter: string = '';
  dateFilter: string = '';
  locationFilter: string = '';
  ratingFilter: string = '';

  weekNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  constructor() { }

  ngOnInit(): void {
    this.city = localStorage.getItem("city");
    this.name = localStorage.getItem("name");
    this.todayNumber = this.today.getUTCDate();
    this.todayDay = this.weekNames[this.today.getDay() - 1];
    this.todayMonth = this.monthNames[this.today.getMonth()];
    this.todayYear = this.today.getFullYear();

    this.data = JSON.parse(localStorage.getItem("data") || "[]");

    this.newEvent.date = new Date();
    this.newEvent.date.setFullYear(this.todayYear);
    this.maxDateStr = this.newEvent.date.toJSON().split('T')[0];

    for (let i = 0; i < 5; i++) {
      this.colsShow[i] = true;
    }

    localStorage.removeItem('imgData');

    this.getMostRecent();
    this.calculateFavType();
    this.calculateFavLocation();
    this.calculateTopRated();
  }

  getMostRecent(): void {
    let temp = this.data;
    for(let item of temp) {
      item.date = new Date(item.date);
    }
    temp.sort((a: EventData, b: EventData) => {
      return a.date.getTime() - b.date.getTime();
    });
    this.mostRecent = temp.slice(temp.length-3);
  }

  calculateFavType() {
    let theatreCount: number = 0, movieCount: number = 0, concertCount: number = 0, otherCount: number = 0;
    for (let item of this.data) {
      if (item.type == 'theatre') theatreCount++;
      else if (item.type == 'movie') movieCount++;
      else if (item.type == 'concert') concertCount++;
      else if (item.type == 'other') otherCount++;
    }
    if (theatreCount > movieCount && theatreCount > concertCount && theatreCount > otherCount) this.favType = 'Theatre';
    if (movieCount > theatreCount && movieCount > concertCount && movieCount > otherCount) this.favType = 'Movies';
    if (concertCount > theatreCount && concertCount > movieCount && concertCount > otherCount) this.favType = 'Concerts';
    if (otherCount > theatreCount && otherCount > movieCount && otherCount > concertCount) this.favType = 'Other';
  }

  calculateFavLocation() {
    let map = new Map();
    for(let i=0; i<this.data.length; i++) {
      if(map.get(this.data[i].location) != null ){
        map.set(this.data[i].location, map.get(this.data[i].location)+1);
      }
      else {
        map.set(this.data[i].location, 1);
      }
    }

    const max = [...map.entries()].reduce((a, e ) => e[1] > a[1] ? e : a);
    this.favLocation = max[0];
  }

  calculateTopRated() {
    for(let item of this.data) {
      if(item.rating == 5) this.noTopRated++;
    }
  }

  openModal(id: string, index: number, detailsModal: boolean) {
    if(detailsModal) this.modalEvent = this.mostRecent[index];
    else this.modalEvent = this.data[index];

    const modal = document.getElementById(id);
    if(modal != null) {
      modal.style.display = 'block';
    }
  }

  closeModal(id: string) {
    const modal = document.getElementById(id);
    if(modal != null) {
      modal.style.display = 'none';
    }
  }

  saveEvent() {
    this.newEvent.imageStr = localStorage.getItem('imgData');
    this.data.push(this.newEvent);
    this.newEvent = new EventData();
    localStorage.setItem("data", JSON.stringify(this.data));

    localStorage.removeItem('imgData');
    this.getMostRecent();
  }

  saveEditedEvent() {
    const index = this.data.indexOf(this.modalEvent, 0);
    this.data[index] = this.modalEvent;
    localStorage.setItem("data", JSON.stringify(this.data));
    this.closeModal('editModal');
  }

  deleteEvent() {
    let ans = window.confirm("Are you sure you want to delete this event?")
    if(ans) {
      const index = this.data.indexOf(this.modalEvent, 0);
      if (index > -1) {
        this.data.splice(index, 1);
      }
      localStorage.setItem("data", JSON.stringify(this.data));
      this.closeModal('editModal');
    }
  }

  sort(colName: string) {
    if(colName === 'title') {
      if(this.asc) {
        this.data.sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0);
        this.asc = false;
      }
      else {
        this.data.sort((a, b) => a.title < b.title ? 1 : a.title > b.title ? -1 : 0);
        this.asc = true;
      }
    }
    if(colName === 'type') {
      if(this.asc) {
        this.data.sort((a, b) => a.type > b.type ? 1 : a.type < b.type ? -1 : 0);
        this.asc = false;
      }
      else {
        this.data.sort((a, b) => a.type < b.type ? 1 : a.type > b.type ? -1 : 0);
        this.asc = true;
      }
    }
    if(colName === 'date') {
      if(this.asc) {
        this.data.sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0);
        this.asc = false;
      }
      else {
        this.data.sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
        this.asc = true;
      }
    }
    if(colName === 'location') {
      if(this.asc) {
        this.data.sort((a, b) => a.location > b.location ? 1 : a.location < b.location ? -1 : 0);
        this.asc = false;
      }
      else {
        this.data.sort((a, b) => a.location < b.location ? 1 : a.location > b.location ? -1 : 0);
        this.asc = true;
      }
    }
    if(colName === 'rating') {
      if(this.asc) {
        this.data.sort((a, b) => a.rating > b.rating ? 1 : a.rating < b.rating ? -1 : 0);
        this.asc = false;
      }
      else {
        this.data.sort((a, b) => a.rating < b.rating ? 1 : a.rating > b.rating ? -1 : 0);
        this.asc = true;
      }
    }
  }

  filterValueChanged() {

    this.data = JSON.parse(localStorage.getItem("data") || "[]");

    let typeFilter = this.typeFilter;
    let titleFilter = this.titleFilter;
    let dateFilter = this.dateFilter;
    let locationFilter = this.locationFilter;
    let ratingFilter = this.ratingFilter;
    this.data = this.data.filter( function(data) {
      return data.type.toLowerCase().startsWith(typeFilter.toLowerCase())
        && data.title.toString().startsWith(titleFilter.toLowerCase())
        && data.date.toString().toLowerCase().startsWith(dateFilter.toLowerCase())
        && data.location.toLowerCase().startsWith(locationFilter.toLowerCase())
        && data.rating.toString().toLowerCase().startsWith(ratingFilter.toLowerCase());
    });
  }

  onFileChanged(event: any) {
    this.newEvent.image = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.newEvent.image);
    reader.onload = function () {
      if(reader.result) {
        localStorage.setItem('imgData', reader.result.toString());
      }
    };
  }

}
