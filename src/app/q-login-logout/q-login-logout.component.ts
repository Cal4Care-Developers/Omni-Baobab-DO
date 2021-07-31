import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HostListener } from '@angular/core';
import Swal from 'sweetalert2'
declare var $:any;
declare var call: any;
declare var transferCall: any;
declare var init_page: any;
declare var getinStatus: any;
declare var iziToast:any;

@Component({
  selector: 'app-q-login-logout',
  templateUrl: './q-login-logout.component.html',
  styleUrls: ['./q-login-logout.component.css']
})
export class QLoginLogoutComponent implements OnInit {
  dialPadContainer;
  quelogged;
  inc_or_out;
  queLogStatus;
dialPadCirclePlus;
dialPadRefresh;
dialPadActionview;
totalSeconds;
 callduration_timer;
 dialpadRecentCalls;
 dialpadOutgoingCalls;
 dialpadIncomingCalls;
 dialpadIncomingCallsProgress;
 dialpadUserList;
 callDetailView;
  userDetailView;
  sip_login;
  sip_authentication;
  sip_password;
  sip_port;
  sip_url;
  call_history_id;
  uadmin_id;
  key;
  dial_status;
  auxcodesM;
  redyForCall;
  loginUser;
  websocket;
  extension;
  has_hard_id;
  in_current_call = '';
  forwordPopup ='notforword';
  public isVisible: boolean = false;
  show_caller_id;
  survey_vid;
  allmyQues;
  admin_id;
  constructor(private serverService: ServerService,private router:Router) {

    this.serverService.show.subscribe( (val:any) => 
    {
    
     var dpContent = JSON.parse(val);
     
     
     if(dpContent.type == "queLoginOut"){
         //alert(dpContent.status)
         this.q_logout(dpContent.status);
     }
    });


 }

 ngOnInit() {
	this.dialPadContainer=false;
	this.dialPadCirclePlus=true;
	this.dialPadRefresh=false;
    this.dialPadActionview = "number_dailer";

    $("#getallmyqueue").prop("checked", false);
    this.loginUser = localStorage.getItem('userId');
    this.uadmin_id = localStorage.getItem('userId');
    this.admin_id = localStorage.getItem('admin_id');

    this.has_hard_id = localStorage.getItem('hardware_id');
    if(this.has_hard_id == ""){
        // $('#addLicence').modal('show');
        //$("#addLicence").modal({"backdrop": "static"});
    } else {


        
        // if(this.loginUser == '64'){
        //     this.websocket = new WebSocket("wss://socket.mconnectapps.com:5013/"); 
        //   } else if(this.loginUser == '164'){
        //     this.websocket = new WebSocket("wss://socket.mconnectapps.com:5014/"); 
        //   } else if(this.loginUser == '201'){
        //     this.websocket = new WebSocket("wss://socket.mconnectapps.com:5014/"); 
        //   } else {
        //     this.websocket = new WebSocket("wss://socket.mconnectapps.com:5012/"); 
        //   }


        if(this.admin_id == '66'){
            this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4002"); 
          } else if(this.admin_id == '201'){
            this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4003"); 
          } else {
            this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4014"); 
          }


        this.websocket.onopen = function(event) { 
          console.log('Dialpad socket connected');
        }
    
        this.websocket.onmessage = function(event) {
          
        var data = event.data;
        var result_message = JSON.parse(data);

        // var result_message = JSON.parse(JSON.stringify(data.toString()));

        //  if(result_message[0].from =='whatsapp'){
        //     iziToast.success({
        //         message: "New Whatsapp message",
        //         position: 'topRight'
        //     }); 
        //   }
        }
    
        this.websocket.onerror = function(event){
          console.log('error');
        }
        this.websocket.onclose = function(event){
          console.log('close');
        } 
    }




  }
  sendOnload(status,reason,queues){
    var socket_message  =  '[{"cust_id":"'+this.has_hard_id+'","data":[{"Name":"queuestatus","extension":"'+this.extension+'","status":"'+status+'","reason":"'+reason+'","queues":"'+queues+'"}]}]';
    this.websocket.send(socket_message);
}




q_logout(queu){
    this.myProfile();
    if(queu == 1){
        Swal.fire({
            title: 'Confirm Queue Logout',
            text: "This action will log you OUT of all queues and queue calls will not be sent to your extension until you log back in",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Not now',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {
                this.aux_codeDatas();
                this.myqueues();
            }
          })

    } else {
        this.loginQ()  
    }
    
}


