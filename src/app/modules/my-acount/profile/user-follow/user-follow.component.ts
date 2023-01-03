import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';

@Component({
  selector: 'app-user-follow',
  templateUrl: './user-follow.component.html',
  styleUrls: ['./user-follow.component.scss'],
})
export class UserFollowComponent implements OnInit {
  @Input() userInfo!: CurrentUserInterface;
  userPhotoUrl: string = '../../../../../assets/noProfile.jpg';

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.checkPhoto();
  }
  checkPhoto(): void {
    if (this.userInfo.imageUserUrl !== '') {
      this.userPhotoUrl = this.userInfo.imageUserUrl;
    }
  }
}
