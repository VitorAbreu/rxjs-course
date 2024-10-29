import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnersCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor() {

    }

    ngOnInit() {
        const http$ = createHttpObservable('/api/courses');

        // tap is used to do side effects out the observable during its execution

        // sharedReplay is used to shared the same request to all subscriptions it may have
        // avoiding multiple requests to receive the same information
        // 
        // catchError is used to replace the observable that will error out and then stop to emit to a new observable that
        // replace the expected value, it can be any observable like a offline database, it depends how you want to treat the error
        // 
        // retryWhen creates a mirror of the source observable when the source throws an error and then subscribe into a brand new observable
        // and retries, we are using delayWhen to make the retry happen 2 seconds after the error throws
        const courses$: Observable<Course[]> = http$.pipe(
            tap(() => console.log('http request executed')),
            map(res => res['payload']),
            shareReplay(),
            retryWhen(error => error.pipe(
                delayWhen(() => timer(2000))
            ))
        );

        this.beginnersCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'BEGINNER'))
        )

        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'ADVANCED'))
        )

    }

}
