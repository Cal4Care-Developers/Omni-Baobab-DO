import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
// import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
declare var tinymce:any;

// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
import { modelChanged } from '@syncfusion/ej2-angular-richtexteditor';
@Component({ 
  selector: 'app-ticket-view-thread',
  templateUrl: './ticket-view-thread.component.html',
  styleUrls: ['./ticket-view-thread.component.css']
})
export class TicketViewThreadComponent implements OnInit {
//   public tools: object = {
//     items: ['Undo', 'Redo', '|',
//         'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
//         'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
//         'SubScript', 'SuperScript', '|',
//         'LowerCase', 'UpperCase', '|',
//         'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
//         'Indent', 'Outdent', '|', 'CreateLink',
//         'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
// };
  // public Editor = ClassicEditor;
  ticket_t;
  admin_id;
  user_id;
  access_token;
  ticket_replies;
  
  ticket_replies_all;

  tick_subject;
  ticket_created_by;
  tick_from;
  ticket_status_sel;
  ticket_status;
  first_letter;
  department;
  tick_time;
  ticket_to;
  rep_to;
  status;
  mainCont;
  closed=false;
  first_res_time;
  closed_time;
  dept_list;
  agent_options;
  ticket_agent;
  ticket_message_id;
  profile_pic;
  pageLimit = 5;
offset_count = 0;
showmore_button=false;
total_offet;
tick_id_ency;
ext;
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute, private sanitizer: DomSanitizer,private tinymce:EditorModule) {  
    
    this.ticket_t = this.route.snapshot.queryParamMap.get('ticket_id');
  }
  ngOnInit() {
  //const content = editor.getContent();
    this.admin_id = localStorage.getItem('admin_id');
    this.user_id = localStorage.getItem('userId');
    this.access_token = localStorage.getItem('access_token');
    this.profile_pic = localStorage.getItem('profile_image');
    this.tick_id_ency=this.ticket_t;
    this.getTicketDetails(this.ticket_t);
    // this.dept_settings();
   this.initTiny();

  }
  initTiny(){
    
    tinymce.init({
      selector : '.richTextArea2',
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
  // dept_settings(){
  //   let access_token: any=localStorage.getItem('access_token');
  
  //   let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_dept_settings","user_id":"'+this.admin_id+'"}}';
  
  //   this.serverService.sendServer(api_req).subscribe((response:any) => {
  //     if(response.result.status==true){       
  //       this.dept_list = response.result.data;
  //       console.log(this.dept_list);
  //     } else {
       
  //     }
  //   }, 
  //   (error)=>{
  //       console.log(error);
  //   });
  // }
  

  getTicketDetails(tick_id){
    this.offset_count = 0;
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"viewExternalTicket","ticket_id":"'+tick_id+'","admin_id":"'+this.admin_id+'","limit":"'+this.pageLimit+'","offset":"'+this.offset_count+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status=="true"){
        this.ticket_replies = response.tick_options;
        this.ticket_replies_all = response.tick_options;
        this.tick_subject = response.tick_options[0].subject;
        this.ticket_created_by=response.tick_options[0].ticket_created_by;
        this.tick_from = response.tick_options[0].user_name;
        this.ticket_status_sel = response.tick_options[0].ticket_status_id;
        this.ticket_status = response.tick_options[0].ticket_status;
        this.first_letter = response.tick_options[0].first_letter;
        this.department =  response.tick_options[0].department;
        this.ticket_agent=response.tick_options[0].ticket_assigned_to;
        this.tick_time = response.tick_options[0].ticket_created_at;
        this.ticket_to = response.tick_options[0].ticket_to;
        this.mainCont = response.tick_options[0].ticket_message;
        this.ticket_message_id = response.tick_options[0].ticket_message_id;
        this.ticket_t = atob(this.ticket_t);
        this.status = response.status_options;
        this.dept_list = response.departments;
        this.total_offet=response.totel;
// this.getdeptuser(this.department);dept_status
        $('#dept_status').val(this.department);
        if( $('#dept_status').val() != null)
           this.get_agents_by_department();
        // $('#ticket_status select').val(response.tick_options[0].ticket_status_id);

// $('#ticket_status [name=options] option').filter(function() { 
//   return ($(this).text() == 'New'); //To select Blue
// }).prop('selected', true);
// $('#ticket_status [name="options"]').find('option[value="'+response.tick_options[0].ticket_status_id+'"]').attr("selected",true);
// $('#ticket_status option[value="'+response.tick_options[0].ticket_status_id+'"]').attr('selected', 'selected').change();
if(response.total > 5){
  // alert(this.queue_list_all.length)
  this.showmore_button=true;

}
        if(response.closed_at==""||response.closed_at==null){
          this.closed=false;
        }else{
          this.closed=true;
        }
        
        this.first_res_time=response.first_res_time;
        this.closed_time=response.closed_at;
      } 
    }, 
    (error)=>{
      console.log(error);
    });
  }

  //  toggleClass(){
  //   var x = document.getElementById("replyPanel");
  // if (x.style.display === "none") {
  //   x.style.display = "block";
  // } else {
  //   x.style.display = "none";
  // }
  // }


  toggleClass(id,to){
   var x = document.getElementById("replyPanel_"+id);
   var y = document.getElementById("replyPanelall_"+id);
    y.style.display = "none";
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  }

  toggleClassreplyall(id){
    var x = document.getElementById("replyPanelall_"+id);
    // var y = document.getElementById("replyPanel_"+id);
    // y.style.display = "none";
  //  $('#'+y).hide();
  // alert(x);
   $('#replyPanelall_'+id).show();

    // if (x.style.display === "none") {
    //   x.style.display = "block";
    // } else {
    //   x.style.display = "none";
    // }
    
  }
