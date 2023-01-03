import { Component, Input, OnInit } from '@angular/core';
import { ArticleInterface } from '../../models/Article.interface';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  timeToRead!: number;
  @Input() article!: ArticleInterface;
  @Input() isShowAuthor: boolean = true;
  constructor() {}

  ngOnInit(): void {
    this.timeToRead = this.countTimeToRead();
  }

  countTimeToRead(): number {
    const average_Time_People_Read_Char_For_One_minute: number = 100; //1000
    return (
      this.article.content.length / average_Time_People_Read_Char_For_One_minute
    );
  }
}
