import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { UserIdleService } from 'angular-user-idle';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm:FormGroup;
    loginFormTemp = true;
    sendotp = false;
    sendotpmain= false;
    userIdle;
    constructor(private serverService: ServerService, private router:Router) { }
    loginError = "";
    loginSuccess = "";

      ngOnInit() {
           
            this.loginForm = new FormGroup({
                'user_name' : new FormControl(null,Validators.required),
                'company_name' : new FormControl(null,Validators.required),
                'password' : new FormControl(null,Validators.required)
            });
          
            if(localStorage.getItem('access_token')) {
                this.router.navigate(['/']);
                return true;

            }

    //Start watching for user inactivity.
    this.userIdle.startWatching();
    
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => console.log('Time is up!'));
      }
    



      stop() {
        this.userIdle.stopTimer();
      }
     
      stopWatching() {
        this.userIdle.stopWatching();
      }
     
      startWatching() {
        this.userIdle.startWatching();
      }
     
      restart() {
        this.userIdle.resetTimer();
      }
      userLogin(){

        let loginReq:any = this.loginForm.value;
          let api_req:any = new Object();
          loginReq.action="login_validation";
          api_req.operation="login";
          api_req.moduleType="login";
          api_req.api_type="web";
          api_req.element_data=loginReq;
                this.serverService.sendServer2(api_req).subscribe((response:any) => {
                    
                    //return false;
                    if(response.data == 1 ){
                      this.sendotp = true;
                      this.loginFormTemp = false;
                      // this.loginSuccess = "Please Enter the OTP";
                      this.loginError="";
                        } else if(response.result.status==1){
                       
                            localStorage.setItem('access_token', response.access_token); 
                            localStorage.setItem('userId', response.result.data.user_id); 
                            localStorage.setItem('user_name', response.result.data.user_name);  
                            localStorage.setItem('user_type', response.result.data.userType); 
                            localStorage.setItem('profile_image', response.result.data.profile_image);   
                            localStorage.setItem('logo_image', response.result.data.logo_image);
                            localStorage.setItem('small_logo_image', response.result.data.small_logo_image);
                            localStorage.setItem('theme', response.result.data.theme);
                            localStorage.setItem('layout', response.result.data.layout);
                            localStorage.setItem('timezone_id', response.result.data.timezone_id);
                            localStorage.setItem('admin_id', response.result.data.admin_id);
                            localStorage.setItem('dsk_access', response.result.data.dsk_access);
                            localStorage.setItem('hardware_id', response.result.data.hardware_id);
                            localStorage.setItem('has_external_contact', response.result.data.has_external_contact);
                            localStorage.setItem('external_contact_url', response.result.data.external_contact_url);
                            localStorage.setItem('show_caller_id', response.result.data.show_caller_id);
                            localStorage.setItem('has_reports', response.result.data.reports);
                            localStorage.setItem('whatsapp_account', response.result.data.whatsapp_account);
                            localStorage.setItem('fb_account', response.result.data.facebook_account);
                            localStorage.setItem('predective_dialer_behave', response.result.data.predective_dialer_behave);
                            localStorage.setItem('crm_type', response.result.data.crm_type);
                            localStorage.setItem('price_sms', response.result.data.price_sms);
                            localStorage.setItem('has_line', response.result.data.has_fax);
                            localStorage.setItem('encAdmin', response.result.data.encAdmin);
                            localStorage.setItem('encUser', response.result.data.encUser);

                            // localStorage.setItem('has_tele', response.result.data.has_telegram);
                            localStorage.setItem('N_token','');
                            localStorage.setItem('company_name',response.result.data.company_name);
                            localStorage.setItem('reseller', response.result.data.reseller);
                            localStorage.setItem('ext_int_status', response.result.data.ext_int_status);
                            this.loginError="";
                            this.loginSuccess = "You have successfully logged in";
                            this.loginForm.reset();
                            this.router.navigate(['/mc']);
                            
                        } 
                        else{
                            this.serverService.sendServer(api_req).subscribe((response:any) => {
                              if(response.result.status==1){                                localStorage.setItem('access_token', response.access_token); 
                                localStorage.setItem('userId', response.result.data.user_id); 
                                localStorage.setItem('user_name', response.result.data.user_name);  
                                localStorage.setItem('user_type', response.result.data.userType); 
                                localStorage.setItem('profile_image', response.result.data.profile_image);   
                                localStorage.setItem('logo_image', response.result.data.logo_image);
                                localStorage.setItem('small_logo_image', response.result.data.small_logo_image);
                                localStorage.setItem('theme', response.result.data.theme);
                                localStorage.setItem('layout', response.result.data.layout);
                                localStorage.setItem('timezone_id', response.result.data.timezone_id);
                                localStorage.setItem('admin_id', response.result.data.admin_id);
                                localStorage.setItem('dsk_access', response.result.data.dsk_access);
                                localStorage.setItem('hardware_id', response.result.data.hardware_id);
                                localStorage.setItem('has_external_contact', response.result.data.has_external_contact);
                                localStorage.setItem('external_contact_url', response.result.data.external_contact_url);
                                localStorage.setItem('show_caller_id', response.result.data.show_caller_id);
                                localStorage.setItem('has_reports', response.result.data.reports);
                                localStorage.setItem('whatsapp_account', response.result.data.whatsapp_account);
                                localStorage.setItem('fb_account', response.result.data.facebook_account);
                                localStorage.setItem('predective_dialer_behave', response.result.data.predective_dialer_behave);
                                localStorage.setItem('crm_type', response.result.data.crm_type);
                                localStorage.setItem('price_sms', response.result.data.price_sms);
                                localStorage.setItem('has_line', response.result.data.has_fax);
                                localStorage.setItem('encAdmin', response.result.data.encAdmin);
                                localStorage.setItem('encUser', response.result.data.encUser);    
                                // localStorage.setItem('has_tele', response.result.data.has_telegram);
                                localStorage.setItem('N_token','');
                                localStorage.setItem('company_name',response.result.data.company_name);
                                localStorage.setItem('reseller', response.result.data.reseller);
                                localStorage.setItem('ext_int_status', response.result.data.ext_int_status);
                                this.loginError="";
                                this.loginSuccess = "You have successfully logged in";
                                this.loginForm.reset();
                                this.router.navigate(['/mc']);
                              }else{
                                this.loginSuccess = "";
                                this.loginError="Please enter the valid company name, username and password";
                              }
                            });
                            

                        }

                    }, 
                    (error)=>{
                        console.log(error);
                    });
    

  }







  loginVia(type){
  let loginReq:any = this.loginForm.value;
    let api_req:any = new Object();
    loginReq.action="send_otp";
    api_req.operation="login";
    api_req.moduleType="login";
    api_req.api_type="web";
    api_req.element_data=loginReq;
    api_req.element_data.method = type;

          this.serverService.sendServer(api_req).subscribe((response:any) => {
            if(response.data==1){
              this.sendotp = false;
              this.sendotpmain = true;
              this.loginSuccess = "Please Enter the OTP";
              this.loginError="";
            } 
          }, 
            (error)=>{
                console.log(error);
            });
 }


