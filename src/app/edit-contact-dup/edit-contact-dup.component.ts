import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
declare var iziToast: any;
declare var medi: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-contact-dup',
  templateUrl: './edit-contact-dup.component.html',
  styleUrls: ['./edit-contact-dup.component.css']
})
export class EditContactDupComponent implements OnInit {

  incomecallNum;
  getaccountid;
  acc_name;
  param1: string;
  param3;
  created_time;
  modified_time;
  contact_id;
  addRefined: FormGroup;
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
  refineshow = false;
  dsk_access;
  hasdsk = false;
  show_failed = false;
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
  MDy_bearer_token;
  contact_name;
  phone_activity;
  websocket;
  extension;
  has_hard_id;
  recordNotFound;
  single_timeline;
  Tsubject;
  Tdescription;
  Tphone;
  Trecord;
  Twrapcode;
  Twrapnote;
  conc_query_list;
  user_type;
  queue_values;
  listsuggestion: any;
  paginationdata: any;
  no_contact = false;
  showloading = false;
  auxcode_catagory;
  start_list;
  end_list;
  category_name;
  get_dailer_value;
  show_mini_butons = false;
  show_ans_del = false;
  show_ans = false;
  show_del = false;
  show_contact_value = false;
  showphoneloader = false;
  showdatalist = false;
  constructor(private serverService: ServerService, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer, public modalService: NgbModal) {


    this.addRefined = new FormGroup({
      'add_group_name': new FormControl(null, Validators.required),
    });

    this.param1 = this.route.snapshot.queryParamMap.get('phone');
    this.param3 = this.route.snapshot.queryParamMap.get('ids');
    this.paramCall = this.route.snapshot.queryParamMap.get('calltype');

    var decodedString = atob(this.param1);
    this.param1 = decodedString;
    this.get_dailer_value = localStorage.getItem("income_calls_num");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  //   this.serverService.editContact.subscribe((val: any) => {

  //     var dpContent = JSON.parse(val);
  //     // console.log(dpContent);
  //     if (dpContent.type == "show_popup") {
  //       this.param1 = dpContent.caller_no;
  //       this.paramCall = dpContent.call_type;
  //       // this.queue_values = dpContent.queue_num;
  //       if (dpContent.show_buttons == "true") {
  //         this.show_mini_butons = true;
  //         this.show_ans = true;
  //         this.show_del = true;
  //       } else {
  //         this.show_mini_butons = false;
  //         this.show_ans = false;
  //         this.show_del = false;
  //       }
  //       console.log(this.param1);
  //       //  this.editConatcts();        
  //     }
  //     if (dpContent.type == "call_ended") {
  //       this.show_ans = false;
  //       this.show_del = false;
  //     }

  //   });

  }

  ngOnChanges() {

  }



