import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';
import { environment } from 'src/environments/environment';
import { Group } from '../models/group.interface';
import { ListOfChatsInterface } from '../models/listOfChats.interface';
import { ListOfMessagesInterface } from '../models/listOfMessages.interface';
import { MessageInterface } from '../models/message.interface';
import { SentMessageInterface } from '../models/sentMessage.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<MessageInterface[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private readonly http: HttpClient) {}

  createHubConnection(
    jwtToken: string,
    otherUsernameId: string,
    otherUsername: string
  ) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsernameId, {
        accessTokenFactory: () => jwtToken,
      })
      .withAutomaticReconnect()
      .build();

    console.log(this.hubConnection);

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages.messages);
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: (messages) => {
            messages.forEach((message) => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            });
            this.messageThreadSource.next([...messages]);
          },
        });
      }
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: (messages) => {
          this.messageThreadSource.next([...messages, message]);
        },
      });
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop();
    }
  }

  async sentMessage(data: SentMessageInterface) {
    if (this.hubConnection) {
      return this.hubConnection
        .invoke('SendMessage', data)
        .catch((error) => console.log(error));
    }
  }

  sentMessageFirst(data: SentMessageInterface): Observable<Guid> {
    const url = environment.apiUrl + 'message/create-message';
    return this.http.post<Guid>(url, data);
  }

  public deleteMessage(id: Guid): Observable<void> {
    const url = environment.apiUrl + 'message/delete-message';
    let params = new HttpParams().append('id', id.toString());

    return this.http.delete<void>(url, { params });
  }

  public getUserListOfChats(): Observable<ListOfChatsInterface> {
    const url = environment.apiUrl + 'message/get-user-list-of-chats';

    return this.http.get<ListOfChatsInterface>(url);
  }

  public getListOfMessagesFromGroup(
    id: Guid
  ): Observable<ListOfMessagesInterface> {
    const url = environment.apiUrl + 'message/get-list-of-messages-from-group';
    let params = new HttpParams().append('recipientUserId', id.toString());

    return this.http.get<ListOfMessagesInterface>(url, { params });
  }
}
