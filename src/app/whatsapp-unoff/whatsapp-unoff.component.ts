import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ServerService } from '../services/server.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { SafePropertyRead } from '@angular/compiler';
// import * as abcJS  from '/src/assets/js/recorder.js';
declare var $:any;
declare var iziToast:any;
// declare var   handleAction:any;
declare var  startRecording:any;

 declare var stopRecording:any;
@Component({
  selector: 'app-whatsapp-unoff',
  templateUrl: './whatsapp-unoff.component.html',
  styleUrls: ['./whatsapp-unoff.component.css']
})

export class WhatsappUnoffComponent implements OnInit {
  @ViewChild('chat_message', {static: false}) chat_message : ElementRef;
	@ViewChild('chat_detail_id', {static: false}) chat_detail_id : ElementRef;
	chat_panel_list;
	chat_panel_details;
	chat_panel_detail_type = "chat_screen";
	loginUser;
	chat_detail_key;
  customer_name;
  customer_number;
	socketData;
	websocket;
	phone_num;
	uadmin_id;
	admin_id;
  departments;
  param1;
  param2;chatid;
  getWp:FormGroup;scan_content=false;
  inst_id;
  user_list;username;transferedToMe=false;transferedforMe=false;
  forworduser;transfered=false;usertype;show_admin_sett=false;show_user_sett=false;
  agentname;
  group_name;
  prof_image;
  isthisgroup=false;
  group_icon;
  profile_image;
  rollonce=false;
  callonce;
  temp_list;
  offset_count = 0;
  chat_ids;
  offset_count_msg = 0;
  doc_link;
  audiofile;
  media_voice: any;
  constructor(private serverService: ServerService,private _ngZone: NgZone,private route: ActivatedRoute,private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.param1 = this.route.snapshot.queryParamMap.get('wp_id');
    //alert(this.param1);
    this.chatid = this.route.snapshot.queryParamMap.get('c');
  //   this.route.queryParamMap.subscribe(params => {

  //     this.ngOnInit();
  // });
  this.serverService.wp_chat.subscribe( ($event) =>
  {
     console.log($event);
     var chatids = $event.unique_id;
     //var chatids = this.param1;
     //alert(this.chat_ids);
     if(this.chat_ids==chatids){
      this.chatPanelDetail2(chatids);
      // alert('bhgu');
     }
    //  var dpContent = JSON.parse(val);

   }
  );
  this.serverService.changeDetectionEmitter.subscribe(
    ($event) => {

      let mData = JSON.parse($event);
      var pagefor = mData.pagefor;
      var pageid = mData.id;
//alert(pageid)

      if(pagefor == 'whatsapp_unoff'){
// alert(this.chat_detail_key)
// alert(pageid)
        if(this.chat_detail_key==pageid)
            this.chatPanelDetail2(pageid);
        else
        this.chatPanelView('all');
        setTimeout(()=>{
          $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
          }, 4000);
      }

    },
    (err) => {
    }
  );
  }

  ngOnInit() {
    setTimeout(() => {
    this.loadScript('../assets/js/recorder.js');
    }, 5000);

    this.profile_image=localStorage.getItem('profile_image');
    // this.route.params.subscribe(routeParams => {
    //   this.chatPanelView("all");
    // });
    // this.chatid=  atob(this.chatid);
    // this.param1=  atob(this.param1);
    this.param1=  atob(this.param1);


     this.uadmin_id = localStorage.getItem('userId');
     this.admin_id = localStorage.getItem('admin_id');
     this.loginUser = localStorage.getItem('userId');
     this.usertype = localStorage.getItem('user_type');
     this.agentname = localStorage.getItem('user_name');


      if(this.usertype == 'Admin'){
        this.show_admin_sett = true;
      }
      if(this.usertype == 'Employee'){
        this.show_user_sett = true;
      }

      this.getWp = new FormGroup({
        'wp_number' : new FormControl(null,Validators.required),
      });

      if(this.chatid){
        this.chatid=atob(this.chatid);
       // alert(this.chatid);
      //  this.chatPanelView("all");
        this.chatPanelDetail(this.chatid);
        clearTimeout(this.callonce);

       this.chatPanelView(this.chatid);
      }
      else if(this.param1)
      this.chatPanelView("all");
  // this.dept_agent_list();
  // this.hasContactAccess();
this.get_temps();
// handleAction();
//  startRecording();
//  stopRecording();
//this.delete(id);
    }

  ngOnDestroy(){
    this.chat_detail_key='';
  }
 ngAfterViewInit() {
     this.chatautoScroll();
  }

//   hasContactAccess(){

//     let access_token: any=localStorage.getItem('access_token');

//     let api_req:any = '{"operation":"contact", "moduleType":"contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"has_contact_access","user_id":"'+this.uadmin_id+'"}}';

//     this.serverService.sendServer(api_req).subscribe((response:any) => {
//       if(response.result.status==true){
//       this.agentname = response.result.data.agent_name;
//       } else {
//       }
//     },
//     (error)=>{
//       console.log(error);
//     });

// }

