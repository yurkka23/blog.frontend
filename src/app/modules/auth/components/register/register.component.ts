import { Component, ElementRef, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegisterRequestInterface } from '../../models/registerRequest.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal!: ElementRef;
  form!: FormGroup;
  isLoading: boolean = false;
  public errorMessage!: string | undefined;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly fb: FormBuilder,
     private readonly router: Router, 
     private readonly authService: AuthService,
     private readonly toastrService: ToastrService) { }
  
  ngOnInit(): void {
    this.initializeFrom();
  }
 
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  closeModal(event: Event) : void{
    if( !this.modal.nativeElement.contains(event.target) ){
      this.router.navigate(['']);
    }
  }
  
  initializeFrom():void {
    this.form = this.fb.group({
      userName: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      firstName: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      lastName: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      aboutMe: this.fb.control('', [Validators.maxLength(600)]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4)])
    });
  }

  onSubmit():void{
    const request: RegisterRequestInterface = {
      user : this.form.value
    }
    this.isLoading = true;
    console.log("request",request);
    this.authService.register(request)
    .pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.unsubscribe$)
      )
    .subscribe({next: _ => {
       this.toastrService.success('You register succesfully', 'Welcome!');
       this.toastrService.warning('Now please login in your acount', 'Warn!');
       this.router.navigate(['login']);
    },
    error: err =>{
      this.toastrService.error(err.error, 'Fail');
      this.errorMessage = err.error;
    }});
  }

  openLogin(): void{
    this.router.navigate(['login']);
  }
}
