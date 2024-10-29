import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay, tap } from 'rxjs/operators';
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
            catchError(err => {
                // it can be a message handler to emit the error
                console.log('Error occurred', err);
                // it catches the error, you can do a treatment and then re-throw the error 
                return throwError(err)
            }),
            finalize(() => console.log('Finalize execution')),
            tap(() => console.log('http request executed')),
            map(res => res['payload']),
            shareReplay()
        );

        this.beginnersCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'BEGINNER'))
        )

        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category == 'ADVANCED'))
        )

    }

}
