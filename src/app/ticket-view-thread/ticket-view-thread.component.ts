import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
// import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
declare var tinymce: any;

// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

declare var $: any;
declare var iziToast: any;
import Swal from 'sweetalert2'
import { modelChanged } from '@syncfusion/ej2-angular-richtexteditor';

export interface Collobrator {
  email_name: string;
}
export interface EmailAddress {
  email_to: string;
}
@Component({
  selector: 'app-ticket-view-thread',
  templateUrl: './ticket-view-thread.component.html',
  styleUrls: ['./ticket-view-thread.component.css']
})
export class TicketViewThreadComponent implements OnInit {

  //CC Collabrator
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  collobrators: Collobrator[] = [];
  EmailToAddress: EmailAddress[] = [];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const input = event.input;
    //     const input = event.input;
    // const value = event.value;
    // Add our fruit


    if (value) {
      this.collobrators.push({ email_name: value });
      event.value = "";
    }

    if (input) {
      input.value = '';
    }

    //  event.chipInput!.clear();
  }

  remove(collobrator: Collobrator): void {
    const index = this.collobrators.indexOf(collobrator);

    if (index >= 0) {
      this.collobrators.splice(index, 1);
    }
  }

  //CC Collabrator End
  addTo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const input = event.input;

    // Add our fruit
    if (value) {
      this.EmailToAddress.push({ email_to: value });
      console.log(this.EmailToAddress)
    }

    if (input) {
      input.value = '';
    }

    // event.chipInput!.clear();
  }

  removeTo(EmailAddress: EmailAddress): void {
    const index = this.EmailToAddress.indexOf(EmailAddress);

    if (index >= 0) {
      this.EmailToAddress.splice(index, 1);
    }
  }

  //CC Collabrator End











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
  closed = false;
  first_res_time;
  closed_time;
  closed_by;
  dept_list;
  agent_options;
  ticket_agent;
  ticket_message_id;
  profile_pic;
  pageLimit = 5;
  offset_count = 0;
  showmore_button = false;
  total_offet;
  tick_id_ency;
  ext;
  singnatures;
  signature_title;
  signature_content;
  user_type;
  reply_from_arr = new Array();
  ticket_to_arr = new Array();
  ticket_cc;
  own_mail;
  markspamshow = false;
  unmarkspamshow = false;
  replied_from;
  user_name;
  selectedDepart;
  selectedAgentID;
  Reopen_closed = false;
  constructor(private serverService: ServerService, private router: Router, private route: ActivatedRoute, private _location: Location,private sanitizer: DomSanitizer, private tinymce: EditorModule) {

    this.ticket_t = this.route.snapshot.queryParamMap.get('ticket_id');
  }
  ngOnInit() {
    //const content = editor.getContent();
    this.admin_id = localStorage.getItem('admin_id');
    this.user_id = localStorage.getItem('userId');
    this.access_token = localStorage.getItem('access_token');
    this.profile_pic = localStorage.getItem('profile_image');
    this.user_type = localStorage.getItem('user_type');
    this.user_name = localStorage.getItem('agent_name');
    this.tick_id_ency = this.ticket_t;
    this.getTicketDetails(this.ticket_t);
    this.EmailToAddress = [];
    this.collobrators = [];
    // this.dept_settings();
    //  this.initTiny();
    this.get_singnature();

  }
  get_singnature() {
    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"viewTicketSignature","admin_id":"' + this.admin_id + '","user_id":"' + this.user_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {

        this.singnatures = response.result.data;

        console.log(this.singnatures);
      }
    },
      (error) => {
        console.log(error);
      });
  }
  initTiny() {

    tinymce.init({
      selector: '.richTextArea2',
      plugins: 'advlist autolink lists link  image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste help wordcount autolink lists media table',
      toolbar: 'undo redo | formatselect | fontselect | bold italic | \ undo redo | link image file| code | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | help',


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


  backtoPage() {

    if (this.unmarkspamshow == true) {
      this.router.navigate(['/spam-list']);
    } else if (this.markspamshow == true) {
      this.router.navigate(['/ticketing-system-new']);
    }else{
      this.router.navigate(['/ticketing-system-new']);

    }

    // this._location.back();

  }

  getTicketDetails(tick_id) {
    Swal.fire({
			html:
				'<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
		showCloseButton: false,
			showCancelButton: false,
			showConfirmButton: false,
			focusConfirm: false,
			background: 'transparent',


		});

    this.offset_count = 0;
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"viewExternalTicket","ticket_id":"' + tick_id + '","admin_id":"' + this.admin_id + '","limit":"' + this.pageLimit + '","offset":"' + this.offset_count + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      Swal.close();
      if (response.status == "true") {
        this.ticket_replies = response.tick_options;
        this.ticket_replies_all = response.tick_options;
        this.tick_subject = response.tick_options[0].subject;
        this.ticket_created_by = response.tick_options[0].ticket_created_by;
        this.tick_from = response.tick_options[0].user_name;
        this.ticket_status_sel = response.tick_options[0].ticket_status_id;

        if (response.tick_options[0].is_spam == '0') {
          this.unmarkspamshow = false;
          this.markspamshow = true;
        } else if (response.tick_options[0].is_spam == '1') {
          this.unmarkspamshow = true;
          this.markspamshow = false;

        }

        //   if(this.ticket_status_sel !=''){
        //   this.get_agents_by_department_dup(this.ticket_status_sel)
        // }

        this.ticket_status = response.tick_options[0].ticket_status;
        if (this.ticket_status == "Closed") {
          this.closed = true;
        } else {
          this.closed = false;
          if (response.closed_at == "" || response.closed_at == null) {

          } else {
            this.Reopen_closed = true;
          }
        }
        this.first_letter = response.tick_options[0].first_letter;
        this.department = response.tick_options[0].department;

        this.selectedDepart = response.tick_options[0].depart_id;
        if (this.selectedDepart != '') {
          this.get_agents_by_department_dup(this.selectedDepart)
        }


        this.ticket_agent = response.tick_options[0].ticket_assigned_to;

        // setTimeout(() => {
        this.selectedAgentID = response.tick_options[0].ticket_assigned_to_id;
        // }, 4000);


        this.tick_time = response.tick_options[0].ticket_created_at;
        this.ticket_to = response.tick_options[0].ticket_to;
        this.ticket_cc = response.tick_options[0].mail_cc;
        this.own_mail = response.tick_options[0].own_mail;
        this.replied_from = response.tick_options[0].replied_from;
        this.mainCont = response.tick_options[0].ticket_message;
        this.ticket_message_id = response.tick_options[0].ticket_message_id;
        this.ticket_t = atob(this.ticket_t);
        this.status = response.status_options.filter(t => t.status_id != '9');
        // console.log(this.status);
        this.dept_list = response.departments;
        this.total_offet = response.totel;
        this.reply_from_arr = response.tick_options[0].replied_from.split(',');
        // this.ticket_to_arr = response.tick_options[0].ticket_to.split(',');
        this.ticket_to_arr = response.tick_options[0].replied_from.split(',');
        // var ticket_to_arr = response.tick_options[0].ticket_to.split(',');

        if (this.ticket_to == response.tick_options[0].own_mail) {
          // this.EmailToAddress.push({email_to:response.tick_options[0].replied_from.split(',')});
          if (response.tick_options[0].replied_from != 'null' && response.tick_options[0].replied_from != '')
            for (var value in this.reply_from_arr) {
              this.EmailToAddress.push({ email_to: this.reply_from_arr[value] });
            }

        } else {

          // this.EmailToAddress.push({email_to:response.tick_options[0].ticket_to});
          if (response.tick_options[0].ticket_to != 'null' && response.tick_options[0].ticket_to != '')
            for (var value in this.ticket_to_arr) {
              this.EmailToAddress.push({ email_to: this.ticket_to_arr[value] });
            }
        }



        console.log(this.EmailToAddress)


        if (response.tick_options[0].mail_cc != 'null' && response.tick_options[0].mail_cc != '') {
          // this.collobrators.push({email_name: response.tick_options[0].mail_cc.split(',')});
          var ticket_cc = this.ticket_cc.split(',')
          for (var value in ticket_cc) {
            this.collobrators.push({ email_name: ticket_cc[value] });
          }
        }


        // this.getdeptuser(this.department);dept_status
        $('#dept_status').val(this.department);
        if ($('#dept_status').val() != null)
          this.get_agents_by_department();
        // $('#ticket_status select').val(response.tick_options[0].ticket_status_id);

        // $('#ticket_status [name=options] option').filter(function() {
        //   return ($(this).text() == 'New'); //To select Blue
        // }).prop('selected', true);
        // $('#ticket_status [name="options"]').find('option[value="'+response.tick_options[0].ticket_status_id+'"]').attr("selected",true);
        // $('#ticket_status option[value="'+response.tick_options[0].ticket_status_id+'"]').attr('selected', 'selected').change();
        if (response.total > 5) {
          // alert(this.queue_list_all.length)
          this.showmore_button = true;

        }


        this.first_res_time = response.first_res_time;
        this.closed_time = response.closed_at;
        this.closed_by = response.ticket_closed_by;
      }
    },
      (error) => {
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


  toggleClass(id, to) {
    var x = document.getElementById("replyPanel_" + id);
    var y = document.getElementById("replyPanelall_" + id);
    y.style.display = "none";
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  toggleClassreplyall(id) {
    var x = document.getElementById("replyPanelall_" + id);
    // var y = document.getElementById("replyPanel_"+id);
    // y.style.display = "none";
    //  $('#'+y).hide();
    // alert(x);
    $('#replyPanelall_' + id).show();

    // if (x.style.display === "none") {
    //   x.style.display = "block";
    // } else {
    //   x.style.display = "none";
    // }

  }
  clickDiscard(id) {
    $('#replyPanelall_' + id).hide();

  }
  changeMyStatus() {
    var tickto;
    if (this.ticket_to == this.own_mail) {
      tickto = this.replied_from;
    } else {
      tickto = this.ticket_to;
    }
    // alert(tickto)
    // return false

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

        let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"oncloseTocket","status_id":"9","ticket_id":"' + this.ticket_t + '","ticket_to":"' + tickto + '","ticket_cc":"' + this.ticket_cc + '","admin_id":"' + this.admin_id + '","user_id":"'+this.user_id+'"}}';
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.status == true) {
            Swal.fire(
              'Closed!',
              'success'
            );
            this.closed = true;
            this.ticket_t = btoa(this.ticket_t);
            this.getTicketDetails(this.ticket_t);
            this.EmailToAddress = [];
            this.collobrators = [];
          }
        },
          (error) => {
            console.log(error);
          });
      }
    })
  }


  changetoSpam() {

    let access_token: any = localStorage.getItem('access_token');
    let user_id: any = localStorage.getItem('userId');
    Swal.fire({
      title: 'Are you sure?',
      text: "Would you like to Mark this Email as Spam!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Spam'
    }).then((result) => {
      if (result.value) {

        // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"blockEmailIds","admin_id":"1203","user_id":"1253","email_id":"Cal4Care | MR < mr@cal4care.com >","spam_status":"0","blacklist_status":"1"}}

        let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"blockEmailIds","admin_id":"' + this.admin_id + '","user_id":"' + user_id + '","email_id":"' + this.ticket_created_by + '","spam_status":"1","blacklist_status":"0" }}';
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.status == true) {
            this.router.navigate(['/ticketing-system-new']);
            iziToast.success({
              message: "Marked as Spam Successfully",
              position: 'topRight'
            });
            this.router.navigate(['/ticketing-system-new']);
          } else {
            iziToast.error({
              message: "Failed to mark as spam",
              position: 'topRight'
            });
          }
        },
          (error) => {
            console.log(error);
          });


      }

    })

  }

  changetoUnspam() {

    let access_token: any = localStorage.getItem('access_token');
    let user_id: any = localStorage.getItem('userId');
    Swal.fire({
      title: 'Are you sure?',
      text: "Would you like to Mark as Not Spam!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Not Spam!'
    }).then((result) => {
      if (result.value) {

        // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"blockEmailIds","admin_id":"1203","user_id":"1253","email_id":"Cal4Care | MR < mr@cal4care.com >","spam_status":"0","blacklist_status":"1"}}

        let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"blockEmailIds","admin_id":"' + this.admin_id + '","user_id":"' + user_id + '","email_id":"' + this.ticket_created_by + '","spam_status":"0","blacklist_status":"0" }}';
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.status == true) {
            this.router.navigate(['/ticketing-system-new']);
            iziToast.success({
              message: "Unspam Successfully",
              position: 'topRight'
            });
          } else {
            iziToast.error({
              message: "Failed to unspam",
              position: 'topRight'
            });
          }
        },
          (error) => {
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

  getFields(input, field) {
    var output = [];
    for (var i = 0; i < input.length; ++i)
      output.push(input[i][field]);
    return output.toString();
  }


  replyMessage(msg_id, to, extra) {
    let access_token: any = localStorage.getItem('access_token');
    let user_id: any = localStorage.getItem('userId');
    let api_req: any = new Object();
    let agent_req: any = new Object();

    var formData = new FormData();
    var id = msg_id;
    // var fileName = $('#up_files_'+msg_id).val();
    // alert(fileName); return false;

    msg_id = msg_id + extra;

    // alert(msg_id);
    if ((<HTMLInputElement>document.getElementById('up_files')).value != null) {
      var totalfiles = (<HTMLInputElement>document.getElementById('up_files')).files.length;
      for (var index = 0; index < totalfiles; index++) {
        formData.append("up_files[]", (<HTMLInputElement>document.getElementById('up_files')).files[index]);
      }
    }

    // var to = $('#email_address_'+msg_id).val();
    // var cc = $('#mail_cc_'+msg_id).val();
    let sign = $('#singature_id').val();
    // alert(sign);
    var result_cc = this.getFields(this.collobrators, "email_name");
    var result_to = this.getFields(this.EmailToAddress, "email_to");




    //var msg_id = $('#editor').val();
    // var msg_id = $('#reply_message_'+msg_id).val();
    // tinymce.activeEditor.setContent('sdsdsd');
    // alert('1');

    var msg_id = tinymce.get('reply_message_' + msg_id).getContent();

    // alert(myContent);

    // var myContent = tinymce.get("myTextarea").getContent();
    // alert(to1);
    // return false;
    if (msg_id == '' || msg_id == undefined) {
      iziToast.error({
        message: "Please Enter the Message",
        position: 'topRight'
      });
      return false;
    }
    if (result_to == '' || result_to == undefined) {
      iziToast.error({
        message: "Please Enter To Address ",
        position: 'topRight'
      });
      return false;
    }
    // alert(cc)
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
    formData.append('signature_id', sign);
    formData.append('to', result_to);
    formData.append('mail_cc', result_cc);
    // formData.append('up_files', $('#reply_file')[0].files);
    var files = $('#up_files')[0].files;
    var totalSize = 0;



    for (var i = 0; i < files.length; i++) {
      totalSize += files[i].size;
    }
    if (totalSize < 5242880) {
    }
    else {
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
      onOpen: () => {
        Swal.showLoading();
      }
    });


    $.ajax({
      url: "https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
      type: 'POST',
      data: formData,
      processData: false,  // tell jQuery not to process the data
      contentType: false,
      success: function (data) {
        Swal.close();
        this.parsed_data = JSON.parse(data);
        console.log(this.parsed_data);
        if (this.parsed_data.status == 'true') {
          iziToast.success({
            message: "Replied Successfully",
            position: 'topRight'
          });
          $("#refresh_page").click();
          $('#replyPanelall_' + id).hide();

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
  refresh() {
    //alert(this.ticket_t);
    this.ticket_t = btoa(this.ticket_t);
    this.getTicketDetails(this.ticket_t);
    this.EmailToAddress = [];
    this.collobrators = [];
  }
  get_agents_by_department() {
    var data = $('#dept_status').val();
    // alert(data)
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"get_agents_by_department","admin_id":"' + this.admin_id + '","dept_id":"' + data + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {
        this.agent_options = response.result.data;
        // this.getTicketDetails(this.ticket_t);
      }
    },
      (error) => {
        console.log(error);
      });
  }
  get_agents_by_department_dup(data) {
    // var data=$('#dept_status').val();
    // alert(data)
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"get_agents_by_department","admin_id":"' + this.admin_id + '","dept_id":"' + data + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {
        this.agent_options = response.result.data;
        // this.selectedAgentID=id;

        // this.getTicketDetails(this.ticket_t);
      }
    },
      (error) => {
        console.log(error);
      });
  }
  UpdateTicketStatus() {
    var dept = $('#dept_status').val();
    var status = $('#ticket_status').val();
    var agent = $('#agent_options').val();


    if (status == '') {
      status = this.ticket_status_sel;
    }
    if (dept == '') {
      iziToast.warning({
        message: "Please Select Department",
        position: "topRight"
      });
      return false;
    }
    // if(agent == ''){
    //   iziToast.warning({
    //     message:"Please Select Agent",
    //     position:"topRight"
    //   });
    //   return false;
    // }

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"updateTicketStatus","user_id":"' + this.user_id + '","ticket_id":"' + this.tick_id_ency + '","status":"' + status + '","department":"' + dept + '","agent_id":"' + agent + '","admin_id":"' + this.admin_id + '","user_name":"' + this.user_name + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {
        iziToast.success({
          message: "Ticket Updated Successfully ",
          position: "topRight"
        });
        this.router.navigate(['/ticketing-system-new']);
        // this.ticket_t=btoa(this.ticket_t);
        // this.getTicketDetails(this.ticket_t);
        // this.EmailToAddress=[];
        // this.collobrators=[];
      }
    },
      (error) => {
        console.log(error);
      });

  }
  AddNote() {
    let api_req: any = new Object();
    let chat_req: any = new Object();

    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    chat_req.action = "addNotesForTicketReply";
    chat_req.admin_id = this.admin_id;
    chat_req.user_id = this.user_id;
    chat_req.ticket_id = this.ticket_t;
    chat_req.user_name = this.user_name;
    chat_req.ticket_message_id = this.ticket_message_id;
    chat_req.ticket_notes = $('#privateNote').val();
    api_req.element_data = chat_req;



    //  var note= $('#privateNote').val();
    // let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"addNotesForTicketReply","admin_id":"'+this.admin_id+'","ticket_message_id":"'+this.ticket_t+'","ticket_notes":"'+note+'"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {

      if (response.result.data == 1) {
        iziToast.success({
          message: "Private Note Added",
          position: "topRight"
        });
        $('#userDepartmentManagement').modal('hide');
        $('#privateNote').val('');
        this.ticket_t = btoa(this.ticket_t);
        this.getTicketDetails(this.ticket_t);
        this.EmailToAddress = [];
        this.collobrators = [];

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

  openModel() {
    $("#document_model").modal('show');

    $('#userDepartmentManagement').modal('show');
  }
  showmore() {
    // $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    // $('.ticketing-system-panel').scrollTop($('.ticketing-system-panel')[0].scrollHeight);

    this.showmore_button = true;
    this.offset_count = this.offset_count + 5;
    // alert(this.offset_count);
    // this.offset_count = this.offset_count -this.total_offet;
    var offset = this.offset_count;
    if (this.total_offet >= offset + 5) {
      if (this.offset_count >= this.total_offet) {
        this.offset_count = this.total_offet;
        this.showmore_button = false;
      }
    } else {
      // alert('dasds');
      this.showmore_button = false;
    }
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"viewExternalTicket","ticket_id":"' + this.tick_id_ency + '","admin_id":"' + this.admin_id + '","limit":"' + this.pageLimit + '","offset":"' + this.offset_count + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == "true") {
        // this.ticket_replies = response.tick_options;
        // this.queue_list = response.ticket_options;
        // this.queue_list_all = response.ticket_options;
        var mydatas = [];
        mydatas = response.tick_options;
        // alert(mydatas.length);
        // this.queue_list = this.queue_list_all.push(mydatas);
        for (let index = 0; index < mydatas.length; index++) {
          var data = mydatas[index];
          this.ticket_replies.push(data);
        }

      }
    },
      (error) => {
        console.log(error);
      });
  }
  getFileExtension(filename) {
    console.log(filename);
    // alert(filename);
    var ext = /^.+\.([^.]+)$/.exec(filename);
    // alert(ext);
    this.ext = ext;
    console.log(this.ext);
    return ext == null ? "" : ext[1];
  }
  // getFileName(file_name){
  //   var name_without_ext = (file_name.split('\\').pop().split('/').pop().split('.'))[0];
  //   console.log(name_without_ext);
  // return name_without_ext;
  // }
  getsignpopup() {
    let access_token: any = localStorage.getItem('access_token');
    let sign: any = $('#singature_id').val();
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"' + access_token + '", "element_data":{"action":"editTicketSignature","sig_id":"' + sign + '","admin_id":"' + this.admin_id + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        $('#showpop_signature').modal('show');
        this.signature_content = response.result.data[0].sig_content;
        this.signature_title = response.result.data[0].sig_title;
      } else {
        iziToast.warning({
          message: "Please try again",
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
  PickUpTicket() {
    Swal.fire({
      title: 'Claim this Ticket',
      text: 'Are you sure to PickUp this Ticket ##' + this.ticket_t + '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        let tick_id = btoa(this.ticket_t);
        let access_token: any = localStorage.getItem('access_token');
        let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"' + access_token + '", "element_data":{"action":"claimMyTicket","user_id":"' + this.user_id + '","ticket_id":"' + tick_id + '","user_name":"' + this.user_name + '","admin_id":"' + this.admin_id + '"}}';
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.status == true) {
            iziToast.success({
              message: "You have Claimed this ticket",
              position: 'topRight'
            });
            this.ticket_t = btoa(this.ticket_t);
            this.getTicketDetails(this.ticket_t);
          } else {
            iziToast.warning({
              message: "Please try again",
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
    });

  }
}
