import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-date',
  templateUrl: './current-date.component.html',
  styleUrls: ['./current-date.component.sass']
})
export class CurrentDateComponent implements OnInit {
  constructor(){}

  time = new Date();

  ngOnInit(): void {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

}