  chatautoScroll(){

    setTimeout(()=>{
      $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
      }, 10);

    }


    chatSearch(chatSearch){
    console.log(chatSearch);

    }

sendChatMessageData(){

  if(this.isthisgroup==true){
    var is_group='1';
        }
    else
    {      is_group='0'; }

     var chat_message=  this.chat_message.nativeElement.value;
      chat_message = chat_message.trim();
     if (chat_message.length > 0) {
      // alert(this.chat_detail_key)
      // alert(this.chat_detail_id.nativeElement.value);
     console.log(chat_message);
         let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="send_chat_message_unoff";
        // chat_req.chat_id=this.chat_detail_id.nativeElement.value;
        chat_req.chat_id=this.chat_detail_key;
        chat_req.user_id=this.loginUser;
        chat_req.chat_message=chat_message;
        chat_req.is_group=is_group;
        chat_req.instance_id=this.param1;
        api_req.operation="wp_instance";
        api_req.moduleType="wp_instance";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;


              this.serverService.sendServer(api_req).subscribe((response:any) => {


                if(response.result.status == true){
                var chat_msg= response.result.data;

               var socket_message  =  '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "'+chat_msg.chat_id+'","msg_user_id" : "'+chat_msg.msg_user_id+'","msg_user_type" : "2","msg_type":"text","message" : "'+chat_msg.chat_msg+'","queue_id":"1"}}';

           //    this.websocket.send(socket_message);

               console.log(socket_message);

                   this.chat_panel_details.push(chat_msg);

                   this.chatautoScroll();
                   this.chatPanelDetail(this.chat_detail_id.nativeElement.value);
                 clearTimeout(this.callonce);

                   $('#chat_msg').val('');
                   iziToast.success({
                    message:'Sent Successfully',
                    position:'topRight'
                   });
                }
                 else{
                   this.validateQR();

                }

              },
              (error)=>{

                  console.log(error);
              });

     }

    }

    onMessageSend($event){

    if($event.keyCode == 13&& !$event.shiftKey){
    this.sendChatMessageData();
            $event.stopPropagation();
          return false;
          }

    }


    chatPanelView(chat_id){
      // this.param1=  atob(this.param1);
      // this.param1=  atob(this.param1);
      // this.chatid=  atob(this.chatid);
     //alert(this.param1);

        let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="chat_message_panel_unoff";
        chat_req.chat_id=chat_id;
        chat_req.user_id=this.loginUser;
        chat_req.limit= 10;
        chat_req.offset= 0;
        chat_req.instance_id=this.param1;
        chat_req.user_type=this.usertype;
        api_req.operation="wp_instance";
        api_req.moduleType="wp_instance";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;

              this.serverService.sendServer(api_req).subscribe((response:any) => {
                console.log(response);
                if(response.result.status==1){

                   this.chat_panel_list = response.result.data.chat_list;
                    this.user_list=response.result.data.user_list;
                   for (var i = 0; i < this.user_list.length; i++) {
                    if(this.agentname == this.user_list[i].user_name){
                      // alert(this.agentname);
                      this.user_list.splice(this.user_list.indexOf(this.user_list[i]), 1 );
                    }
                  }
                  //   $("#tranfer_user option[value='"+this.loginUser+"']").remove();
                     if(chat_id == "all" || chat_id == "" || chat_id == 0){
                       this.chat_panel_detail_type = "chat_screen";
                     }
                     else{
                       this.chat_panel_details = response.result.data.chat_detail_list;
                       this.chat_panel_detail_type = "chat_detail";
                       this.chatPanelDetail(chat_id);
                 clearTimeout(this.callonce);

                     }

                    //  if(this.rollonce==false)
                          // this.chatautoScroll();

                     this.chat_detail_key = chat_id;
                    //  alert(this.chat_detail_key+"  id 1");

                }

              },
              (error)=>{
                  console.log(error);
              });
              // setTimeout(()=>{
              //   this.rollonce=true;
              //   // alert(chat_id);
              //   this.chatPanelView(this.chat_detail_key);
              //   }, 15000);

    }
    oncemore(){
    // alert("all");
    // clearTimeout(this.callonce);
    //   this.chatPanelViewoncemore(this.chat_detail_key);
    }

