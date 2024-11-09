import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    // when use subject:
    // - previous methods not convenient
    // - multicasting vales to multiple observables
    // - source of data is not easy to transform to observable
    // - subject is at the same time na observable  and na observer
    // - we can emits values with subject but also combine it with other observables
    // - subject mean to be a private, it's  no a good idea share the observer part to all the application, because we don't want to other parts of the project could call the methods next(), error(), complete()
    // - when we want to share a subject we need to share using subject.asObservable();
    // cons
    // - we don't have a way to provide an unsubscribe logic to the observable
    // - we have the risk of sharing accidentally the subject with other parts of the application which could 
    // potentially take over the behavior by calling the next, complete or error
    // - we should use it as little as possible
    // - we should use the methods to transform what we need into a observable, using fromPromise(), from() etc
    const subject = new Subject();
    const series$ = subject.asObservable();

    series$.subscribe(console.log);

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();
  }

}






