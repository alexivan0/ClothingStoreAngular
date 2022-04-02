import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  // Input = receive from the parent component
  @Input() totalCount: number;
  @Input() pageSize: number;
  @Input() pageNumber: number;
  // Pagination component / Pager component = child component on the shop component page
  // emits output from the child component to the parent component
  @Output() pageChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  //pagercomponent.html calls shopcompnent.ts and sens it the event.page number
  onPagerChange(event: any) {
    this.pageChanged.emit(event.page);
  }

}