    chatPanelViewoncemore(chat_id){
        let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="chat_message_panel_unoff";
        chat_req.chat_id=chat_id;
        chat_req.user_id=this.loginUser;
        chat_req.limit="90";
        chat_req.instance_id=this.param1;
        chat_req.user_type=this.usertype;
        api_req.operation="wp_instance";
        api_req.moduleType="wp_instance";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;

              this.serverService.sendServer(api_req).subscribe((response:any) => {
                // console.log(response);
                if(response.result.status==1){
  //  alert("called");

  this.chat_panel_list = response.result.data.chat_list;
  this.user_list=response.result.data.user_list;
 for (var i = 0; i < this.user_list.length; i++) {
  if(this.agentname == this.user_list[i].user_name){
    // alert(this.agentname);
    this.user_list.splice(this.user_list.indexOf(this.user_list[i]), 1 );
  }
}
//   $("#tranfer_user option[value='"+this.loginUser+"']").remove();
  //  if(chat_id == "all" || chat_id == "" || chat_id == 0){
  //    this.chat_panel_detail_type = "chat_screen";
  //  }
  //  else{
  //   //  this.chat_panel_details = response.result.data.chat_detail_list;
  //    this.chat_panel_detail_type = "chat_detail";
  //   //  this.chatPanelDetail(chat_id);
  //  }

  //  if(this.rollonce==false)
        // this.chatautoScroll();


// this.callonce = setTimeout(() => {
//   // alert(chat_id);
//   // alert(this.chat_detail_key);
//   this.chatPanelViewoncemore(this.chat_detail_key);

// }, 15000);
// this.chat_detail_key = this.chat_detail_key;

                }

              },
              (error)=>{
                  console.log(error);
              });


    }


     chatPanelList(search_text){

  clearTimeout(this.callonce);
  // alert(this.param1);
  Swal.fire({
    title: 'Searching',
    allowEscapeKey: true,
    allowOutsideClick: false,
  //  background: '#19191a',
    showConfirmButton: false,
    onOpen: ()=>{
        Swal.showLoading();
    }
  });
          let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="getSearchResForWhatsapp";
        chat_req.search_text=search_text;
        chat_req.user_id=this.loginUser;
        chat_req.instance_id=this.param1;
        chat_req.limit=10;
        chat_req.offset=0;
        api_req.operation="wp_instance";
        api_req.moduleType="wp_instance";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;

              this.serverService.sendServer(api_req).subscribe((response:any) => {
                Swal.close();
                if(response.result.status==1){
                  console.log(response);
                     this.chat_panel_list = response.result.data;
                     //$('#searchText').val();

                }

              },
              (error)=>{
                Swal.close();
                iziToast.warning({
                  message: "Sorry,Some error occured",
                  position: 'topRight'
                });
                  console.log(error);
              });
              setInterval(function () {
                Swal.close()
              },10000)

    }

    chatPanelDetail(chat_id){
      // this.chatPanelView(chat_id);
      this.chat_ids = chat_id;
      $('#chat_msg').val('');
          let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="chat_detail_listOFF";
        chat_req.chat_id=chat_id;
        chat_req.limit="20";
				chat_req.offset= 0;
        chat_req.user_id=this.loginUser;
        api_req.operation="wpchat";
        api_req.moduleType="wpchat";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;

              this.serverService.sendServer(api_req).subscribe((response:any) => {

                if(response.result.status == true){
                  //console.log(response.result.status);
                     this.chat_panel_detail_type = "chat_detail";
                     this.chat_panel_details = response.result.data.chat_detail_list;
                     this.customer_name = response.result.data.chat_detail_list[0].customer_name;
                     this.group_name=response.result.data.chat_detail_list[0].group_name;
                     this.group_icon=response.result.data.chat_detail_list[0].group_icon;
                     this.prof_image=response.result.data.chat_detail_list[0].customer_image;
                     this.offset_count_msg = 0;
                     if(this.group_name != null){
                      this.isthisgroup=true;
                        this.customer_name = this.group_name;
                     }
                     else{
                      this.isthisgroup=false;
                     this.customer_name = response.result.data.chat_detail_list[0].customer_name;

                     }
                     this.customer_number = response.result.data.chat_detail_list[0].customer_number;

                     this.forworduser=response.result.data.chat_detail_list[0].f_user_nm;
                     this.username=response.result.data.chat_detail_list[0].user_name;


  if( this.forworduser!=null || this.forworduser!=undefined)
  {
      this.transfered=true;
     // this.transferedforMe=false; agentname
    //  if(this.username != this.forworduser && (this.username != null ||this.username != undefined) ){
      if(this.agentname == this.forworduser ){
              // alert(this.username);
              this.transferedforMe=true;
              // this.transfered=false;
            }
            else{
              this.transferedforMe=false;

            }
  }

  else
  {
      this.transfered=false;
      this.transferedforMe=false;

  }
  this.chat_detail_key = chat_id;
  // alert(this.chat_detail_key+"  id 3 details");

                   if(this.rollonce==false){

                  //  this.chatautoScroll();  2-3-21

                     setTimeout(()=>{
                      $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);

                      }, 10);
                    }


                          // this.rollonce==true;

                        // setTimeout(()=>{
                        //   this.rollonce==true;
                        //   this.chatPanelDetail(chat_id);
                        //     }, 20000);
                }
                clearTimeout(this.callonce);

  $("#calloncemore").click();

              },
              (error)=>{
                  console.log(error);
              });
    }









    genTicket(phone_num){
    this.phone_num = phone_num;
    this.getDepartments();
      $('#assign_ticket').modal('show');
    }



    assignTicket(phone_num){
    let assigned_department_id: any= $('#departments').val();
    console.log(assigned_department_id);
      if(assigned_department_id == '0'){
        iziToast.warning({
        message: "Please select department",
        position: 'topRight'
      });
      return false;
      }

      let access_token: any=localStorage.getItem('access_token');
      let admin_id: any=localStorage.getItem('admin_id');
      let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"generate_wp_ticket","user_id":"'+this.uadmin_id+'","department_id":"'+assigned_department_id+'","phone_num":"'+phone_num+'","admin_id":"'+admin_id+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == 1) {
            iziToast.success({
              message: "Ticket Assigned Successfully",
              position: 'topRight'
            });
            $('#assign_ticket').modal('hide');
          } else {

            iziToast.warning({
              message: "Ticket Not Assigned. Please try again",
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





    getDepartments(){
    let access_token: any=localStorage.getItem('access_token');

    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_dept_settings","user_id":"'+this.uadmin_id+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
      this.departments = response.result.data;
      } else {
      }
    },
    (error)=>{
      console.log(error);
    });
    }


