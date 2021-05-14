import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent implements OnInit {

  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit() {
  }







 sendDetails(){
    let email: any=$('#email').val();
      if(email == ''){
        iziToast.warning({
          message: "Please enter the valid email",
          position: 'topRight'
      });
      return false;
      }


    let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "element_data":{"action":"forgot_password","email":"'+email+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
          iziToast.success({
            message: "Password was sent to your email",
            position: 'topRight'
        });
        this.router.navigate(['/forgot-pwd']);
      } else {
        iziToast.warning({
          message: "Please enter the valid email",
          position: 'topRight'
      });
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }
  





}
