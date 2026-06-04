import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-date',
  templateUrl: './current-date.component.html',
  styleUrls: ['./current-date.component.sass']
})
export class CurrentDateComponent implements OnInit, OnDestroy {
  constructor(){}

  time = new Date();
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

}
