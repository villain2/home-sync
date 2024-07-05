import { Component, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements AfterViewInit  {
  backgroundVideoSource: string;
  backgroundVideoList: string[] = [
    "../assets/video/waves-bg.mp4", 
    "../assets/video/cosmic-bg.mp4", 
    "../assets/video/galaxy-bg.mp4", 
    "../assets/video/city-loop-bg.mp4", 
    "../assets/video/stream-bg.mp4", 
    "../assets/video/milky-way-desert-bg.mp4",
    "../assets/video/miami-bg.mp4",
    "../assets/video/jellyfish-bg.mp4"
  ];
  videoSrc: string;

  @ViewChild('backgroundVideo', {static: false}) backgroundVideo: ElementRef<HTMLVideoElement>;

  constructor() { 
    // randomize the source
    this.setRandomVideoSource();
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.playVideo();
    }, 500);
  }

  setRandomVideoSource() {
    const randomIndex = Math.floor(Math.random() * this.backgroundVideoList.length);
    this.videoSrc = this.backgroundVideoList[randomIndex];
  }

  playVideo() {
    if (this.backgroundVideo) {
      const videoElement = this.backgroundVideo.nativeElement;
      videoElement.muted = true; // Ensure the video is muted
      videoElement.play().catch(error => {
        console.error('Error attempting to play the video:', error);
        // Retry playing the video after a short delay
        setTimeout(() => {
          videoElement.play().catch(err => {
            console.error('Retrying failed:', err);
          });
        }, 1000); // Retry after 1 second
      });
    } else {
      console.error('Background video element not found on this page.');
    }
  }

}
