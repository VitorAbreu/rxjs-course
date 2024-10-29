import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
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
        const courses$: Observable<Course[]> = http$.pipe(
            tap(() => console.log('http request executed')),
            map(res => res['payload']),
            shareReplay(),
            catchError(err => of([
                {
                    id: 0,
                    description: "RxJs In Practice Course",
                    iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
                    courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
                    longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
                    category: 'BEGINNER',
                    lessonsCount: 10
                },
            ]))
        );
        courses$.subscribe(console.log)

        this.beginnersCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'BEGINNER'))
        )

        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'ADVANCED'))
        )

    }

}
