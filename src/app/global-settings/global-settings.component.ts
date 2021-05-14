import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AnyARecord } from 'dns';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.css']
})
export class GlobalSettingsComponent implements OnInit {
  call_history_list;
  recordNotFound = false;
  pageLimit = 20;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  getRep: FormGroup;
  auxcodes;
  uadmin_id;
  queue_list;
  res;
  show_admin_sett;
  user_type;
  small_logo_image;
  logo_image;
  myTime;
  has_external_contact;
  showurlsett = false;
  external_contact_url;
  behaviourURL;
  crm_type;
  showForZDesk = false;
  showForHubSpot = false;
  h_con;
  host_name;
  dialer_ring;
  dialer_ring_upt;
  dialer_step;

  admin_id;
  valume;
  server_list;
  server_ID;
  server_FQDN;
  predective_dialer_behave;
  has_predict=false;
  has_voice=false;
  constructor(private serverService: ServerService) { }

   ngOnInit() {
     this.getRep = new FormGroup({
     'auxcode_name' :new FormControl(null),
     'from_date' :new FormControl(null),
     'to_date' :new FormControl(null),
     });
     this.host_name =window.location.hostname;
     this.uadmin_id = localStorage.getItem('userId');
     this.user_type = localStorage.getItem('user_type');
     this.has_external_contact = localStorage.getItem('has_external_contact');
     this.external_contact_url = localStorage.getItem('external_contact_url');
     this.h_con = localStorage.getItem('h_con');
     this.admin_id = localStorage.getItem('admin_id');
     this.server_ID = localStorage.getItem('server_ID');
     this.server_FQDN = localStorage.getItem('server_FQDN');
     this.predective_dialer_behave= localStorage.getItem('predective_dialer_behave');
     if(localStorage.getItem('has_predict')=='1')
        this.has_predict = true;
     if(localStorage.getItem('has_voice')=='1')
       this.has_voice = true;
      


     $('#webrtc_server').val(this.server_ID);

     var ext_url = localStorage.getItem('external_contact_url');
     let searchParams = new URLSearchParams(ext_url)
     let Z_orgId = searchParams.get('orgId');
     let z_authkey = searchParams.get('authkey');

  
     this.crm_type = localStorage.getItem('crm_type');
     if(this.crm_type == 'HubSpot' && this.has_external_contact == '1'){
      this.showForHubSpot = true;
      this.showForZDesk = false;
     // this.behaviourURL = 'https://omni.mconnectapps.com/#/edit-contacts?q=%CallerNumber%&hapikey=ed15f3fa-87c4-4169-a555-6bb845c257e9';
      this.behaviourURL = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&hapikey=ed15f3fa-87c4-4169-a555-6bb845c257e9';
      if(this.uadmin_id == '64'){
        this.external_contact_url = 'https://'+window.location.hostname+'/#/edit-contacts?q=hubSpot&hapikey=ed15f3fa-87c4-4169-a555-6bb845c257e9';
      }
     
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://app.hubspot.com/login/" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')

    } else if(this.crm_type == 'SalesForce' && this.has_external_contact == '1'){
      this.behaviourURL = '?locale=in';
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://login.salesforce.com/?locale=in" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    }else if(this.crm_type == 'FreshDesk'  && this.has_external_contact == '1'){
      this.behaviourURL = '?locale=in';
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://freshdesk.com/login" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    } else if(this.crm_type == 'FreshDesk'  && this.has_external_contact == '1'){
      this.behaviourURL = '?locale=in';
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://freshdesk.com/login" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    } else if(this.crm_type == 'Insightly'  && this.has_external_contact == '1'){
      this.behaviourURL = '?locale=in';
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://login.insightly.com/User/Login" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    } else if(this.crm_type == 'Shopify'  && this.has_external_contact == '1'){
      this.behaviourURL = '?locale=in';
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://accounts.shopify.com/store-login" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    } else if(this.crm_type == 'Vtiger'  && this.has_external_contact == '1'){
      this.behaviourURL = '?locale=in';
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://www.vtiger.com/log-in/" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    } else if(this.crm_type == 'Zendesk'  && this.has_external_contact == '1'){
      this.behaviourURL = '?locale=in';
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://www.zendesk.com/login/" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    } else if(this.crm_type == 'Zoho'  && this.has_external_contact == '1'){
      this.behaviourURL = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&authkey=<Authorization Key>&orgId=<orgId>';
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://www.zoho.com/desk/login.html" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    } else if(this.crm_type == 'ZohoDesk'  && this.has_external_contact == '1'){
      this.showForZDesk = true;
      this.showForHubSpot = false;
      // if(this.uadmin_id == '64'){
      //   this.external_contact_url = 'https://omni.mconnectapps.com/#/edit-contacts?q=hubSpot&hapikey=ed15f3fa-87c4-4169-a555-6bb845c257e9';
      // } else {
      //   this.behaviourURL = 'https://omni.mconnectapps.com/#/edit-contacts?q=%CallerNumber%&authkey=<Authorization Key>&orgId=<orgId>';
      // }
      if(this.uadmin_id == '64'){
        this.external_contact_url = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&authkey=cd8bc68182aec5ae48a9b60faab2f051&orgId=719234391';
        this.behaviourURL = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&authkey=cd8bc68182aec5ae48a9b60faab2f051&orgId=719234391';
      } else {
        this.behaviourURL = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&authkey=<Authorization Key>&orgId=<orgId>';
      }
     
      $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://www.zoho.com/desk/login.html" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
    }

     if(this.external_contact_url == undefined || this.external_contact_url == 'undefined'){
      this.external_contact_url = '';
     }
     $('input:radio[name=has_external_contact][value='+this.has_external_contact+']').prop('checked', true);
     $("input:radio[name='has_external_contact'][value='"+this.has_external_contact+"']").prop('checked', 'checked');
     if(this.user_type == 'Admin'){
       this.show_admin_sett = true;
     }
     if(this.has_external_contact == '1'){
      this.showurlsett = true;
     }
    
     this.dept_settings();
    //  this.listwebrtc();
     
   }

