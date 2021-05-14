import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import Swal from 'sweetalert2'
import { ActivatedRoute } from '@angular/router';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-admin-plans',
  templateUrl: './admin-plans.component.html',
  styleUrls: ['./admin-plans.component.css']
})
export class AdminPlansComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addPlan: FormGroup;
  editPlan: FormGroup;
  old_sip_url;
  plans;
  admin_id;
  has_contacts;
  statuss;
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
  reportChecked;
  price_sms_upd;price_sms_add
  device_type = [{'status':'1'},{'status':'0'}]
  constructor(private serverService: ServerService,private route: ActivatedRoute,private router:Router) { }

  ngOnInit() {
    var userId = localStorage.getItem('userId');
    if(userId == '1'){
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have no access view that page!',
      });
      this.router.navigate(['/']);
      return false;
    }

    this.addPlan = new FormGroup({
      'plan_name' : new FormControl(null,Validators.required),
      'plan_cost' : new FormControl(null,Validators.required),
      'plan_description' : new FormControl(null),
      'has_contact' : new FormControl(0),
      'voice_3cx' : new FormControl(0),
      'predective_dialer' : new FormControl(0),
      'lead' : new FormControl(0),
      'has_sms' : new FormControl(0),
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
      'has_external_contact' : new FormControl(0),
      'wallboard_one' : new FormControl(0),
      'wallboard_two' : new FormControl(0),
      'wallboard_three' : new FormControl(0),
      'wallboard_four' : new FormControl(0),
      'reports' : new FormControl(0),
      'status': new FormControl(0)
     });
  
  
      this.editPlan= new FormGroup({
        'plan_name' : new FormControl(null,Validators.required),
        'plan_cost' : new FormControl(null,Validators.required),
        'plan_description' : new FormControl(null),
        'has_contact' : new FormControl(0),
        'voice_3cx' : new FormControl(0),
        'predective_dialer' : new FormControl(0),
        'lead' : new FormControl(0),
        'has_sms' : new FormControl(0),
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
        'has_external_contact' : new FormControl(0),
        'wallboard_one' : new FormControl(0),
        'wallboard_two' : new FormControl(0),
        'wallboard_three' : new FormControl(0),
        'wallboard_four' : new FormControl(0)
                 });
           this.listReports();
           this.allPlans();


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


  allPlans(){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"plans", "moduleType":"plans", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"view_plans"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        this.plans = response.result.data;
        console.log(this.plans);
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
  }




  editPlandata(id){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"plans", "moduleType": "plans", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_plans","id":"'+id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        var agent_data = response.result.data[0];
        this.editPlan.setValue({
           'plan_name' : agent_data.plan_name,
           'plan_cost' : agent_data.plan_cost,
           'plan_description' : agent_data.plan_description,
           'voice_3cx' : agent_data.voice_3cx,
           'has_contact' : agent_data.has_contact,
           'predective_dialer' : agent_data.predective_dialer,
           'lead' : agent_data.lead,
           'has_sms' : agent_data.has_sms,
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
           'wallboard_one' : agent_data.wallboard_one,
          'wallboard_two' : agent_data.wallboard_two,
            'wallboard_three' : agent_data.wallboard_three,
            'wallboard_four' : agent_data.wallboard_four,
            'has_external_contact': agent_data.has_external_contact
           
       });


        if(agent_data.reports == null){
        this.reportChecked = agent_data.reports;
        }
        else{
        this.reportChecked = agent_data.reports.split(",");
        }
      $('#edit_reports').val(this.reportChecked);

       if(agent_data.voice_3cx == 1){
        $('#voice_3cx').prop('checked', true);
       } else {
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


       if(agent_data.has_external_contact == 1){
        $('#has_external_contact').prop('checked', true);
       } else {
        $('#has_external_contact').prop('checked', false);
       }
       if(agent_data.has_contact == 1){
        $('#has_contact').prop('checked', true);
       } else {
        $('#has_contact').prop('checked', false);
       }

       if(agent_data.has_sms == 1){
        $('#has_sms').prop('checked', true);
        this.price_sms_upd = true;
        $('#price_sms_u').val(agent_data.price_sms);
       } else {
        $('#has_sms').prop('checked', false);
       }
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

       if(agent_data.has_whatsapp == 1){
        $('#has_whatsapp').prop('checked', true);
       } else {
        $('#has_whatsapp').prop('checked', false);
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



       if(agent_data.status == 1){
        $('#status').prop('checked', true);
       } else {
        $('#status').prop('checked', false);
       }

       this.admin_id = agent_data.id;
       $('#edit_adminform').modal('show');
      }   else{
              
        iziToast.warning({
            message: "Plan data could not retrive. Please try again",
            position: 'topRight'
        });
    
  }
    }, 
    (error)=>{
        console.log(error);
    });
  }


  addNewPlan(){
    let agent_req:any = this.addPlan.value;
    let access_token: any=localStorage.getItem('access_token');
    var reports = $('#add_reports').val().join();
    var voice_3cx = '0';  if($('#a_voice_3cx').prop('checked')){ voice_3cx = '1'; }
    var predective_dialer = '0';  if($('#a_predective_dialer').prop('checked')){ predective_dialer = '1'; }
    var lead = '0';  if($('#a_lead').prop('checked')){ lead = '1'; }
    var has_contact = '0';  if($('#a_has_contact').prop('checked')){ has_contact = '1'; }
    var has_sms = '0';  if($('#a_has_sms').prop('checked')){ has_sms = '1'; }
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
    var  wallboard_one = '0';  if($('#a_wallboard_one').prop('checked')){ wallboard_one = '1'; }
    var  wallboard_two = '0';  if($('#a_wallboard_two').prop('checked')){ wallboard_two = '1'; }
    var  wallboard_three = '0';  if($('#a_wallboard_three').prop('checked')){ wallboard_three = '1'; }
    var  wallboard_four = '0';  if($('#a_wallboard_four').prop('checked')){ wallboard_four = '1'; }
    var  status = '0';  if($('#a_status').prop('checked')){ status = '1'; }
    var has_external_contact  = '0';  if($('#a_has_external_contact').prop('checked')){ has_external_contact = '1'; }




    let api_req:any = '{"operation":"plans", "moduleType": "plans", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"insert_plans","plan_name":"'+agent_req.plan_name+'","plan_cost":"'+agent_req.plan_cost+'","plan_description":"'+agent_req.plan_description+'","reports":"'+reports+'","voice_3cx":"'+voice_3cx+'","predective_dialer":"'+predective_dialer+'","lead":"'+lead+'","has_contact":"'+has_contact+'","has_external_contact":"'+has_external_contact+'","has_sms":"'+has_sms+'","has_chat":"'+has_chat+'","has_whatsapp":"'+has_whatsapp+'","has_fb":"'+has_fb+'","has_fax":"'+has_fax+'","has_wechat":"'+has_wechat+'","has_telegram":"'+has_telegram+'","has_internal_ticket":"'+has_internal_ticket+'","has_external_ticket":"'+has_external_ticket+'","has_internal_chat":"'+has_internal_chat+'","wallboard_one":"'+wallboard_one+'","wallboard_two":"'+wallboard_two+'","wallboard_three":"'+wallboard_three+'","wallboard_four":"'+wallboard_four+'","status":"'+status+'","has_chatbot":"'+has_chatbot+'"}}';



    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data == 1){
            $('#add_adminform').modal('hide');
            this.addPlan.reset();
            this.allPlans();
            iziToast.success({
                message: "Plan created successfully",
                position: 'topRight'
            });
      }  else if(response.result.data == 3){
              iziToast.warning({
                message: "Plan name already in use",
                position: 'topRight'
            });
  
       } else{
              
        iziToast.warning({
            message: "Plan data could not retrive. Please try again",
            position: 'topRight'
        });
    
  }
    }, 
    (error)=>{
        console.log(error);
    });
  }



  dataPlanEdit(main_id){    
    

    let agent_req:any = this.editPlan.value;
    let access_token: any=localStorage.getItem('access_token');
    var reports = $('#edit_reports').val().join();
    var voice_3cx = '0';  if($('#voice_3cx').prop('checked')){ voice_3cx = '1'; }
    var predective_dialer = '0';  if($('#predective_dialer').prop('checked')){ predective_dialer = '1'; }
    var lead = '0';  if($('#lead').prop('checked')){ lead = '1'; }
    var has_contact = '0';  if($('#has_contact').prop('checked')){ has_contact = '1'; }
    var has_sms = '0';  if($('#has_sms').prop('checked')){ has_sms = '1'; }
    var has_chat = '0';  if($('#has_chat').prop('checked')){ has_chat = '1'; }
    var has_internal_chat = '0';  if($('#has_internal_chat').prop('checked')){ has_internal_chat = '1'; }
    var has_whatsapp = '0';  if($('#has_whatsapp').prop('checked')){ has_whatsapp = '1'; }
    var has_chatbot = '0';  if($('#has_chatbot').prop('checked')){ has_chatbot = '1'; }
    var has_fb = '0';  if($('#has_fb').prop('checked')){ has_fb = '1'; }
    var has_fax = '0';  if($('#has_fax').prop('checked')){ has_fax = '1'; }
    var has_wechat = '0';  if($('#has_wechat').prop('checked')){ has_wechat = '1'; }
    var has_telegram = '0';  if($('#has_telegram').prop('checked')){ has_telegram = '1'; }
    var has_internal_ticket = '0';  if($('#has_internal_ticket').prop('checked')){ has_internal_ticket = '1'; }
    var has_external_ticket = '0';  if($('#has_external_ticket').prop('checked')){ has_external_ticket = '1'; }
    var wallboard_one = '0';  if($('#wallboard_one').prop('checked')){ wallboard_one = '1'; }
    var wallboard_two = '0';  if($('#wallboard_two').prop('checked')){ wallboard_two = '1'; }
    var wallboard_three = '0';  if($('#wallboard_three').prop('checked')){ wallboard_three = '1'; }
    var wallboard_four = '0';  if($('#wallboard_four').prop('checked')){ wallboard_four = '1'; }
    var two_factor = '0';  if($('#two_factor').prop('checked')){ two_factor = '1'; }
    var status = '0';  if($('#status').prop('checked')){ status = '1'; }
    var has_external_contact  = '0';  if($('#a_has_external_contact').prop('checked')){ has_external_contact = '1'; }



    let api_req:any = '{"operation":"plans", "moduleType": "plans", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_plans","plan_name":"'+agent_req.plan_name+'","plan_cost":"'+agent_req.plan_cost+'","plan_description":"'+agent_req.plan_description+'","reports":"'+reports+'","voice_3cx":"'+voice_3cx+'","predective_dialer":"'+predective_dialer+'","lead":"'+lead+'","has_contact":"'+has_contact+'","has_external_contact":"'+has_external_contact+'","has_sms":"'+has_sms+'","has_chat":"'+has_chat+'","has_whatsapp":"'+has_whatsapp+'","has_fb":"'+has_fb+'","has_fax":"'+has_fax+'","has_wechat":"'+has_wechat+'","has_telegram":"'+has_telegram+'","has_internal_ticket":"'+has_internal_ticket+'","has_external_ticket":"'+has_external_ticket+'","has_internal_chat":"'+has_internal_chat+'","wallboard_one":"'+wallboard_one+'","wallboard_two":"'+wallboard_two+'","wallboard_three":"'+wallboard_three+'","wallboard_four":"'+wallboard_four+'","status":"'+status+'","has_chatbot":"'+has_chatbot+'"}}';
  

        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
                $('#edit_adminform').modal('hide');
                this.editPlan.reset();
                this.allPlans();
                iziToast.success({
                    message: "Plan data updated successfully",
                    position: 'topRight'
                });
            }
        else{
                iziToast.warning({
                    message: "Plan data not updated. Please try again",
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





  deletedata(id){

    let access_token: any=localStorage.getItem('access_token');
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
        let api_req:any = '{"operation":"plans", "moduleType":"plans", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_plans","id":"'+id+'"}}';
        this.serverService.sendServer(api_req).subscribe((response:any) => {
          if(response.result.data==1){
            iziToast.success({
              message: "Plan deleted successfully",
              position: 'topRight'
          });
          this.allPlans();            }
        }, 
        (error)=>{
            console.log(error);
        });
      }
    })
      
    }








}