addWhatsappMedia(){
  $('#createNewWidget').modal('hide');

  let access_token: any=localStorage.getItem('access_token');
  let user_id: any =  localStorage.getItem('userId');
  let chat_id: any=this.chat_detail_id.nativeElement.value;
    var formData = new FormData();
    formData.append('operation', 'wp_instance');
    formData.append('moduleType', 'wp_instance');
    formData.append('api_type', 'web');
    formData.append('api_type', 'web');
    formData.append('action', 'whatsapp_media_upload');
    formData.append('access_token', access_token);
    formData.append('whatsapp_media', $('#whatsapp_media')[0].files[0]);
    formData.append('user_id', user_id);
    formData.append('chat_id', chat_id);


    console.log(formData);
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
      //  url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
    url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
    type : 'POST',
    data : formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false,
    success:function(data){
      this.parsed_data = JSON.parse(data);
      console.log(this.parsed_data );
      if(this.parsed_data.status == 'true'){

        $('#whatsapp_media_url').val(this.parsed_data.url);
        $('#whatsapp_media').val('');
        $('#hit_image').click();
        Swal.close();

        iziToast.success({
          message: "Message sent successfully",
          position: 'topRight'
      });
      } else {
        Swal.close();


        iziToast.error({
          message: "Sorry, Some Error Occured",
          position: 'topRight'
      });
      }
      Swal.close();

    },
    error: function () {
      iziToast.error({
        message: "Sorry, Message not sent. Server takes too much of time for response",
        position: 'topRight'
    });
    Swal.close();

  }
});

  }






  sendChatMediaData(){

    var chat_message=  $('#whatsapp_media_with_text').val();
    chat_message = chat_message.trim();
    // alert(chat_message);
    if(this.isthisgroup==true){
      var is_group='1';
          }
      else
      {      is_group='0'; }
   console.log(chat_message);
       let api_req:any = new Object();
      let chat_req:any = new Object();
      chat_req.action="send_chat_message_unoff";
      chat_req.chat_id=this.chat_detail_id.nativeElement.value;
      chat_req.user_id=this.loginUser;
      chat_req.chat_message=chat_message;
      chat_req.is_group=is_group;
      chat_req.instance_id=this.param1;
      api_req.operation="wp_instance";
      api_req.moduleType="wp_instance";
      api_req.api_type="web";
      api_req.access_token=localStorage.getItem('access_token');
      chat_req.whatsapp_media_url= $('#whatsapp_media_url').val();
      api_req.element_data = chat_req;


            this.serverService.sendServer(api_req).subscribe((response:any) => {

              if(response.result.status==1){

              var chat_msg= response.result.data;

             var socket_message  =  '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "'+chat_msg.chat_id+'","msg_user_id" : "'+chat_msg.msg_user_id+'","msg_user_type" : "2","msg_type":"text","message" : "'+chat_msg.chat_msg+'","queue_id":"1"}}';

             //this.websocket.send(socket_message);

             console.log(socket_message);

                 this.chat_panel_details.push(chat_msg);
                //  this.forworded=
                 this.chatautoScroll();
                 clearTimeout(this.callonce);


                //  this.chatPanelDetail(this.chat_detail_id.nativeElement.value);
                 this.chatPanelDetail(this.chat_detail_key);
                 $('#chat_msg').val('');
              }
              else{
                this.validateQR();

             }

            },

            (error)=>{
                console.log(error);
            });



  }

  // scan(){
  //   $('#scan_qr').modal('show');
  // }

  get_wp_number(){

    let agent_req:any = this.getWp.value;
    console.log(this.getWp.value);
        let access_token: any=localStorage.getItem('access_token');
        let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_whatsapp_num","admin_id":"'+this.admin_id+'","whatsapp_num":"'+agent_req.wp_number+'"}}';
            this.serverService.sendServer(api_req).subscribe((response: any) => {
            if (response.result.data == 1) {
                    this.scan_content=true;
console.log(this.scan_content);
                    $('#scan_qr').modal('hide');
                    $('#show_qr').modal('show');
// $('#dailyfIframes').attr("src", $('#dailyfIframes').attr("src"));
$('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://whatsapp.mconnectapps.com/83430/qrCode" width="500" height="500" ></iframe>')

$('#dailyfIframes',window.parent.document).attr('src',$('#dailyfIframes',window.parent.document).attr('src'));

setTimeout(function() {$('#show_qr').modal('hide');}, 30000);

                }
                else {
                  iziToast.warning({
                      message: "Some server issue occur. Please try again",
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

      tranfer_chat(){

        if(this.username ==''|| this.username==null|| this.username==undefined)
        {
          iziToast.warning({
            message: "You must Initialize this customer chat before transfer",
            position: 'topRight'
        });
        return false;
        }

      var trans_user = $('#tranfer_user').val();

        console.log(trans_user);
          let access_token: any=localStorage.getItem('access_token');

            let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chatTransfer","chat_id":"'+this.chat_detail_key+'","user_id":"'+trans_user+'"}}';

            this.serverService.sendServer(api_req).subscribe((response:any) => {
              if(response.result.status==true){
                this.transfered=true;
                iziToast.success({
                  message: "Chat successfully Transfered to Agent",
                  position: 'topRight'
              });
                   $('#transferModel').modal('hide');
                 clearTimeout(this.callonce);

                   this.chatPanelDetail(this.chat_detail_key);



              }
            },
            (error)=>{
              iziToast.error({
                message: "Some server issue occur. Please try again",
                position: 'topRight'
            });
                console.log(error);
            });

      }

      modeltrans(){

        $('#transferModel').modal('show');

      }


      revokeransfer(){
        let access_token: any=localStorage.getItem('access_token');

        let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"revokeTransfer","chat_id":"'+this.chat_detail_key+'"}}';

        this.serverService.sendServer(api_req).subscribe((response:any) => {
          if(response.result.status==true){
       this.transfered=false;
       clearTimeout(this.callonce);

       this.chatPanelDetail(this.chat_detail_key);


            iziToast.success({
              message: "Chat successfully Revoked from "+this.forworduser+"",
              position: 'topRight'
          });
              //  $('#transferModel').modal('hide');
          }
        },
        (error)=>{
          iziToast.error({
            message: "Some server issue occur. Please try again",
            position: 'topRight'
        });
            console.log(error);
        });
      }

      // dept_agent_list(){
      //   let access_token: any=localStorage.getItem('access_token');

      //   let api_req:any = '{"operation":"chatinternal", "moduleType": "chatinternal", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"dept_agent_list","admin_id":"'+this.admin_id+'","user_id":"'+this.loginUser+'"}}';

      //   this.serverService.sendServer(api_req).subscribe((response:any) => {
      //     if(response.result.status==true){
      //                this.user_list=response.result.data.agent_list;

      //         //  $('#transferModel').modal('hide');
      //     }
      //   });
      // }
      composenew(){
     this.param1 = btoa(this.param1);

      // this.param1=  atob(this.param1);
// alert("this"+this.param1);
        this.router.navigate(['/wp-comp-unoff'], { queryParams: { wp_id: this.param1} });

      }

      validateQR(){

      // alert(this.param1);
        let access_token: any=localStorage.getItem('access_token');

          let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"readInstance","instance_id":"'+this.param1+'"}}';

          this.serverService.sendServer(api_req).subscribe((response:any) => {
            if(response.result.status == true){


         if(response.result.data == 'CONNECTED'){
          iziToast.warning({
            message: "Please try again.",
            position: 'topRight'
        });

         }
        else if(response.result.data == "CONFLICT"){
          this.refereshInstance();
            iziToast.warning({
              message: "Instance was Conflicted. May your WhatsApp is opend on another Brower/Computer. Please refresh our page once and try again",
              position: 'topRight'
          });

         }

         else{
        this.refereshInstance();

         iziToast.warning({
          message: "May you can try again after few seconds. Some error occured",
          position: 'topRight'
      });
         }
        }
     else{

              iziToast.warning({
                message: "Sorry,Some Server Error Occured",
                position: 'topRight'
            });


            }
     },
          (error)=>{
              console.log(error);
          });
      }


      refereshInstance(){


        let access_token: any=localStorage.getItem('access_token');

          let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"refreshInstance","instance_id":"'+this.param1+'"}}';

          this.serverService.sendServer(api_req).subscribe((response:any) => {

          },
          (error)=>{
              console.log(error);
          });
      }
      changestatus(id){
        // $('#'+id+'').removeClass('agent_active.fa-circle.fas');
      this.rollonce=false;
      // this.chatPanelView(id);
      }
      refereshInstance2(){
        this.chatPanelView('all');
        $('#searchText').val('')
      //   Swal.fire({
      //       title: 'Refresh your Instance',
      //        text:'',
      //       icon: 'warning',
      //       showCancelButton: true,
      //       confirmButtonColor: '#d33',
      //       cancelButtonColor: '#3085d6',
      //       confirmButtonText: 'yes'
      //     }).then((result) => {
      //       if (result.value) {

      //   let access_token: any=localStorage.getItem('access_token');

      //     let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"refreshInstance","instance_id":"'+this.param1+'"}}';

      //     this.serverService.sendServer(api_req).subscribe((response:any) => {

      //     },
      //     (error)=>{
      //         console.log(error);
      //     });
      //   }
      // });
      }

      get_temps(){
        let access_token: any=localStorage.getItem('access_token');

        let api_req:any = '{"operation":"template", "moduleType":"template", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"listTemplateByUSer","user_id":"'+this.uadmin_id+'","admin_id":"'+this.admin_id+'"}}';

        this.serverService.sendServer(api_req).subscribe((response:any) => {
          if(response.result.status==true){

          this.temp_list = response.result.data;
          console.log(this.temp_list);
          }
        },
        (error)=>{
          console.log(error);
        });
        }



      template(){
        var options = {};
              $.map(this.temp_list,
                  function(o) {
                      options[o.template_message] = o.template_name;
            });
            console.log(options);
            console.log(this.temp_list);
        const fruit =   Swal.fire({
          title: 'Select Template',
          input: 'select',
          inputOptions:options,
          inputPlaceholder: 'Select a Template',

          confirmButtonText: 'Pick out',
          showCancelButton: true,
          }).then(function (inputValue) {
          if (inputValue) {

            console.log(inputValue.value);
            console.log(fruit);
            $('#chat_msg').val(inputValue.value);
          }
        });


      }



      onScroll() {
       if($('#searchText').val()!= '')
       {
        var off = this.offset_count + 5;
        this.offset_count = off;
        let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="getSearchResForWhatsapp";
        chat_req.search_text=$('#searchText').val();
        chat_req.user_id=this.loginUser;
        chat_req.instance_id=this.param1;
        chat_req.limit=5;
        chat_req.offset=off;
        api_req.operation="wp_instance";
        api_req.moduleType="wp_instance";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;
              this.serverService.sendServer(api_req).subscribe((response:any) => {
                console.log(response);
                if(response.status==true){

                  // this.chat_panel_list = response.result.data.chat_list;

                   $('#infinitescrool').val();
                   var mydatas= [];
                   mydatas =  response.result.data;


                   for (let index = 0; index < mydatas.length; index++) {
                     var data = mydatas[index];
                     this.chat_panel_list.push(data);
                    }


                }

          },
          (error)=>{
            console.log(error);
          });
       }

else{
        var off = this.offset_count +  10;
        this.offset_count = off;
        var chat_id ='all';
        let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="chat_message_panel_unoff";
        chat_req.chat_id=chat_id;
        chat_req.user_id=this.loginUser;
        chat_req.limit= 5;
        chat_req.offset= off;
        chat_req.instance_id=this.param1;
        chat_req.user_type=this.usertype;
        api_req.operation="wp_instance";
        api_req.moduleType="wp_instance";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;

              this.serverService.sendServer(api_req).subscribe((response:any) => {
                console.log(response);
                if(response.result.status==1){

                  // this.chat_panel_list = response.result.data.chat_list;

                   $('#infinitescrool').val();
                   var mydatas= [];
                   mydatas =  response.result.data.chat_list;


                   for (let index = 0; index < mydatas.length; index++) {
                     var data = mydatas[index];
                     this.chat_panel_list.push(data);
                    }


                }

          },
          (error)=>{
            console.log(error);
          });

        }
    }









        onUp(){
            console.log('scroll ups');

            var off = this.offset_count_msg +  5;
            this.offset_count_msg = off;

          let api_req:any = new Object();
        let chat_req:any = new Object();
        chat_req.action="chat_detail_listOFF";
        chat_req.chat_id=this.chat_ids;
        chat_req.limit="5";
        chat_req.offset= this.offset_count_msg;
        chat_req.user_id=this.loginUser;
        api_req.operation="wpchat";
        api_req.moduleType="wpchat";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = chat_req;

              this.serverService.sendServer(api_req).subscribe((response:any) => {


                if(response.result.status == true){


                    // this.chat_panel_detail_type = "chat_detail";
                    // this.chat_panel_details = response.result.data.chat_detail_list;
                    // this.customer_number = response.result.data.chat_detail_list[0].customer_name;
                    // this.cus_name = response.result.data.chat_detail_list[0].cus_name;
                    // //    alert(this.cus_name);
                    // $('#id_'+chat_id).attr('style','display:none');
                    // //this.chatautoScroll();
                    // this.scrollSmoothToBottom ('infscrollUp');
                    // this.chat_detail_key = chat_id;
                    // console.log(this.chat_panel_list);
                    // this.chat_panel_list=this.chat_panel_list;

                    var mydatas= [];
                    mydatas =  response.result.data.chat_detail_list;
                    mydatas.reverse();
                    for (let index = 0; index < mydatas.length; index++) {
                      var data = mydatas[index];
                      this.chat_panel_details.unshift(data);
                     }

                    console.log(this.chat_panel_details);
                }

              },
              (error)=>{
                console.log(error);
              });


        }

        showdoc(link){
          //   this.doc_link=link;
          //  $("#document_model").modal('show');
          var url= link.split('/');
          // alert(url)
          this.doc_link="https://www.youtube.com/embed/"+url[3];
          // alert(this.doc_link)

          $("#video_play").modal('show');

         }stop(){
          var el_src = $('.myvideo').attr("src");
                $('.myvideo').attr("src",el_src);
          }
 startrec(){
  startRecording();
 }
 stoprec(){
  stopRecording();
 }
