import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-chat-ratings',
  templateUrl: './chat-ratings.component.html',
  styleUrls: ['./chat-ratings.component.css']
})
export class ChatRatingsComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addDept: FormGroup;
  editDept: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  dep_status; 
  dep_id;
  chat_panel_list
  loginUser
  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.loginUser = localStorage.getItem('userId');
    this.addDept = new FormGroup({
     'department_name' : new FormControl(null,Validators.required),
    });
 
     this.editDept = new FormGroup({
      'department_name' : new FormControl(null,Validators.required),
    });
    this.chatPanelView();
   }



   chatPanelView(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_list","user_id":"'+this.loginUser+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
     
      this.chat_panel_list = response.result.data;
    } else {
      this.recordNotFound = true;
    }
  }, 
  (error)=>{
      console.log(error);
  });
}

}
