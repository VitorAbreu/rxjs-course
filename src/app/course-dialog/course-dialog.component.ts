import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import moment from 'moment';
import { concatMap, exhaustMap, filter, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { fromEvent } from 'rxjs';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course:Course;

    @ViewChild('saveButton', { static: true, read: ElementRef }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    // concatMap operator is a combination of map that transforms a value emitted into other and concat
    // so this way when we are receiving multiple changes from the form we transform then to a http request
    // and concat all changes so this way we'll control the sequence of the requests
    ngOnInit() {
        this.form.valueChanges.pipe(
            filter(() => this.form.valid),
            concatMap(changes => this.saveCourse(changes))
        ).subscribe()

    }

    saveCourse(changes) {
        return fromPromise(fetch(`http://localhost:9000/api/courses/${this.course.id}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }))
    }



    // exhaustMap prevents multiple emissions occurs until the first emission ends, and is combined with Map
    ngAfterViewInit() {
        fromEvent(this.saveButton.nativeElement, 'click').pipe(
            tap(() => console.log('cliquei')),
            exhaustMap(() => this.saveCourse(this.form.value))
        )
        .subscribe();
    }



    close() {
        this.dialogRef.close();
    }

  save() {

  }
}
