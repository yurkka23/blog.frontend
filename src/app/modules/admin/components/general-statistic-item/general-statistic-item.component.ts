import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-statistic-item',
  templateUrl: './general-statistic-item.component.html',
  styleUrls: ['./general-statistic-item.component.scss']
})
export class GeneralStatisticItemComponent implements OnInit {
  @Input() iconName!:string;
  @Input() description!:string;
  @Input() countItem!:string;
  constructor() { }

  ngOnInit(): void {
  }

}
