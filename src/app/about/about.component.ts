import { Component, OnInit } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Subject } from 'rxjs';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    
    // - AsyncSubject is used for long running calculations
    const subject = new AsyncSubject();
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('early sub' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // - AsyncSubject won't receive intermediate values, only the last value
    subject.complete();

    setTimeout(() => {
      // - AsyncSubject receive the last value before it completes, also complete is essential or else it won't emit
      // - later subscriptions works even when complete
      series$.subscribe(val => console.log('late sub' + val));

    }, 3000)
  }

}