  ngOnInit() {

    this.uadmin_id = localStorage.getItem('userId');
    this.show_caller_id = localStorage.getItem('show_caller_id');
    this.extension = localStorage.getItem('ext_num');
    this.has_hard_id = localStorage.getItem('hardware_id');
    // let user_id: any=localStorage.getItem('userId');

    $('#dup_user_number').val(this.extension);
    //  this.getDepartments();
    //  this.getAuxCode();
    if (this.param3 != '' && this.param3 != null && this.param3 != undefined) {
      if (this.get_dailer_value != 'unknown') {
        this.editbutttonContacts();
      } else {
        $('#dup_first_name').val('');
        $('#dup_last_name').val('');
        $('#dup_email').val('');
        $('#dup_title').val('');
        $('#dup_phone').val('');
        $('#dup_mobile').val('');
      }
    } else {
      if (this.get_dailer_value != 'unknown') {
        this.editConatcts();
      } else {
        $('#dup_first_name').val('');
        $('#dup_last_name').val('');
        $('#dup_email').val('');
        $('#dup_title').val('');
        $('#dup_phone').val('');
        $('#dup_mobile').val('');
      }
    }
    this.initSocket();
    // if(this.fromEdit){

    // } else {
    //   this.getquestionnaire();
    // }
    this.toggleClass();
    this.admin_id = localStorage.getItem('admin_id');
    this.dsk_access = localStorage.getItem('dsk_access');
    this.has_external_contact = localStorage.getItem('has_external_contact');
    this.user_type = localStorage.getItem('user_type');

    // let api_reqs:any = '{"type": "sidebar"}';
    // this.serverService.sidebar.next();

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


    if (this.crm_type == 'SalesForce') {
      this.dailyfoodurl = this.external_contact_url;
      $('<iframe is="x-frame-bypass" class="dailyfIfram" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>').attr('src', this.dailyfoodurl).appendTo('#dup_dailyfIframes');

    } else if (this.crm_type == 'HubSpot') {
      this.dailyfoodurl = this.external_contact_url;
      let access_token: any = localStorage.getItem('access_token');

      if (this.paramq == '') {
        this.dailyfoodurl = this.external_contact_url;
      } else {
        this.dailyfoodurl = 'https://api.hubapi.com/contacts/v1/search/query?q=' + this.paramq + '&hapikey=' + this.hapikey;
      }


      let api_req: any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"curl_response","url":"' + this.dailyfoodurl + '"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
        //  console.log(response.contacts[0]);
        this.dailyfoodurlhub = response.contacts[0]['profile-url'];
        // alert(this.dailyfoodurlhub);
        $('<iframe  class="dailyfIfram" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>').attr('src', this.dailyfoodurlhub).appendTo('#dup_dailyfIframes');
      },
        (error) => {
          console.log(error);
        });
    } else if (this.crm_type == 'ZohoDesk') {
      this.dailyfoodurl = this.external_contact_url;
      let access_token: any = localStorage.getItem('access_token');
      this.z_authId = this.route.snapshot.queryParamMap.get('authkey');
      this.z_orgId = this.route.snapshot.queryParamMap.get('orgId');
      var number = this.route.snapshot.queryParamMap.get('q');


      if (this.paramq == '') {
        this.dailyfoodurl = this.external_contact_url;
      } else {
        this.dailyfoodurl = 'https://desk.zoho.com/api/v1/search?module=contacts&searchStr=' + this.paramq;
      }


      let api_req: any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"curl_response_zoho_desk","url":"' + this.dailyfoodurl + '","authkey":"' + this.z_authId + '","orgID":"' + this.z_orgId + '","number":"' + number + '"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
        this.dailyfoodurlhub = response.result.data;
        // alert(this.dailyfoodurlhub);
        $('<iframe is="x-frame-bypass" class="dailyfIfram" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>').attr('src', this.dailyfoodurlhub).appendTo('#dup_dailyfIframes');
      },
        (error) => {
          console.log(error);
        });
    }


  }
  tesr() {
    medi();
    this.allowMp = false;
    $("#dup_btns").css("display", "block");
  }

  openRefinement() {
    $("#dup_add_refinement").modal('show');
  }

  initSocket() {

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
      //    console.log($('#dup_user_number').val());
      this.has_hard_id = localStorage.getItem('hardware_id');
      if (result_message[0].cust_id == this.has_hard_id) {
        // console.log('matched');
      } else {
        // console.log('not matched');
        return false;
      }

      // if (result_message[0].data[0].wrapuptype == "wrapupcall_id" && result_message[0].data[0].extno == $('#dup_user_number').val()) {
      //   $('#dup_wrapup_callID').val(result_message[0].data[0].callid);
      //   // alert(result_message[0].data[0].callid)
      //   // alert('asnja')
      //   // $('#dup_wrapup_callID').click();
      // }
      // if (result_message[0].data[0].calltype == "Incoming Call" && result_message[0].data[0].ag_no == $('#dup_user_number').val()) {
      //   $('#dup_queue_ids3').val(result_message[0].data[0].q_no);
      // }


    }

    this.websocket.onerror = function (event) {
      console.log('error');
    }
    this.websocket.onclose = function (event) {
      console.log('close');
      $('#dup_con_reconnect_socket').click();

    }




  }
  getquestionnaire() {
    if (this.questions != null)
      return false;

    let access_token: any = localStorage.getItem('access_token');
    let admin_id: any = localStorage.getItem('admin_id');
    let api_req: any = '{"operation":"questionaire", "moduleType":"questionaire", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_user_queue","user_id":"' + admin_id + '"}}';

    // this.serverService.sendServer(api_req).subscribe((response:any) => {
    //   if(response.status==true){
    //     // $('.settingSidebar').addClass('showSettingPanel');
    //     this.questions= response.result.data;
    //   } else {
    //   }
    // }, 
    // (error)=>{
    //     console.log(error);
    // });
  }

  closeQuestion() {
    $('.settingSidebar').removeClass('showSettingPanel');
  }


  toggleClass() {
    // this.getAuxCode();
    this.getAuxCatogory();
    if (this.fromEdit) {

    } else {
      this.getquestionnaire();
    }

    $('.settingSidebar').toggleClass('showSettingPanel');
  }




  getDepartments() {
    if (this.departments != null)
      return false;

    let access_token: any = localStorage.getItem('access_token');
    let admin_id: any = localStorage.getItem('admin_id');
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_dept_settings","user_id":"' + admin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        this.departments = response.result.data;
      } else {
      }
    },
      (error) => {
        console.log(error);
      });
  }
  getAuxCatogory() {

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

  getAuxCode() {
    // if(this.auxcodes!=null)
    //  return false;
    let cat_id = $('#dup_auxcodes_pop_dup').val();
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

  autosuggestAccName() {

    let acc_name = $("#dup_account_name").val();

    if (acc_name.length >= 5) {
      this.showloading = true;
      let api_req_get_access: any = new Object();
      api_req_get_access.apiFor = "getAutoAccName";

      acc_name=acc_name.replace(/ /g, '%20');
      api_req_get_access.acc_name = acc_name;
      api_req_get_access.accessToken = this.MDy_bearer_token;


      this.serverService.MDy_Contacts_API(api_req_get_access).subscribe((response: any) => {

        this.paginationdata = response.id; 
        this.start_list = 0;
        this.end_list = 10; 
        this.pagedropdown(this.start_list,this.end_list)
        this.showdatalist = true;
        this.showloading = false;
      },
        (error) => {
          console.log(error);
        });

    }
  }

pagedropdown(start,end){
  console.log(start);
  console.log(end);
  console.log(this.paginationdata);
  var i, j, chunk = 10;
  for (i = start, j = end; i < j; i += chunk) {
    this.listsuggestion = this.paginationdata.slice(i, i + chunk);
    console.log(this.listsuggestion);
    // do whatever
  }
}

 nextPage(){
  this.start_list = this.start_list+10;
  this.end_list = this.end_list+10; 
  console.log(this.start_list);
  console.log(this.end_list);
  
  this.pagedropdown(this.start_list,this.end_list);
}

prevPage(){
  this.start_list = this.start_list-10;
  this.end_list = this.end_list-10; 
  console.log(this.start_list);
  console.log(this.end_list);

  this.pagedropdown(this.start_list,this.end_list);
}

  sentDataInInput(selectname){
    $("#dup_account_name").val(selectname);
    this.showdatalist = false;
    this.searchnumAccount();
  }


  searchnumAccount() {

    console.log($("#dup_account_name").val());

    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',


    });
    let api_req_get_contact: any = new Object();
    let api_req_get_access: any = new Object();
    let api_req_get_acc_contact: any = new Object();
    api_req_get_access.apiFor = "getAcesstoken";


    this.serverService.MDy_Contacts_API(api_req_get_access).subscribe((response: any) => {
      this.MDy_bearer_token = response.access_token;


      api_req_get_contact.apiFor = "getAccountID";

      let acc_name = $("#dup_account_name").val();
      api_req_get_contact.acc_name = acc_name;
      api_req_get_contact.accessToken = this.MDy_bearer_token;

      this.serverService.MDy_Contacts_API(api_req_get_contact).subscribe((response: any) => {
        let acc_ids = response.id;

        Swal.close();
        api_req_get_acc_contact.apiFor = "getAccountPhone";
        api_req_get_acc_contact.acc_ids = acc_ids;
        api_req_get_acc_contact.accessToken = this.MDy_bearer_token;

        this.serverService.MDy_Contacts_API(api_req_get_acc_contact).subscribe((response: any) => {
          console.log(response);

          this.conc_query_list = response.id;
          if (response.id != null && response.id != []) {
            this.show_contact_value = true;
            this.show_failed = false;
            this.no_contact = false;
          } else {
            this.show_failed = true;
            this.show_contact_value = false;
            this.no_contact = true;
          }

        },
          (error) => {
            console.log(error);
          });



      },
        (error) => {
          console.log(error);
        });





    },
      (error) => {
        console.log(error);
      });


  }

  cancelbutton() {
    this.show_contact_value = false;
    $("#dup_add_refinement").modal('hide');
  }


  SearchContacts() {
    // alert(this.paramCall);
    
    this.showphoneloader = true;
    let conct_req: any = new Object();
    let api_req_get_access: any = new Object();
    let api_req_get_contact: any = new Object();
    let api_req_get_activity: any = new Object();



    // alert(this.paramq);
    api_req_get_access.apiFor = "getAcesstoken";


    this.serverService.MDy_Contacts_API(api_req_get_access).subscribe((response: any) => {
      this.MDy_bearer_token = response.access_token;
      api_req_get_contact.apiFor = "getContact_omni";

      this.param1 = $("#dup_phone").val();
     
      api_req_get_contact.number = this.param1;
      api_req_get_contact.accessToken = this.MDy_bearer_token;

      this.serverService.MDy_Contacts_API(api_req_get_contact).subscribe((response: any) => {
        this.showphoneloader = false;
        if (response.data != "") {
          let value = response.data[0];
          $('#dup_first_name').val('');
        $('#dup_last_name').val('');
        $('#dup_email').val('');
        $('#dup_title').val('');
        $('#dup_phone').val('');
        $('#dup_mobile').val('');
          this.incomecallNum = value.telephone1;
          this.getaccountid = value._parentcustomerid_value;

          this.getAccountName(this.getaccountid);
          // localStorage.setItem('income_calls_num', this.incomecallNum);
          $('#dup_mobile_phone').val(value.mobilephone);
          $('#dup_fax').val(value.fax);
          this.contact_name = value.fullname;

          api_req_get_activity.apiFor = "getPhoneCallActivity";
          api_req_get_activity.number = this.param1;
          api_req_get_activity.accessToken = this.MDy_bearer_token;
          this.serverService.MDy_Contacts_API(api_req_get_activity).subscribe((response: any) => {

            // if(response.status==true){
            if (response.data != "") {
              this.phone_activity = response.data;
              //  console.log(this.phone_activity)
              //  this.phone_activity=this.phone_activity.reverse();
              //  console.log(this.phone_activity)

              this.recordNotFound = false;

            } else {
              this.recordNotFound = true;
            }


          },
            (error) => {
              console.log(error);
            });


        } else {
          this.no_contact = true;
          this.refineshow = true;
          $('#dup_first_name').val('');
          $('#dup_last_name').val('');
          $('#dup_email').val('');
          $('#dup_title').val('');
          $('#dup_phone').val('');
          $('#dup_mobile').val('');
          this.incomecallNum = this.param1;
          // localStorage.setItem('income_calls_num', this.incomecallNum);
          $('#dup_mobile_phone').val();
          $('#dup_fax').val();
          this.contact_name = "Contact Details";



          Swal.fire({
            title: 'Contact Not Found',
            text: "You can save contact by hitting the Add contact button",
            icon: 'info',
            showCancelButton: false,
            confirmButtonColor: '#dup_3085d6',
            confirmButtonText: 'Got it'
          })
        }

      },
        (error) => {
          console.log(error);
        });


    });
  }


  searchGetContact() {

    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',


    });
    this.param1 = $("#dup_add_acc_num").val();
    if (this.param1 != '0') {
      // this.editConatcts();
      this.param3=btoa(this.param1);
      this.editbutttonContacts();
    }
  }

  editConatcts() {
    // alert(this.paramCall);
    // alert(this.param1);
    let conct_req: any = new Object();
    let api_req_get_access: any = new Object();
    let api_req_get_contact: any = new Object();
    let api_req_get_activity: any = new Object();



    // alert(this.paramq);
    api_req_get_access.apiFor = "getAcesstoken";


    this.serverService.MDy_Contacts_API(api_req_get_access).subscribe((response: any) => {
      this.MDy_bearer_token = response.access_token;
      api_req_get_contact.apiFor = "getContact_omni";


      api_req_get_contact.number = this.param1;
      api_req_get_contact.accessToken = this.MDy_bearer_token;

      this.serverService.MDy_Contacts_API(api_req_get_contact).subscribe((response: any) => {
        Swal.close();
        $('#dup_add_refinement').modal('hide');


        if (response.data != "") {
          let value = response.data[0];
          $('#dup_first_name').val('');
        $('#dup_last_name').val('');
        $('#dup_email').val('');
        $('#dup_title').val('');
        $('#dup_phone').val('');
        $('#dup_mobile').val('');
          this.incomecallNum = value.telephone1;
          this.getaccountid = value._parentcustomerid_value;
          this.getAccountName(this.getaccountid);
          // localStorage.setItem('income_calls_num', this.incomecallNum);
          $('#dup_mobile_phone').val(value.mobilephone);
          $('#dup_fax').val(value.fax);
          this.contact_name = value.fullname;


          api_req_get_activity.apiFor = "getPhoneCallActivity";
          api_req_get_activity.number = this.param1;
          api_req_get_activity.accessToken = this.MDy_bearer_token;
          this.serverService.MDy_Contacts_API(api_req_get_activity).subscribe((response: any) => {

            // if(response.status==true){
            if (response.data != "") {
              this.phone_activity = response.data;
              //  console.log(this.phone_activity)
              //  this.phone_activity=this.phone_activity.reverse();
              //  console.log(this.phone_activity)

              this.recordNotFound = false;

            } else {
              this.recordNotFound = true;
            }


          },
            (error) => {
              console.log(error);
            });


        } else {
          this.no_contact = true;

          $('#dup_first_name').val('');
          $('#dup_last_name').val('');
          $('#dup_email').val('');
          $('#dup_title').val('');
          $('#dup_phone').val('');
          $('#dup_mobile').val('');
          // $('#dup_account_name').val();
          $('#dup_email').val('');
          $('#dup_business_phone_dup').val(this.param1);
          this.incomecallNum = this.param1;
          // localStorage.setItem('income_calls_num', this.incomecallNum);
          $('#dup_mobile_phone').val('');
          $('#dup_fax').val();
          this.contact_name = "Contact Details";


          Swal.fire({
            title: 'Contact Not Found',
            text: "You can save contact by hitting the Add contact button",
            icon: 'info',
            showCancelButton: false,
            confirmButtonColor: '#dup_3085d6',
            confirmButtonText: 'Got it'
          })
        }

      },
        (error) => {
          console.log(error);
        });


    });
  }

  editbutttonContacts() {
    // alert(this.paramCall);
    // alert(this.param1);
    let conct_req: any = new Object();
    let api_req_get_access: any = new Object();
    let api_req_get_contact: any = new Object();
    let api_req_get_activity: any = new Object();



    // alert(this.paramq);
    api_req_get_access.apiFor = "getAcesstoken";


    this.serverService.MDy_Contacts_API(api_req_get_access).subscribe((response: any) => {
      this.MDy_bearer_token = response.access_token;
      api_req_get_contact.apiFor = "getContactbyId";
      api_req_get_contact.numberid = atob(this.param3);
      api_req_get_contact.accessToken = this.MDy_bearer_token;

      this.serverService.MDy_Contacts_API(api_req_get_contact).subscribe((response: any) => {
        Swal.close();
        $('#dup_add_refinement').modal('hide');
        if (response.data != "") {
          let value = response.data;
          $('#dup_first_name').val('');
        $('#dup_last_name').val('');
        $('#dup_email').val('');
        $('#dup_title').val('');
        $('#dup_phone').val('');
        $('#dup_mobile').val('');
          this.incomecallNum = value.telephone1;
          this.getaccountid = value._parentcustomerid_value;
          this.getAccountName(this.getaccountid);
          // localStorage.setItem('income_calls_num', this.incomecallNum);
          $('#dup_mobile_phone').val(value.mobilephone);
          $('#dup_fax').val(value.fax);
          this.contact_name = value.fullname;
        } else {
          this.no_contact = true;

          Swal.fire({
            title: 'Contact Not Found',
            text: "You can save contact by hitting the Add contact button",
            icon: 'info',
            showCancelButton: false,
            confirmButtonColor: '#dup_3085d6',
            confirmButtonText: 'Got it'
          })
          $('#dup_first_name').val('');
          $('#dup_last_name').val('');
          $('#dup_email').val('');
          $('#dup_title').val('');
          $('#dup_phone').val('');
          $('#dup_mobile').val('');
          this.incomecallNum = this.param1;
          // localStorage.setItem('income_calls_num', this.incomecallNum);
          $('#dup_mobile_phone').val();
          $('#dup_fax').val();
          this.contact_name = "Contact Details";
        }

      },
        (error) => {
          console.log(error);
        });

      api_req_get_activity.apiFor = "getPhoneCallActivity";
      api_req_get_activity.number = this.param1;
      api_req_get_activity.accessToken = this.MDy_bearer_token;
      this.serverService.MDy_Contacts_API(api_req_get_activity).subscribe((response: any) => {

        // if(response.status==true){
        if (response.data != "") {
          this.phone_activity = response.data;
          //  console.log(this.phone_activity)
          //  this.phone_activity=this.phone_activity.reverse();
          //  console.log(this.phone_activity)

          this.recordNotFound = false;

        } else {
          this.recordNotFound = true;
        }


      },
        (error) => {
          console.log(error);
        });
    });
  }



  getAccountName(acc_ids) {

    let api_post_account: any = new Object();
    let api_ax_account: any = new Object();
    $('#dup_account_ids').val(acc_ids);
    api_post_account.apiFor = "getAccountName";
    api_post_account.account_id = acc_ids;
    api_post_account.accessToken = this.MDy_bearer_token;
    this.serverService.MDy_Contacts_API(api_post_account).subscribe((response: any) => {
      console.log(response);
      if (response.acc_name != "") {
        //this.acc_name = response.acc_name;
        $("#dup_acc_name").val(response.acc_name);
      }
      api_ax_account.apiFor = "getaxAccountId";
      api_ax_account.acc_name = response.acc_name;
      api_ax_account.accessToken = this.MDy_bearer_token;
      this.serverService.MDy_Contacts_API(api_ax_account).subscribe((response: any) => {

        if (response.accountnumber != "") {
          //this.acc_name = response.acc_name;
          $("#dup_ax_name").val(response.acc_name[0].accountnumber);
        }
      },
        (error) => {
          console.log(error);
        });

    },
      (error) => {
        console.log(error);
      });

  }



  AddContact() {
    let api_post_contact: any = new Object();
    let first_name = $('#dup_first_name').val();
    let last_name = $('#dup_last_name').val();
    let job_title = $('#dup_job_title').val();
    // $('#dup_account_name').val();
    let email = $('#dup_email').val();
    let business_phone = $('#dup_business_phone_dup').val();
    let mobile = $('#dup_mobile_phone').val();
    let fax = $('#dup_fax').val();

    if (first_name == "") {
      iziToast.warning({
        message: "Please enter the First Name",
        position: "topRight"
      });
      return false;
    }
    if (last_name == "") {
      iziToast.warning({
        message: "Please enter the Last Name",
        position: "topRight"
      });
      return false;
    }
    // alert(typeof business_phone);
    // if (typeof business_phone == "string") {
    //   iziToast.warning({
    //     message: "Invalid Business Number",
    //     position: "topRight"
    //   });
    //   return false;
    // }


    let api_post_account: any = new Object();

    api_post_account.apiFor = "getOwnerID";
    api_post_account.ext_no = localStorage.getItem('ext_num');
    api_post_account.accessToken = this.MDy_bearer_token;
    this.serverService.MDy_Contacts_API(api_post_account).subscribe((response: any) => {

      let owner_id = response.id;

      api_post_contact.apiFor = "AddNewContact";
      api_post_contact.accessToken = this.MDy_bearer_token;
      api_post_contact.Num = business_phone;
      api_post_contact.F_Name = first_name;
      api_post_contact.L_Name = last_name;
      api_post_contact.job_title = job_title;
      api_post_contact.email = email;
      api_post_contact.mobile = mobile;
      api_post_contact.fax = fax;
      api_post_contact.ownerid = owner_id;
      this.serverService.MDy_Contacts_API(api_post_contact).subscribe((response: any) => {
        let wrapcall_id = $('#dup_wrapup_callID').val();

        var socket_message = '[{"cust_id":"' + this.has_hard_id + '","data":[{"Name":"unknowncontact","callid":"' + wrapcall_id + '","contactno":"' + business_phone + '"}]}]';
        this.websocket.send(socket_message);

        // [{"cust_id":"8C05-99D2-0563-BF38-6561-6DB1-8501-CC0D","data":[{"Name":"unknowncontact","callid":"148","contactno":"0968738645"}]}]

        if (response.data != "" && response.data != "null") {
          iziToast.success({
            message: "Contact details Added to Microsoft Dynamics",
            position: "topRight"
          });
          this.no_contact = false;
          this.editConatcts();
        } else {
          iziToast.error({
            message: "Sorry,Server issue ouccred",
            position: "topRight"
          })
          this.recordNotFound = true;
        }


      },
        (error) => {
          console.log(error);
        });

    },
      (error) => {
        console.log(error);
      });
  }



  clictToCall() {
    // if(to == 'phone'){  this.to_num = $('#dup_phone').val(); } else {  this.to_num = $('#dup_mobile').val(); }

    // if(to == 'phone'){  this.to_num = this.click_to_call_number; } else {  this.to_num = this.click_to_call_mobile_number; }
    let to = $('#dup_business_phone_dup').val();
    if (to == '') {
      iziToast.warning({
        message: "No Number To Call",
        position: 'topRight'
      });
    } else {


      let access_token: any = localStorage.getItem('access_token');

      var extention = localStorage.getItem('ext_int_status');
      //alert(extention);
      if (extention == '2') {
        let api_reqs: any = '{"type": "makecall", "number": "' + to + '","show_caller_id":"' + this.show_caller_id + '"}';
        this.serverService.show.next(api_reqs);
      } else {
        let api_reqs: any = '{"type": "makecallauto", "number": "' + to + '"}';
        this.serverService.show.next(api_reqs);
      }

    }
    console.log(to);
  }

  clictToCall2() {
    // if(to == 'phone'){  this.to_num = $('#dup_phone').val(); } else {  this.to_num = $('#dup_mobile').val(); }

    // if(to == 'phone'){  this.to_num = this.click_to_call_number; } else {  this.to_num = this.click_to_call_mobile_number; }
    let to = $('#dup_mobile_phone').val();
    if (to == '') {
      iziToast.warning({
        message: "No Number To Call",
        position: 'topRight'
      });
    } else {


      let access_token: any = localStorage.getItem('access_token');

      var extention = localStorage.getItem('ext_int_status');
      //alert(extention);
      if (extention == '2') {
        let api_reqs: any = '{"type": "makecall", "number": "' + to + '","show_caller_id":"' + this.show_caller_id + '"}';
        this.serverService.show.next(api_reqs);
      } else {
        let api_reqs: any = '{"type": "makecallauto", "number": "' + to + '"}';
        this.serverService.show.next(api_reqs);
      }

    }
    console.log(to);
  }

  addWrapupcode() {
    //alert('123')
    let wrapcall_id = $('#dup_wrapup_callID').val();
    let cat_id = $('#dup_auxcodes_pop_dup').val();
    let wraupcode = $('#dup_auxcodes_subcat_dup').val();
    let notes = $('#dup_notes').val();
    let access_token: any = localStorage.getItem('access_token');
    let from_no;
    let to_no;
    let queue_ids = $('#dup_queue_ids3').val();

    var wrap = this.category_name + ' -> ' + wraupcode;

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
   
     let api_reqs: any = '{"type": "updatewrapupCode","call_type": "outgoing","aux_code": "'+wraupcode+'","cat_id": "'+cat_id+'","call_note": "'+notes+'","from_no": "'+from_no+'","to_no": "'+to_no+'","wrapCode": "'+wrap+'"}';
     this.serverService.minimize.next(api_reqs);
   return false;

    // let api_req:any = '{"operation":"contact", "moduleType":"contact", "api_type": "web", 
    // "access_token":"'+access_token+'", "element_data":{"action":"add_auxcode_wall","from_no":
    // "'+from_no+'","to_no":"'+to_no+'","type":"'+this.paramCall+'","aux_code":"'+wraupcode+'",
    // "user_id":"'+this.uadmin_id+'","cat_id":"'+cat_id+'","call_note":"'+notes+'"}}';
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
    // {"operation":"contact","moduleType":"contact","api_type":"web","access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvbW5pLmVudGVydGFpbm1lbnQuY29tLmF1IiwiYXVkIjoib21uaS5lbnRlcnRhaW5tZW50LmNvbS5hdSIsImlhdCI6MTYyMTA1ODcwOSwibmJmIjoxNjIxMDU4NzA5LCJleHAiOjE2MjEwNzY3MDksImFjY2Vzc19kYXRhIjp7InRva2VuX2FjY2Vzc0lkIjoiOTU4IiwidG9rZW5fYWNjZXNzTmFtZSI6ImFubmVzc2EiLCJ0b2tlbl9hY2Nlc3NUeXBlIjoiMiJ9fQ.vBc-2g4FoZC_xNb4dBUmQYKblkPL6l6wbI7WEes-xRI","element_data":{"action":"add_auxcode_wall","from_no":"1000","to_no":"1001","type":"outgoing","aux_code":"No Answer","user_id":"958"}}
    var socket_message = '[{"cust_id":"' + this.has_hard_id + '","data":[{"Name":"wrapupcode","callid":"' + wrapcall_id + '","wcode":"' + wrap + '","wcodenote":"' + notes + '","extno":"' + this.extension + '"}]}]';
    this.websocket.send(socket_message);
    this.closeQuestion();
    iziToast.success({
      message: "Wrapup Code Added successfully",
      position: "topRight"
    });
    // $('#dup_wrapup_callID').val('');
    $('#dup_auxcodes_pop_dup').val('');
    $('#dup_auxcodes_subcat_dup').val('');
    $('#dup_notes').val('');
  }
  gettimedetails(act_id) {

    let get_single_timeline: any = new Object();
    get_single_timeline.accessToken = this.MDy_bearer_token;
    get_single_timeline.activity_id = act_id;
    get_single_timeline.apiFor = "get_single_timeline";
    this.serverService.MDy_Contacts_API(get_single_timeline).subscribe((response: any) => {

      // if(response.status==true){
      if (response.data != "") {
        this.single_timeline = response.data[0];
        let Tdata = response.data[0];
        console.log(this.single_timeline);
        this.Tsubject = Tdata.subject;
        this.Tdescription = Tdata.description;
        this.Tphone = Tdata.phonenumber;
        this.Trecord = Tdata.new_recordingurl;
        this.Twrapcode = Tdata.new_wrapupcode;
        this.Twrapnote = Tdata.new_wrapupnote;
        //  alert(this.Trecord);
        //  this.phone_activity=this.phone_activity.reverse();
        //  console.log(this.phone_activity)
        $('#dup_showpop_timeline').modal('show');
        this.recordNotFound = false;

      } else {
        this.Tsubject = '';
        this.Tdescription = '';
        this.Tphone = '';
        this.Trecord = '';
        this.Twrapcode = '';
        this.Twrapnote = '';
        iziToast.warning({
          message: 'Sorry, cannot fetch timeline details',
          position: 'topRight'
        })
        this.recordNotFound = true;
      }


    },
      (error) => {
        console.log(error);
      });
  }


  closeModelPopup(link) {

    const modalRef = this.modalService.dismissAll(EditContactDupComponent);
    let api_reqs: any = '{"type": "minimize"}';
    this.serverService.minimize.next(api_reqs);
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

}
