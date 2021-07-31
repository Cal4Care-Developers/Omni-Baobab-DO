import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addDept: FormGroup;
  editDept: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  dep_status; 
  dep_id;
  agents_list;
  userchecked;

  constructor(private serverService: ServerService) { }


  ngOnInit() {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.addDept = new FormGroup({
     'department_name' : new FormControl(null,Validators.required),
     'report_path' : new FormControl(null,Validators.required),

     
    });
 
     this.editDept = new FormGroup({
      'department_name' : new FormControl(null,Validators.required),
      'report_path'    : new FormControl(null,Validators.required),

    });
    this.dept_settings();
   }

dept_settings(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"list_report"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.status==true){
     
      this.queue_list = response.result.data;
      console.log(this.queue_list);
    } else {
      this.recordNotFound = true;
    }
  }, 
  (error)=>{
      console.log(error);
  });
}






editDepartmentSettings(id){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_report","id":"'+id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.status==true){
      var agent_data = response.result.data;
      this.editDept.setValue({
         'department_name' : agent_data.report_name,
         'report_path' :    agent_data.report_url,

     });
     this.dep_id = response.result.data.id;

  

     $('#edit_deptform').modal('show');
     this.dept_settings();
    }   else{
            
      iziToast.warning({
          message: "Wrap Up codes not retrive. Please try again",
          position: 'topRight'
      });
  
}
  }, 
  (error)=>{
      console.log(error);
  });
}

addDepartment(){
  $('#add_deptform').modal('show');
}


editDepartment(id){


  let agent_req:any = this.editDept.value;
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_report","id":"'+id+'","report_name":"'+agent_req.department_name+'","report_url":"'+agent_req.report_path+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {
              $('#edit_deptform').modal('hide');
              this.dept_settings();
              iziToast.success({
                  message: "WrapUp updated successfully",
                  position: 'topRight'
              });
          } else {
          
              iziToast.warning({
                  message: "WrapUp not updated. Please try again",
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



addDeptData(){


let agent_req:any = this.addDept.value;
// if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_report","report_name":"'+agent_req.department_name+'","report_url":"'+agent_req.report_path+'"}}';
  
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
                $('#add_deptform').modal('hide');
                iziToast.success({
                    message: "Wrap Up Code added successfully",
                    position: 'topRight'
                });
                this.dept_settings();
            }
            else if (response.result.data == 2) {
              iziToast.warning({
                  message: "Wrap Up Code name already inserted",
                  position: 'topRight'
              });
          }
        else{
            
                iziToast.error({
                    message: "Wrap Up Code not added. Please try again",
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






  // deletedata(id){
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.value) {
  //       let access_token: any=localStorage.getItem('access_token');
  //       let admin_id: any=localStorage.getItem('admin_id');
  // let api_req:any = '{"operation":"contact", "moduleType": "contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_auxcode","id":"'+id+'","admin_id":"'+admin_id+'"}}';

  // this.serverService.sendServer(api_req).subscribe((response:any) => {
  //   if(response.result.data==1){
  //     Swal.fire(
  //       'Deleted!',
  //       'success'
  //     );
  //     this.dept_settings();
  //   }

  // }, 
  // (error)=>{
  //     console.log(error);
  // });
  //     }
  //   })
  // }



}

