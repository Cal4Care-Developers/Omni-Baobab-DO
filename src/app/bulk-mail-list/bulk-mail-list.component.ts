import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ServerService } from '../services/server.service';
declare var $:any
@Component({
  selector: 'app-bulk-mail-list',
  templateUrl: './bulk-mail-list.component.html',
  styleUrls: ['./bulk-mail-list.component.css']
})
export class BulkMailListComponent implements OnInit {

  constructor(private serverService: ServerService) { }

  queue_list;
  admin_id;
  recordNotFound = false;
  subject;

  ngOnInit(): void {
    this.admin_id = localStorage.getItem('admin_id');

    this.get_mails();
  }
  get_mails(){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"email_blasting", "moduleType":"email_blasting", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_emails_list","admin_id":"'+this.admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
       
        this.queue_list = response.result.data;

       // console.log(this.queue_list);
      } else {
        this.recordNotFound = true;
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }
  viewmail(message,sub){
    // console.log(message);
this.subject=sub;
    let mess =atob(message);
 
$('#template_view').html(mess);
$('#view_mail').modal('show');
  }
}
