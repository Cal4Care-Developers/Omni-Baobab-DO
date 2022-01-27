import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialpadComponent } from '../mc/dialpad/dialpad.component';
declare var $:any;
declare var iziToast:any;
declare var medi: any;
declare var dialPadOpen: any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-edit-contacts',
  templateUrl: './edit-contacts.component.html',
  styleUrls: ['./edit-contacts.component.css']
})
@Pipe({
  name: 'safe'
})
export class EditContactsComponent implements OnInit {




  param1: string;
  created_time;
  addRefined: FormGroup;
  modified_time;
  contact_id;
  editContact: FormGroup;
  departments;
  uadmin_id;
  auxcodes;
  fromEdit;
  questions;
  to_num;
  call_record_id;
  admin_id;
  dailyfood = false;
  alladmin = true;
  dsk_access;
  hasdsk = false
  hasnodsk = true;
  external_contact_url;
  public allowMp = true;
  public startrec = false;
  dailyfoodurl;
  has_external_contact;
  IFlink;
  show_caller_id;
  hide_cal1er = '0';
  click_to_call_number;
  click_to_call_mobile_number;
  click_to_call_office_phone;
  click_to_call_home_phone;
  crm_type;
  hapikey;
  paramq;
  dailyfoodurlhub;
  z_authId;
  z_orgId;
  paramCall;
  popupnumber;
  category_name;
  extension;
  has_hard_id;
  auxcode_catagory;
  user_type;
  admin_permission;
  get_dailer_value;
  no_contact = false;
  show_mini_butons = false;
  show_ans_del = false;
  show_ans = false;
  show_del = false;
  param3;
  websocket;
  email_id: string;
  type_appellant: any;
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute, private sanitizer: DomSanitizer,public modalService: NgbModal) { 
    
    this.addRefined = new FormGroup({
      'add_group_name': new FormControl(null, Validators.required),
    });

    this.param1 = this.route.snapshot.queryParamMap.get('phone');
    this.param3 = this.route.snapshot.queryParamMap.get('ids');
    this.paramCall = this.route.snapshot.queryParamMap.get('calltype');
    this.email_id = this.route.snapshot.queryParamMap.get('email');

   //alert(this.paramCall)
    var decodedString = atob(this.param1);
    this.param1 = decodedString;
    this.get_dailer_value = localStorage.getItem("income_calls_num");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.serverService.editContact.subscribe((val: any) => {

      var dpContent = JSON.parse(val);
      // console.log(dpContent);
      if (dpContent.type == "show_popup") {
        this.param1 = dpContent.caller_no;
        this.paramCall = dpContent.call_type;
      //  alert(this.paramCall)
        // this.queue_values = dpContent.queue_num;
        if (dpContent.show_buttons == "true") {
          this.show_mini_butons = true;
          this.show_ans = true;
          this.show_del = true;
        } else {
          this.show_mini_butons = false;
          this.show_ans = false;
          this.show_del = false;
        }
        console.log(this.param1);
        //  this.editConatcts();        
      }
      if (dpContent.type == "call_ended") {
        this.show_ans = false;
        this.show_del = false;
      }

    });
    
  }
  
  ngOnInit() {
    this.editContact = new FormGroup({
      'contact_owner' :new FormControl(null,Validators.required),
      'first_name' :new FormControl(null),
      'last_name' :new FormControl(null),
      'account_name' :new FormControl(null),
      'lead_source' :new FormControl(null),
      'title' :new FormControl(null),
      'email' :new FormControl(null,[
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      'activity' :new FormControl(null),
      'phone' :new FormControl(null,Validators.required),
      'home_phone' :new FormControl(null),
      'office_phone' :new FormControl(null),
      'fax' :new FormControl(null),
      'mobile' :new FormControl(null),
      'dob' :new FormControl(null),
      'assistant' :new FormControl(null),
      'assitant_phone' :new FormControl(null),
      'reports_to' :new FormControl(null),
      'email_opt_out' :new FormControl(0),
      'skype' :new FormControl(null),
      'secondary_email' :new FormControl(null),
      'twitter' :new FormControl(null),
      'reporting_to' :new FormControl(null),
      'mailing_street' :new FormControl(null),
      'other_street' :new FormControl(null),
      'mailing_city' :new FormControl(null),
      'other_city' :new FormControl(null),
      'mailing_province' :new FormControl(null),
      'other_province' :new FormControl(null),
      'mailing_postal_code' :new FormControl(null),
      'other_postal_code' :new FormControl(null),
      'mailing_country' :new FormControl(null),
      'other_country' :new FormControl(null),
      'created_by' :new FormControl(null),
      'notes' :new FormControl(null),
      'modified_by' :new FormControl(null),
      'whatsapp_number' :new FormControl(null),
      'line' :new FormControl(null),
      'facebook_url' :new FormControl(null),
      'wechat' :new FormControl(null),
      'viber' :new FormControl(null),
      'telegram' :new FormControl(null),
      'instagram_url' :new FormControl(null),
      'linkedin' :new FormControl(null),
      'country_code' : new FormControl(null)
     });
     this.uadmin_id = localStorage.getItem('userId');
     this.show_caller_id = localStorage.getItem('show_caller_id');
     
    this.extension = localStorage.getItem('ext_num');
    this.has_hard_id = localStorage.getItem('hardware_id');
    // let user_id: any=localStorage.getItem('userId');

    $('#user_number').val(this.extension);
    //  this.getDepartments();
    //  this.getAuxCode();
    // if (this.param3 != '' && this.param3 != null && this.param3 != undefined) {
    //   if (this.get_dailer_value != 'unknown' && this.get_dailer_value != 'anonymous') {
    //     this.editbutttonContacts();
    //   } else {
    //     $('#first_name').val('');
    //     $('#last_name').val('');
    //     $('#job_title').val('');
    //     $('#acc_name').val('');
    //     $('#ax_name').val('');
    //     $('#account_ids').val('');
    //     this.no_contact=true;
    //     Swal.fire({
    //       title: 'Contact Unknown',
    //       text: "You can save contact by hitting the Add contact button",
    //       icon: 'info',
    //       showCancelButton: false,
    //       confirmButtonColor: '#3085d6',
    //       confirmButtonText: 'Got it'
    //     })
    //   }
    // } else {
      if (this.get_dailer_value != 'unknown' && this.get_dailer_value != 'anonymous') {
        this.editConatcts();
      } else {
        $('#first_name').val('');
        $('#last_name').val('');
        $('#email').val('');
        $('#title').val('');
        $('#phone').val('');
        $('#mobile').val('');       
        this.no_contact=true;
        Swal.fire({
          title: 'Contact Unknown',
          text: "You can save contact by hitting the Add contact button",
          icon: 'info',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Got it'
        })

      }
    //  this.getDepartments();
    //  this.getAuxCode();
     this.editConatcts();
     //this.getAuxCatogory();
    // if(this.fromEdit){
     
    // } else {
    //   this.getquestionnaire();
    // }
    this.toggleClass();
    this.admin_id = localStorage.getItem('admin_id');
    this.dsk_access = localStorage.getItem('dsk_access');
    this.has_external_contact = localStorage.getItem('has_external_contact');
    this.user_type = localStorage.getItem('user_type');
    this.admin_permission = localStorage.getItem('admin_permision');
	

		if (this.user_type == 'Super Admin') {
			this.user_type = 1;
		}
		else if (this.user_type == 'Admin' || this.admin_permission =='1') {
			this.user_type = 2;	 
		}
		else {
			this.user_type = 3;		 
		}
    if ($("body").hasClass("sidebar-mini")) {
      $("body").removeClass("sidebar-mini");
      $("body").addClass("sidebar-mini");
    } else {
      $("body").addClass("sidebar-mini");
    }

  }

  ngAfterViewInit() {
    // if(this.crm_type == 'SalesForce' ){
    //   this.dailyfoodurl = this.external_contact_url;
    // } else if(this.crm_type == 'HubSpot'){
     
    // }


    if(this.crm_type == 'SalesForce' ){
      this.dailyfoodurl = this.external_contact_url;
      $('<iframe is="x-frame-bypass" class="dailyfIfram" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>').attr('src', this.dailyfoodurl).appendTo('#dailyfIframes'); 

    } else if(this.crm_type == 'HubSpot'){
      this.dailyfoodurl = this.external_contact_url;
      let access_token: any=localStorage.getItem('access_token');

      if(this.paramq ==''){
        this.dailyfoodurl = this.external_contact_url;
      } else {
        this.dailyfoodurl = 'https://api.hubapi.com/contacts/v1/search/query?q='+this.paramq+'&hapikey='+this.hapikey;
      }
      

      let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"curl_response","url":"'+this.dailyfoodurl+'"}}';

      this.serverService.sendServer(api_req).subscribe((response:any) => {
      //  console.log(response.contacts[0]);
        this.dailyfoodurlhub = response.contacts[0]['profile-url'];
       // alert(this.dailyfoodurlhub);
        $('<iframe  class="dailyfIfram" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>').attr('src', this.dailyfoodurlhub).appendTo('#dailyfIframes'); 
      }, 
      (error)=>{
          console.log(error);
      });  
    }  else if(this.crm_type == 'ZohoDesk'){
      this.dailyfoodurl = this.external_contact_url;
      let access_token: any=localStorage.getItem('access_token');
      this.z_authId  = this.route.snapshot.queryParamMap.get('authkey');
      this.z_orgId  = this.route.snapshot.queryParamMap.get('orgId');
      var number  = this.route.snapshot.queryParamMap.get('q');


      if(this.paramq ==''){
        this.dailyfoodurl = this.external_contact_url;
      } else {
        this.dailyfoodurl = 'https://desk.zoho.com/api/v1/search?module=contacts&searchStr='+this.paramq;
      }
      

      let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"curl_response_zoho_desk","url":"'+this.dailyfoodurl+'","authkey":"'+this.z_authId+'","orgID":"'+this.z_orgId+'","number":"'+number+'"}}';

      this.serverService.sendServer(api_req).subscribe((response:any) => {
        this.dailyfoodurlhub = response.result.data;
     // alert(this.dailyfoodurlhub);
        $('<iframe is="x-frame-bypass" class="dailyfIfram" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>').attr('src', this.dailyfoodurlhub).appendTo('#dailyfIframes'); 
      }, 
      (error)=>{
          console.log(error);
      });  
    }


  }