// action(){
//   handleAction();
// }
public loadScript(url: string) {
  const body = <HTMLDivElement> document.body;
  const script = document.createElement('script');
  script.innerHTML = '';
  script.src = url;
  script.async = false;
  script.defer = true;
  body.appendChild(script);
}
stpbtn(){

  $('#VoiceModel').modal('show');

}
addWhatsappVoice(){
  $('#VoiceModel').modal('hide');

  let access_token: any=localStorage.getItem('access_token');
  let user_id: any =  localStorage.getItem('userId');
  let chat_id: any=this.chat_detail_id.nativeElement.value;
  let data:any=$('#audio-playback').attr("src");
  console.log(data)
  fetch(""+data).then(response => response.blob())
  .then(blob => {
    const fd = new FormData();
   console.log(blob)
    fd.append('operation', 'wp_instance');
    fd.append('moduleType', 'wp_instance');
    fd.append('api_type', 'web');
    fd.append('action', 'whatsapp_upload_voice');
    fd.append('access_token', access_token);
    fd.append("audiofile", blob,$('#audio-playback').attr("src"));
     // alert($('#audio-playback')[0])
     fd.append('user_id', user_id);
     fd.append('chat_id', chat_id);
    // where `.ext` matches file `MIME` type
    var responsenew= fetch("https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php", {method:"POST", body:fd})
//return fetch("https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php", {method:"POST", body:fd})
  console.log(responsenew)
  return responsenew

  })
  .then((response) => response.json())

  .then((responsenew) => {
    console.log(responsenew);
    var self=this;
    self.media_voice=responsenew.url;
    //alert( media_voice)
  $('this.media_voice').val(responsenew.url);
  //  alert($('#self.media_voice').val())

    $('#whatsapp_media').val('');
  $('#hit_image_voice').click();
  if(responsenew.status=='true'){
    iziToast.success({
      message:'Sent Successfully',
      position:'topRight'
  });
}

});




// .then(response => response.responsenew)


//   .then(res => console.log(res))
//  .catch(err => console.log(err))


  // let audiofile: any=localStorage.getItem('access_token');
  // let audio: any= $('#audio-playback').val();
//     var formData = new FormData();
//     formData.append('operation', 'wp_instance');
//     formData.append('moduleType', 'wp_instance');
//     formData.append('api_type', 'web');
//     formData.append('action', 'whatsapp_media_upload');
//     formData.append('access_token', access_token);
//   // formData.append('audiofile', $('#audio')[0].files[0]);
//    formData.append('whatsapp_media', $('#audio-playback').attr("src"));
//   // alert($('#audio-playback')[0])
//    formData.append('user_id', user_id);
//     formData.append('chat_id', chat_id);
//    console.log($('#audio-playback').files);


//     console.log(formData);
//     Swal.fire({
//       title: 'Please Wait',
//       allowEscapeKey: false,
//       allowOutsideClick: false,
//     //  background: '#19191a',
//       showConfirmButton: false,
//       onOpen: ()=>{
//           Swal.showLoading();
//       }
//     });

//  $.ajax({
//       // url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
//     url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
//     type : 'POST',
//     data : formData,
//     processData: false,  // tell jQuery not to process the data
//     contentType: false,
//  success:function(data){
//       this.parsed_data = JSON.parse(data);
//       console.log(this.parsed_data );
//       if(this.parsed_data.status == 'true'){

//         //  $('#whatsapp_media_url').val(this.parsed_data.url);
//         $('#audio-playback').val('');
//         $('#hit_image').click();
//         Swal.close();

//         iziToast.success({
//           message: "Message sent successfully",
//           position: 'topRight'
//       });
//       } else {
//         Swal.close();


//         iziToast.error({
//           message: "Sorry, Some Error Occured",
//           position: 'topRight'
//       });
//       }
//       Swal.close();

//     },
//     error: function () {
//       iziToast.error({
//         message: "Sorry, Message not sent. Server takes too much of time for response",
//         position: 'topRight'
//     });
//     Swal.close();

//   }
;

}

