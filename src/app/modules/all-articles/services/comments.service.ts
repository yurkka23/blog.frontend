import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentsInterface } from '../models/Comments.interface';
import { PostCommentInterface } from '../models/PostComment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private readonly http: HttpClient) { }
  
  getComments(articleId: Guid): Observable<CommentsInterface>{
    const url = environment.apiUrl + 'comment/get-comments-by-article';
    let params = new HttpParams().append('articleId', articleId.toString());

    return this.http.get<CommentsInterface>(url, {params});
  }

  postComment(data: PostCommentInterface) : Observable<number> {
    const url = environment.apiUrl + 'comment/create-comment-to-article';

    return this.http.post<number>(url, data);
  }
  
  deleteComment(id: number): Observable<void>{
    const url = environment.apiUrl + 'comment/delete-comment';
    let params = new HttpParams().append('id', id.toString());

    return this.http.delete<void>(url, {params});
  }
}
