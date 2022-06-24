import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';
import { callbackify } from 'util';
import Swal from 'sweetalert2'


declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-wp-inst-compose',
  templateUrl: './wp-inst-compose.component.html',
  styleUrls: ['./wp-inst-compose.component.css']
})
export class WpInstComposeComponent implements OnInit {

compSMS: FormGroup;
compGroupSMS: FormGroup;
senders_list;
admin_id;
uadmin_id;
show_sender = false;
singleSMS = true;
bulkSMS = false;
groups_list;user_type;
param1;
chatid;
constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute,) {

  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.param1 = this.route.snapshot.queryParamMap.get('wp_id');

  this.compSMS = new FormGroup({
    'mobile_num' :new FormControl(null,Validators.required),
    'country_code':new FormControl(null,Validators.required),
    'message' :new FormControl(null,Validators.required)
  });
  this.compGroupSMS = new FormGroup({
    'group' :new FormControl(null),
    'message' :new FormControl(null)
  });
}

ngOnInit() {
     this.param1=  atob(this.param1);


  this.admin_id = localStorage.getItem('admin_id');
  this.uadmin_id = localStorage.getItem('userId');
  this.user_type=localStorage.getItem('user_type');
  if(this.admin_id == 47){
    this.show_sender = false;
  } else {
    this.show_sender = true;
  }
  this.smsGroups();
}




senders(){
  let access_token: any=localStorage.getItem('access_token');
  let user_id: any=localStorage.getItem('userId');
  let api_req:any = '{"operation":"contact", "moduleType":"contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_senderid","admin_id":"'+this.admin_id +'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    this.senders_list = response.result.data;
  },
  (error)=>{
      console.log(error);
  });
}



