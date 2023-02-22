import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { CurrentUserInterface } from 'src/app/shared/models/currentUser.interface';
import { UpdateUserInterface } from '../../models/updateUser.interface';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  userForm!: FormGroup;
  public errorMessage: string | undefined;
  public errorStatus: string | undefined;
  image: string = '../../../../../assets/noProfile.jpg'; 
  isPicture: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly dialogRef: MatDialogRef<EditProfileComponent>,
    private readonly storage: AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public editData: CurrentUserInterface,
    private readonly toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeFrom();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeFrom():void {
    if(this.editData.imageUserUrl !== ''){
      this.image = this.editData.imageUserUrl;
      this.isPicture = true;
    }
    this.userForm = this.fb.group({
      userName: this.fb.control(this.editData.userName, [Validators.required, Validators.maxLength(20)]),
      firstName: this.fb.control(this.editData.firstName, [Validators.required, Validators.maxLength(20)]),
      lastName: this.fb.control(this.editData.lastName, [Validators.required, Validators.maxLength(20)]),
      aboutMe: this.fb.control(this.editData.aboutMe, [Validators.required, Validators.maxLength(600)]),
    });
  }

  onSubmit():void{
    const request: UpdateUserInterface = {
        UserName: this.userForm.value.userName,
        FirstName: this.userForm.value.firstName,
        LastName:  this.userForm.value.lastName,
        AboutMe:  this.userForm.value.aboutMe,
        ImageUserUrl:  this.image
    }
    this.userService.updateCurrentUserInfo(request)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({next: _ =>{
      this.toastrService.success('You have updated your information','Success!')
      this.userForm.reset();
      this.dialogRef.close('edit');
    },
    error: err =>{
      this.toastrService.success(err.error,'Error with update your info')
      this.errorMessage= err.error;
    }
  })
  }

  uploadFile(event: any): void{
    const file = event.target.files[0];
    const filePath =`images/${file.name}`;
    const task = this.storage.upload(filePath, file);
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`)
      .getDownloadURL()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({next: url => {
        this.image = url;
        this.isPicture = true;
      },error: err=>{
        this.toastrService.success(err.error,'Error with upload photo')
        this.errorMessage = err.message;
        this.errorStatus = err.status;
      }});
    });
  }
}
