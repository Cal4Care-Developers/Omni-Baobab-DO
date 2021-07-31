import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
// import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
declare var tinymce:any;
declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-ticket-template',
  templateUrl: './ticket-template.component.html',
  styleUrls: ['./ticket-template.component.css']
})
export class TicketTemplateComponent implements OnInit {
  richTextArea_id;
  admin_id;
  response_content;
  access_token;
  filteredvalues;
  constructor(private serverService:ServerService) { }

  ngOnInit(): void {
    // $('#auto_reply').click();
    this.admin_id=localStorage.getItem('admin_id');
    this.access_token = localStorage.getItem('access_token');

    this.richTextArea_id='richTextArea';
    // this.initTiny();
    this.GetTicketTemp('created_ticket');
    // setTimeout(() => {
      
    // }, 5000);
  }
  GetTicketTemp(data){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"getEmaiautoResponses","admin_id":"'+this.admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
       
        this.response_content = response.result.data;
        this.dept_settings(data);

       console.log(this.response_content);
      } 
    }, 
    (error)=>{
        console.log(error);
    });
  }
  dept_settings(data){
    // alert(data);
    this.filteredvalues = this.response_content.filter(t=>t.response_for ===data);
    console.log(this.filteredvalues)
    // tinymce.get(data+'_content').setContent(this.filteredvalues[0].response_content);

    // console.log(this.filteredvalues);
    // tinymce.editors[0].setContent('html');
// $('#'+data+'_content').html(this.filteredvalues[0].response_content);
// var set =tinymce.get('#'+data+'_content').getContent();
// alert(set)
// alert('set')
// $('#proposal_content').html('<p>eeer</p>');
    let access_token: any=localStorage.getItem('access_token');
  
    // let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"getEmaiautoResponses","admin_id":"'+this.admin_id+'"}}';
  
    // this.serverService.sendServer(api_req).subscribe((response:any) => {
    //   if(response.status==true){
       
    //     this.response_content = response.result.data;

    //    console.log(this.response_content);
    //   } 
    // }, 
    // (error)=>{
    //     console.log(error);
    // });
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

  UpdateTemp(data){
    let api_req:any=new Object();
    let chat_req:any = new Object();
// let status=$('#'+data+'_status').val();
let content=tinymce.get(data+'_content').getContent();
var status = '0';  if($('#'+data+'_status').prop('checked')){ status = '1';}
if(content ==null || content == ''){
  iziToast.warning({
    message:"Please write the Template Text",
    position:"topRight"
    
  });
  return false;
}
// alert(content);
    api_req.operation="ticket";
    api_req.moduleType="ticket";
    api_req.api_type="web";
    chat_req.action="addUpdateDeptToEmailResponse";
    chat_req.admin_id=this.admin_id;
    chat_req.response_for=data;
    chat_req.status=status;
    chat_req.content=content;
    api_req.element_data=chat_req;
    
// return false;

  //  var note= $('#privateNote').val();
  // let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"addNotesForTicketReply","admin_id":"'+this.admin_id+'","ticket_message_id":"'+this.ticket_t+'","ticket_notes":"'+note+'"}}';
  this.serverService.sendServer(api_req).subscribe((response:any) => {
    
    if(response.result.data==1){
      iziToast.success({
        message:"template Updated",
        position:"topRight"
      });
      this.GetTicketTemp(data);

    } 
    else{
      iziToast.warning({
        message:"Sorry Some error ocurred",
        position:"topRight"
      });
    }
    $('#userDepartmentManagement').modal('hide');

  }, 
  (error)=>{
    console.log(error);
    $('#userDepartmentManagement').modal('hide');

    iziToast.warning({
      message:"Sorry,Server issue ocurred,Please contact Admin",
      position:"topRight"
    });
  });
  }

}
