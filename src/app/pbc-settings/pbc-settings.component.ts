import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pbc-settings',
  templateUrl: './pbc-settings.component.html',
  styleUrls: ['./pbc-settings.component.css']
})
export class PbcSettingsComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addPbx: FormGroup;
  editPbx: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  queue_length;
  constructor(private serverService: ServerService) { }


  ngOnInit() {
    this.uadmin_id = localStorage.getItem('userId');
    this.addPbx = new FormGroup({
     'sip_port' : new FormControl(null),
     'sip_url' : new FormControl(null),
     'status':  new FormControl(null)
    });
 
 
     this.editPbx = new FormGroup({
      'sip_port' : new FormControl(null),
      'sip_url' : new FormControl(null),
      'status':  new FormControl(null)
    });
    this.pbc_settings();
    this.pbc_details();
   }

pbc_settings(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_pbx_settings","user_id":"'+this.uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      this.queue_list = response.result.data;
      this.queue_length = Object.keys(response.result.data).length;;
    } else {
      this.recordNotFound = true;
    }
  }, 
  (error)=>{
      console.log(error);
  });
}


pbc_details(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_pbx_details","user_id":"'+this.uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
   this.pbx_count = response.result.data[0].pbx_count;
    } 
  }, 
  (error)=>{
      console.log(error);
  });
}

editPbc(pbx){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_single_pbx_settings","pbx_id":"'+pbx+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      var agent_data = response.result.data[0];
      this.editPbx.setValue({
         'sip_port' : agent_data.sip_port,
         'sip_url' : agent_data.sip_url,
         'status' : agent_data.status,
     });
     this.old_sip_url = pbx;

     if(agent_data.status == 1){
      $('#status').prop('checked', true);
     } else {
      $('#status').prop('checked', false);
     }

     $('#edit_pbxform').modal('show');
     this.pbc_settings();
    }   else{
            
      iziToast.warning({
          message: "PBX data could not retrive. Please try again",
          position: 'topRight'
      });
  
}
  }, 
  (error)=>{
      console.log(error);
  });
}

addpbx(){
  $('#add_pbxform').modal('show');
}
editPbxData(main_url){
console.log(main_url);

  let agent_req:any = this.editPbx.value;
  console.log(agent_req.sip_id)
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_single_pbx_settings","sip_port":"'+agent_req.sip_port+'","sip_url":"'+agent_req.sip_url+'","edit_fom_url":"'+main_url+'","admin_id":"'+this.uadmin_id+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == 1) {
              $('#edit_pbxform').modal('hide');
              this.pbc_settings();
              iziToast.success({
                  message: "PBX updated successfully",
                  position: 'topRight'
              });
          }
      else{
          
              iziToast.warning({
                  message: "PBX not updated. Please try again",
                  position: 'topRight'
              });
          
      }

  },
  (error) => {
       iziToast.error({
          message: "Sorry, some server issue occur. Please contact admin",
          position: 'topRight'
      });
      console.log(error);
  });
}



addPbxData(){
  
    let agent_req:any = this.addPbx.value;
    console.log(agent_req.sip_id)
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_single_pbx_settings","sip_port":"'+agent_req.sip_port+'","sip_url":"'+agent_req.sip_url+'","admin_id":"'+this.uadmin_id+'"}}';
  
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == 1) {
                $('#add_pbxform').modal('hide');
              
                iziToast.success({
                    message: "PBX added successfully",
                    position: 'topRight'
                });
                this.pbc_settings();
            }
        else{
            
                iziToast.warning({
                    message: "PBX not updated. Please try again",
                    position: 'topRight'
                });
            
        }
  
    },
    (error) => {
         iziToast.error({
            message: "Sorry, some server issue occur. Please contact admin",
            position: 'topRight'
        });
        console.log(error);
    });
  
  
  
  }

  deletedata(id){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        let access_token: any=localStorage.getItem('access_token');
        let admin_id: any=localStorage.getItem('admin_id');
  let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_pbx","id":"'+id+'","admin_id":"'+admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.data==1){
      Swal.fire(
        'Deleted!',
        'success'
      );
      this.pbc_settings();
      this.pbc_details();
    }

  }, 
  (error)=>{
      console.log(error);
  });
      }
    })
  }
}