sendSMS(){

  console.log(this.compSMS.value);

  if(this.compSMS.value.country_code == null){
    iziToast.error({
      message: "Please enter the Country code",
      position: 'topRight'
    });
    return false;
  }

  if(this.compSMS.value.mobile_num == null){
    iziToast.error({
      message: "Please enter the number",
      position: 'topRight'
    });
    return false;
  }



  if(this.compSMS.value.message == null && $('#wp_media_file').val() == ''){
    iziToast.error({
      message: "Please enter the message",
      position: 'topRight'
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

          let access_token: any=localStorage.getItem('access_token');
          let user_id: any =  localStorage.getItem('userId');
          let agent_req:any = this.compSMS.value;

            var formData = new FormData();
            var json_arr = JSON.stringify(agent_req);
            formData.append('operation', 'wp_instance');
            formData.append('moduleType', 'wp_instance');
            formData.append('api_type', 'web');
            formData.append('action', 'single_whatsapp_media_upload_uoff');
            formData.append('access_token', access_token);
            formData.append('whatsapp_media', $('#wp_media_file')[0].files[0]);
            formData.append('user_id', user_id);
            formData.append('phone_num', this.compSMS.value.mobile_num);
            formData.append('country_code', this.compSMS.value.country_code);
            formData.append('chat_msg', this.compSMS.value.message);
            formData.append('timezone_id', localStorage.getItem('timezone_id'));
            formData.append('admin_id', localStorage.getItem('admin_id'));
            formData.append('instance_id', this.param1);

            console.log(formData);



           // return false;

          $.ajax({

            // url:"https://baobabbfaso.mconnectapps.com/api/v1.0/index_new.php",
            url:"https://baobabbfaso.mconnectapps.com/api/v1.0/index_new.php",
            type : 'POST',
            data : formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,
            success:function (data){
              this.parsed_data = JSON.parse(data);
              console.log(this.parsed_data );
              if(this.parsed_data.status == 'true'){
                Swal.close();


                var chat_id = this.parsed_data.chat_id;
                console.log(chat_id);
                // formData.append('chat_id', chat_id);
                iziToast.success({
                  message: "Sent successfully",
                  position: 'topRight'
                });
              $("#refresh_page").val(chat_id);
              // this.goToMain(chat_id);
              $("#refresh_page").click();

              } else {
                Swal.close();


                iziToast.error({
                  message: this.parsed_data.data,
                  position: 'topRight'
              });

              }
              Swal.close();

            },
            error: function () {
              iziToast.error({
                message: "Sorry,Message not sent.",
                position: 'topRight'
            });
            Swal.close();
          }

        });

}
closeLoading(){
  Swal.close();
}
goToMain(){
  this.chatid=$("#refresh_page").val();
        //alert(this.chatid);
  this.param1=btoa(this.param1);
  this.chatid=btoa(this.chatid);
  this.router.navigate(['/wp-unoff'], { queryParams: { wp_id: this.param1, c: this.chatid} });

}


wordCount(){
  $("#wordCount").text($('#message').val().length );
}

smsTab(tab){
if(tab == 'bulk'){
this.singleSMS = false;
this.bulkSMS = true;
} else {
this.singleSMS = true;
this.bulkSMS = false;
}
}
smsGroups(){
let access_token: any=localStorage.getItem('access_token');

let api_req:any = '{"operation":"contact", "moduleType":"contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"list_smsgroup","admin_id":"'+this.uadmin_id+'"}}';

this.serverService.sendServer(api_req).subscribe((response:any) => {
  if(response.status==true){

    this.groups_list = response.result.data;
    console.log(this.groups_list);
  }
},
(error)=>{
    console.log(error);
});
}







sendGroupSMS(){
var mes = this.compGroupSMS.value.message;

if(this.compGroupSMS.value.group == null){
iziToast.error({
  message: "Please Select The Group",
  position: 'topRight'
});
return false;
}


if(this.compGroupSMS.value.message == null && $('#wp_media_file_b').val() == ''){
iziToast.error({
  message: "Please enter the message",
  position: 'topRight'
});
return false;
}


if(this.compGroupSMS.value.message == null && $('#wp_media_file_b').val() != ''){
mes = '';
}

//console.log(mes ); return false;

let access_token: any=localStorage.getItem('access_token');
let user_id: any =  localStorage.getItem('userId');


  var formData = new FormData();
  formData.append('operation', 'wpchat');
  formData.append('moduleType', 'wpchat');
  formData.append('api_type', 'web');
  formData.append('action', 'bulk_whatsapp_media_upload');
  formData.append('access_token', access_token);
  formData.append('whatsapp_media', $('#wp_media_file_b')[0].files[0]);
  formData.append('user_id', user_id);
  formData.append('admin_id', localStorage.getItem('admin_id'));
  formData.append('timezone_id', localStorage.getItem('timezone_id'));
  formData.append('group', this.compGroupSMS.value.group );
  formData.append('chat_msg', mes);




  console.log(formData);

$.ajax({
  url:"https://baobabbfaso.mconnectapps.com/api/v1.0/index_new.php",
  type : 'POST',
  data : formData,
  processData: false,  // tell jQuery not to process the data
  contentType: false,
  success:function(data){
    this.parsed_data = JSON.parse(data);
    console.log(this.parsed_data );
    if(this.parsed_data.status == 'true'){
      iziToast.success({
        message: "Sent successfully",
        position: 'topRight'
      });
      $("#refresh_page").click();

    } else {
      iziToast.error({
        message: "Sorry, Some Error Occured",
        position: 'topRight'
    });
    }
  }
});
}



// updateWPnum(){
//   let access_token: any=localStorage.getItem('access_token');

//   let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_whatsapp_num","whatsapp_num":"097654321","admin_id":"'+this.admin_id+'"}}';

//   this.serverService.sendServer(api_req).subscribe((response:any) => {
//     if(response.status==true){

//       this.groups_list = response.result.data;
//       console.log(this.groups_list);
//     }
//   },
//   (error)=>{
//       console.log(error);
//   });
// }


}
