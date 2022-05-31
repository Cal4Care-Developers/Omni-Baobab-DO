import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usersL;
  user_type;
  has_contact;
  has_sms;
  queue_list;
  show_admin_sett = false;
  editAgent: FormGroup;
  selectedFile: File;
  profilePic;
  logoPic;
  small_logo_image;
  ext_num;
  hardware_id;
  websocket;
  admin_id;
  loginUser;
  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit() {
    this.user_type = localStorage.getItem('user_type');
    this.editAgent = new FormGroup({
      'user_name' : new FormControl(null,Validators.required),
      'email_id' : new FormControl(null),
      'agent_name' : new FormControl(null),
      'sip_login' : new FormControl(null),
      'sip_username' : new FormControl(null),
      'sip_password' : new FormControl(null),
      'phone_number' : new FormControl(null),
      'user_id' : new FormControl(null),
      'has_contact' : new FormControl(0),
      'has_sms' : new FormControl(0)
     });
    this.get_timezone();

    this.user_type = localStorage.getItem('user_type');
    if(this.user_type == 'Admin'){
      this.show_admin_sett = true;
    }
    this.myProfile();
    this.initsocket();
  }
  initsocket(){
    this.loginUser = localStorage.getItem('userId');
    this.admin_id = localStorage.getItem('admin_id');

    this.user_type = localStorage.getItem('user_type');
    if(this.admin_id == '64'){
      this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4002");
    } else if(this.admin_id == '201'){
      this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4003");
    } else if(this.admin_id == '1230'){
      this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4015");
      } else {
      this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4023");
    }

    this.websocket.onopen = function(event) {
     // $('#sendonload').click();
      console.log('Profile socket connected');
    }

    this.websocket.onmessage = function(event) {
    console.log(event.data);
      var result_message = JSON.parse(event.data);
      this.hardware_id = localStorage.getItem('hardware_id');
      if(result_message[0].cust_id == this.hardware_id){
       console.log('matched');
      //  console.log(result_message);
      } else {
        console.log('not matched');
        return false;
      }

       if(result_message[0].data[0].status=="false"){
        $('#datagetsfailed').click();
        // Swal.close();

      }
      else if(result_message[0].data[0].sipdata=="getagentdet"){

        // $('#sip_username_add').val(result_message[0].data[0].sip_username);
        // $('#sip_password_add').val(result_message[0].data[0].sip_password);
        $('#sip_username').val(result_message[0].data[0].sip_username);
        $('#sip_password').val(result_message[0].data[0].sip_password);
      }
    }
    this.websocket.onerror = function(event){
      console.log('error');
    }
    this.websocket.onclose = function(event){
      console.log('close');
    }
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
        // let api_reqs:any = '{"type": "profile"}';
        // this.serverService.profile.next(api_reqs);


        if(response.result.status==true){
          this.usersL = response.result.data;
          if(response.result.data.has_contact == '1'){ this.has_contact = 'Yes'; } else { this.has_contact = 'No';  }
          if(response.result.data.has_sms == '1'){ this.has_sms = 'Yes'; } else { this.has_sms = 'No';  }
        var agent_data = response.result.data;
        this.editAgent.setValue({
           'user_name' : agent_data.user_name,
           'email_id' : agent_data.email_id,
           'sip_login' : agent_data.sip_login,
           'sip_username' : agent_data.sip_username,
           'sip_password' :agent_data.sip_password,
           'agent_name' : agent_data.agent_name,
           'phone_number' : agent_data.phone_number,
           'user_id' : agent_data.user_id,
           'has_contact' : agent_data.has_contact,
           'has_sms' : agent_data.has_sms
       });

       this.profilePic = agent_data.profile_image;
       this.logoPic = agent_data.logo_image;
       this.small_logo_image = agent_data.small_logo_image;
        this.ext_num =  agent_data.sip_login;
       localStorage.setItem('profile_image', this.profilePic);
       localStorage.setItem('ext_num', this.ext_num);
       localStorage.setItem('user_name',agent_data.user_name);

       $('#timezone').val(agent_data.timezone_id).prop('selected', true);
       if(agent_data.has_contact == 1){
           $('#has_contact').prop('checked', true);
          } else {
           $('#has_contact').prop('checked', false);
          }
          if(agent_data.has_sms == 1){
           $('#has_sms').prop('checked', true);
          } else {
           $('#has_sms').prop('checked', false);
          }
      }
    },
      (error)=>{
          console.log(error);
      });
}


