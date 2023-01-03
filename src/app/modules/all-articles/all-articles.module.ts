import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllArticlesComponent } from './components/all-articels/all-articles.component';
import { MatIconModule } from '@angular/material/icon';
import { ArticleComponent } from './components/article/article.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArticleGenresComponent } from './components/article-genres/article-genres.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostArticleComponent } from './components/post-article/post-article.component';
import { MatButtonModule } from '@angular/material/button';
import { AddRatingComponent } from './components/add-rating/add-rating.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    AllArticlesComponent,
    ArticleComponent,
    ArticleGenresComponent,
    PostArticleComponent,
    AddRatingComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    SharedModule,
    MatButtonModule,
    MatRadioModule,
    MatDialogModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [ArticleComponent],
})
export class AllArticlesModule {}
