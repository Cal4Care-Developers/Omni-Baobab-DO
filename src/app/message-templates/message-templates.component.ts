import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-message-templates',
  templateUrl: './message-templates.component.html',
  styleUrls: ['./message-templates.component.css']
})
export class MessageTemplatesComponent implements OnInit {
  @ViewChild('chat_message', {static: false}) chat_message : ElementRef;

  queue_list;
  recordNotFound = false; 
  addDept: FormGroup;
  editDept: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  dep_status; 
  dep_id;
  pageLimit = 20;
  agents_list;
  userchecked;
  Mqueue_list;
  doc_link;
  dept_list;
  constructor(private serverService: ServerService) { }


  ngOnInit() {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.addDept = new FormGroup({
    //  'template' : new FormControl(null,Validators.required),
     'template_name' : new FormControl(null,Validators.required)

    });
 
     this.editDept = new FormGroup({
      // 'template' : new FormControl(null,Validators.required),
      'template_name' : new FormControl(null,Validators.required)
    });
    this.dept_settings();
    this.get_dept_list();
    
   }

dept_settings(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"template", "moduleType":"template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"listTemplate","admin_id":"'+this.uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
     
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

get_dept_list(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_dept_settings","user_id":"'+this.uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
     
      this.dept_list = response.result.data;
      console.log(this.dept_list);
    } else {
      this.recordNotFound = true;
    }
  }, 
  (error)=>{
      console.log(error);
  });
}


listDataInfo(list_data){

  list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
  list_data.order_by_name = list_data.order_by_name == undefined ? "queue.queue_id" : list_data.order_by_name;
  list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
  list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
  list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
  return list_data;
}


  



editDepartmentSettings(id){
  // alert("test");
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"template", "moduleType": "template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"getSingleTemplateData","template_id":"'+id+'","admin_id":"'+this.uadmin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      var agent_data = response.result.data;
      this.editDept.setValue({
        //  'template' : agent_data.template_message,
         'template_name' : agent_data.template_name
     });
     this.dep_id = response.result.data.template_id;
// alert(agent_data.department);
$('#template').val(agent_data.template_message);

let checked= agent_data.department.split(",");

     $('#Upd_queue_no').val(checked);

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

  let api_req:any = new Object();
  let agent_req:any = this.editDept.value;
  let access_token: any=localStorage.getItem('access_token');
let content: any= $('#template').val();
// content=content.replace(/\n/ig,' ');

  let queue_no: any= $('#Upd_queue_no').val().join();
 
  api_req.operation="template";
  api_req.moduleType="template";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
api_req.element_data = this.editDept.value;
api_req.element_data.department= queue_no;
api_req.element_data.template_id= id;
api_req.element_data.admin_id=this.uadmin_id;
api_req.element_data.template_content=content;
api_req.element_data.action="updateSmsTemplate";
//  alert(id);
  // if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
  // let api_req:any = '{"operation":"template", "moduleType": "template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"updateSmsTemplate","template_content":"'+content+'","template_name":"'+agent_req.name+'","department":"'+queue_no+'","template_id":"'+id+'","admin_id":"'+this.uadmin_id+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == 1) {
              $('#edit_deptform').modal('hide');
              this.dept_settings();
              iziToast.success({
                  message: "Template updated successfully",
                  position: 'topRight'
              });
          } else {
              iziToast.warning({
                  message: "Template not updated. Please try again",
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
  let api_req:any = new Object;
var content=  this.chat_message.nativeElement.value;

let queue_no: any= $('#queue_no').val().join();
api_req.operation="template";
api_req.moduleType="template";
api_req.api_type="web";
api_req.access_token=localStorage.getItem('access_token');
api_req.element_data = this.addDept.value;
api_req.element_data.department= queue_no;
api_req.element_data.admin_id=this.uadmin_id;
api_req.element_data.template_content=content;
api_req.element_data.action="addSmsTemplate";
    let access_token: any=localStorage.getItem('access_token');
  
    // let api_req:any = '{"operation":"template", "moduleType": "template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"addSmsTemplate","template_name":"'+agent_req.name+'","template_content":"'+content.trim()+'","department":"'+queue_no +'","admin_id":"'+this.uadmin_id+'"}}';
  
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
                $('#add_deptform').modal('hide');
                iziToast.success({
                    message: "Template added successfully",
                    position: 'topRight'
                });
                this.dept_settings();
            }
            else if (response.result.data == 2) {
              iziToast.warning({
                  message: "Template name already inserted",
                  position: 'topRight'
              });
          }
        else{
            
                iziToast.error({
                    message: "Template not added. Please try again",
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
        // let api_req:any = '{"operation":"contact", "moduleType": "contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_auxcode","id":"'+id+'","admin_id":"'+admin_id+'"}}';
        let api_req:any = '{"operation":"template", "moduleType": "template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"deleteTemplate","template_id":"'+id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.data==1){
      Swal.fire(
        'Deleted!',
        'success'
      );
      this.dept_settings();
    }

  }, 
  (error)=>{
      console.log(error);
  });
      }
    })
  }

  showdoc(link){   
    this.doc_link=link;
   $("#document_model").modal('show');   
  }

}

