import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { noop, Observable } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //creating aa cold observable, to call API
    const http$ = Observable.create(observer => {
      fetch('/api/courses')
        .then(data => data.json())
        .then(body => {
          observer.next(body);
          observer.complete();
        })
        .catch(err => observer.error(err))
    })

    http$.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('end')
    )
  }

}