tesr(){
  medi();
  this.allowMp = false;
  $("#btns").css("display", "block");
}
initSocket() {
  var self=this;
      if (this.admin_id == '66') {
        this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4002");
      } else if (this.admin_id == '201') {
        this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4003");
      } else {
        this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4036");
      }
  
  
      this.websocket.onopen = function (event) {
        console.log('Dialpad socket connected');
      }
  
      this.websocket.onmessage = function (event) {
        // console.log(event.data);
        var result_message = JSON.parse(event.data);
        //    console.log(result_message);  
        //    console.log($('#user_number').val());
        this.has_hard_id = localStorage.getItem('hardware_id');
        if (result_message[0].cust_id == this.has_hard_id) {
          // console.log('matched');
        } else {
          // console.log('not matched');
          return false;
        }
  
        if (result_message[0].data[0].wrapuptype == "wrapupcall_id" && result_message[0].data[0].extno == $('#user_number').val()) {
          $('#wrapup_callID').val(result_message[0].data[0].callid);
         // alert(result_message[0].data[0].callid)
         alert('asnja')
          // $('#wrapup_callID').click();
        }
        if (result_message[0].data[0].calltype == "Incoming Call" && result_message[0].data[0].ag_no == $('#user_number').val()) {
          $('#queue_ids2').val(result_message[0].data[0].q_no);
        //   self.Queue_number=result_message[0].data[0].q_no;
        //   // alert(result_message[0].data[0].q_no)
        //   iziToast.info({
        //     title:""+result_message[0].data[0].q_no+"",
        //     message: "Queue No is '"+result_message[0].data[0].q_no+"'",
        //     position: 'topRight',                
        //     timeout: 1000,
        // });
        }
  
  
      }
  
      this.websocket.onerror = function (event) {
        console.log('error');
      }
      this.websocket.onclose = function (event) {
        console.log('close');
        $('#reconnect_socket').click();

      }
  
  
  
  
    }

