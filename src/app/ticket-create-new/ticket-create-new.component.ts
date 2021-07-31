import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
// import { EditorModule } from "@tinymce/tinymce-angular";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

import Swal from 'sweetalert2'

declare var $:any;
declare var iziToast:any;
declare var tinymce:any;
export interface Collobrator {
  email_name: string;
}
export interface EmailAddress {
  email_to: string;
}
@Component({
  selector: 'app-ticket-create-new',
  templateUrl: './ticket-create-new.component.html',
  styleUrls: ['./ticket-create-new.component.css']
})
export class TicketCreateNewComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  showdept = false;
  showassign = false;
  showstatus = false;
  showpriority = false;
  presentEmails = false;
  showtoEmail = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  collobrators: Collobrator[] = [ ];
  EmailToAddress: EmailAddress[] = [ ];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const input = event.input;

    if (value) {
      this.collobrators.push({email_name: value}); 
    }
    if (input) {
      input.value = '';
    }

  }

  remove(collobrator: Collobrator): void {
    const index = this.collobrators.indexOf(collobrator);

    if (index >= 0) {
      this.collobrators.splice(index, 1);
    }
  }

//CC Collabrator End
//TO Address 

addTo(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  const input = event.input;

    // var filtered = this.EmailToAddress.filter(
    //   function(value) {
    //     return 
    //   });

    let myItems = this.EmailToAddress.filter(item => item.email_to === value);
    console.log(myItems.length);

    // Add our fruit
    if (myItems.length < 1) {
      this.presentEmails = false;
      // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"check_to_email","to_email":""}}

      let api_req: any = new Object();
      let chat_req: any = new Object();
      chat_req.action = "check_to_email";
      chat_req.to_email = value;
      api_req.operation = "ticket";
      api_req.moduleType = "ticket";
      api_req.api_type = "web";
      api_req.access_token = localStorage.getItem('access_token');
      api_req.element_data = chat_req;
      this.serverService.sendServer(api_req).subscribe((response: any) => {

        if (response.result.data == 1) {
          this.presentEmails = true;
          // this.email_error_msg = 'This wrapCode already existed';
        } else {

          if (value) {
            this.EmailToAddress.push({ email_to: value });
          }
          if (input) {
            input.value = '';
          }

        }


      });



    } else {
      this.presentEmails = true;
    }
    // Clear the input value
    // event.chipInput!.clear();
  }

removeTo(EmailAddress: EmailAddress): void {
  const index = this.EmailToAddress.indexOf(EmailAddress);

  if (index >= 0) {
    this.EmailToAddress.splice(index, 1);
  }
}
//TO Address  END



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
  sel_agent='Select Agent';
  email_from="omni@pipe.mconnectapps.com";
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute) { }
  userEmails = new FormGroup({
    primaryEmail: new FormControl('',[
      Validators.required
      // Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ])
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
      toolbar : 'undo redo| fullscreen | formatselect | fontselect | fontsizeselect| bold italic | \ undo redo | link image file| code | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | help',
  
      content_style: 'body {font-size: 10pt;font-family: Verdana;}',
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
    // var EmailTo=$('#email_to').val();
    // var email_cc=$('#email_cc').val();

    var email_cc = this.getFields(this.collobrators, "email_name"); 
var EmailTo = this.getFields(this.EmailToAddress, "email_to"); 



    // if (EmailTo == null || EmailTo == undefined || EmailTo == '') {
    //   iziToast.warning({
    //     message: "Enter To Email Address",
    //     position: 'topRight'
    //   });
    //   return false;
    // }
    // if (!this.email_from) {
    //   iziToast.warning({
    //     message: "Please choose from Email to send",
    //     position: 'topRight'
    //   });
    //   return false;
    // }


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
agent_req.from_address=this.email_from;
var formData = new FormData();
if((<HTMLInputElement>document.getElementById('create_file')).value != null){
  var ins = (<HTMLInputElement>document.getElementById('create_file')).files.length;
      for (var x = 0; x < ins; x++) {
        formData.append("up_files[]", (<HTMLInputElement>document.getElementById('create_file')).files[x]);
      }
    }
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
    formData.append('from_address', this.email_from);
    formData.append('mail_cc', email_cc);
    // formData.append('up_files', $('#create_file')[0].files[0]);

    // formData.append('logo_image', $('#logo_image')[0].files[0]);
    // formData.append('small_logo_image', $('#small_logo_image')[0].files[0]);
    // formData.append('user_id', user_id);
    // formData.append('element_data', json_arr);

    if (Dept == null || Dept == '') {
      this.showdept = true;
    } else {
      this.showdept = false;
    }

    if (agent == null || agent == '') {
      this.showassign = true;
    } else {
      this.showassign = false;
    }

    if (status == null || status == '') {
      this.showstatus = true;
    } else {
      this.showstatus = false;
    }

    if (priority == null || priority == '') {
      this.showpriority = true;
    } else {
      this.showpriority = false;
    }

    if (EmailTo == null || EmailTo == '') {
      this.showtoEmail = true;
    } else {
      this.showtoEmail = false;
    }
    console.log(formData);


    if (Dept != '' && agent != '' && status != '' && priority != '' && EmailTo != '') {

      Swal.fire({
        title: 'Please Wait',
        allowEscapeKey: false,
        allowOutsideClick: false,
        //  background: '#19191a',
        showConfirmButton: false,
        onOpen: () => {
          Swal.showLoading();
        }
      });

      // return  false;

      $.ajax({
        url: "https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
        type: 'POST',
        data: formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,
        success: function (data) {
          this.parsed_data = JSON.parse(data);
          console.log(this.parsed_data);
          Swal.close();
          // if(this.parsed_data.result.status == "Message has been sent successfully"){   
          if (this.parsed_data.data == "Message has been sent successfully") {

        $("#refresh_profile").click();
        iziToast.success({
          message: "Ticket has been sent successfully",
          position: 'topRight'
      });
      // this.router.navigate(['/ticketing-system-new']);
    // $("#NavigateFunc").click();
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

  }
  NavigateFunc(){
    this.router.navigate(['/ticketing-system-new']);

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
selectFromEmail(from){
  // if(from=='newz')
  // this.email_from="omni@pipe.mconnectapps.com";
  // else
  this.email_from="omni@pipe.mconnectapps.com";
}
getFields(input, field) {
  var output = [];
  for (var i=0; i < input.length ; ++i)
      output.push(input[i][field]);
  return output.toString();
}

}
