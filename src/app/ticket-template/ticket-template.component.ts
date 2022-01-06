import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
declare var tinymce: any;
declare var iziToast: any;
declare var $: any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-ticket-template',
  templateUrl: './ticket-template.component.html',
  styleUrls: ['./ticket-template.component.css']
})
export class TicketTemplateComponent implements OnInit {
  admin_id;
  response_content;
  access_token;
  filteredvalues;
  dept_ids;
  dept_listing;
  show = false;
  show2 = false;
  admin_permission;
  user_type;
  response_content2=[];
  has_robin;
  constructor(private serverService: ServerService,private router:Router) { }

  ngOnInit() {
    
    // $('#auto_reply').click();
    this.admin_id = localStorage.getItem('admin_id');
    this.access_token = localStorage.getItem('access_token');
    this.admin_permission = localStorage.getItem('admin_permision');
		this.user_type = localStorage.getItem('user_type');
    this.has_robin = localStorage.getItem('round_robin');

    if (this.user_type == 'Super Admin') {
			this.user_type = 1;          
		}
		else if (this.user_type == 'Admin' || this.admin_permission =='1') {
			this.user_type = 2;		
		}
		else {
			this.user_type = 3;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have no access view this page!',
      });
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
      return false;
		}
setTimeout(() => {
    this.deptList();
}, 500);
   
