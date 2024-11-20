import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Course } from "../model/course";
import { tap, map, filter } from "rxjs/operators";
import { createHttpObservable } from "./util";
import { fromPromise } from "rxjs/internal-compatibility";

@Injectable({
    providedIn: 'root'
})
export class Store {

    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable();

    init() {
        const http$ = createHttpObservable('/api/courses');

        http$.pipe(
            tap(() => console.log('http request executed')),
            map(res => res['payload'])
        ).subscribe({
            next: (courses) => this.subject.next(courses)
        })
    }

    selectBeginnersCourse(): Observable<Course[]> {
        return this.selectByCategory('BEGINNER');
    }

    selectAdvancedCourse(): Observable<Course[]> {
        return this.selectByCategory('ADVANCED');
    }

    selectByCategory(category: string): Observable<Course[]> {
        return this.courses$.pipe(
            map(courses => courses.filter(course => course.category == category)),
            filter(courses => Boolean(courses))
        )
    }
    
    saveCourse(courseId: number, changes): Observable<any> {
        const courses = this.subject.getValue();

        const courseIndex = courses.findIndex(course => course.id === courseId);
        // we should create a new emission to new subscribers receive the lastest version, if we just change the attribute using
        // old courses object it won't notify the changes to the subscribers
        const newCourses = courses.slice(0);

        newCourses[courseIndex] = {
            ...courses[courseIndex],
            ...changes
        }
        
        this.subject.next(newCourses);

        return fromPromise(fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }))
    }

    selectByCourseId(courseId: number) {
        return this.courses$.pipe(
            map(courses => courses.find(course => course.id == courseId))
        )
    }
}