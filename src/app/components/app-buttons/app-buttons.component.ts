import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-buttons',
  templateUrl: './app-buttons.component.html',
  styleUrls: ['./app-buttons.component.sass']
})
export class AppButtonsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoPage(pageId){
    console.log(`go to page ${pageId}`);
    this.playSound('click');
    switch(pageId) {
      case 'ac':
        this.router.navigateByUrl('/');
        break;

      case 'security':
        this.router.navigateByUrl('/security');
        break;

      case 'media':
        this.router.navigateByUrl('/media');
        break;
    }
  }

  playSound(e) {
    let audio = new Audio();
    switch(e) {
      case 'click':
        audio.src = "./assets/audio/button-click.mp3";
        break;

      case 'hover':
        audio.src = "./assets/audio/button-over.mp3";
        break;

      default:
        break;
    }
    audio.load();
    audio.play();
  }

}