this.initTiny();
    //this.GetTicketTemp('created_ticket');
    // setTimeout(() => {

    // }, 5000);
  }

  initTiny() {
     var richTextArea_id = 'richTextArea2';
    tinymce.init({
      selector: '#richTextArea2',
      height: 500,
      plugins: 'advlist autolink textcolor formatpainter lists link  image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste wordcount autolink lists media table',
      toolbar: 'undo redo |fullscreen|forecolor backcolor| formatselect | bold italic | \ undo redo | link image file| code | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent  | autoresize',
      paste_data_images: true,
      images_upload_url: 'upload.php',
      automatic_uploads: false,

      images_upload_handler: function (blobInfo, success, failure) {
        var xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', 'upload.php');

        xhr.onload = function () {
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
    if (tinymce.editors.length > 0) {
      tinymce.execCommand('mceFocus', true, richTextArea_id );       
      tinymce.execCommand('mceRemoveEditor',true, richTextArea_id);        
      tinymce.execCommand('mceAddEditor',true, richTextArea_id);
  }
  }
  getDeptId(ids) {
    this.dept_ids = ids;
    $('.removing').removeClass('active');
    $("#list_dept_" + ids).addClass("active");

    // Make  new ticket reposne  tap as active
    $("#New_ticket").addClass("active");
    $("#Close_ticket").removeClass("active");
    $("#New_ticket2").addClass("active");
    $("#Close_ticket2").removeClass("active");
    
    $("#Agent_template").removeClass("active");
    $("#Agent_template2").removeClass("active");
    this.GetTicketTemp('created_ticket');
  }

  deptList() {
    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"get_dept_settings","user_id":"1203"}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "get_dept_settings";
    chat_req.user_id = this.admin_id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {
        const arr1 = response.result.data;
        const arr2 = response.result.data;
        this.dept_ids=response.result.data[0].dept_id;
        // alert(this.dept_ids);
        this.dept_listing = arr1.filter(d => d.has_email == 1);
        // this.GetTicketTemp('created_ticket');
        setTimeout(() => {
          $('.removing').removeClass('active');
          $("#list_dept_" + this.dept_ids).addClass("active");
          this.getDeptId(this.dept_ids);
        }, 500);
      }
    },
      (error) => {
        console.log(error);
      });

  }



  GetTicketTemp(data) {
    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"getEmaiautoResponses","admin_id":"' + this.admin_id + '","dept_id":"' + this.dept_ids + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {

      if (response.result.data !== 'empty') {

        this.response_content = response.result.data;
        // console.log(this.response_content);
        // console.log(this.response_content.length);
        if(this.response_content.length == 1){
          var message;
        //   console.log(this.response_content[0].response_for);
          if(this.response_content[0].response_for == 'close_ticket'){
            message = 'create_ticket';
          }else if(this.response_content[0].response_for == 'created_ticket'){
            message = 'close_ticket'; 
            console.log(this.response_content[0].status);     
          }
          else {

            message = 'agent_template'; 
            console.log(this.response_content[0].status);     
                
          }
          var addingData = {
            "admin_id": "",
            "created_at": "",
            "dept_id": "",
            "res_id": "",
            "response_content": "",
            "response_for": message,
            "response_subject": null,
            "status": this.response_content[0].status,
          }

          this.response_content.push(addingData);
        //   console.log(this.response_content);
        }

        this.dept_settings(data);
        this.show = true;
        this.show2 = false;
      } else {
        this.response_content2=[];
        // var testing = [{
        //   "admin_id": "",
        //   "created_at": "",
        //   "dept_id": "",
        //   "res_id": "",
        //   "response_content": "",
        //   "response_for": "close_ticket",
        //   "response_subject": null,
        //   "status": "",

        // }, {
        //   "admin_id": "",
        //   "created_at": "",
        //   "dept_id": "",
        //   "res_id": "",
        //   "response_content": "",
        //   "response_for": "created_ticket",
        //   "response_subject": null,
        //   "status": "",

        // }];   
        this.show = false;
        this.show2 = true;
       
        var addingData2 = {
          "admin_id": "",
          "created_at": "",
          "dept_id": "",
          "res_id": "",
          "response_content": "",
          "response_for": data,
          "response_subject": null,
          "status": ""
        }
        // this.response_content = testing;        
        this.response_content2.push(addingData2);
        this.select_create_temp(data);

      }

      $('.removing').removeClass('active');
      $("#list_dept_" + this.dept_ids).addClass("active");
    },
      (error) => {
        console.log(error);
      });
  }
  dept_settings(data) {
    // alert(data);
    this.filteredvalues = this.response_content.filter(t =>t.response_for === data );
    console.log(this.filteredvalues)
    // alert(this.filteredvalues)
    if(this.filteredvalues==''){
      var addingData2 = {
        "admin_id": "",
        "created_at": "",
        "dept_id": "",
        "res_id": "",
        "response_content": "",
        "response_for": data,
        "response_subject": null,
        "status": ""
      }
      this.response_content2.push(addingData2);
      this.filteredvalues = this.response_content2.filter(t => t.response_for === data);
      this.filteredvalues = this.removeDuplicates(this.filteredvalues, "response_for");
      tinymce.get('richTextArea2').setContent('');
    }
     else if(this.filteredvalues[0].response_content == '' || this.filteredvalues[0].response_content == null){
       
      tinymce.get('richTextArea2').setContent('');
      // this.show = false;
      // this.show2 = true;
      }else{
     
    //   setTimeout(() => {
    //   $('#New_ticket').click();
    // //   alert()
    //   }, 2000);
      tinymce.get('richTextArea2').setContent(this.filteredvalues[0].response_content);
   
     
    //   if(this.response_content[0].status=='1'){
    //     // setTimeout(() => {        
    //      $('#use_template_'+this.response_content[0].dept_id).prop('checked',true)       
    //     // },1000);
       
    //     }  
    //    else{
    //     //  setTimeout(() => {
    //        $('#use_template_'+this.response_content[0].dept_id).prop('checked',false) 
    //       // }, 1000);
    //  } 
     
      }


  }

  select_create_temp(data) {    // console.log(data);
    
    this.filteredvalues = this.response_content2.filter(t => t.response_for === data);
    console.log(this.filteredvalues)
    // this.filteredvalues = this.response_content.filter(t => t.response_for === data);
    if(this.filteredvalues==''){
      var addingData2 = {
        "admin_id": "",
        "created_at": "",
        "dept_id": "",
        "res_id": "",
        "response_content": "",
        "response_for": data,
        "response_subject": null,
        "status": ""
      }
      this.response_content2.push(addingData2);
      this.filteredvalues = this.response_content2.filter(t => t.response_for === data);
      this.filteredvalues = this.removeDuplicates(this.filteredvalues, "response_for");
      tinymce.get('richTextArea2').setContent('');
    }
     else if(this.filteredvalues[0].response_for === data){
    
         tinymce.get('richTextArea2').setContent(this.filteredvalues[0].response_content);   
     
     
    }else{   
        
      this.response_content2=[]
    var addingData2 = {
      "admin_id": "",
      "created_at": "",
      "dept_id": "",
      "res_id": "",
      "response_content": "",
      "response_for": data,
      "response_subject": null,
      "status": ""
    }
    this.response_content2.push(addingData2);
    this.filteredvalues = this.response_content2.filter(t => t.response_for === data);
    this.filteredvalues = this.removeDuplicates(this.filteredvalues, "response_for");
    tinymce.get('richTextArea2').setContent('');
    }
    
    // tinymce.get('richTextArea2').setContent('');
    // this.show = false;
    // this.show2 = true;
    // console.log(this.filteredvalues);
    // tinymce.get('richTextArea2').setContent(this.filteredvalues[0].response_content);

    // tinymce.get(this.filteredvalues.response_for+'_content').setContent('e232');

  }


  UpdateTemp(data) {
    let api_req: any = new Object();
    let chat_req: any = new Object();
    // let status=$('#'+data+'_status').val();
    // let content = tinymce.get(data + '_content').getContent();
    let content = tinymce.get('richTextArea2').getContent();
    // var status = '0'; if ($('#' + data + '_status').prop('checked')) { status = '1'; }
    if (content == null || content == '') {
      iziToast.warning({
        message: "Please write the Template Text",
        position: "topRight"

      });
      return false;
    }


    // {"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"", "element_data":{"action":"addUpdateDeptToEmailResponse","admin_id":"1203","dept_id":"3","response_for":"","content":"","status":""}}
    // alert(content);
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = this.access_token;
    chat_req.action = "addUpdateDeptToEmailResponse";
    chat_req.admin_id = this.admin_id;
    chat_req.dept_id = this.dept_ids;
    chat_req.response_for = data;
    // chat_req.status = status;
    chat_req.content = content;
    api_req.element_data = chat_req;

    // return false;

    //  var note= $('#privateNote').val();
    // let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"addNotesForTicketReply","admin_id":"'+this.admin_id+'","ticket_message_id":"'+this.ticket_t+'","ticket_notes":"'+note+'"}}';
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update the Template!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update!',      
      }).then((result) => {
        if (result.value) {
    this.serverService.sendServer(api_req).subscribe((response: any) => {

      if (response.result.status == true) {
        iziToast.success({
          message: "template Updated",
          position: "topRight"
        });
        this.GetTicketTemp(data);

      }
      else {
        iziToast.warning({
          message: "Sorry Some error ocurred",
          position: "topRight"
        });
      }
      $('#userDepartmentManagement').modal('hide');

    },
      (error) => {
        console.log(error);
        $('#userDepartmentManagement').modal('hide');

        iziToast.warning({
          message: "Sorry,Server issue ocurred,Please contact Admin",
          position: "topRight"
        });
      });
    }
    });
  }


  AddTemp(data) {
    let api_req: any = new Object();
    let chat_req: any = new Object();
    // let status=$('#'+data+'_status').val();
    // let content = tinymce.get(data + '_content_create').getContent();
    let content = tinymce.get('richTextArea2').getContent();
    // var status = '0'; if ($('#' + data + '_status').prop('checked')) { status = '1'; }
    if (content == null || content == '') {
      iziToast.warning({
        message: "Please write the Template Text",
        position: "topRight"

      });
      return false;
    }
    // alert(content);
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = this.access_token;
    chat_req.action = "addUpdateDeptToEmailResponse";
    chat_req.admin_id = this.admin_id;
    chat_req.dept_id = this.dept_ids;
    chat_req.response_for = data;
    // chat_req.status = status;
    chat_req.content = content;
    api_req.element_data = chat_req;


    console.log(api_req);


    //  var note= $('#privateNote').val();
    // let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"addNotesForTicketReply","admin_id":"'+this.admin_id+'","ticket_message_id":"'+this.ticket_t+'","ticket_notes":"'+note+'"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        iziToast.success({
          message: "template Updated",
          position: "topRight"
        });
        this.GetTicketTemp(data);
      }
      else {
        iziToast.warning({
          message: "Sorry Some error ocurred",
          position: "topRight"
        });
      }
      $('#userDepartmentManagement').modal('hide');
    },
      (error) => {
        console.log(error);
        $('#userDepartmentManagement').modal('hide');

        iziToast.warning({
          message: "Sorry,Server issue ocurred,Please contact Admin",
          position: "topRight"
        });
      });
  }

  ClearText(){
    tinymce.get('richTextArea2').setContent('');
  }
  createTempactive(id,res){
    let use_tick=1;
    if ($("#use_template_"+id).prop("checked") == true) {
      use_tick = 1;
    } else {
      use_tick = 0;
    }
  
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "updateEmailResponse_status";
    chat_req.status =use_tick;   
    chat_req.admin_id = this.admin_id;
    chat_req.response_for = res;
    chat_req.dept_id = id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    console.log(chat_req)
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1){
          // this.agentsList({});
          iziToast.success({
            message:"Settings Updated",
            position:"topRight"
          });
      }
    },
      (error) => {
        console.log(error);
      });
    }
    removeDuplicates(originalArray, prop) {
      var newArray = [];
      var lookupObject  = {};
   
      for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
      }
   
      for(i in lookupObject) {
        newArray.push(lookupObject[i]);
      }
       return newArray;
    }
}