   listwebrtc(){
    //  alert(this.server_list)
     if(this.server_list != null )
        return false;

    var access_token=localStorage.getItem('access_token');
    let api:any='{"operation":"call", "moduleType":"call", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"list_webrtc_servers"}}';
    this.serverService.sendServer(api).subscribe((response:any)=>{
      if(response.status ==true){
        // alert('cksnns')
        this.server_list=response.result.data;
        console.log(this.server_list);
      }
    })
    
  }
   dept_settings(){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_admin_global_settings","user_id":"'+user_id+'"}}';
    // let api_reqs:any = '{"type": "profile"}';
    // this.serverService.profile.next(api_reqs);
    // let api_reqss:any = '{"type": "ring"}';
    // this.serverService.show.next(api_reqss);

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      var agent_data = response;
      this.myTime = agent_data.user_timezone;
    
      $('#dialer_det').val(agent_data.dialer_value).prop('selected', true);
      localStorage.setItem('ring_step',agent_data.dialer_ring); 

      if(agent_data.dialer_ring =='6' ){
        $('#has_default_call').prop('checked', true);
        $("#volume_step").attr('disabled','disabled');

      } else {
        $('#has_default_call').prop('checked', false);
        agent_data.dialer_ring++;
        $('#volume_step').val(agent_data.dialer_ring++);
        $("#volume_step").removeAttr('disabled');

      }
      if(agent_data.show_caller_id =='1' ){
        $('#show_caller_id').prop('checked', true);
      } else {
        $('#show_caller_id').prop('checked', false);
      }

     if(agent_data.predective_dialer_behave =='1' ){
        $('#pred_behav').prop('checked', true);
      } else {
        $('#pred_behav').prop('checked', false);
      }

      if(agent_data.has_video_call == '1' ){
        localStorage.setItem('has_video_dialer', agent_data.has_video_call);
        
        $('#has_video_call').prop('checked', true);
      } else {
        localStorage.setItem('has_video_dialer', agent_data.has_video_call);

        $('#has_video_call').prop('checked', false);
      }
      

      // if(agent_data.dialer_ring =='1' ){
      //   $('#show_caller_id').prop('checked', true);
      // } else {
      //   $('#show_caller_id').prop('checked', false);
      // }
      $('#crm_type').val(this.crm_type).prop('selected', true);
      this.small_logo_image = agent_data.small_logo_image;
      this.logo_image = agent_data.logo_image;
      this.queue_list = response.timezone_options;
    }, 
    (error)=>{
        console.log(error);
    });
  }

  //  getAuxCode(){
  //  let access_token: any=localStorage.getItem('access_token');
  //  let api_req:any = '{"operation":"user", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_dialer_timezone","user_id":"'+this.uadmin_id+'"}}';
  //  this.serverService.sendServer(api_req).subscribe((response:any) => {
  //    if(response.status == "true"){
  //     $('#timezone').val(response.user_timezone).prop('selected', true);
  //     $('#dialer_det').val(response.user_dialer).prop('selected', true);
  //    this.auxcodes = response.result.data;
  //    } else {
  //    }
  //  }, 
  //  (error)=>{
  //    console.log(error);
  //  });
  //  }



  //  get_timezone(){
  //   let access_token: any=localStorage.getItem('access_token');
  //   let api_req:any = '{"operation":"getTimezone", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_timezone"}}';
  //   this.serverService.sendServer(api_req).subscribe((response:any) => {
  //     if(response.status=="true"){
  //       this.queue_list = response.timezone_options;
  //       console.log(this.queue_list);
  //     } else {
       
  //     }
  //   }, 
  //   (error)=>{
  //       console.log(error);
  //   });
  // }



  // updateGlobalSet(){
  //   let access_token: any=localStorage.getItem('access_token');
  //   let timezone_id: any= $('#timezone').val();
  //   let dialer_det: any= $('#dialer_det').val();
  //   let api_req:any = '{"operation":"user", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_dialer_timezone","user_id":"'+this.uadmin_id+'","timezone_id":"'+timezone_id+'","ext_int_status":"'+dialer_det+'"}}';
    
  //   this.serverService.sendServer(api_req).subscribe((response:any) => {
  //     if(response.result.data==1){
  //       iziToast.success({
  //         message: "Settings Updated",
  //         position: 'topRight'
  //       });
  //     } else {
  //     }
  //   }, 
  //   (error)=>{
  //     console.log(error);
  //   });
  // }


  updateGlobalSet(){
 
    let user_id: any =  localStorage.getItem('userId'); 
    let api_req:any = new Object();
  
      var formData = new FormData();
      var show_caller_id = '0';  if($('#show_caller_id').prop('checked')){ show_caller_id = '1'; }
      var has_video_call = '0';  if($('#has_video_call').prop('checked')){ has_video_call = '1'; }
      let access_token: any=localStorage.getItem('access_token');
      let timezone_id: any= $('#timezone').val();
      let ext_int_status: any= $('#dialer_det').val();
      let dialer_ring_upt: any= $('#volume_step').val();
       var dialer_step: any=dialer_ring_upt -1;
// alert(dialer_step);

// return false;

var has_def_call = '0';  if($('#has_default_call').prop('checked')){ has_def_call = '1'; }
if(has_def_call == '1'){
  dialer_step = '6';
}
      if(has_video_call == '1'){
        // localStorage.setItem('has_video_dialer',)
        localStorage.setItem('has_video_dialer', has_video_call);

        let api_reqs:any = '{"type": "showDialer"}';
        this.serverService.showvedioDialer.next(api_reqs);
      } else {

        localStorage.setItem('has_video_dialer', has_video_call);
   

        let api_reqs:any = '{"type": "hideDialer"}';
        this.serverService.showvedioDialer.next(api_reqs);

      }
  
      var pred_bh:any=0;if($('#pred_behav').prop('checked')){pred_bh=1}else{pred_bh=0};
      formData.append('operation', 'agents');
      formData.append('moduleType', 'agents');
      formData.append('api_type', 'web');
      formData.append('action', 'admin_global_settings');
      formData.append('access_token', access_token);
      formData.append('logo_image', $('#logo_image')[0].files[0]);
      formData.append('small_logo_image', $('#small_logo_image')[0].files[0]);
      formData.append('user_id', user_id);
      formData.append('timezone_id', timezone_id);
      formData.append('show_caller_id', show_caller_id);
      formData.append('has_video_call', has_video_call);
      formData.append('ext_int_status',ext_int_status);
      formData.append('dialer_ring',dialer_step);
      formData.append('webrtc_server',$('#webrtc_server').val());
      formData.append('predective_dialer_behave',pred_bh);
  
  
      console.log(formData);
    // return false;
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
          iziToast.success({
            message: "Data Updated Successfully",
            position: 'topRight'
        });
        $("#refresh_page").click();
        localStorage.setItem('show_caller_id', show_caller_id);
        localStorage.setItem('ext_int_status',ext_int_status);
        localStorage.setItem('ring_step',dialer_step);
         localStorage.setItem('predective_dialer_behave',pred_bh);
        localStorage.setItem('server_ID',$('#webrtc_server').val());
        setTimeout(() => {
        $("#checkring").click();
             }, 2000);

        //location.reload();
        } else {
          iziToast.error({
            message: "Sorry, Some Error Occured",
            position: 'topRight'
        });
        // history.go(-1);
        //location.reload();
        }
      }  
  });  
  
    }
  
