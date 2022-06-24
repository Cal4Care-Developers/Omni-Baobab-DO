
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup,FormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import Swal from 'sweetalert2'
import { ActivatedRoute } from '@angular/router';

import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  reseller_sets = false;
  reseller_value;
  addAadmin: FormGroup;
  editAdmin: FormGroup;
  old_sip_url;
  admins;
  admin_id;
  has_contacts;
  admin_statuss;
  has_smss;
  has_chats;
  has_whatsapps;
  has_chatbots;
  selected = 1;
  admin_user_name;
  password;
  reports;
  list_report;
  faxuser = false;
  inst_wp_upd;inst_wp_add;wp_inst_edit;wp_type_edit;inst_wp_add_unoff;inst_wp_upd_unoff;
  reportChecked;
  price_sms_upd;price_sms_add;smsTariffs;sms_price_edit;  device_type = [{'status':'1'},{'status':'0'}]

  list_wpinst;list_allwpinst;

  wp_count;adminlists;resellerChecked;
  admin;
  id;

  price_sms_postpaid=true;
  showCallTariffsDetEdit;
  showCallTariffsDet;
  callTariffs;
  editShippingAddresss = false;
  pdfurl;
  constructor(private serverService: ServerService,private route: ActivatedRoute,private router:Router,private sanitizer: DomSanitizer) { }

  ngOnInit() {

    var userId = localStorage.getItem('userId');
    var reseller = localStorage.getItem('reseller');
    console.log(reseller);
    this.reseller_value=localStorage.getItem('reseller');

    if(userId == '1'  || (reseller != '' || reseller != null|| reseller !=undefined) ){

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have no access view that page!',
      });
      this.router.navigate(['/'])
      return false;
    }
// Password Validation
    $("#add_admin_password").keydown(function (e) {

      console.log(e.which);
      if(e.which == 32){
              iziToast.warning({
                message: "Sorry, Whitespace not allowed",
                position: 'topRight'
            });
            return false;
      }
      return e.which !== 32;
});
$("#user_name").keydown(function (e) {

  console.log(e.which);
  if(e.which == 32){
          iziToast.warning({
            message: "Sorry, Whitespace not allowed",
            position: 'topRight'
        });
        return false;
  }
  return e.which !== 32;
});

