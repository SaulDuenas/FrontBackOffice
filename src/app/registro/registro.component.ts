import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from "../services/login/login.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  
    urlTree ;
    email;
    id;
    resp;
    constructor(private router: Router,private elementRef: ElementRef, authService:AuthService) { 
      this.urlTree = this.router.parseUrl(this.router.url);
  
      this.email = this.urlTree.queryParams['email'];
      this.id = this.urlTree.queryParams['setorval'];
      console.log("email: " +this.email + "--ID: " +this.id)
  
      authService.validaEmail(this.email,this.id).subscribe(
        data => {
          console.log(data)
          this.resp = data["number"]
        })
    }
  
    ngAfterViewInit(){
      //this.elementRef.nativeElement.ownerDocument.body.style.background =" -webkit-gradient(linear, left top, left bottom, from(#164194), to(#29bdef)) fixed";
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage=" url('../../assets/img/smart_fondo.png')";
   }
  
    ngOnInit(): void {
    }
  
  
  }
  