get_timezone(){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"getTimezone", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_timezone"}}';
  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.status=="true"){
      this.queue_list = response.timezone_options;
      console.log(this.queue_list);
    } else {

    }
  },
  (error)=>{
      console.log(error);
  });
}

// editAgentData(){

//   let api_req:any = new Object();
//   let agent_req:any = this.editAgent.value;
//   let timezone_id: any= $('#timezone').val();
//   agent_req.action='update_agent';
//   agent_req.timezone_id=timezone_id;
//   api_req.operation="agents";
//   api_req.moduleType="agents";
//   api_req.api_type="web";
//   api_req.access_token=localStorage.getItem('access_token');
//   api_req.element_data = agent_req;
//       this.serverService.sendServer(api_req).subscribe((response: any) => {
//       if (response.result.status == 1) {
//               $('#edit_agents_form').modal('hide');
//               iziToast.success({
//                   message: "Agent - "+agent_req.agent_name+" updated successfully",
//                   position: 'topRight'
//               });
//               this.myProfile();
//           }
//       else{

//               iziToast.warning({
//                   message: "Agent data not updated. Please try again",
//                   position: 'topRight'
//               });

//       }

//   },
//   (error) => {
//        iziToast.error({
//           message: "Sorry, some server issue occur. Please contact admin",
//           position: 'topRight'
//       });
//       console.log(error);
//   });
// }




