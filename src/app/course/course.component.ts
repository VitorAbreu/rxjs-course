import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { forkJoin, fromEvent, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { debug, RxjsLoggingLevel, setRxjsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`api/courses/${this.courseId}`)
        this.lessons$ = this.loadLessons();

        // forkJoin is used to do parallel requests once all the requests are completed it emits, if one of them throws
        // an error or didn't complete it won't emit, if one of the observables emits more then a value before completes
        // it'll only emits the last value
        forkJoin([this.course$, this.lessons$]).pipe(
            tap(([course, lessons]) => {
                console.log('course', course)
                console.log('lessons', lessons)
            })
        ).subscribe()
        // .pipe(
        //     debug(RxjsLoggingLevel.INFO, 'courses value '),
        // );
        // setRxjsLoggingLevel(RxjsLoggingLevel.TRACE)
    }

    // debounceTime operator is used when we have a burst of emissions and we don't want to all of them emit
    // because it in this example we are typing on an input if every key up fired an emission we'll call the back and
    // multiple unnecessary times, debounceTime makes a delay to make a emission secure if the time of debounce pass it emits the
    // last value
    // 
    // distinctUntilChanged is used to avoid fire an emission exactly equals to the last emission
    // 
    // switchmap cancels the last emission by unsubscribe if a new emission is received and the first operation didn't finish until
    // the new emission starts
    ngAfterViewInit() {
        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
            map(event => event.target.value),
            startWith(''),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(search => this.loadLessons(search)),
        ); 
        // debug(RxjsLoggingLevel.TRACE, 'search '),
        // debug(RxjsLoggingLevel.DEBUG, 'lessons value'),
    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
            map(res => res['payload'])
        );
    }


}