sendvoiceMediaData(){

  var chat_message=  $('#whatsapp_media_with_text').val();
  chat_message = chat_message.trim();
  // alert(chat_message);
  if(this.isthisgroup==true){
    var is_group='1';
        }
    else
    {      is_group='0'; }
 console.log(chat_message);
     let api_req:any = new Object();
    let chat_req:any = new Object();
   //alert(this.media_voice);
    //return false;
    chat_req.action="send_chat_message_unoffvoice";
    chat_req.chat_id=this.chat_detail_id.nativeElement.value;
    chat_req.user_id=this.loginUser;
    chat_req.chat_message=chat_message;
    chat_req.is_group=is_group;
    chat_req.instance_id=this.param1;
    api_req.operation="wp_instance";
    api_req.moduleType="wp_instance";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    chat_req.whatsapp_media_url= this.media_voice;
    //alert(chat_req.whatsapp_media_url);
    api_req.element_data = chat_req;


          this.serverService.sendServer(api_req).subscribe((response:any) => {

            if(response.result.status==1){

            var chat_msg= response.result.data;

           var socket_message  =  '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "'+chat_msg.chat_id+'","msg_user_id" : "'+chat_msg.msg_user_id+'","msg_user_type" : "2","msg_type":"text","message" : "'+chat_msg.chat_msg+'","queue_id":"1"}}';

           //this.websocket.send(socket_message);

           console.log(socket_message);

               this.chat_panel_details.push(chat_msg);
              //  this.forworded=
               this.chatautoScroll();
               clearTimeout(this.callonce);


              //  this.chatPanelDetail(this.chat_detail_id.nativeElement.value);
               this.chatPanelDetail(this.chat_detail_key);
               $('#chat_msg').val('');
               // $('#chat_msg').val('');
              this.media_voice.val('');
              iziToast.success({
               message:'Sent Successfully',
               position:'topRight'
              });
            }
            else{
              this.validateQR();

           }

          },

          (error)=>{
              console.log(error);
          });



}
getFileExtension(filename) {
  //console.log(filename);
  // alert(filename);
  var ext = /^.+\.([^.]+)$/.exec(filename);
  // alert(ext);
  //console.log(ext);
  return ext == null ? "" : ext[1];
}
chatPanelDetail2(chat_id) {

  this.chat_ids = chat_id;
  $('#chat_msg').val('');
  let api_req: any = new Object();
  let chat_req: any = new Object();
  chat_req.action = "chat_detail_listOFF";
  chat_req.chat_id = chat_id;
  chat_req.limit = "5";
  chat_req.offset = 0;
  chat_req.user_id = this.loginUser;
  api_req.operation = "wpchat";
  api_req.moduleType = "wpchat";
  api_req.api_type = "web";
  api_req.access_token = localStorage.getItem('access_token');
  api_req.element_data = chat_req;

  this.serverService.sendServer(api_req).subscribe((response: any) => {

    if (response.result.status == true) {
      //console.log(response.result.status);
      this.chat_panel_detail_type = "chat_detail";
      this.chat_panel_details = response.result.data.chat_detail_list;
      this.customer_name = response.result.data.chat_detail_list[0].customer_name;
      this.group_name = response.result.data.chat_detail_list[0].group_name;
      this.group_icon = response.result.data.chat_detail_list[0].group_icon;
      this.prof_image = response.result.data.chat_detail_list[0].customer_image;
      this.offset_count_msg = 0;
      if (this.group_name != null) {
        this.isthisgroup = true;
        this.customer_name = this.group_name;
      }
      else {
        this.isthisgroup = false;
        this.customer_name = response.result.data.chat_detail_list[0].customer_name;

      }
      this.customer_number = response.result.data.chat_detail_list[0].customer_number;

      this.forworduser = response.result.data.chat_detail_list[0].f_user_id;
      this.username = response.result.data.chat_detail_list[0].user_name;


      if (this.forworduser != null || this.forworduser != undefined) {
        this.transfered = true;
        if (this.uadmin_id == this.forworduser) {
          this.transferedforMe = true;
        }
        else {
          this.transferedforMe = false;
        }
      }

      else {
        this.transfered = false;
        this.transferedforMe = false;

      }
      this.chat_detail_key = chat_id;
      // alert(this.chat_detail_key+"  id 3 details");

      if (this.rollonce == false) {

        //  this.chatautoScroll();  2-3-21

        setTimeout(() => {
          $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);

        }, 10);
      }


    }

  },
    (error) => {
      console.log(error);
    });

}

delete(chat_details){
// alert(id)
let id=chat_details.wp_msg_id;
Swal.fire({

  title: 'Are you sure?',
  text: "Delete message for Me!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'

})
.then((result) => {
  if (result.value) {
    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',


    });
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('admin_id');
    // let api_req:any = '{"operation":"contact", "moduleType": "contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_auxcode","id":"'+id+'","admin_id":"'+admin_id+'"}}';
    let api_req:any = '{"operation":"delete_message_chat", "moduleType": "wpchat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_message_chat","wp_msg_id":"'+id+'","mobile_num":"'+this.customer_number+'","instance_id":"'+this.param1+'","chat_id":"'+this.chat_detail_id.nativeElement.value+'"}}';

this.serverService.sendServer(api_req).subscribe((response:any) => {
  Swal.close()
  chat_details.delete_status=1;
if(response.result.data==1){

  Swal.fire(
    'Deleted!',
    'success'
  );
}

},
(error)=>{
  console.log(error);
});
  }
})

            }

}