editAgentData(){

  let access_token: any=localStorage.getItem('access_token');
  let user_id: any =  localStorage.getItem('userId');
  let api_req:any = new Object();
  let agent_req:any = new Object();

if(this.editAgent.value.user_name == ''){
  iziToast.error({
    message: "Please Enter the valid username",
    position: 'topRight'
});
}
var ext =this.editAgent.value.sip_login;


  //let timezone_id: any= $('#timezone').val();
  agent_req.action='update_agent';
  //agent_req.timezone_id=timezone_id;
  agent_req.user_name=this.editAgent.value.user_name;
  agent_req.email_id=this.editAgent.value.email_id;
  agent_req.agent_name=this.editAgent.value.agent_name;
  agent_req.sip_login=this.editAgent.value.sip_login;
    if(this.admin_id==user_id){
    agent_req.sip_username=$('#sip_username').val();
    agent_req.sip_password=$('#sip_password').val();
    }
    else{
      // Users dont has Sip update permission..So
      agent_req.sip_username=this.editAgent.value.sip_username;
      agent_req.sip_password=this.editAgent.value.sip_password;
    }
  agent_req.phone_number=this.editAgent.value.phone_number;
  agent_req.user_id=this.editAgent.value.user_id;
  agent_req.has_contact=this.editAgent.value.has_contact;
  agent_req.has_sms=this.editAgent.value.has_sms;
    var formData = new FormData();



    var json_arr = JSON.stringify(agent_req);
    formData.append('operation', 'agents');
    formData.append('moduleType', 'agents');
    formData.append('api_type', 'web');
    formData.append('action', 'image_upload');
    formData.append('access_token', access_token);
    formData.append('profile_image', $('#profile_image')[0].files[0]);
    // formData.append('logo_image', $('#logo_image')[0].files[0]);
    // formData.append('small_logo_image', $('#small_logo_image')[0].files[0]);
    formData.append('user_id', user_id);
    formData.append('element_data', json_arr);


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
      if(this.parsed_data.status == 'true'){
        $("#refresh_profile").click();
        iziToast.success({
          message: "Agent - "+agent_req.agent_name+" updated successfully",
          position: 'topRight'
      });

      setTimeout(() => {
        $("#refresh_page").click();
        }, 2500);
      localStorage.setItem('ext_num',ext);
      //location.reload();
      }else if(this.parsed_data.message) {
        iziToast.error({
          message: "Sorry, "+this.parsed_data.message+"",
          position: 'topRight'
      });
      // history.go(-1);
      //location.reload();
      }
      else{
        iziToast.error({
          message: "Sorry, Some Error Occured,Please contact Admin",
          position: 'topRight'
      });
      // history.go(-1);
      //location.reload();
      }
    }
});

  }
  reload(){
    window.location.reload();
    window.location.reload();
  }
  edit_billing_address(){

    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('admin_id');
    let api_req:any = '{"operation":"call_tarrif", "moduleType":"call_tarrif", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"view_admin_biller","admin_id":"'+admin_id+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        var ab = response.result.data[0];
    //    alert(response.result.data);
        //var contact_person =  $('#econtact_person').val();
        if(response.result.data != null && response.result.data != ""){
      //  alert("sdssfdss");

        $('#eadd1').val(ab.add1);
       $('#eadd2').val(ab.add1);
        $('#ecity').val(ab.city);
        $('#estate').val(ab.state);
        $('#ezip_code').val(ab.zip_code);
        $('#ecountry').val(ab.country);
        $('#ephone').val(ab.phone);
        $('#eemail').val(ab.email);
        $('#toll_free').val(ab.toll_free);
        $('#reg_no').val(ab.reg_no);
        $('#account_no').val(ab.account_no);
        $('#bank').val(ab.bank);
        $('#branch').val(ab.branch);
      }

        $('#edit_agents_form').modal('hide');
        $('#edit_billing_address').modal('show');

      } else {

      }
    },
    (error)=>{
        console.log(error);
    });


  }


  editShippingAddressMain(){
    // var user_id = $('#edit_agents_key').val();
    // var contact_person =  $('#contact_person').val();
    // var add1 =  $('#add1').val();
    // var add2 =  $('#add2').val();
    // var city =  $('#city').val();
    // var state =  $('#state').val();
    // var zip_code =  $('#zip_code').val();
    // var country =  $('#country').val();
    // var edit_ship =  $('#edit_ship').val();
    // var ship_contact =  $('#ship_contact').val();
    // var ship_to =  $('#ship_to').val();
    // var ship_add1 =  $('#ship_add1').val();
    // var ship_add2 =  $('#ship_add2').val();
    // var ship_city =  $('#ship_city').val();
    // var ship_state =  $('#ship_state').val();
    // var ship_zip =  $('#ship_zip').val();
    // var ship_country =  $('#ship_country').val();
    let admin_id: any =  localStorage.getItem('admin_id');
    var user_id = localStorage.getItem('userId');
   // var contact_person =  $('#econtact_person').val();
    var add1 =  $('#eadd1').val();
    var add2 =  $('#eadd2').val();
    var city =  $('#ecity').val();
    var state =  $('#estate').val();
    var zip_code =  $('#ezip_code').val();
    var country =  $('#ecountry').val();
    var phone =  $('#ephone').val();
    var email =  $('#eemail').val();
    var toll_free =  $('#toll_free').val();
    var reg_no =  $('#reg_no').val();
    var account_no =  $('#account_no').val();
    var bank =  $('#bank').val();
    var branch =  $('#branch').val();


  if(add1 == "" || city == "" || state == "" || zip_code == "" || country == ""){
    iziToast.warning({
      message: "Please Fill The Required Field",
      position: 'topRight'
    });
    return false;
  }

  if(phone == "" || email == "" || toll_free == "" || reg_no == "" || account_no == "" || bank == "" || branch == ""){
    iziToast.warning({
      message: "Please Fill The Required Field",
      position: 'topRight'
    });
    return false;
  }

    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_admin_biller","admin_id": "'+admin_id+'","user_id":"'+user_id+'","add1":"'+add1+'","add2":"'+add2+'","city":"'+city+'","state":"'+state+'","zip_code":"'+zip_code+'","country":"'+country+'","phone":"'+phone+'","email":"'+email+'","toll_free":"'+toll_free+'","reg_no":"'+reg_no+'","account_no":"'+account_no+'","bank":"'+bank+'","branch":"'+branch+'"}}';

   // console.log(api_req); return false;
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status == true){
        $('#edit_billing_address').modal('hide');
      } else {
      }
    },
    (error)=>{
      console.log(error);
    });



   }

   retriveFrom3cx(dev){
    if(dev == ''){
      iziToast.warning({
        message: "Please Enter the Extension",
        position: 'topRight'
    });
    return false;
    }
    $('#sip_username').val('');
    $('#sip_password').val('');
    this.hardware_id = localStorage.getItem('hardware_id');
      if(this.hardware_id !=''){
        var socket_message  =  '[{"cust_id":"'+this.hardware_id+'","data":[{"Name":"getagentdet","agentno":"'+dev+'"}]}]';
        this.websocket.send(socket_message);
      }
  }
  toggleClasss(){
    $(event.target).toggleClass("fa-eye fa-eye-slash");
    var input = $($(event.target).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  };
}
