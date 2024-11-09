import { Component, OnInit } from '@angular/core';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    
    // - ReplaySubject will emit again all emitions to every new subscription
    const subject = new ReplaySubject();
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('early sub' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // - ReplaySubject don't need necessary to complete to emit again to later subscriptions
    // subject.complete();

    setTimeout(() => {
      series$.subscribe(val => console.log('late sub' + val));
      subject.next(4);

    }, 3000)
  }

}






