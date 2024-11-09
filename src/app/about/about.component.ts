import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    
    // - in BehaviorSubject we have an initial value to emit, so it will emit something before call next()
    const subject = new BehaviorSubject(0);
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('early sub' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // - if BehaviorSubject completes later subscriptions will no longer receive the last value emited
    subject.complete();

    setTimeout(() => {
      // - behaviorSubject supports to later subscriptions, it will always emit the last value to new subscriptions
      series$.subscribe(val => console.log('late sub' + val));

      subject.next(4);

    }, 3000)
  }

}






