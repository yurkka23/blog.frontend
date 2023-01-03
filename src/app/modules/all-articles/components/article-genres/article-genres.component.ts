import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { GenresHelper } from '../../Helpers/genre.helper';
import { Genre } from '../../models/Genre.interface';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-article-genres',
  templateUrl: './article-genres.component.html',
  styleUrls: ['./article-genres.component.scss'],
})
export class ArticleGenresComponent implements OnInit {
  listGenres!: Genre[];
  selectedGenre!: Genre;

  constructor(
    private readonly articleService: ArticlesService,
    private readonly toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres(): void {
    this.articleService
      .getGenres(15)
      .pipe(map((res) => GenresHelper.createGenreVM(res.genres)))
      .subscribe({
        next: (res) => {
          this.listGenres = res;
        },
        error: (err) => {
          this.toastrService.error(err.error, 'Error with getting  genres');
        },
      });
  }

  chooseGenre(genre: Genre) {
    if (this.selectedGenre) {
      if (
        this.selectedGenre.name == genre.name &&
        this.selectedGenre.selected
      ) {
        this.selectedGenre.selected = false;
        this.articleService.genreChoosed.next('all');
      } else {
        this.selectedGenre.selected = false;
        this.selectedGenre = genre;
        genre.selected = !genre.selected;
        this.articleService.genreChoosed.next(genre.name);
      }
    } else {
      this.selectedGenre = genre;
      genre.selected = !genre.selected;
      this.articleService.genreChoosed.next(genre.name);
    }
  }
}