myqueues(){
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('admin_id');
    let api_req:any = '{"operation":"queue", "moduleType":"queue", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"user_queue","agent_id":"'+this.uadmin_id+'","admin_id":"'+admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.result.status == true){
                this.allmyQues = response.result.data;
                $('#Qlogform').modal('show');
        }
    }, 
    (error)=>{
        console.log(error);
    });   
}




updateQ(){
    let access_token: any=localStorage.getItem('access_token');
    var queues = $('.getallmyqueues:checked').map(function(){
        return this.value;
    }).get();



    if(queues ==''|| queues=='0' ){
        iziToast.warning({
            message: "Please Select atleast one Queue",
            position: 'topRight'
        }); 
        return false;
    }

    let que: any =  $('#que').val();  

    if(que ==''|| que=='0' ){
        iziToast.warning({
            message: "Please Select Auxcode",
            position: 'topRight'
        }); 
        return false;
    }


    let api_req:any = '{"operation":"call", "moduleType":"call", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"in_login_logout","agent_id":"'+this.uadmin_id+'","reason":"'+que+'","status":"0"}}';
    this.sendOnload('0',que,queues);  
    this.serverService.sendServer(api_req).subscribe((response:any) => {

        let api_reqs:any = '{"type": "profile"}';
        this.serverService.profile.next(api_reqs);

      if(response.result.status == true){

        
        iziToast.success({
            message: "Logout successfully",
            position: 'topRight'
        });
        $('#Qlogform').modal('hide');
      } else {
        iziToast.error({
            message: "Sorry some error occured",
            position: 'topRight'
        });
        $('#Qlogform').modal('hide');
      }
    }, 
    (error)=>{
        console.log(error);
    });
}



// q_login(){
    
//     $('#Qloginform').modal('show');
// }



loginQ(){
    let access_token: any=localStorage.getItem('access_token');
	let que: any =  $('#que').val(); 
  this.sendOnload('1',que,'');

    let api_req:any = '{"operation":"call", "moduleType":"call", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"in_login_logout","agent_id":"'+this.uadmin_id+'","reason":"","status":"1"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {

        let api_reqs:any = '{"type": "profile"}';
        this.serverService.profile.next(api_reqs);
        if(response.result.status == true){
            
        iziToast.success({
            message: "Login successfully!",
            position: 'topRight'
        });
        this.queLogStatus = '1';
        this.redyForCall = 'Ready for calls';
      } else {
        iziToast.error({
            message: "Sorry some error occured",
            position: 'topRight'
        });
      }
    }, 
    (error)=>{
        console.log(error);
    });
}






aux_codeDatas(){
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('admin_id');
    let api_req:any = '{"operation":"auxcode", "moduleType":"auxcode", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_auxcode","admin_id":"'+admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        this.auxcodesM = response.result.data;
      } 
    }, 
    (error)=>{
        console.log(error);
    });
  }

openFullscreen(){

$("#dialpad-wrapper").addClass("enable-fullscreen-dialpad");
$(".card").addClass("none");
$(".main-sidebar, .main-footer, .navbar, .card, .main-content").addClass("blur");

}








myProfile(){
    let api_req:any = new Object();
    let get_agent_req:any = new Object();
    get_agent_req.user_id=localStorage.getItem('userId');
    get_agent_req.action='get_agent_data';
    api_req.operation="agents";
    api_req.moduleType="agents";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = get_agent_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {  
          if(response.result.status==true){
                this.extension = response.result.data.sip_login;
          }
           
        }, 
        (error)=>{
            console.log(error);
        });
  }

  checkallQueues(){
    if($("#getallmyqueue").prop("checked")){   
    $('.getallmyqueues').prop('checked',true);
    }
    else
    $(".getallmyqueues").prop("checked",false);
    //$(".queues_check").prop("checked", false);
  }
  checksingleQueue(){  
    $("#getallmyqueue").prop("checked",false);
  }

}
