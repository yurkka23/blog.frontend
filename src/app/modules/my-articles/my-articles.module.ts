import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyArticlesComponent } from './components/my-articles/my-articles.component';
import { MyArticleComponent } from './components/my-article/my-article.component';
import { StateArticleToNamePipe } from './pipes/state-article-to-name.pipe';
import { MatDialogModule } from "@angular/material/dialog";
import { CreateArticleComponent } from './components/create-article/create-article.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DeleteArticleComponent } from './components/delete-article/delete-article.component';
import { EditArticleComponent } from './components/edit-article/edit-article.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotArticlesComponent } from './components/not-articles/not-articles.component';

@NgModule({
  declarations: [
    MyArticlesComponent,
    MyArticleComponent,
    StateArticleToNamePipe,
    CreateArticleComponent,
    DeleteArticleComponent,
    EditArticleComponent,
    NotArticlesComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule
  ]
})
export class MyArticlesModule { }