getquestionnaire(){
if(this.questions != null)
return false;

  let access_token: any=localStorage.getItem('access_token');
  let admin_id: any=localStorage.getItem('admin_id');
  let api_req:any = '{"operation":"questionaire", "moduleType":"questionaire", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_user_queue","user_id":"'+admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.status==true){
      // $('.settingSidebar').addClass('showSettingPanel');
      this.questions= response.result.data;
    } else {
    }
  }, 
  (error)=>{
      console.log(error);
  });
}

closeQuestion(){
  $('.settingSidebar').removeClass('showSettingPanel');
}


toggleClass(){
  //this.getAuxCode();
  this.getAuxCatogory();
  if(this.fromEdit){
     
  } else {
    this.getquestionnaire();
  }
  
  $('.settingSidebar').toggleClass('showSettingPanel');
}
getCatname(id) {
  let access_token: any = localStorage.getItem('access_token');
  let api_req: any = '{"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"edit_aux_code_category","cat_id":"' + id + '","admin_id":"' + this.admin_id + '"}}';

  this.serverService.sendServer(api_req).subscribe((response: any) => {
    if (response.result.status == true) {
      var agent_data = response.result.data;
      this.category_name = agent_data.category_name;

    } else {
      iziToast.warning({
        message: "Wrap Up codes not retrive. Please try again",
        position: 'topRight'
      });

    }
  },
    (error) => {
      console.log(error);
    });
}