sendOTPLogin(){  
    var otp =   $('#otp').val();
    let loginReq:any = this.loginForm.value;
    let api_req:any = new Object();
    loginReq.action="check_otp";
    loginReq.otp = otp;
    api_req.operation="login";
    api_req.moduleType="login";
    api_req.api_type="web";
    api_req.element_data=loginReq;
          this.serverService.sendServer(api_req).subscribe((response:any) => {
              
              
                  if(response.result.status==1){
                  
                      localStorage.setItem('access_token', response.access_token); 
                      localStorage.setItem('userId', response.result.data.user_id); 
                      localStorage.setItem('user_name', response.result.data.user_name);  
                      localStorage.setItem('user_type', response.result.data.userType); 
                      localStorage.setItem('profile_image', response.result.data.profile_image);   
                      localStorage.setItem('logo_image', response.result.data.logo_image);
                      localStorage.setItem('small_logo_image', response.result.data.small_logo_image);
                      localStorage.setItem('theme', response.result.data.theme);
                      localStorage.setItem('layout', response.result.data.layout);
                      localStorage.setItem('timezone_id', response.result.data.timezone_id);
                      localStorage.setItem('admin_id', response.result.data.admin_id);
                      localStorage.setItem('dsk_access', response.result.data.dsk_access);
                      localStorage.setItem('hardware_id', response.result.data.hardware_id);
                      localStorage.setItem('has_external_contact', response.result.data.has_external_contact);
                      localStorage.setItem('external_contact_url', response.result.data.external_contact_url);
                      localStorage.setItem('show_caller_id', response.result.data.show_caller_id);
                      localStorage.setItem('has_reports', response.result.data.reports);
                      localStorage.setItem('whatsapp_account', response.result.data.whatsapp_account);
                      localStorage.setItem('predective_dialer_behave', response.result.data.predective_dialer_behave);
                      localStorage.setItem('crm_type', response.result.data.crm_type);
                      localStorage.setItem('price_sms', response.result.data.price_sms);
                      localStorage.setItem('company_name',response.result.data.company_name);
                      localStorage.setItem('ext_int_status', response.result.data.ext_int_status);
                      
                      localStorage.setItem('N_token','');
                      this.loginError="";
                      this.loginSuccess = "You have successfully logged in successfully";
                      this.loginForm.reset();
                      this.router.navigate(['/mc']);
                      
                  }
                  else{

                        this.loginSuccess = "";
                        this.loginError="Please enter the valid otp";

                  }

              }, 
              (error)=>{
                  console.log(error);
              });
    

  }


  backToLogin(){
    this.sendotp = false;
    this.loginFormTemp = true;
  }


}