clickDiscard(id){
  $('#replyPanelall_'+id).hide();

}
  changeMyStatus(){
// Closing a Ticket
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close it!'
    }).then((result) => {
      if (result.value) {

    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"onchange_status","status_id":"9","ticket_id":"'+this.ticket_t+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        Swal.fire(
          'Deleted!',
          'success'
        );
        this.closed=true;
        this.ticket_t=btoa(this.ticket_t);
        this.getTicketDetails(this.ticket_t);
      } 
    }, 
    (error)=>{
      console.log(error);
    });
  }
})
}



// replyMesssage(msg_id,to){
//   var msg_id = $('#message_'+msg_id).val();
//   let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"replyMessage","message":"'+msg_id+'","ticket_id":"'+this.ticket_t+'","to":"'+to+'"}}';
//   this.serverService.sendServer(api_req).subscribe((response:any) => {
//     if(response.status==true){
//       Swal.fire(
//         'Deleted!',
//         'success'
//       );
//       this.getTicketDetails(this.ticket_t);
//     } 
//   }, 
//   (error)=>{
//     console.log(error);
//   });

// }


replyMessage(msg_id,to,extra){
  let access_token: any=localStorage.getItem('access_token');
  let user_id: any =  localStorage.getItem('userId'); 
  let api_req:any = new Object();
  let agent_req:any = new Object();
 
  var formData = new FormData();
  var id=msg_id;
  // var fileName = $('#up_files_'+msg_id).val();
  // alert(fileName); return false;

  msg_id = msg_id+extra;

// alert(msg_id);
  if((<HTMLInputElement>document.getElementById('up_files')).value != null){
    var totalfiles = (<HTMLInputElement>document.getElementById('up_files')).files.length;
    for (var index = 0; index < totalfiles; index++) {
      formData.append("up_files[]", (<HTMLInputElement>document.getElementById('up_files')).files[index]);

    }
  }

  var to = $('#email_address_'+msg_id).val();


   //var msg_id = $('#editor').val();
  // var msg_id = $('#reply_message_'+msg_id).val();
  // tinymce.activeEditor.setContent('sdsdsd');
  // alert('1');

  var msg_id = tinymce.get('reply_message_'+msg_id).getContent();

  // alert(myContent);
  
  // var myContent = tinymce.get("myTextarea").getContent();
// alert(to1);
// return false;
  if(msg_id == '' || msg_id == undefined){
    iziToast.error({
      message: "Please Enter the Message",
      position: 'topRight'
  });
  return false;
  }
  // var upFileID = 'up_files_'+id+'s';
  // if((<HTMLInputElement>document.getElementById(upFileID)).value != null){
  //   var totalfiles = (<HTMLInputElement>document.getElementById(upFileID)).files.length;
  //   for (var index = 0; index < totalfiles; index++) {
  //     formData.append("up_files[]", (<HTMLInputElement>document.getElementById(upFileID)).files[index]);
  //   }
  // }



  formData.append('operation', 'ticket');
  formData.append('moduleType', 'ticket');
  formData.append('api_type', 'web');
  formData.append('access_token', access_token);
  formData.append('user_id', user_id);
  formData.append('action', 'replyTicketMessage');
  formData.append('message', msg_id);
  formData.append('ticket_id', this.ticket_t);
  formData.append('to', to);
  // formData.append('up_files', $('#reply_file')[0].files);
var files=$('#up_files')[0].files;
var totalSize=0;

  

  for (var i = 0; i < files.length; i++) 
  {
    totalSize += files[i].size;
  }
  if (totalSize < 5242880) 
    {  
    }
    else
    {    
      iziToast.warning({
        message: "Sorry, File size should be below 5MB",
        position: 'topRight'
    });  
      // alert("File size is more than 5MB");
        event.preventDefault();
        return false;
    }
  //alert(files[0].size);
//  return false;
// alert(totalSize);

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
 

  
  $.ajax({    
    url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",  
    type : 'POST',
    data : formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false, 
    success:function(data){ 
      Swal.close();
      this.parsed_data = JSON.parse(data);
      console.log(this.parsed_data );
      if(this.parsed_data.status == 'true'){    
        iziToast.success({
          message: "Replied Successfully",
          position: 'topRight'
      });
      $("#refresh_page").click();  
      $('#replyPanelall_'+id).hide();

      } else {
        iziToast.error({
          message: "Sorry, Some Error Occured",
          position: 'topRight'
      });
      }
    }  
});  

  }



  // changeMyStatusmain(ticket_id, status){
  //   let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"onchange_status","status_id":"'+status+'","ticket_id":"'+ticket_id+'"}}';
  //   this.serverService.sendServer(api_req).subscribe((response:any) => {
  //     if(response.status==true){
  //     this.getTicketDetails(this.ticket_t);
  //     } 
  //   }, 
  //   (error)=>{
  //     console.log(error);
  //   });
  
  //   }
    refresh(){
      //alert(this.ticket_t);
      this.ticket_t=btoa(this.ticket_t);
    this.getTicketDetails(this.ticket_t);
    }
    get_agents_by_department(){
      var data=$('#dept_status').val();
      let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"get_agents_by_department","admin_id":"'+this.admin_id+'","dept_id":"'+data+'"}}';
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status==true){
          this.agent_options=response.result.data;
        // this.getTicketDetails(this.ticket_t);
        } 
      }, 
      (error)=>{
        console.log(error);
      });
      }

      UpdateTicketStatus(){
      var dept=$('#dept_status').val();
      var status=$('#ticket_status').val();
      var agent=$('#agent_options').val();
      if(status == ''){
        iziToast.warning({
          message:"Please Select the Ticket Status",
          position:"topRight"
        });
        return false;
      }
      if(dept == ''){
        iziToast.warning({
          message:"Please Select Department",
          position:"topRight"
        });
        return false;
      }   if(agent == ''){
        iziToast.warning({
          message:"Please Select Agent",
          position:"topRight"
        });
        return false;
      }
       
      let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"updateTicketStatus","user_id":"'+this.user_id+'","ticket_id":"'+this.tick_id_ency+'","status":"'+status+'","department":"'+dept+'","agent_id":"'+agent+'","admin_id":"'+this.admin_id+'"}}';
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.result.data==1){
          iziToast.success({
            message:"Ticket Updated Successfully ",
            position:"topRight"
          });
          this.ticket_t=btoa(this.ticket_t);
          this.getTicketDetails(this.ticket_t);
        } 
      }, 
      (error)=>{
        console.log(error);
      });

      }
      AddNote(){
        let api_req:any=new Object();
		  	let chat_req:any = new Object();

        api_req.operation="ticket";
        api_req.moduleType="ticket";
        api_req.api_type="web";
        chat_req.action="addNotesForTicketReply";
        chat_req.admin_id=this.admin_id;
        chat_req.ticket_message_id=this.ticket_message_id;
        chat_req.ticket_notes=$('#privateNote').val();
        api_req.element_data=chat_req;
        


      //  var note= $('#privateNote').val();
      // let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"addNotesForTicketReply","admin_id":"'+this.admin_id+'","ticket_message_id":"'+this.ticket_t+'","ticket_notes":"'+note+'"}}';
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        
        if(response.result.data==1){
          iziToast.success({
            message:"Private Note Added",
            position:"topRight"
          });
          $('#userDepartmentManagement').modal('hide');
          this.ticket_t=btoa(this.ticket_t);
          this.getTicketDetails(this.ticket_t);

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

      openModel(){
          $("#document_model").modal('show');   

      $('#userDepartmentManagement').modal('show');
    }
    showmore(){
      // $("html, body").animate({ scrollTop: $(document).height() }, "slow");
      // $('.ticketing-system-panel').scrollTop($('.ticketing-system-panel')[0].scrollHeight);
    
      this.showmore_button=true;
      this.offset_count= this.offset_count+5;
      // alert(this.offset_count);
      // this.offset_count = this.offset_count -this.total_offet;
      var offset=this.offset_count;
      if(this.total_offet>=offset+5)
      {
      if(this.offset_count >= this.total_offet){
        this.offset_count = this.total_offet;
         this.showmore_button=false;
       }
    }else{
      // alert('dasds');
      this.showmore_button=false;
    }
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"viewExternalTicket","ticket_id":"'+this.tick_id_ency+'","admin_id":"'+this.admin_id+'","limit":"'+this.pageLimit+'","offset":"'+this.offset_count+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status=="true"){
        // this.ticket_replies = response.tick_options;
        // this.queue_list = response.ticket_options;
        // this.queue_list_all = response.ticket_options;
        var mydatas= [];
        mydatas = response.tick_options;              
    // alert(mydatas.length);		
    // this.queue_list = this.queue_list_all.push(mydatas); 
        for (let index = 0; index < mydatas.length; index++) { 
          var data = mydatas[index];	
          this.ticket_replies.push(data); 
         }
        
        } 
      }, 
      (error)=>{
        console.log(error);
      });
    }
getFileExtension(filename)
{
  console.log(filename);
  // alert(filename);
  var ext = /^.+\.([^.]+)$/.exec(filename);
  // alert(ext);
  this.ext=ext;
  console.log(this.ext);
  return ext == null ? "" : ext[1];
}
// getFileName(file_name){
//   var name_without_ext = (file_name.split('\\').pop().split('/').pop().split('.'))[0];
//   console.log(name_without_ext);
// return name_without_ext;
// }
}