checkring(){
  window.location.reload();

        // if(this.admin_id == '64' || this.admin_id== '1166')
}
setval(){
$('#incommingCalltone6')[0].pause();
$('#incommingCalltone0')[0].pause();
$('#incommingCalltone2')[0].pause();
$('#incommingCalltone3')[0].pause();
$('#incommingCalltone1')[0].pause();
  var has_def_ring = '0';  if($('#has_default_call').prop('checked')){ has_def_ring = '1'; }
// alert(has_def_ring);
if(has_def_ring == '1'){
$('#incommingCalltone6')[0].play();
$("#volume_step").attr('disabled','disabled');

// return false;
}
else{  
// alert('1223');
$("#volume_step").removeAttr('disabled');

  let data =$('#volume_step').val();
  if(data == '1'){
this.valume="Silent";
$('#incommingCalltone0')[0].play();
  }
  else if(data == '2'){
this.valume="Low";
$('#incommingCalltone1')[0].play();
  }
  else if(data == '3'){
this.valume="Medium";
$('#incommingCalltone2')[0].play();
  }
  else if(data == '4'){
    this.valume="High";
    $('#incommingCalltone3')[0].play();

      }
    }

}
    showCRMlink(crm){

      if(crm=="ext"){
        this.showurlsett=true;
      } else {
        this.showurlsett=false;
        $('#dailyfIframes').html('');
      }

    }
  
    updateCRMSet(){
      let access_token: any=localStorage.getItem('access_token');
      let user_id: any=localStorage.getItem('userId');
      this.external_contact_url =  $("#external_contact_url").val();
      this.has_external_contact = $("input[name='has_external_contact']:checked").val() ;
      var crm_type = $('#crm_type').val();
      let api_req:any = '{"operation":"agents","moduleType":"agents","api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_external_contact","user_id":"'+user_id+'","has_external_contact":"'+this.has_external_contact+'","external_contact_url":"'+this.external_contact_url+'","crm_type":"'+crm_type+'"}}';
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        console.log(response);
        if(response.result.data == 1){
          localStorage.setItem('has_external_contact', this.has_external_contact);
          localStorage.setItem('external_contact_url', this.external_contact_url);
          localStorage.setItem('crm_type', crm_type);
          iziToast.success({
            message: "Updated successfully",
            position: 'topRight'
        });
        } 
      }, 
      (error)=>{
          console.log(error);
      });
    }

    crmType(){
      var crmType = $('#crm_type').val();
     
      if(crmType == 'HubSpot' ){
        this.showForZDesk = false;
        this.showForHubSpot = true;
        if(this.uadmin_id == '64'){
          this.external_contact_url = 'https://'+window.location.hostname+'/#/edit-contacts?q=hubSpot&hapikey=ed15f3fa-87c4-4169-a555-6bb845c257e9';
        }
        this.behaviourURL = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&hapikey=ed15f3fa-87c4-4169-a555-6bb845c257e9';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://app.hubspot.com/login/" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
  
      } else if(crmType == 'SalesForce'){
        if(this.uadmin_id == '64'){
          this.external_contact_url = '';
        }
        this.behaviourURL = '?locale=in';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://login.salesforce.com/?locale=in" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      }else if(crmType == 'FreshDesk'){
        if(this.uadmin_id == '64'){
          this.external_contact_url = '';
        }
        this.behaviourURL = '?locale=in';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://freshdesk.com/login" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      } else if(crmType == 'FreshDesk'){
        if(this.uadmin_id == '64'){
          this.external_contact_url = '';
        }
        this.behaviourURL = '?locale=in';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://freshdesk.com/login" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      } else if(crmType == 'Insightly'){
        if(this.uadmin_id == '64'){
          this.external_contact_url = '';
        }
        this.behaviourURL = '?locale=in';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://login.insightly.com/User/Login" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      } else if(crmType == 'Shopify'){
        if(this.uadmin_id == '64'){
          this.external_contact_url = '';
        }
        this.behaviourURL = '?locale=in';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://accounts.shopify.com/store-login" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      } else if(crmType == 'Vtiger'){
        if(this.uadmin_id == '64'){
          this.external_contact_url = '';
        }
        this.behaviourURL = '?locale=in';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://www.vtiger.com/log-in/" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      } else if(crmType == 'Zendesk'){
        if(this.uadmin_id == '64'){
          this.external_contact_url = '';
        }
        this.behaviourURL = '?locale=in';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://www.zendesk.com/login/" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      } else if(crmType == 'Zoho'){
        if(this.uadmin_id == '64'){
          this.external_contact_url = '';
        }
        this.behaviourURL = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&authkey=<Authorization Key>&orgId=<orgId>';
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://www.zoho.com/desk/login.html" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      } else if(crmType == 'ZohoDesk'){
        this.showForZDesk = true;
        this.showForHubSpot = false;
        if(this.uadmin_id == '64'){
          this.external_contact_url = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&authkey=cd8bc68182aec5ae48a9b60faab2f051&orgId=719234391';
          this.behaviourURL = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&authkey=cd8bc68182aec5ae48a9b60faab2f051&orgId=719234391';
        } else {
          this.behaviourURL = 'https://'+window.location.hostname+'/#/edit-contacts?q=%CallerNumber%&authkey=<Authorization Key>&orgId=<orgId>';
        }
        
        $('#dailyfIframes').html('<iframe class="dailyfIfram" src="https://www.zoho.com/desk/login.html" width="100%" height="800px" frameborder="0" allowfullscreen ></iframe>')
      }

      
    }


}
