import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  
  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  openAllArticles():void{
    this.router.navigate(['all-articles']);
  }
  openRegister():void{
    this.router.navigate(['register']);
  }

}
