import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
// import { EditorModule } from "@tinymce/tinymce-angular";
import Swal from 'sweetalert2'

declare var $:any;
declare var iziToast:any;
declare var tinymce:any;
@Component({
  selector: 'app-ticket-create-new',
  templateUrl: './ticket-create-new.component.html',
  styleUrls: ['./ticket-create-new.component.css']
})
export class TicketCreateNewComponent implements OnInit {
  admin_id;
  user_id;
  user_type_;
  user_type;
  agents_options;
  department_options;
  priority_options;
  status_options;
  richTextArea_id;
  sel_priority='Select Priority';
  sel_Dept='Select Department';
  sel_status='Select Status';
  sel_agent='Select Agent'
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute) { }
  userEmails = new FormGroup({
    primaryEmail: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
    });  
  ngOnInit() {
    this.user_type_ = localStorage.getItem('user_type');
    if(this.user_type_ == 'Employee')
      this.user_type =3;    
    else if(this.user_type_ == 'Admin')
       this.user_type =2;

    this.admin_id = localStorage.getItem('admin_id');
    this.user_id = localStorage.getItem('userId');
    this.richTextArea_id='richTextArea';

    this.initTiny();
    // this.initTiny();
		
    this.getAlldetailsOfAgents();
  }
  getAlldetailsOfAgents(){
    let access_token: any=localStorage.getItem('access_token');
    // var subject = $('#subject').val();
    // var description = btoa(tinymce.activeEditor.getContent());
    // console.log(tinymce.activeEditor.getContent());

    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"getAlldetailsOfAgents","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status="true"){
      // this.agents_options=response.agents_options;
      this.department_options=response.department_options;
      this.priority_options=response.priority_options;
      this.status_options=response.status_options;
      }
      else{
        iziToast.warning({
          message: "Sorry not able to fetch Data.Please contact Admin",
          position: 'topRight'
        })
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }

  initTiny(){
    
    tinymce.init({
      selector : '.richTextArea',
      plugins : 'advlist autolink lists link  image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste help wordcount autolink lists media table',
      toolbar : 'undo redo | formatselect | bold italic | \ undo redo | link image file| code | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | help',
  
      images_upload_url : 'upload.php',
      automatic_uploads : false,
  
      images_upload_handler : function(blobInfo, success, failure) {
        var xhr, formData;
  
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', 'upload.php');
  
        xhr.onload = function() {
          var json;
  
          if (xhr.status != 200) {
            failure('HTTP Error: ' + xhr.status);
            return;
          }
  
          json = JSON.parse(xhr.responseText);
  
          if (!json || typeof json.file_path != 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
          }
  
          success(json.file_path);
        };
  
        formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
  
        xhr.send(formData);
      },
    });
  }
  createNewTicket(){
    let agent_req:any = new Object();
    let access_token: any=localStorage.getItem('access_token');
    var subject = $('#subject').val();
    var description = btoa(tinymce.activeEditor.getContent());
    console.log(tinymce.activeEditor.getContent());
    var priority=$('#PickPriority').val();
    var status=$('#PickStatus').val();
    var Dept=$('#PickDepartment').val();
    var agent=$('#PickAgents').val();
    var EmailTo=$('#email_to').val();
if(!this.userEmails.get('primaryEmail').valid){
  iziToast.warning({
    message:"Enter valid Email Address",
    position:'topRight'
  });
  return false;
}
Swal.fire({
  title: 'Please Wait',
  allowEscapeKey: false,
  allowOutsideClick: false,
//  background: '#19191a',
  showConfirmButton: false,
  onOpen: ()=>{
      Swal.showLoading();
  }
});
agent_req.action='createExternalTicket';
agent_req.subject=subject;
agent_req.description=description;
agent_req.department=Dept;
agent_req.status=status;
agent_req.priority_id=priority;
agent_req.admin_id=this.admin_id;
agent_req.user_id=this.user_id;
agent_req.agent_id=agent;
agent_req.to=EmailTo;
var formData = new FormData();

var json_arr = JSON.stringify(agent_req);
    formData.append('operation', 'ticket');
    formData.append('moduleType', 'ticket');
    formData.append('api_type', 'web');
    formData.append('action', 'createExternalTicket');
    formData.append('subject', subject);
    formData.append('description',description);
    formData.append('department',Dept);
    formData.append('status', status);
    formData.append('priority_id',priority);
    formData.append('admin_id', this.admin_id);
    formData.append('user_id', this.user_id);
    formData.append('agent_id',agent);
    formData.append('to', EmailTo);
    formData.append('up_files', $('#create_file')[0].files[0]);
    // formData.append('logo_image', $('#logo_image')[0].files[0]);
    // formData.append('small_logo_image', $('#small_logo_image')[0].files[0]);
    // formData.append('user_id', user_id);
    // formData.append('element_data', json_arr);


    console.log(formData);
  
  $.ajax({  
    url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",  
    type : 'POST',
    data : formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false, 
    success:function(data){ 
      this.parsed_data = JSON.parse(data);
      console.log(this.parsed_data );
      if(this.parsed_data.result.status == "Message has been sent successfully"){   
        $("#refresh_profile").click();
        iziToast.success({
          message: "Message has been sent successfully",
          position: 'topRight'
      });
      this.router.navigate(['/ticketing-system-new']);
      }
      else{
        iziToast.error({
          message: "Sorry, Some Error Occured,Please contact Admin",
          position: 'topRight'
      });
    
      }
    }  
});  

  }

  PickDepartment(data,value){
    this.sel_Dept=value
    $('#PickDepartment').val(data);
    // alert( $('#PickDepartment').val());
    this.editDepartmentSettings(data);
  }
PickAgents(data,value){
  this.sel_agent=value
    $('#PickAgents').val(data);
}
PickStatus(data,value){
  this.sel_status=value;
    $('#PickStatus').val(data);
    // alert( $('#PickStatus').val());
    
}
PickPriority(data,value){
  this.sel_priority=value;
  $('#PickPriority').val(data);
    // alert( $('#PickPriority').val());
}
editDepartmentSettings(id){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_agents_by_department","dept_id":"'+id+'","admin_id":"'+this.admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      // console.log(response);
      this.agents_options = response.result.data;  
}
  }, 
  (error)=>{
      console.log(error);
  });
}
}
