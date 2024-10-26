import { Component, OnInit } from '@angular/core';
import { noop } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnersCourses: Course[];
    advancedCourses: Course[];

    constructor() {

    }

    ngOnInit() {
        const http$ = createHttpObservable('api/courses');

        const courses$ = http$.pipe(
            map(res => res['payload'])
        );

        courses$.subscribe(
            (courses: Course[]) => {
                // You shouldn't do this because we are trying to avoid nested complex callbacks or subscriptions
                // and in the future it may happen
                this.beginnersCourses = courses.filter(course => course.category == 'BEGINNER');
                this.advancedCourses = courses.filter(course => course.category == 'ADVANCED');
            },
            noop,
            () => console.log('end')
        )

    }

}