getAuxCatogory() {
  //alert('123')
  if (this.auxcode_catagory != null)
    return false;

  let access_token: any = localStorage.getItem('access_token');
  let admin_id: any = localStorage.getItem('admin_id');
  let api_req: any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_aux_code_category","admin_id":"' + admin_id + '","user_id":"' + this.uadmin_id + '"}}';

  this.serverService.sendServer(api_req).subscribe((response: any) => {
    if (response.result.status == true) {
      this.auxcode_catagory = response.result.data;
    } else {
    }
  },
    (error) => {
      console.log(error);
    });
}


  getDepartments(){
    if(this.departments!=null)
       return false;

    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_dept_settings","user_id":"'+this.admin_id+'"}}';
  
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


  getAuxCode() {
    // if(this.auxcodes!=null)
    //  return false;
    let cat_id = $('#auxcodes_pop').val();
    this.getCatname(cat_id);
    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"getuax_by_cat","cat_id":"' + cat_id + '","admin_id":"' + this.admin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        this.auxcodes = response.result.data;
      } else {
      }
    },
      (error) => {
        console.log(error);
      });
  }
editConatcts(){
  // alert(this.paramCall);
  // alert(this.paramq);
  let conct_req:any = new Object();
  let api_req:any = new Object();
  conct_req.user_id=localStorage.getItem('userId');
  conct_req.action="edit_contact";
  conct_req.contact_phone = this.param1;
  if(this.call_record_id == null && this.fromEdit == null && this.paramq!=null){
    conct_req.contact_phone = this.paramq;
    conct_req.screenPoupus = 'true';
  }
  
  // else if(this.paramCall == null && this.paramq != null){
  //   alert('sdsdsd')
  //   conct_req.contact_phone=this.paramq;
  // }
  // else
  // conct_req.contact_phone=this.param1;
  // if(this.param1 == null && this.fromEdit == null){
  //   conct_req.contact_phone = this.paramCall;
  //   conct_req.screenPoupus = 'true';
  // }
  // this.paramq

  // alert(conct_req.contact_phone);
  // alert(this.paramq);
  api_req.operation="contact";
  api_req.moduleType="contact";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  api_req.element_data = conct_req;

    this.serverService.sendServer(api_req).subscribe((response:any) => {      

        if(response.result.data==false){
          
          // if(this.call_record_id !='' && this.show_caller_id == '0')
            if(this.show_caller_id == '0')
            {
            this.hide_cal1er = 'xxxxxxxxx';
            if(this.call_record_id == null && this.fromEdit == null && this.paramq!=null)
                this.click_to_call_number = this.paramq;
            else
            this.click_to_call_number = this.param1;

            //  alert('hided'+this.click_to_call_number)

          } 
          else if(this.call_record_id == null && this.fromEdit == null&& this.paramq != null){
          this.hide_cal1er = this.paramq;
          this.click_to_call_number = this.paramq;
          // alert(this.click_to_call_number)
          }
          else {
            this.hide_cal1er = this.param1;
            this.click_to_call_number = this.param1;
          }
          this.editContact.setValue({
            'contact_owner' : '',
            'first_name' : '',
            'last_name' : '',
            'account_name' : '',
            'lead_source' : '',
            'title' : '',
            'email' : '',
            'activity' : '',
            'phone' : this.hide_cal1er,
            'home_phone' : '',
            'office_phone' : '',
            'fax' : '',
            'mobile' :'',
            'dob' : '',
            'assistant' : '',
            'assitant_phone' : '',
            'reports_to' : '',
            'email_opt_out' : '',
            'skype' : '',
            'secondary_email' : '',
            'twitter' : '',
            'reporting_to' : '',
            'mailing_street' : '',
            'other_street' : '',
            'mailing_city' : '',
            'other_city' : '',
            'mailing_province' : '',
            'other_province' : '',
            'mailing_postal_code' : '',
            'other_postal_code' : '',
            'mailing_country' : '',
            'other_country' : '',
            'notes' :'',
            'created_by' : '',
            'modified_by' : '',
            'whatsapp_number' :'',
            'line' :'',
            'facebook_url' :'',
            'wechat' :'',
            'viber' :'',
            'telegram' :'',
            'instagram_url' :'',
            'linkedin' :'',
            'country_code' : '',
          });



         
        } else {


          var home_phone = '';
          var office_phone = '';
          var mobile='';
          
          // if(this.call_record_id !='' &&this.show_caller_id == '0')
          if(this.show_caller_id == '0')
          {
            this.hide_cal1er = 'xxxxxxxxx';
            var home_phone = 'xxxxxxxxx';
            var office_phone = 'xxxxxxxxx';
            var mobile='xxxxxxxxx';
            this.click_to_call_mobile_number = response.result.data.mobile
            this.click_to_call_number = response.result.data.phone;
            this.click_to_call_office_phone = response.result.data.office_phone;
            this.click_to_call_home_phone = response.result.data.home_phone;
          } else {
            this.hide_cal1er = response.result.data.phone;
            this.click_to_call_number = response.result.data.phone;
            this.click_to_call_mobile_number = response.result.data.mobile
            this.click_to_call_office_phone = response.result.data.office_phone;
            this.click_to_call_home_phone = response.result.data.home_phone;
            home_phone = response.result.data.home_phone;
            office_phone = response.result.data.office_phone
            mobile= response.result.data.mobile;
          }
        
          this.editContact.setValue({
            'contact_owner' : response.result.data.contact_owner,
            'first_name' : response.result.data.first_name,
            'last_name' : response.result.data.last_name,
            'account_name' : response.result.data.account_name,
            'lead_source' : response.result.data.lead_source,
            'title' : response.result.data.title,
            'email' : response.result.data.email,
            'activity' : response.result.data.activity,
            'phone' : this.hide_cal1er,
            'home_phone' : home_phone,
            'office_phone' : office_phone,
            'fax' : response.result.data.fax,
            'mobile' : mobile,
            'dob' : response.result.data.dob,
            'assistant' : response.result.data.assistant,
            'assitant_phone' : response.result.data.assitant_phone,
            'reports_to' : response.result.data.reports_to,
            'email_opt_out' : response.result.data.email_opt_out,
            'skype' : response.result.data.skype,
            'secondary_email' : response.result.data.secondary_email,
            'twitter' : response.result.data.twitter,
            'reporting_to' : response.result.data.reporting_to,
            'mailing_street' : response.result.data.mailing_street,
            'other_street' : response.result.data.other_street,
            'mailing_city' : response.result.data.mailing_city,
            'other_city' : response.result.data.other_city,
            'mailing_province' : response.result.data.mailing_province,
            'other_province' : response.result.data.other_province,
            'mailing_postal_code' : response.result.data.mailing_postal_code,
            'other_postal_code' : response.result.data.other_postal_code,
            'mailing_country' : response.result.data.mailing_country,
            'other_country' : response.result.data.other_country,
            'notes' :'',
            'created_by' : response.result.data.creater,
            'modified_by' : response.result.data.modifier,
            'whatsapp_number' :response.result.data.whatsapp_number,
            'line' :response.result.data.line,
            'facebook_url' :response.result.data.facebook_url,
            'wechat' :response.result.data.wechat,
            'viber' :response.result.data.viber,
            'telegram' :response.result.data.telegram,
            'instagram_url' :response.result.data.instagram_url,
            'linkedin' :response.result.data.linkedin,
            'country_code' : response.result.data.country_code
          });
          this.contact_id = response.result.data.contact_id;
          
          $('#departments').val(response.result.data.department).prop('selected', true);
          $('#res_departments').val(response.result.data.res_dept).prop('selected', true);
          this.created_time = response.result.data.created_at;
          this.modified_time = response.result.data.updated_at;

        }
        
    }, 
    (error)=>{
        console.log(error);
    });
}





