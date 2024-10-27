import { Component, OnInit } from '@angular/core';
import { concat, of } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const source1$ = of(1, 2, 3);
    // const source1$ = interval(1000);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);

    // concat is used to concat values of all Observables but it only subscribe the next value if
    // the first has completed so if we change the source1$ to an interval, source2$ and source3$ won't emit
    const result$ = concat(source1$, source2$, source3$);

    result$.subscribe(console.log);
  }

}
