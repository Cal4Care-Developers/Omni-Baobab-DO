import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import Swal from 'sweetalert2'
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addDept: FormGroup;
  editDept: FormGroup;
  addDept_RAK:FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  dep_status; 
  dep_id;
  agents_list;
  userchecked;
  dialer_type;
  showbro_file_upload_add;
  audiaFile;
  showbro_file_upload;
  show_caller_id;

  pDialler = false;
  proDialler = false;
  BrocalsDialler = false;
  norDialler= true;


  pDiallerU = false;
  proDiallerU = false;
  BrocalsDiallerU = false;
  norDiallerU = true;

  isRAK=false;
  parallel;
  frequency;
  admin_id;
  rak_parallel;
  rak_freq;
  doc_link;
  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit(): void {
    this.uadmin_id = localStorage.getItem('userId');
    this.admin_id = localStorage.getItem('admin_id');

    this.addDept = new FormGroup({
     'camp_pre' : new FormControl('Pre'),
     'camp_name' : new FormControl(null,Validators.required),
     'camp_id' : new FormControl(null,Validators.required),
     'call_repeat' : new FormControl(null,Validators.required),
     'camp_vid' : new FormControl(null),
     'status' : new FormControl(null)
    });

    // this.addDept_RAK = new FormGroup({
    //   'camp_pre' : new FormControl('Pre'),
    //    'camp_name' : new FormControl(null,Validators.required),
    //    'camp_id' : new FormControl(null,Validators.required),
    //    'call_repeat' : new FormControl(null,Validators.required),
    //    'camp_vid' : new FormControl(null),
    //    'status' : new FormControl(null)
    //   });

     this.editDept = new FormGroup({
      'camp_name' : new FormControl(null,Validators.required),
      'camp_id' : new FormControl(null,Validators.required),
      'camp_pre' : new FormControl(null),
      'camp_vid' : new FormControl(null),
      'call_repeat' : new FormControl(null,Validators.required),
    });

    this.dept_settings();

    if(this.admin_id==564)
      this.isRAK=true;
    else
      this.isRAK=false;
  }
  dept_settings(){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"campaign", "moduleType":"campaign", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"camp_list","user_id":"'+this.uadmin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
       
        this.queue_list = response.result.data;
        console.log(this.queue_list);
      } else {
        this.recordNotFound = true;
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }
  
  editDepartmentSettings(id){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"campaign", "moduleType": "campaign", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_camp","id":"'+id+'","admin_id":"'+this.uadmin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        var agent_data = response.result.data;
        this.editDept.setValue({
          'camp_id' : agent_data.camp_id,
           'camp_name' : agent_data.camp_name,
           'call_repeat':agent_data.call_repeat,
           'camp_vid': agent_data.camp_vid,
           'camp_pre' : agent_data.camp_pre,
       });
       $('#dialer_type').val(agent_data.camp_type);
       $('#redial_upd').val(agent_data.redial);
  
       this.rak_freq=agent_data.frequency;
       this.rak_parallel=agent_data.parallel;
       if(this.isRAK==true){
        
         $('#parallel_upd').val(this.rak_parallel);
         $('#frequency_upd').val(this.rak_freq);
       }
  
       if(agent_data.camp_type == 'Broadcast_Dialler' || agent_data.camp_type == 'Broadcast_Survey_Dialler' ){
            this.audiaFile =agent_data.broadcast_audio;
            this.showbro_file_upload = true;
       } else {
        this.showbro_file_upload = false;
       }
  
  var dialer_t = agent_data.camp_type;
  
       if(dialer_t == 'Broadcast_Dialler' || dialer_t == 'Broadcast_Survey_Dialler'){
        this.BrocalsDiallerU = true;
        this.pDiallerU = false;
        this.proDiallerU = false;
        this.norDiallerU = false;
      } else if(dialer_t == 'Predictive_Dialler'){
        this.BrocalsDiallerU  = false;
        this.pDiallerU = true;
        this.proDiallerU  = false;
        this.norDiallerU = false;
      } else if(dialer_t == 'Proactive_Dialler'){
        this.BrocalsDiallerU  = false;
        this.pDiallerU  = false;
        this.proDiallerU  = true;
        this.norDiallerU = false;
      } else {
        this.BrocalsDiallerU  = false;
        this.pDiallerU  = false;
        this.proDiallerU  = false;
        this.norDiallerU  = true;
      }
  
  
  
  
  
  
       this.dep_id = id;
  
       $('#edit_deptform').modal('show');
       this.dept_settings();
      }   else{
              
        iziToast.warning({
            message: "Content not retrive. Please try again",
            position: 'topRight'
        });
    
  }
    }, 
    (error)=>{
        console.log(error);
    });
  }
  
  addDepartment(){
    // alert(this.admin_id);
    // if(this.admin_id==564)
    // $('#add_deptform_for_RAK').modal('show');
  
    // else
    $('#add_deptform').modal('show');
  
    
  }
  
  
  
  
  
  
  editDepartment(id){
    let agent_req:any = this.editDept.value;
    let access_token: any=localStorage.getItem('access_token');
    if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
    let user_id: any =  localStorage.getItem('userId'); 
      var formData = new FormData();
        this.rak_parallel=$('#parallel_upd').val();
        this.rak_freq=$('#frequency_upd').val();
        let redial_sec=$('#redial_upd').val();
  
        this.dialer_type=$('#dialer_type').val();
        // alert(this.dialer_type);
  
        formData.append('operation', 'campaign');
        formData.append('moduleType', 'campaign');
        formData.append('api_type', 'web');
        formData.append('action', 'update_camp');
        formData.append('access_token', access_token);
        formData.append('camp_id', agent_req.camp_id);
        formData.append('camp_name', agent_req.camp_name);
        formData.append('call_repeat', agent_req.call_repeat);
        formData.append('camp_vid', agent_req.camp_vid);
        formData.append('camp_status', this.dep_status);
        formData.append('camp_pre', agent_req.camp_pre);
        formData.append('agent_id', this.uadmin_id);
        formData.append('admin_id', this.admin_id);
        formData.append('camp_type', this.dialer_type);
        formData.append('parallel', this.rak_parallel);
        formData.append('frequency', this.rak_freq);
        formData.append('redial', redial_sec);
        formData.append('id', id);
        
      
     
  
      if(this.dialer_type == 'Broadcast_Dialler' || this.dialer_type == 'Broadcast_Survey_Dialler' ){
        if($('#audio_file')[0].files[0] == 'undefined' || $('#audio_file')[0].files[0] == undefined){
          iziToast.error({
            message: "Please Upload Audio file",
            position: 'topRight'
        });
        return false;
        } else {
          formData.append('audio_file', $('#audio_file')[0].files[0]);
        }
      } 
  
  
    $.ajax({  
      url:"https://omni.mconnectapps.com/api/v1.0/index_new.php",  
      type : 'POST',
      data : formData,
      processData: false,  // tell jQuery not to process the data
      contentType: false, 
      success:function(data){ 
        this.parsed_data = JSON.parse(data);
        if(this.parsed_data.status == "true"){
          $('#reload').click();
          $('#edit_deptform').modal('hide');
                // this.editDept.reset();
                this.dept_settings();
                iziToast.success({
                    message: "Data updated successfully",
                    position: 'topRight'
                });
        } else {
          iziToast.error({
            message: "Sorry, Some Error Occured",
            position: 'topRight'
        });
        }
      }  
  });  
  }
  
  
  
  
  
  
  
  
   
  dialerType(){
    var dialer_t = $('#dialer_type').val();
    this.dialer_type = dialer_t;
    if(dialer_t == 'Broadcast_Dialler' || dialer_t == 'Broadcast_Survey_Dialler'){
      this.showbro_file_upload = true;
    } else {
      this.showbro_file_upload = false;
    }
  
    if(dialer_t == 'Broadcast_Dialler' || dialer_t == 'Broadcast_Survey_Dialler'){
      this.BrocalsDiallerU = true;
      this.pDiallerU = false;
      this.proDiallerU = false;
      this.norDiallerU = false;
    } else if(dialer_t == 'Predictive_Dialler'){
      this.BrocalsDiallerU  = false;
      this.pDiallerU = true;
      this.proDiallerU  = false;
      this.norDiallerU = false;
    } else if(dialer_t == 'Proactive_Dialler'){
      this.BrocalsDiallerU  = false;
      this.pDiallerU  = false;
      this.proDiallerU  = true;
      this.norDiallerU = false;
    } else {
      this.BrocalsDiallerU  = false;
      this.pDiallerU  = false;
      this.proDiallerU  = false;
      this.norDiallerU  = true;
    }
  
  
  }
  
  
  dialerTypeAdd(){
    var dialer_t = $('#dialer_type_add').val();
    this.dialer_type = dialer_t;
    if(dialer_t == 'Broadcast_Dialler' || dialer_t == 'Broadcast_Survey_Dialler'){
      this.showbro_file_upload_add = true;
    } else {
      this.showbro_file_upload_add = false;
    } 
  
  
    if(dialer_t == 'Broadcast_Dialler' || dialer_t == 'Broadcast_Survey_Dialler'){
      this.BrocalsDialler = true;
      this.pDialler = false;
      this.proDialler = false; 
      this.norDialler = false;
    } else if(dialer_t == 'Predictive_Dialler'){
      this.BrocalsDialler = false;
      this.pDialler = true;
      this.proDialler = false;
      this.norDialler = false;
    } else if(dialer_t == 'Proactive_Dialler'){
      this.BrocalsDialler = false;
      this.pDialler = false;
      this.proDialler = true;
      this.norDialler = false;
    } else {
      this.BrocalsDialler = false;
      this.pDialler = false;
      this.proDialler = false;
      this.norDialler = true;
    }
    
  
  
  
  
  }
  
  
  
  
    addDeptData(){
      let access_token: any=localStorage.getItem('access_token');
      let user_id: any =  localStorage.getItem('userId'); 
      let agent_req:any = this.addDept.value;
      if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
  
      this.parallel=$('#parallel').val();
     this.frequency=$('#frequency').val();
     let redial=$('#re_delay').val();
    // alert(this.parallel);
    
        var formData = new FormData();
        
        formData.append('operation', 'campaign');
        formData.append('moduleType', 'campaign');
        formData.append('api_type', 'web');
        formData.append('action', 'insert_camp');
        formData.append('access_token', access_token);
        formData.append('camp_id', agent_req.camp_id);
        formData.append('camp_name', agent_req.camp_name);
        formData.append('call_repeat', agent_req.call_repeat);
        formData.append('camp_vid', agent_req.camp_vid);
        formData.append('camp_status', this.dep_status);
        formData.append('camp_pre', agent_req.camp_pre);
        formData.append('agent_id', this.uadmin_id);
        formData.append('camp_type', this.dialer_type);
        formData.append('user_id', user_id);
        formData.append('parallel', this.parallel);
        formData.append('frequency', this.frequency);
        formData.append('redial', redial);
        if(this.dialer_type == 'Broadcast_Dialler' || this.dialer_type == 'Broadcast_Survey_Dialler'){
          if($('#audio_file_add')[0].files[0] == 'undefined' || $('#audio_file_add')[0].files[0] == undefined){
            iziToast.error({
              message: "Please Upload Audio file",
              position: 'topRight'
          });
          return false;
          } else {
            formData.append('audio_file', $('#audio_file_add')[0].files[0]);
          }
        } else {
  
        }
      $.ajax({  
        url:"https://omni.mconnectapps.com/api/v1.0/index_new.php",  
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false, 
        success:function(data){ 
          this.parsed_data = JSON.parse(data);
          if(this.parsed_data.status == "true"){
            $('#reload').click();
            iziToast.success({
              message: "Campaign added successfully",
              position: 'topRight'
          });
          $('#add_deptform').modal('hide');
          this.addDept.reset();
          } else {
            iziToast.error({
              message: this.parsed_data.data,
              position: 'topRight'
          });
          }
        }  
    });  
  }
  
  // addDeptData_for_RAK(){
  //   let access_token: any=localStorage.getItem('access_token');
  //   let user_id: any =  localStorage.getItem('userId'); 
  //   let agent_req:any = this.addDept_RAK.value;
  //   this.parallel=$('#parallel').val();
  //   this.frequency=$('#frequency').val();
  //   alert(this.parallel);
  //   alert(agent_req.camp_id);
  //       alert(this.addDept_RAK.value.camp_id);
  //   if(agent_req.status == true){  this.dep_status = 1 } else { this.dep_status  = 0 }
  //     var formData = new FormData();
  //     formData.append('operation', 'campaign');
  //     formData.append('moduleType', 'campaign');
  //     formData.append('api_type', 'web');
  //     formData.append('action', 'insert_rak_camp');
  //     formData.append('access_token', access_token);
  //     formData.append('camp_id', agent_req.camp_id);
  //     formData.append('camp_name', agent_req.camp_name);
  //     formData.append('call_repeat', agent_req.call_repeat);
  //     formData.append('camp_vid', agent_req.camp_vid);
  //     formData.append('camp_status', this.dep_status);
  //     formData.append('camp_pre', agent_req.camp_pre);
  //     formData.append('agent_id', this.uadmin_id);
  //     formData.append('camp_type', this.dialer_type);
  //     formData.append('user_id', user_id);
  //     formData.append('parallel', this.parallel);
  //     formData.append('frequency', this.frequency);
  //     if(this.dialer_type == 'Broadcast_Dialler' || this.dialer_type == 'Broadcast_Survey_Dialler'){
  //       if($('#audio_file_add')[0].files[0] == 'undefined' || $('#audio_file_add')[0].files[0] == undefined){
  //         iziToast.error({
  //           message: "Please Upload Audio file",
  //           position: 'topRight'
  //       });
  //       return false;
  //       } else {
  //         formData.append('audio_file', $('#audio_file_add')[0].files[0]);
  //       }
  //     } else {
  
  //     }
  //   $.ajax({  
  //     url:"https://omni.mconnectapps.com/api/v1.0/index_new.php",  
  //     type : 'POST',
  //     data : formData,
  //     processData: false,  // tell jQuery not to process the data
  //     contentType: false, 
  //     success:function(data){ 
  //       this.parsed_data = JSON.parse(data);
  //       if(this.parsed_data.status == "true"){
  //         $('#reload').click();
  //         iziToast.success({
  //           message: "Campaign for RAK added successfully",
  //           position: 'topRight'
  //       });
  //       $('#add_deptform').modal('hide');
  //       this.addDept.reset();
  //       } else {
  //         iziToast.error({
  //           message: this.parsed_data.data,
  //           position: 'topRight'
  //       });
  //       }
  //     }  
  // });  
  // }
  
  
  
  
  
  
  
  
  
  
  deleteCamp(id){
  
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
        let api_req:any = '{"operation":"campaign", "moduleType":"campaign", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_camp","id":"'+id+'"}}';
        this.serverService.sendServer(api_req).subscribe((response:any) => {
          if(response.result.status==true){
            iziToast.success({
              message: "Campaign deleted successfully",
              position: 'topRight'
          });
          this.dept_settings();
          }
        }, 
        (error)=>{
            console.log(error);
        });
      }
    })
      
    }
  
  
    actCamp(id,vid){
      this.show_caller_id = localStorage.getItem('show_caller_id');
      if($('#statu_'+id).is(':checked')){
        let api_reqs:any = '{"type": "makecall", "number": "'+vid+'","show_caller_id":"'+this.show_caller_id+'"}';
        this.serverService.show.next(api_reqs);
      } else {
  
      }
      let access_token: any = localStorage.getItem('access_token');
      let api_req:any = '{"operation":"campaign", "moduleType":"campaign", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"toggle_status","id":"'+id+'"}}';
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        
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
    
}