clictToCall(to){
  // if(to == 'phone'){  this.to_num = $('#phone').val(); } else {  this.to_num = $('#mobile').val(); }
 
  if(to == 'phone'){  this.to_num = this.click_to_call_number; } else {  this.to_num = this.click_to_call_mobile_number; }
  
   if(this.to_num == ''){
       iziToast.warning({
         message: "No Number To Call",
         position: 'topRight'
       });
   } else {
 
 
     let access_token: any=localStorage.getItem('access_token');
   
     var extention = localStorage.getItem('ext_int_status');
     //alert(extention);
     if(extention == '2'){
      let api_reqs:any = '{"type": "makecall", "number": "'+this.to_num+'","show_caller_id":"'+this.show_caller_id+'"}';
      this.serverService.show.next(api_reqs);
     } else {
      let api_reqs:any = '{"type": "makecallauto", "number": "'+this.to_num+'"}';
      this.serverService.show.next(api_reqs);
     }
 
   }
   console.log(this.to_num);
 }





updateContact(contact_id){

let assigned_department_id: any= $('#departments').val();
console.log(assigned_department_id);

let res_department_id: any= $('#res_departments').val();
console.log(assigned_department_id);


let auxcodes: any= $('#auxcodes').val();
if(auxcodes == '0') {
  auxcodes = $('#auxcodes_pop').val();
} 
console.log(auxcodes);

let api_req:any = new Object();
let add_contact_req:any = new Object();
// alert('sdsds'+this.click_to_call_number);

if(contact_id == '' || contact_id == undefined){

  api_req.operation="contact";
  api_req.moduleType="contact";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  let element_data:any = new Object();
  if(this.admin_id == this.uadmin_id){
    api_req.element_data = this.editContact.value;
    if(this.editContact.value.home_phone == "xxxxxxxxx")
    api_req.element_data.home_phone = this.click_to_call_home_phone;
 
   if(this.editContact.value.mobile == "xxxxxxxxx")
    api_req.element_data.mobile =   this.click_to_call_mobile_number;
 
   if(this.editContact.value.office_phone == "xxxxxxxxx")
    api_req.element_data.office_phone = this.click_to_call_office_phone;
 
   if(this.editContact.value.phone == "xxxxxxxxx")
    api_req.element_data.phone = this.click_to_call_number;
  } else {
    api_req.element_data = this.editContact.value;
    api_req.element_data.home_phone = this.click_to_call_home_phone;
    api_req.element_data.mobile = this.click_to_call_mobile_number;
    api_req.element_data.office_phone = this.click_to_call_office_phone;
    api_req.element_data.phone = this.click_to_call_number;
  }
  api_req.element_data.action='add_contact';
  api_req.element_data.department= assigned_department_id;
  api_req.element_data.res_dept=res_department_id;
  api_req.element_data.auxcode_name=auxcodes;
  api_req.element_data.callid=this.call_record_id;
  api_req.element_data.created_by = localStorage.getItem('userId');
} else {
  api_req.operation="contact";
  api_req.moduleType="contact";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  

if(this.admin_id == this.uadmin_id){
  api_req.element_data = this.editContact.value;
  if(this.editContact.value.home_phone == "xxxxxxxxx")
   api_req.element_data.home_phone = this.click_to_call_home_phone;

  if(this.editContact.value.mobile == "xxxxxxxxx")
   api_req.element_data.mobile =   this.click_to_call_mobile_number;

  if(this.editContact.value.office_phone == "xxxxxxxxx")
   api_req.element_data.office_phone = this.click_to_call_office_phone;

  if(this.editContact.value.phone == "xxxxxxxxx")
   api_req.element_data.phone = this.click_to_call_number;
} else {
  api_req.element_data = this.editContact.value;
  api_req.element_data.home_phone = this.click_to_call_home_phone;
  api_req.element_data.mobile = this.click_to_call_mobile_number;
  api_req.element_data.office_phone = this.click_to_call_office_phone;
  api_req.element_data.phone = this.click_to_call_number;
}

 
  api_req.element_data.action='update_contact';
  api_req.element_data.modified_by = localStorage.getItem('userId');
  api_req.element_data.contact_id=contact_id;
  api_req.element_data.department= assigned_department_id;
  api_req.element_data.auxcode_name=auxcodes;
  api_req.element_data.callid=this.call_record_id;
  api_req.element_data.res_dept=res_department_id;
}
// alert( api_req.element_data.phone);
// return false;
      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {
        $('#add_pbxform').modal('hide');
              iziToast.success({
                  message: "Contact update successfully",
                  position: 'topRight'
              });
              this.editContact.value.notes = "";
              this.router.navigate(['/contacts']);
          }
      else{
          
              iziToast.warning({
                  message: "Contact not updated. Please try again",
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

addNotes(id){
  this.router.navigate(['/activity'], { queryParams: { contact_id: id, email : this.email_id } });
}
addWrapupcode() {
 // alert('hii')
  let wrapcall_id = $('#wrapup_callID').val();
  let cat_id = $('#auxcodes_pop').val();
  let wraupcode = $('#auxcodes_subcat').val();
  let notes = $('#notes').val();
  //alert(notes)
  let access_token: any = localStorage.getItem('access_token');
  let from_no;
  let to_no;
  let queue_ids = $('#queue_ids2').val();
//alert(queue_ids)
// alert(this.Queue_number);
  var wrap = this.category_name + ' -> ' + wraupcode;
  var contact_id=this.contact_id;
  //var callid=this.call
  var type_appellant=$('#type_applicant').val();
 //alert(type_appellant)
  // alert(this.param1)
  // alert(this.extension)

  if (this.paramCall == 'incoming') {
    from_no = this.param1;
    to_no = this.extension;
  }
  else {
    from_no = this.extension;
    to_no = this.param1;
  }
  //  notes=notes.toString().replace('"',' ');
  notes = notes.toString().replaceAll(/"|'/g, '');

  if(queue_ids==''||queue_ids==null){
   console.log('No Queuename found');
  }
 // alert(from_no)

  let api_reqs: any = '{"type": "updatewrapupCode","call_type":"'+this.paramCall+'","aux_code": "'+wraupcode+'","cat_id": "'+cat_id+'","call_note": "'+notes+'","from_no": "'+from_no+'","to_no": "'+to_no+'","wrapCode": "'+wrap+'","contact_id": "'+contact_id+'","type_appellant": "'+type_appellant+'"}';
  this.serverService.minimize.next(api_reqs);
return false;  
  
  let api_req: any = new Object;
  let conct_req: any = new Object();

  api_req.operation = "contact";
  api_req.moduleType = "contact";
  api_req.api_type = "web";
  api_req.access_token = localStorage.getItem('access_token');

  conct_req.from_no = from_no;
  conct_req.to_no = to_no;
  conct_req.type = this.paramCall;
  conct_req.aux_code = wraupcode;
  conct_req.cat_id = cat_id;
  conct_req.call_note = notes;
  conct_req.call_queue_num = queue_ids;
  conct_req.user_id = this.uadmin_id;
  api_req.element_data = conct_req;


  api_req.element_data.admin_id = this.admin_id;
  api_req.element_data.action = "add_auxcode_wall";
  this.serverService.sendServer(api_req).subscribe((response: any) => {
   
    if (response.status == false) {

    }
  },
    (error) => {
      console.log(error);
    });
  var socket_message = '[{"cust_id":"' + this.has_hard_id + '","data":[{"Name":"wrapupcode","callid":"' + wrapcall_id + '","wcode":"' + wrap + '","wcodenote":"' + notes + '","extno":"' + this.extension + '"}]}]';
  //this.websocket.send(socket_message);
  this.closeQuestion();
  iziToast.success({
    message: "Wrapup Code Added successfully",
    position: "topRight"
  });
  $('#auxcodes_pop').val('');
  $('#auxcodes_subcat').val('');
  $('#notes').val('');
}
acceptIncomeCall() {
  let api_reqtest: any = '{"type": "showpopupdialer"}';
  this.serverService.show.next(api_reqtest);
  let api_reqs: any = '{"type": "attendincomingCall"}';
  this.serverService.minimize.next(api_reqs);
  this.show_mini_butons = true;
  this.show_ans = false;
  this.show_del = true;
}

declineIncomeCall() {
  let api_reqs: any = '{"type": "declineincomingCall"}';
  this.serverService.minimize.next(api_reqs);
  this.show_mini_butons = true;
  this.show_ans = false;
  this.show_del = false;
}
closeModelPopup(link) {

  const modalRef = this.modalService.dismissAll(EditContactsComponent);
  let api_reqs: any = '{"type": "minimize"}';
  this.serverService.minimize.next(api_reqs);
}

}
