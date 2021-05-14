import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';

declare var $:any;
declare var iziToast:any;
declare var tinymce:any;

@Component({
  selector: 'app-bulk-email',
  templateUrl: './bulk-email.component.html',
  styleUrls: ['./bulk-email.component.css']
})
export class BulkEmailComponent implements OnInit {
  compSMS: FormGroup;
  compGroupSMS: FormGroup;
  senders_list;
  admin_id;
  uadmin_id;
  show_sender = false;
  singleSMS = true;
  bulkSMS = false;
  groups_list;
  price_sms
  constructor(private serverService: ServerService, private router:Router,private http:HttpClient) { 
  
    this.compGroupSMS = new FormGroup({
      'group' :new FormControl(null),
      'subject' :new FormControl(null,Validators.required)    });
  }

  ngOnInit() {
    this.admin_id = localStorage.getItem('admin_id');
    this.uadmin_id = localStorage.getItem('userId');    
    this.smsGroups();
  }
  embTemp(){
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json'
    //   })
    // };
    // let temp= this.http.get('http://www.google.com');
    //  console.log(temp)
    let template=$('#dialer_type').val();
   
if(template==''|| template==null)
       tinymce.activeEditor.setContent('');
else{
    let temp=$('#'+template).html();
    console.log(temp);
    tinymce.activeEditor.setContent(temp, {format: 'raw'});
}
  }







smsGroups(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"email_blasting", "moduleType":"email_blasting", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"list_emailgroup","admin_id":"'+this.uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.status==true){
     
      this.groups_list = response.result.data;
      console.log(this.groups_list);
    } 
  }, 
  (error)=>{
      console.log(error);
  });
}







sendGroupSMS(){
  console.log(this.compGroupSMS.value);
  var myContent = tinymce.get("myTextarea").getContent();

if(this.compGroupSMS.value.group == null){
  iziToast.error({
    message: "Please Select The Group",
    position: 'topRight'
  });
  return false;
}


if(myContent == null){
  iziToast.error({
    message: "Please enter the message",
    position: 'topRight'
  });
  return false;
}


  let api_req:any = new Object();
  let chat_req:any = new Object();
  chat_req.action="ComposeBulkEmail";
  chat_req.group=this.compGroupSMS.value.group;
  chat_req.user_id=localStorage.getItem('userId');
  chat_req.admin_id=localStorage.getItem('admin_id');
  chat_req.timezone_id=localStorage.getItem('timezone_id');
  chat_req.sender_id=$('#group').val();
  chat_req.chat_message=myContent;
  chat_req.chat_sub=this.compGroupSMS.value.subject;
  api_req.operation="email_blasting";
  api_req.moduleType="email_blasting";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  api_req.element_data = chat_req;
  

  
        this.serverService.sendServer(api_req).subscribe((response:any) => {

          if(response.result.data==1){
            iziToast.success({
              message: "Eamil sent successfully",
              position: 'topRight'
            });
            this.router.navigate(['../mc']);
          } else {
            iziToast.warning({
              message: "Some error occured. Please try again",
              position: 'topRight'
          });
          }
                  
          }, 
          (error)=>{
              console.log(error);
          });
}


}
