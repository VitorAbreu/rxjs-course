import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
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
        const http$ = createHttpObservable('api/courses');

        // tap is used to do side effects out the observable during its execution

        // sharedReplay is used to shared the same request to all subscriptions it may have
        // avoiding multiple requests to receive the same information
        const courses$: Observable<Course[]> = http$.pipe(
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
