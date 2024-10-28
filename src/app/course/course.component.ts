import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { fromEvent, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        const courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`api/courses/${courseId}`);
        this.lessons$ = createHttpObservable(`api/lessons?courseId=${courseId}&pageSize=100`)
        .pipe(
            map(res => res['payload'])
        );

    }

    // debounceTime operator is used when we have a burst of emissions and we don't want to all of them emit
    // because it in this example we are typing on an input if every key up fired an emission we'll call the back and
    // multiple unnecessary times, debounceTime makes a delay to make a emission secure if the time of debounce pass it emits the
    // last value
    // 
    // distinctUntilChanged is used to avoid fire an emission exactly equals to the last emission
    ngAfterViewInit() {
        fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
            map(event => event.target.value),
            debounceTime(400),
            distinctUntilChanged()
        ).subscribe(console.log)
    }




}
