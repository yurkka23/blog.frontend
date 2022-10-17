import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoginRequestInterface } from '../../models/loginRequest.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal!: ElementRef;
  form!: FormGroup;
  isLoading: boolean = false;
  public errorMessage: string | undefined;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, 
    private readonly router: Router, 
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initializeFrom();
  }
  ngOnDestroy():void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeModal(event: Event) : void{
    if(!this.modal.nativeElement.contains(event.target)){
      this.router.navigate(['']);
    }
  }

  initializeFrom():void {
    this.form = this.fb.group({
      userName: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4)])
    });
  }
  
  onSubmit():void{
    const request: LoginRequestInterface = {
      user : this.form.value
    }
    this.isLoading = true;
    this.authService.login(request)
    .pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.unsubscribe$)
      )
    .subscribe({next: _ => {
      this.toastrService.success('You successfully logged!','Success!');
       this.router.navigate(['']);
    },
    error: err =>{
      this.toastrService.error( err.error,'Error!')
      this.errorMessage = err.error;
    }});
  }

  openRegister(): void {
    this.router.navigate(['register']);
  }
}