$("#update_admin_password").keydown(function (e) {

  if(e.which == 32){
          iziToast.warning({
            message: "Sorry, Whitespace not allowed",
            position: 'topRight'
        });
        return false;
  }
  return e.which !== 32;
});

    this.addAadmin = new FormGroup({
      'admin_name' : new FormControl(null,Validators.required),
      'pbx_count' : new FormControl(null),
      'agent_count' : new FormControl(null),
      'user_name' : new FormControl(null),
      // 'user_password' : new FormControl(null,Validators.required),
      'whatsapp_num' : new FormControl(null),
      'company_name' : new FormControl(null,Validators.required),
      'domain_name' : new FormControl(null),
      'has_contact' : new FormControl(0),
      'voice_3cx' : new FormControl(0),
      'predective_dialer' : new FormControl(0),
      'survey_vid': new FormControl(0),
      'lead' : new FormControl(0),
        'has_sms' : new FormControl(0),
        'has_mrvoipconnection' : new FormControl(0),
        'has_chat' : new FormControl(0),
        'has_whatsapp' : new FormControl(0),
        'has_chatbot' : new FormControl(0),
        'has_fb' : new FormControl(0),
        'has_fax' : new FormControl(0),
        'has_wechat' : new FormControl(0),
        'has_telegram' : new FormControl(0),
        'has_internal_ticket' : new FormControl(0),
        'has_external_ticket' : new FormControl(0),
        'has_internal_chat' : new FormControl(0),
        'baisc_wallboard' : new FormControl(0),
        'wallboard_one' : new FormControl(0),
        'wallboard_two' : new FormControl(0),
        'wallboard_three' : new FormControl(0),
        'wallboard_four' : new FormControl(0),
        'wallboard_five' : new FormControl(0),
        'wallboard_six' : new FormControl(0),
        'wallboard_eight' : new FormControl(0),
        'two_factor' : new FormControl(0),
        'admin_status' : new FormControl(0),
        'notes' : new FormControl(null),
        'a_has_sms_postpaid':new FormControl(0),
        'has_webinar' : new FormControl(0),
        'has_queue' : new FormControl(0),
        'has_rec_manage' : new FormControl(0),
     });


      this.editAdmin= new FormGroup({
        'admin_name' : new FormControl(null,Validators.required),
// for billing ---
        'user_id' : new FormControl(null),
// ----
        'pbx_count' : new FormControl(null),
        'agent_count' : new FormControl(null),
        'company_name' : new FormControl(null),
        'whatsapp_num' : new FormControl(null),
        'domain_name' : new FormControl(null),
        'has_contact' : new FormControl(0),
        'voice_3cx' : new FormControl(0),
        'predective_dialer' : new FormControl(0),
        'survey_vid': new FormControl(0),
        'lead' : new FormControl(0),
        'has_sms' : new FormControl(0),
        'has_mrvoipconnection' : new FormControl(0),
        'has_chat' : new FormControl(0),
        'has_whatsapp' : new FormControl(0),
        'has_chatbot' : new FormControl(0),
        'has_fb' : new FormControl(0),
        'has_fax' : new FormControl(0),
        'has_wechat' : new FormControl(0),
        'has_telegram' : new FormControl(0),
        'has_internal_ticket' : new FormControl(0),
        'has_external_ticket' : new FormControl(0),
        'has_internal_chat' : new FormControl(0),
        'baisc_wallboard' : new FormControl(0),
        'wallboard_one' : new FormControl(0),
        'wallboard_two' : new FormControl(0),
        'wallboard_three' : new FormControl(0),
        'wallboard_four' : new FormControl(0),
        'wallboard_five' : new FormControl(0),
        'wallboard_six' : new FormControl(0),
        'wallboard_eight' : new FormControl(0),
        'two_factor' : new FormControl(0),
        'admin_status' : new FormControl(0),
        'notes' : new FormControl(null),
        'a_has_sms_postpaid_upd':new FormControl(0),
        'has_webinar' : new FormControl(0),
        'has_queue' : new FormControl(0),
        'has_rec_manage' : new FormControl(0),

           });
           this.listReports();
           this.getwpinsts();

     this.admin_settings();
     this.getTariffsList();
     this.getalladmins();
     this.getcalltariffs();

  }

  getTariffsList(){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"wpchat", "moduleType":"wpchat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"view_tarrif"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status == true){
      this.smsTariffs = response.result.data.plans;
      } else {
      }
    },
    (error)=>{
      console.log(error);
    });
    }

  listReports(){
    let access_token: any=localStorage.getItem('access_token');
    let uadmin_id: any=localStorage.getItem('userId');

    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"list_report","user_id":"'+uadmin_id+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        this.list_report = response.result.data;
      }
    },
    (error)=>{
        console.log(error);
    });
  }
  getwpinsts(){
    let access_token: any=localStorage.getItem('access_token');
    let uadmin_id: any=localStorage.getItem('userId');

    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"getInstanceDetails"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        this.list_wpinst = response.result.data;
      }
    },
    (error)=>{
        console.log(error);
    });
  }
  getallwpinsts(id){

    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"getallInstanceDetails","admin_id":"'+id+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        this.list_allwpinst = response.result.data;
      }
    },
    (error)=>{
        console.log(error);
    });
  }
  admin_settings(){
    let userId: any=localStorage.getItem('userId');
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"get_admin_settings","user_id":"'+userId+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        this.admins= response.result.data;
      } else {
        this.recordNotFound = true;
      }
    },
    (error)=>{
        console.log(error);
    });
  }
  addadmin(){
    $('#add_adminform').modal('show');
   this.price_sms_postpaid=true;
   $('#a_has_sms_postpaid').prop('checked',false);
  }

  getalladmins(){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"getalladmins"}}';
    console.log(this.reseller_value);
    if( this.reseller_value!= '' ||this.reseller_value!=null){

      this.reseller_sets= true;
    }
    else
    {
      this.reseller_sets= false;

    }
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        this.adminlists= response.result.data;
        console.log(this.adminlists);
      }
      // else {
      //   this.recordNotFound = true;
      // }
    },
    (error)=>{
        console.log(error);
    });

  }

  editAdmindata(id,admin_id){
    this.id=id;
    this.admin=admin_id;
    $('#checkreadinst').click();
      // console.log(admin_id);return false;
     // alert(admin_id);
    $('#edit_agents_key').val(admin_id);
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_single_admin_settings","pbx_id":"'+id+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        var agent_data = response.result.data.admin_data;
        var inst_data  = response.result.data.instance_data;
        if(agent_data.whatsapp_num == null){
        var nullcheck=  "";
        }else{
          nullcheck=agent_data.whatsapp_num;
        }

        this.getallwpinsts(admin_id);
        this.editAdmin.setValue({
           'admin_name' : agent_data.name,

           'user_id' : agent_data.admin_id,

           'pbx_count' : agent_data.pbx_count,
           'agent_count' : agent_data.agent_counts,
           'company_name' :agent_data.company_name,
           'domain_name' : agent_data.domain_name,
           'voice_3cx' : agent_data.voice_3cx,
           'has_contact' : agent_data.has_contact,
           'survey_vid': agent_data.survey_vid,
           'predective_dialer' : agent_data.predective_dialer,
           'lead' : agent_data.lead,
           'has_sms' : agent_data.has_sms,
           'has_mrvoipconnection' : agent_data.mr_voip,
           'has_chat' : agent_data.has_chat,
           'has_whatsapp' : agent_data.has_whatsapp,
           'has_chatbot' : agent_data.has_chatbot,
           'has_fb' : agent_data.has_fb,
           'has_fax' : agent_data.has_fb,
           'has_wechat' : agent_data.has_wechat,
           'has_telegram' : agent_data.has_telegram,
           'has_internal_ticket' : agent_data.has_internal_ticket,
           'has_external_ticket' : agent_data.has_external_ticket,
           'has_internal_chat':agent_data.has_internal_chat,
           'baisc_wallboard' : agent_data.baisc_wallboard,
           'wallboard_one' : agent_data.wallboard_one,
        'wallboard_two' : agent_data.wallboard_two,
        'wallboard_three' : agent_data.wallboard_three,
        'wallboard_four' : agent_data.wallboard_four,
        'wallboard_five' : agent_data.wallboard_five,
        'wallboard_six' : agent_data.wallboard_six,
        'wallboard_eight' : agent_data.wallboard_eight,
        'two_factor': agent_data.two_factor,
        'admin_status' : agent_data.admin_status,
        'whatsapp_num' : nullcheck,
        'notes':agent_data.notes,
        'a_has_sms_postpaid_upd':agent_data.sms_type,
         'has_webinar' : agent_data.has_webinar,
         'has_rec_manage' : agent_data.voice_manage,
         'has_queue' : agent_data.queue,


       });
      //  alert(agent_data.queue);
this.sms_price_edit=agent_data.price_sms;
this.wp_type_edit=agent_data.whatsapp_type;

this.admin_user_name = agent_data.user_name;
this.password = agent_data.password;
// this.faxuser= agent_data.fax_user_id;

$('#eMPlanName').val(agent_data.call_plan);
$('#ecall_rate').val(agent_data.call_rate);
$('#ecall_prefix').val(agent_data.call_prefix);
$('#evalid_from').val(agent_data.valid_from);
$('#evalid_to').val(agent_data.valid_to);
$('#e_tax_name').val(agent_data.tax_name);
$('#e_tax_per').val(agent_data.tax_per);
$('#upd_post_url').val(agent_data.post_url);



if(agent_data.fax_user_id != null)
{
  this.faxuser = true;
}
else{
  this.faxuser = false;

}
if(agent_data.reports == null){
  this.reportChecked = agent_data.reports;
}
else{
  this.reportChecked = agent_data.reports.split(",");
}
$('#edit_reports').val(this.reportChecked);

if(agent_data.reseller == null || agent_data.reseller==''){
  this.resellerChecked = agent_data.reseller;
}
else{
  this.resellerChecked = agent_data.reseller.split(",");
}
// alert(this.wp_type_edit);
// $('.selDiv option:'+this.wp_type_edit+'').attr('selected', 'selected')
$('#inst_type_upd option[value="'+this.wp_type_edit+'"]').attr("selected", "selected");


      $('#edit_reseller').val(this.resellerChecked);

       if(agent_data.voice_3cx == 1){
        this.showCallTariffsDetEdit = true;
        $('#voice_3cx').prop('checked', true);
       } else {
        this.showCallTariffsDetEdit = false;
        $('#voice_3cx').prop('checked', false);
       }

       if(agent_data.predective_dialer == 1){
        $('#predective_dialer').prop('checked', true);
       } else {
        $('#predective_dialer').prop('checked', false);
       }
       if(agent_data.lead == 1){
        $('#lead').prop('checked', true);
       } else {
        $('#lead').prop('checked', false);
       }
       if(agent_data.mr_voip == 1){
        $('#has_mrvoipconnection').prop('checked', true);
       } else {
        $('#has_mrvoipconnection').prop('checked', false);
       }


       if(agent_data.has_contact == 1){
        $('#has_contact').prop('checked', true);
       } else {
        $('#has_contact').prop('checked', false);
       }
                    if($('#has_sms').prop('checked', false)){
                    this.price_sms_postpaid =true;
                    this.price_sms_upd=false;
                    }
       if(agent_data.has_sms == 1){
        $('#has_sms').prop('checked', true);
        this.price_sms_upd = true;
        $('#price_sms_u').val(this.sms_price_edit);
        console.log(agent_data.price_sms);

                      if(agent_data.sms_type == 1){
                        $('#a_has_sms_postpaid_upd').prop('checked', true);
                        this.price_sms_postpaid =true;

                      } else {
                       this.price_sms_postpaid =false;
                        $('#price_sms_u').val(this.sms_price_edit);
                        $('#a_has_sms_postpaid_upd').prop('checked', false);
                      }

       } else {
        this.price_sms_postpaid =true;
        this.price_sms_upd=false;
        $('#has_sms').prop('checked', false);
        $('#a_has_sms_postpaid_upd').prop('checked', false);
       }

       if(agent_data.has_whatsapp == 1){
        $('#has_whatsapp').prop('checked', true);
        this.inst_wp_upd = true;

        if( this.inst_wp_upd_unoff == true ){

          this.wp_inst_edit=agent_data.wp_instance_count.split(",");
          this.wp_count=this.wp_inst_edit;


        }
        else{
            this.inst_wp_upd_unoff = false;
            this.wp_inst_edit='';

        }

        $('#inst_type_upd option[value="'+this.wp_type_edit+'"]').attr("selected", "selected");
        this.onChangeupd(this.wp_type_edit);
       }
       else {
         this.inst_wp_upd_unoff=false;
        this.inst_wp_upd = false;

        $('#has_whatsapp').prop('checked', false);
       }

      //  $("#inst_type_upd select").val("{agent_data.whatsapp_type}").change();
      // var target = $('#inst_type_a option:selected').val();

      //  $("#inst_type_upd > select > option[value=" + target + "]").prop("selected",true);

// console.log(agent_data.whatsapp_type);
        if(agent_data.has_chat == 1){
        $('#has_chat').prop('checked', true);
       } else {
        $('#has_chat').prop('checked', false);
       }

       if(agent_data.has_chatbot == 1){
        $('#has_chatbot').prop('checked', true);
       } else {
        $('#has_chatbot').prop('checked', false);
       }



       if(agent_data.has_fb == 1){
        $('#has_fb').prop('checked', true);
       } else {
        $('#has_fb').prop('checked', false);
       }


       if(agent_data.has_fax == 1){
        $('#has_fax').prop('checked', true);
       } else {
        $('#has_fax').prop('checked', false);
       }


       if(agent_data.has_wechat == 1){
        $('#has_wechat').prop('checked', true);
       } else {
        $('#has_wechat').prop('checked', false);
       }
       if(agent_data.has_telegram == 1){
        $('#has_telegram').prop('checked', true);
       } else {
        $('#has_telegram').prop('checked', false);
       }

        if(agent_data.has_webinar == 1){
        $('#has_webinar').prop('checked', true);
       } else {
        $('#has_webinar').prop('checked', false);
       }

       if(agent_data.voice_manage == 1){
        $('#has_rec_manage').prop('checked', true);
       } else {
        $('#has_rec_manage').prop('checked', false);
       }
       if(agent_data.queue == 1){
        $('#has_queue').prop('checked', true);
       } else {
        $('#has_queue').prop('checked', false);
       }

       if(agent_data.has_internal_ticket == 1){
        $('#has_internal_ticket').prop('checked', true);
       } else {
        $('#has_internal_ticket').prop('checked', false);
       }
       if(agent_data.has_external_ticket == 1){
        $('#has_external_ticket').prop('checked', true);
       } else {
        $('#has_external_ticket').prop('checked', false);
       }

       if(agent_data.has_internal_chat == 1){
        $('#has_internal_chat').prop('checked', true);
       } else {
        $('#has_internal_chat').prop('checked', false);
       }

       $('#MPlanName').val(agent_data.tarrif_id);
       $("#MPlanName option:contains("+ $.trim( agent_data.tarrif_id ) + ")").prop('selected',true);

       if(agent_data.baisc_wallboard == 1){
        $('#baisc_wallboard').prop('checked', true);
       } else {
        $('#baisc_wallboard').prop('checked', false);
       }

       if(agent_data.wallboard_one == 1){
        $('#wallboard_one').prop('checked', true);
       } else {
        $('#wallboard_one').prop('checked', false);
       }
       if(agent_data.wallboard_two == 1){
        $('#wallboard_two').prop('checked', true);
       } else {
        $('#wallboard_two').prop('checked', false);
       }
       if(agent_data.wallboard_three == 1){
        $('#wallboard_three').prop('checked', true);
       } else {
        $('#wallboard_three').prop('checked', false);
       }
       if(agent_data.wallboard_four == 1){
        $('#wallboard_four').prop('checked', true);
       } else {
        $('#wallboard_four').prop('checked', false);
       }
      if(agent_data.wallboard_five == 1){
              $('#wallboard_five').prop('checked', true);
            } else {
              $('#wallboard_five').prop('checked', false);
            }

        if(agent_data.wallboard_six == 1){
              $('#wallboard_six').prop('checked', true);
            } else {
              $('#wallboard_six').prop('checked', false);
            }
  if(agent_data.wallboard_eight == 1){
              $('#wallboard_eight').prop('checked', true);
            } else {
              $('#wallboard_eight').prop('checked', false);
            }

       if(agent_data.two_factor == 1){
        $('#two_factor').prop('checked', true);
       } else {
        $('#two_factor').prop('checked', false);
       }


       if(agent_data.admin_status == 1){
        $('#admin_status').prop('checked', true);
       } else {
        $('#admin_status').prop('checked', false);
       }

       this.admin_id = agent_data.id;
       $('#edit_adminform').modal('show');
      }
      else{

        iziToast.warning({
            message: "Admin data could not retrive. Please try again",
            position: 'topRight'
        });

  }
    },
    (error)=>{
        console.log(error);
    });

}



  dataAdminEdit(main_id){

      var ad_pass=$('#update_admin_password').val();

      let agent_req:any = this.editAdmin.value;
      let access_token: any=localStorage.getItem('access_token');
      var reports = $('#edit_reports').val().join();
      var get_user_type : any=localStorage.getItem('user_type');
      if((this.reseller_value != '' ||this.reseller_value !=null)&&  get_user_type == "Super Admin"){
        var reseller = $('#edit_reseller').val().join();
      }else{
          reseller = "";
        }
       //  add in API "reseller":"'+reseller+'"
      if(this.inst_wp_upd_unoff == true && $('#has_whatsapp').prop('checked')){

          var wpinst_upd = this.wp_count;
    }
     else{
      this.inst_wp_upd_unoff == false;
        wpinst_upd = '';
     }

      //console.log(wpinst_upd);
      // return false;
      var user_name = $('#admin_user_name').val();
      var password = $('#update_admin_password').val();
      var voice_3cx = '0';  if($('#voice_3cx').prop('checked')){ voice_3cx = '1'; }
      var predective_dialer = '0';  if($('#predective_dialer').prop('checked')){ predective_dialer = '1'; }
      var lead = '0';  if($('#lead').prop('checked')){ lead = '1'; }
      var mrvoip = '0';  if($('#has_mrvoipconnection').prop('checked')){ mrvoip = '1'; }
      var has_contact = '0';  if($('#has_contact').prop('checked')){ has_contact = '1'; }
      var has_sms = '0';  if($('#has_sms').prop('checked')){ has_sms = '1'; }
      var postpaid = '0';  if($('#a_has_sms_postpaid_upd').prop('checked')){ postpaid = '1'; }
      var has_chat = '0';  if($('#has_chat').prop('checked')){ has_chat = '1'; }
      var has_internal_chat = '0';  if($('#has_internal_chat').prop('checked')){ has_internal_chat = '1'; }
      var has_whatsapp = '0';  if($('#has_whatsapp').prop('checked')){ has_whatsapp = '1'; }
      var has_chatbot = '0';  if($('#has_chatbot').prop('checked')){ has_chatbot = '1'; }
      var has_fb = '0';  if($('#has_fb').prop('checked')){ has_fb = '1'; }
      var has_fax = '0';  if($('#has_fax').prop('checked')){ has_fax = '1'; }
      var has_wechat = '0';  if($('#has_wechat').prop('checked')){ has_wechat = '1'; }
      var has_telegram = '0';  if($('#has_telegram').prop('checked')){ has_telegram = '1'; }
      var has_internal_ticket = '0';  if($('#has_internal_ticket').prop('checked')){ has_internal_ticket = '1'; }
      var  has_external_ticket = '0';  if($('#has_external_ticket').prop('checked')){ has_external_ticket = '1'; }
      var  baisc_wallboard = '0';  if($('#baisc_wallboard').prop('checked')){ baisc_wallboard = '1'; }
      var  wallboard_one = '0';  if($('#wallboard_one').prop('checked')){ wallboard_one = '1'; }
      var  wallboard_two = '0';  if($('#wallboard_two').prop('checked')){ wallboard_two = '1'; }
      var  wallboard_three = '0';  if($('#wallboard_three').prop('checked')){ wallboard_three = '1'; }
      var  wallboard_four = '0';  if($('#wallboard_four').prop('checked')){ wallboard_four = '1'; }
      var  wallboard_five = '0';  if($('#wallboard_five').prop('checked')){ wallboard_five = '1'; }
      var  wallboard_six = '0';  if($('#wallboard_six').prop('checked')){ wallboard_six = '1'; }
      var  wallboard_eight = '0';  if($('#wallboard_eight').prop('checked')){ wallboard_eight = '1'; }
      var  two_factor = '0';  if($('#two_factor').prop('checked')){ two_factor = '1'; }
      var admin_status = '0';  if($('#admin_status').prop('checked')){ admin_status = '1'; }
      var has_webinar = '0';  if($('#has_webinar').prop('checked')){ has_webinar = '1'; }
      var has_rec_manage = '0';  if($('#has_rec_manage').prop('checked')){ has_rec_manage = '1'; }
      var has_queue = '0';  if($('#has_queue').prop('checked')){ has_queue = '1'; }


      var price_sms_upd = $('#price_sms_u').val();
      var MPlanName = $('#MPlanName').val();

     let plan_id=$('#eMPlanName').val();
     let call_rate=$('#ecall_rate').val();
     let call_prefix=$('#ecall_prefix').val();
     let valid_from=$('#evalid_from').val();
     let valid_to=$('#evalid_to').val();
     let tax_name=$('#e_tax_name').val();
     let tax_per=$('#e_tax_per').val();
     let upd_post_url=$('#upd_post_url').val();


    if(has_whatsapp=='1')
      var wp_type_u = $('#inst_type_upd').val();
      else
        wp_type_u = "";

        if( user_name.indexOf(" ") !== -1 )
        {
          iziToast.warning({
            message: "Username should not contain Whitespace.",
            position: 'topRight'
        });return false;
      }

        if( ad_pass.indexOf(" ") !== -1 )
        {
          iziToast.warning({
            message: "Password should not contain Whitespace.",
            position: 'topRight'
        }); return false;
        }

       // alert(postpaid);

      let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_single_adminsettings","admin_name":"'+agent_req.admin_name+'","company_name":"'+agent_req.company_name+'","reseller":"'+reseller+'","domain_name":"'+agent_req.domain_name+'","whatsapp_num":"'+agent_req.whatsapp_num+'","tarrif_id":"'+MPlanName+'","survey_vid":"'+agent_req.survey_vid+'","pbx_count":"'+agent_req.pbx_count+'","price_sms":"'+price_sms_upd+'","user_name":"'+user_name+'","password":"'+password+'","agent_count":"'+agent_req.agent_count+'","sip_password":"'+agent_req.sip_password+'","reports":"'+reports+'","id":"'+main_id+'","voice_3cx":'+voice_3cx+',"predective_dialer":'+predective_dialer+',"lead":'+lead+',"mr_voip":'+mrvoip+',"has_contact":'+has_contact+',"has_sms":'+has_sms+',"sms_type":"'+postpaid+'","has_chat":'+has_chat+',"has_chatbot":'+has_chatbot+',"has_whatsapp":'+has_whatsapp+',"has_fb":'+has_fb+',"has_fax":'+has_fax+',"has_wechat":'+has_wechat+',"has_telegram":'+has_telegram+',"has_webinar":'+has_webinar+',"voice_manage":'+has_rec_manage+',"queue":'+has_queue+',"has_internal_ticket":'+has_internal_ticket+',"has_external_ticket":'+has_external_ticket+',"has_internal_chat":'+has_internal_chat+',"baisc_wallboard":'+baisc_wallboard+',"wallboard_one":'+wallboard_one+',"wallboard_two":'+wallboard_two+',"wallboard_three":'+wallboard_three+',"wallboard_four":'+wallboard_four+',"wallboard_five":'+wallboard_five+',"wallboard_six":'+wallboard_six+',"wallboard_eight":'+wallboard_eight+',"two_factor":'+two_factor+',"admin_status":'+admin_status+',"wp_instance_count":"'+wpinst_upd+'","whatsapp_type":"'+wp_type_u+'","notes":"'+agent_req.notes+'","plan_id":"'+plan_id+'","call_rate":"'+call_rate+'","valid_from":"'+valid_from+'","valid_to":"'+valid_to+'","call_prefix":"'+call_prefix+'","tax_name":"'+tax_name+'","tax_per":"'+tax_per+'","post_url":"'+upd_post_url+'"}}';



          this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.data == 1) {
                  $('#edit_adminform').modal('hide');
                  this.editAdmin.reset();
                  this.admin_settings();
                this.getwpinsts();
                  iziToast.success({
                      message: "Admin data updated successfully",
                      position: 'topRight'
                  });
              }
          else{
                  iziToast.warning({
                      message: "Admin data  not updated. Please try again",
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





    addadminData(){
      let agent_req:any = this.addAadmin.value;
      let access_token: any=localStorage.getItem('access_token');
      var reports = $('#add_reports').val().join();

      let get_user_type : any=localStorage.getItem('user_type');
      if((this.reseller_value != '' ||this.reseller_value !=null) &&  get_user_type == "Super Admin" ){
      var reseller = $('#add_reseller').val().join();
      }else{
        reseller = "";
      }
      console.log(reports);

      if($('#a_has_whatsapp').prop('checked')){
       if(this.inst_wp_upd_unoff==true){

          var wpinst = $('#add_mul_inst').val().join();
       }
       }
else{
  this.inst_wp_upd_unoff==false;
}
      console.log(wpinst);
      // return false;

      var voice_3cx = '0';  if($('#a_voice_3cx').prop('checked')){ voice_3cx = '1';}
      var predective_dialer = '0';  if($('#a_predective_dialer').prop('checked')){ predective_dialer = '1'; }
      var lead = '0';  if($('#a_lead').prop('checked')){ lead = '1'; }
      var mrvoip = '0';  if($('#a_mrvoip').prop('checked')){ mrvoip = '1'; }
      var has_contact = '0';  if($('#a_has_contact').prop('checked')){ has_contact = '1'; }
      var has_sms = '0';  if($('#a_has_sms').prop('checked')){ has_sms = '1'; }
      var postpaid = '0';  if($('#a_has_sms_postpaid').prop('checked')){ postpaid = '1'; }
      var has_chat = '0';  if($('#a_has_chat').prop('checked')){ has_chat = '1'; }
      var has_internal_chat = '0';  if($('#a_has_internal_chat').prop('checked')){ has_internal_chat = '1'; }
      var has_whatsapp = '0';  if($('#a_has_whatsapp').prop('checked')){ has_whatsapp = '1'; }
      var has_chatbot = '0';  if($('#a_has_chatbot').prop('checked')){ has_chatbot = '1'; }
      var has_fb = '0';  if($('#a_has_fb').prop('checked')){ has_fb = '1'; }
      var has_fax = '0';  if($('#a_has_fax').prop('checked')){ has_fax = '1'; }
      var has_wechat = '0';  if($('#a_has_wechat').prop('checked')){ has_wechat = '1'; }
      var has_telegram = '0';  if($('#a_has_telegram').prop('checked')){ has_telegram = '1'; }
      var has_internal_ticket = '0';  if($('#a_has_internal_ticket').prop('checked')){ has_internal_ticket = '1'; }
      var  has_external_ticket = '0';  if($('#a_has_external_ticket').prop('checked')){ has_external_ticket = '1'; }
      var  baisc_wallboard = '0';  if($('#a_baisc_wallboard').prop('checked')){ baisc_wallboard = '1'; }
      var  wallboard_one = '0';  if($('#a_wallboard_one').prop('checked')){ wallboard_one = '1'; }
      var  wallboard_two = '0';  if($('#a_wallboard_two').prop('checked')){ wallboard_two = '1'; }
      var  wallboard_three = '0';  if($('#a_wallboard_three').prop('checked')){ wallboard_three = '1'; }
      var  wallboard_four = '0';  if($('#a_wallboard_four').prop('checked')){ wallboard_four = '1'; }
      var  wallboard_five = '0';  if($('#a_wallboard_five').prop('checked')){ wallboard_five = '1'; }
      var  wallboard_six = '0';  if($('#a_wallboard_six').prop('checked')){ wallboard_six = '1'; }
      var  wallboard_eight = '0';  if($('#a_wallboard_eight').prop('checked')){ wallboard_eight = '1'; }
      var  two_factor = '0';  if($('#a_two_factor').prop('checked')){ two_factor = '1'; }
      var  admin_status = '0';  if($('#a_admin_status').prop('checked')){ admin_status = '1'; }
      var has_webinar = '0';  if($('#a_has_webinar').prop('checked')){ has_webinar = '1'; }
      var has_rec_manage = '0';  if($('#a_has_rec_manage').prop('checked')){ has_rec_manage = '1'; }
      var has_queue = '0';  if($('#a_has_queue').prop('checked')){ has_queue = '1'; }

      var price_sms_a = $('#price_sms_a').val();
      var add_pass= $('#add_admin_password').val();
      console.log(add_pass);

      var a_MPlanName = $('#a_MPlanName').val()


      var  wp_inst_count_a = $('#inst_add').val();
      var  wp_inst_type_a  = $('#inst_type_a').val();


if( agent_req.user_name.indexOf(" ") !== -1 )
{
  iziToast.warning({
    message: "Username should not contain Whitespace.",
    position: 'topRight'
});
return false;
}
if( add_pass.indexOf(" ") !== -1 )
{
  iziToast.warning({
    message: "Password should not contain Whitespace.",
    position: 'topRight'
});
return false;
}
//alert(postpaid);alert(price_sms_a);
      let plan_id=$('#add_MPlanName').val();
      let call_rate=$('#call_rate').val();
      let call_prefix=$('#call_prefix').val();
      let valid_from=$('#valid_from').val();
      let valid_to=$('#valid_to').val();
      let tax_name=$('#a_tax_name').val();
      let tax_per=$('#a_tax_per').val();
      let add_post_url=$('#add_post_url').val();

     let new_id : any=localStorage.getItem('admin_id');
      let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_single_admin","name":"'+agent_req.admin_name+'","user_id":"'+new_id+'","company_name":"'+agent_req.company_name+'","price_sms":"'+price_sms_a+'","wp_instance_count":"'+wpinst+'","whatsapp_type":"'+wp_inst_type_a+'","domain_name":"'+agent_req.domain_name+'","pbx_count":"'+agent_req.pbx_count+'","tarrif_id":"'+a_MPlanName+'","survey_vid":"'+agent_req.survey_vid+'","whatsapp_num":"'+agent_req.whatsapp_num+'","agent_counts":"'+agent_req.agent_count+'","reports":"'+reports+'","user_name":"'+agent_req.user_name+'","user_password":"'+add_pass+'","voice_3cx":"'+voice_3cx+'","predective_dialer":"'+predective_dialer+'","lead":"'+lead+'","mr_voip":"'+mrvoip+'","has_contact":"'+has_contact+'","has_sms":"'+has_sms+'","sms_type":"'+postpaid+'","has_chat":"'+has_chat+'","has_whatsapp":"'+has_whatsapp+'","has_fb":"'+has_fb+'","reseller":"'+reseller+'","has_fax":"'+has_fax+'","has_wechat":"'+has_wechat+'","has_telegram":"'+has_telegram+'","has_webinar":"'+has_webinar+'","voice_manage":"'+has_rec_manage+'","queue":"'+has_queue+'","has_internal_ticket":"'+has_internal_ticket+'","has_external_ticket":"'+has_external_ticket+'","has_internal_chat":"'+has_internal_chat+'","baisc_wallboard":"'+baisc_wallboard+'","wallboard_one":"'+wallboard_one+'","wallboard_two":"'+wallboard_two+'","wallboard_three":"'+wallboard_three+'","wallboard_four":"'+wallboard_four+'","wallboard_five":"'+wallboard_five+'","wallboard_six":"'+wallboard_six+'","wallboard_eight":"'+wallboard_eight+'","two_factor":"'+two_factor+'","admin_status":"'+admin_status+'","has_chatbot":"'+has_chatbot+'","notes":"'+agent_req.notes+'","plan_id":"'+plan_id+'","call_rate":"'+call_rate+'","valid_from":"'+valid_from+'","valid_to":"'+valid_to+'","call_prefix":"'+call_prefix+'","tax_name":"'+tax_name+'","tax_per":"'+tax_per+'","post_url":"'+add_post_url+'"}}';


      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.result.data == 1){
              $('#add_adminform').modal('hide');
              this.addAadmin.reset();
              this.admin_settings();
              iziToast.success({
                  message: "Admin created successfully",
                  position: 'topRight'
              });
        }  else if(response.result.data == 3){
                iziToast.warning({
                  message: "Admin name already in use",
                  position: 'topRight'
              });

         } else{

          iziToast.warning({
              message: "Admin data could not retrive. Please try again",
              position: 'topRight'
          });

    }
      },
      (error)=>{
          console.log(error);
      });
    }




    actCamp(to_per,id){
      let agent_req:any = this.addAadmin.value;
      let access_token: any=localStorage.getItem('access_token');
      let api_req:any = '{"operation":"agents", "moduleType": "agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"take_down_toggle_status","status_for":"'+to_per+'","id":"'+id+'"}}';
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.result.data == 1){
          this.admin_settings();
       }
      },
      (error)=>{
          console.log(error);
      });
    }









    deletedata(id){

      let access_token: any=localStorage.getItem('access_token');
      let u_id: any=localStorage.getItem('userId');
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_admin","user_id":"'+id+'"}}';
          this.serverService.sendServer(api_req).subscribe((response:any) => {
            if(response.result.data==1){
              iziToast.success({
                message: "Admin deleted successfully",
                position: 'topRight'
            });
            this.admin_settings();            }
          },
          (error)=>{
              console.log(error);
          });
        }
      })

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

      priceSMS(data){
        //alert(data);
        if(data == 'update'){
          if($('#has_sms').prop('checked')){
          // $('#a_has_sms_postpaid_upd').prop('checked', false);

              if($('#a_has_sms_postpaid_upd').prop('checked')){this.price_sms_postpaid= true;} else {  $('#a_has_sms_postpaid_upd').prop('checked', false); this.price_sms_postpaid = false;}
            this.price_sms_upd = true;this.price_sms_postpaid = true;

          }
          else {
            this.price_sms_upd = false; this.price_sms_postpaid = true;
          }
          // if($('#a_has_sms_postpaid_upd').prop('checked')){ this.price_sms_postpaid= true;  this.price_sms_upd = true; } else { this.price_sms_postpaid = false;}

        }
        else if(data == 'postpaid') {

          if($('#a_has_sms_postpaid').prop('checked')){ this.price_sms_postpaid = true;  } else {this.price_sms_add = true; this.price_sms_postpaid = false;}
        }

        else if(data == 'postpaidupd') {

          if($('#a_has_sms_postpaid_upd').prop('checked')){ this.price_sms_postpaid= true;  this.price_sms_upd = true; } else { this.price_sms_postpaid = false; this.price_sms_upd = true;}
        }

        else {
          // alert(data);
          $('#a_has_sms_postpaid_upd').prop('checked', false);

          if($('#a_has_sms').prop('checked')){ this.price_sms_add = true; this.price_sms_postpaid = false; } else {this.price_sms_add = false; this.price_sms_postpaid = true; }
        }
      }
      wpinst(data){
        console.log(data);
                if(data == 'update'){
                  if($('#has_whatsapp').prop('checked')){ this.inst_wp_upd = true;} else {this.inst_wp_upd = false; this.inst_wp_upd_unoff = false;}
                }
                else {
                  if($('#a_has_whatsapp').prop('checked')){ this.inst_wp_add = true; } else {this.inst_wp_add_unoff = false;this.inst_wp_add = false; }
                }

              }


              // selectOption(id: number) {
              //   //getted from event
              //   console.log(id);
              //   //getted from binding
              //   console.log(this.selected)
              // }
              onChange(deviceValue) {
                if(deviceValue == 0){
                //  this.inst_wp_upd_unoff = true;

                if($('#a_has_whatsapp').prop('checked')){ this.inst_wp_add_unoff = true;} else {this.inst_wp_add_unoff = false;}
                }
                else{
                   this.inst_wp_add_unoff = false;
                }
                console.log(deviceValue);
            }
            onChangeupd(deviceValue) {
              console.log(deviceValue);

              if(deviceValue == 0){
                 this.inst_wp_upd_unoff = true;
              }
              else{
                 this.inst_wp_upd_unoff = false;
              }

          }
              // test(){
              //   var target = $('#inst_type_a option:selected').val();
              //   console.log(target);
              // }
              // changeFunc()   {
              //   var selectBox = document.getElementById("selectBox");
              //   selectBox.addEventListener('change', changeFunc);
              //   function changeFunc() {
              //     alert(this.value);
              //   }
              // }



              getCallTariffsList(){
              //  alert(this.addAadmin.value.voice_3cx);
                if(this.addAadmin.value.voice_3cx == null || this.addAadmin.value.voice_3cx == false){
                 // alert( this.showCallTariffsDet)
                  this.showCallTariffsDet = true;
                } else {
                  this.showCallTariffsDet = false;
                }
            }

            getCallTariffsListe(){
              if(this.editAdmin.value.voice_3cx == null || this.editAdmin.value.voice_3cx == false){
                this.showCallTariffsDetEdit = true;
              } else {
                this.showCallTariffsDetEdit = false;
              }
            }

            getcalltariffs(){
              let access_token: any=localStorage.getItem('access_token');
              let admin_id: any=localStorage.getItem('admin_id');

              let api_req:any = '{"operation":"call_tarrif", "moduleType":"call_tarrif", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"view_call_tarrif","admin_id": "'+admin_id+'"}}';
              this.serverService.sendServer(api_req).subscribe((response:any) => {
                if(response.status == true){
                this.callTariffs = response.result.data.plans;
                } else {
                }
              },
              (error)=>{
                console.log(error);
              });
            }

            edit_billing_address(){

              // $('#edit_billing_address').reset();


               var user_id = $('#edit_agents_key').val();
               //alert(user_id);
               let access_token: any=localStorage.getItem('access_token');
               let admin_id: any=localStorage.getItem('admin_id');
               let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_agent_billing_det","admin_id": "1","id":"'+user_id+'"}}';
               this.serverService.sendServer(api_req).subscribe((response:any) => {
                 if(response.status==true){
                   if(response.result.data !=""){
                    // alert(response.result.data);
                     var ab = response.result.data[0]
             //alert(ab.edit_ship);
                     if(ab.edit_ship == '1'){
                       $('#eedit_ship').prop('checked', true);
                       $('#editShippingAddresss').attr('style','display:flex');

                       $('#econtact_person').val(ab.contact_person);
                       $('#eadd1').val(ab.add1);
                       $('#eadd2').val(ab.add2);
                       $('#ecity').val(ab.city);
                       $('#estate').val(ab.state);
                       $('#ezip_code').val(ab.zip_code);
                       $('#ecountry').val(ab.country);
                       $('#e_monthly_charges').val(ab.monthly_charges);
                       $('#e_discount_per').val(ab.discount);
                       $('#eship_contact').val(ab.ship_contact);
                       $('#eship_to').val(ab.ship_to);
                       $('#eship_add1').val(ab.ship_add1);
                       $('#eship_add2').val(ab.ship_add2);
                       $('#eship_city').val(ab.ship_city);
                       $('#eship_state').val(ab.ship_state);
                       $('#eship_zip').val(ab.ship_zip);
                       $('#eship_country').val(ab.ship_country);
                     } else {

                       $('#econtact_person').val(ab.contact_person);
                       $('#eadd1').val(ab.add1);
                       $('#eadd2').val(ab.add2);
                       $('#ecity').val(ab.city);
                       $('#estate').val(ab.state);
                       $('#ezip_code').val(ab.zip_code);
                       $('#ecountry').val(ab.country);
                       $('#e_monthly_charges').val(ab.monthly_charges);
                       $('#e_discount_per').val(ab.discount);
                     }





                     $('#edit_agents_form').modal('hide');
                     $('#edit_billing_address').modal('show');

                   } else {
                   //alert('called');


                   $('#edit_agents_form').modal('hide');
                   $('#edit_billing_address').modal('show');

                   // temp for clean a id values
                     $('#econtact_person').val('');
                     $('#eadd1').val('');
                     $('#eadd2').val('');
                     $('#ecity').val('');
                     $('#estate').val('');
                     $('#ezip_code').val('');
                     $('#ecountry').val('');
                     $('#e_monthly_charges').val('');
                     $('#e_discount_per').val('');
                     $('#eship_contact').val('');
                     $('#eship_to').val('');
                     $('#eship_add1').val('');
                     $('#eship_add2').val('');
                     $('#eship_city').val('');
                     $('#eship_state').val('');
                     $('#eship_zip').val('');
                     $('#eship_country').val('');
                     $('#econtact_person').val('');
                     $('#eadd1').val('');
                     $('#eadd2').val('');
                     $('#ecity').val('');
                     $('#estate').val('');
                     $('#ezip_code').val('');
                     $('#ecountry').val('');
                     $('#e_monthly_charges').val('');
                     $('#e_discount_per').val('');



                     $('#edit_agents_form').modal('hide');
                     $('#edit_billing_address').modal('show');
                   }


                 } else {

                 }
               },
               (error)=>{
                   console.log(error);
               });



             }

             editShippingAddress(){
              if($( "#eedit_ship" ).is( ":checked" ) ){
               this.editShippingAddresss = true;
               $('#editShippingAddresss').attr('style','display:flex');
              } else {
               this.editShippingAddresss = false;
               $('#editShippingAddresss').attr('style','display:none');
              }

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

  var user_id = $('#edit_agents_key').val();
  var contact_person =  $('#econtact_person').val();
  var add1 =  $('#eadd1').val();
  var add2 =  $('#eadd2').val();
  var city =  $('#ecity').val();
  var state =  $('#estate').val();
  var zip_code =  $('#ezip_code').val();
  var country =  $('#ecountry').val();
  var ship_contact =  $('#eship_contact').val();
  var ship_to =  $('#eship_to').val();
  var ship_add1 =  $('#eship_add1').val();
  var ship_add2 =  $('#eship_add2').val();
  var ship_city =  $('#eship_city').val();
  var ship_state =  $('#eship_state').val();
  var ship_zip =  $('#eship_zip').val();
  var ship_country =  $('#eship_country').val();
  var monthly_charges =  $('#e_monthly_charges').val();
  var discount_per =  $('#e_discount_per').val();


if(contact_person == "" || add1 == "" || city == "" || state == "" || zip_code == "" || country == ""){
  iziToast.warning({
    message: "Please Fill The Required Field",
    position: 'topRight'
  });
  return false;
}

if($( "#eedit_ship" ).is( ":checked" ) ){
  var edit_ship =  '1';
 } else {
  var edit_ship =  '0';
 }

 if($( "#eedit_ship" ).is( ":checked" ) ){
  if(ship_contact == "" || ship_to == "" || ship_add1 == "" || ship_city == "" || ship_state == "" || ship_zip == "" || ship_country == "" ){
    iziToast.warning({
      message: "Please Fill The Required Field",
      position: 'topRight'
    });
    return false;
  }
  else{
    ship_contact =  contact_person;
   ship_to =  contact_person;
   ship_add1 =  add1;
   ship_add2 =  add2;
   ship_city =  city;
   ship_state =  state;
   ship_zip =  zip_code;
   ship_country = country;
  }
 }
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_agent_billing_det","admin_id": "1","user_id":"'+user_id+'","contact_person":"'+contact_person+'","add1":"'+add1+'","add2":"'+add2+'","city":"'+city+'","state":"'+state+'","zip_code":"'+zip_code+'","country":"'+country+'","edit_ship":"'+edit_ship+'","ship_contact":"'+ship_contact+'","ship_to":"'+ship_to+'","ship_add1":"'+ship_add1+'","ship_add2":"'+ship_add2+'","ship_city":"'+ship_city+'","ship_state":"'+ship_state+'","ship_zip":"'+ship_zip+'","ship_country":"'+ship_country+'","monthly_charges":"'+monthly_charges+'","discount_per":"'+discount_per+'"}}';

 // console.log(api_req); return false;
  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.status == true){
      $('#edit_billing_address').modal('hide');
     // $('#edit_billing_address').reset();
      this.editShippingAddresss = false;
    } else {
    }
  },
  (error)=>{
    console.log(error);
  });

 }

 closeLoading(){
  Swal.close();
}
 genInvoice(id,email){
  let access_token: any=localStorage.getItem('access_token');
  let admin_id: any=localStorage.getItem('admin_id');
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

  let api_req:any = '{"operation":"call_tarrif", "moduleType":"call_tarrif", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"gen_admin_invoice","user_id":"'+id+'","admin_id":"1"}}';
  this.serverService.sendServer(api_req).subscribe((response:any) => {
    console.log(response);
    Swal.close();

    if(response.status==true){

      if(response.result.data == null){
        iziToast.error({
          message: "Sorry,some error occure",
          position: 'topRight'
          });
      } else if(response.result.data.data == '2'){
            this.pdfurl = response.result.data.url;
            $("#showGeneratedPdf").modal('show');
        }

      else if(response.result.data.data == '3'){
        iziToast.error({
          message: "Update user billing address",
          position: 'topRight'
          });
          Swal.fire({
            title: 'Update user Billing Address',
            text: "click the update user icon -> Update Billing Address",
            icon: 'info',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Got it'
          })

    }
    else if(response.result.data.data == '4'){
      iziToast.error({
        message: "Admin billing Address not available",
        position: 'topRight'
        });
        Swal.fire({
          title: 'Update Admin Billing Address',
          text: "Go to profile(by clicking profile Icon)-> Update Billing Address",
          icon: 'info',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Got it'
        })

  }   else if(response.result.data.data == '5'){
          iziToast.error({
           message: "User does not have call plan",
          position: 'topRight'
      });
      Swal.fire({
        title: 'Voice 3CX permission',
        text: "Update your user with voice3CX permission,you should provide plan details for specific user",
        icon: 'info',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Got it'
      })

}

        else  {
          var arrStr = encodeURIComponent(JSON.stringify(response));

          // document.location.href = 'https://baobabbfaso.mconnectapps.com/api/storage/contact/download.php?res='+arrStr;
          var url = 'https://baobabbfaso.mconnectapps.com/api/storage/invoice/invoice.php';
          var form = $('<form action="' + url + '" method="post">' +
            '<input type="text" name="res" value="' + arrStr + '" />' +
            '</form>');
          $('body').append(form);
          form.submit();
        }

    }
  },
  (error)=>{
      console.log(error);
  });
}


}



