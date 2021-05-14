import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-document-download',
  templateUrl: './document-download.component.html',
  styleUrls: ['./document-download.component.css']
})
export class DocumentDownloadComponent implements OnInit {
  access_token;
  uadmin_id;
  admin_id;
  layoutM;
  hide_admin_sett = true;
  dailyfood = false;
  alladmin = true;
  param1: string;
  created_time;
  modified_time;
  parsed_data;
  editContact: FormGroup;
  mrvoip_main;
  mrvoip_lin;
  mrvoip_win;
  agent_rating_main;
  ar_1;
  ar_2;
  prdic_dialer_main;
  pd_camp_1;
  pd_camp_2;
  pd_camp_3;
  mrvoip_win_file;
  mrvoip_lin_file;
  pd_camp_4;
  mrvoip_version;
  pd_version;
  pd_main;
  camps_list
  pro_version
  bd_version
  pro_main;
  pro_camp_1;
  bd_main;
  bd_camp_1;
  bd_camp_2;
  bds_main;
  bds_camp_1;
  bds_camp_2;
  bs_version;
  pred_dial=false;
  sec_title;
  sec2_title;
  mrvoip_win_file2;
  mrvoip_lin_file2;
  mrvoip_lin2;
  mrvoip_win2;
  isRAK=false;
  constructor(private serverService: ServerService,private router:Router) { }

  ngOnInit() { 
    this.admin_id = localStorage.getItem('admin_id');
    this.uadmin_id = localStorage.getItem('userId');
    if(this.admin_id == '128'){
      this.dailyfood = true;
      this.alladmin = false;
    }

    if(this.admin_id == '564'){
      this.isRAK = true;

      //this.alladmin = false;
    }
   // alert(this.admin_id);
    this.allDocuments()
    this.camps_list_settings();
    this.hasContactAccess();
  }

  camps_list_settings(){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"campaign", "moduleType":"campaign", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"camp_list","user_id":"'+this.uadmin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
       
        this.camps_list = response.result.data;
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }

  allDocuments(){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"upload_list"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status == true){
          let data = response.result.data;
          this.mrvoip_main = data.mrvoip_data[0].main_document;
          this.mrvoip_lin = data.mrvoip_data[0].linux_document;
          this.mrvoip_win = data.mrvoip_data[0].windows_document;
          this.mrvoip_version  = data.mrvoip_data[0].mrvoip_version;
          this.mrvoip_lin_file = data.mrvoip_data[0].linux_document_1;
          this.mrvoip_win_file  = data.mrvoip_data[0].windows_document_1;

          this.sec_title = data.mrvoip_data[0].sec_title;

          this.sec2_title = data.mrvoip_data[0].sec2_title;
          this.mrvoip_lin_file2 = data.mrvoip_data[0].linux2_file;
          this.mrvoip_win_file2  = data.mrvoip_data[0].window_file;
          this.mrvoip_lin2 = data.mrvoip_data[0].linux2_doc;
          this.mrvoip_win2 = data.mrvoip_data[0].windows2_doc;


          this.agent_rating_main = data.agentrating_data[0].agent_rating_main;
          this.ar_1 = data.agentrating_data[0].agent_rating_1;
          this.ar_2 = data.agentrating_data[0].agent_rating_2;
          this.prdic_dialer_main = data.pd_data[0].pd_main;
          this.pd_version = data.pd_data[0].pd_version;
          this.pd_main = data.pd_data[0].pd_main;
          this.pd_camp_1 = data.pd_data[0].camp_1;
          this.pd_camp_2 = data.pd_data[0].camp_2;
          this.pd_camp_3 = data.pd_data[0].camp_3;
          this.pd_camp_4 = data.pd_data[0].camp_4;
          this.pro_version = data.pro_data[0].pro_version;
          if(data.bd_data!= '')
             this.bd_version = data.bd_data[0].bd_version;

          this.pro_main = data.pro_data[0].pro_main;
          this.pro_camp_1 = data.pro_data[0].camp_1;
          this.bd_main = data.bd_data[0].bd_main;
          this.bd_camp_1 = data.bd_data[0].camp_1;
          this.bd_camp_2 = data.bd_data[0].camp_2;
          this.bds_main = data.broadcast_survey_dialler[0].bs_main;
          this.bds_camp_1 = data.broadcast_survey_dialler[0].camp_1;
          this.bds_camp_2 = data.broadcast_survey_dialler[0].camp_2;
          this.bs_version = data.broadcast_survey_dialler[0].bs_version;
          $('#mrvoip_version').val(data.mrvoip_data[0].mrvoip_version)
          $('#agent_rating_version').val(data.agentrating_data[0].agent_rating_version)
          $('#pd_version').val(data.pd_data[0].pd_version)
        }
    }, 
    (error)=>{
        console.log(error);
    });
  }

  filterItemsOfType(type){
    if(type.length)
    return this.camps_list.filter(x => x.camp_type == type);
    
}
  downloadZip(column_name,table_name){
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"zipfile_update","column_name":"'+column_name+'","table_name":"'+table_name+'","user_id":"'+admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status == "true"){

          window.open(response.link, "_blank");

        }
    }, 
    (error)=>{
        console.log(error);
    });
  }

  bd_zipfile_update(cmp_id,cmp_pre,audio){
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"bd_zipfile_update","column_name":"camp_2","table_name":"bd_document","user_id":"'+admin_id+'","broadcast_audio":"'+audio+'","cmp_id":"'+cmp_id+'","cmp_pre":"'+cmp_pre+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status == "true"){
          // window.open(response.link.camp_1, "_blank");
          // window.open(response.link.camp_2, "_blank");

          var linkArray = [];
          linkArray.push(response.link.camp_1);
          linkArray.push(response.link.camp_2);
          
          $("#pages").append("<a href="+response.link.camp_1+" class='btn btn-success' target='_blank' ><i class='fas fa-download'></i>Broadcast Dialer</a>")
          $("#pages").append("<a href="+response.link.camp_2+" class='btn btn-success' target='_blank' ><i class='fas fa-download'></i>Broadcast Receiver</a>")

        }
    }, 
    (error)=>{
        console.log(error);
    });  
  }

  bd_zipfile_update_for_RAK(cmp_id,cmp_pre,audio,parallel,frequency){
    
        let access_token: any=localStorage.getItem('access_token');
        let admin_id: any=localStorage.getItem('userId');
        let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"rak_zipfile_update","column_name":"camp_2","table_name":"bd_document  ","user_id":"'+admin_id+'","broadcast_audio":"'+audio+'","cmp_id":"'+cmp_id+'","cmp_pre":"'+cmp_pre+'","parallel":"'+parallel+'","frequency":"'+frequency+'"}}';
      
        this.serverService.sendServer(api_req).subscribe((response:any) => {
            if(response.status == "true"){
              // window.open(response.link.camp_1, "_blank");
              // window.open(response.link.camp_2, "_blank");
//alert("called");
    
              var linkArray = [];
              linkArray.push(response.link.camp_1);
              linkArray.push(response.link.camp_2);
              
              $("#pages").append("<a href="+response.link.camp_1+" class='btn btn-success' target='_blank' ><i class='fas fa-download'></i>Broadcast Dialer</a>")
              $("#pages").append("<a href="+response.link.camp_2+" class='btn btn-success' target='_blank' ><i class='fas fa-download'></i>Broadcast Receiver</a>")
    
            }
        }, 
        (error)=>{
            console.log(error);
        });  
      }

  bds_zipfile_update(cmp_id,cmp_pre,audio){
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"bs_zipfile_update","column_name":"camp_2","table_name":"bs_document  ","user_id":"'+admin_id+'","broadcast_audio":"'+audio+'","cmp_id":"'+cmp_id+'","cmp_pre":"'+cmp_pre+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status == "true"){
          // window.open(response.link.camp_1, "_blank");
          // window.open(response.link.camp_2, "_blank");

          var linkArray = [];
          linkArray.push(response.link.camp_1);
          linkArray.push(response.link.camp_2);
          
          $("#pagess").append("<a href="+response.link.camp_1+" class='btn btn-success' target='_blank' ><i class='fas fa-download'></i>Broadcast Dialer</a>")
          $("#pagess").append("<a href="+response.link.camp_2+" class='btn btn-success' target='_blank' ><i class='fas fa-download'></i>Broadcast Receiver</a>")

        }
    }, 
    (error)=>{
        console.log(error);
    });  
  }

 
    
  pro_zipfile_update(cmp_id,cmp_pre){
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"pro_zipfile_update","column_name":"camp_1","table_name":"pro_document","user_id":"'+admin_id+'","cmp_id":"'+cmp_id+'","cmp_pre":"'+cmp_pre+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status == "true"){
          window.open(response.link,"_blank");

        }
    }, 
    (error)=>{
        console.log(error);
    });  
  }

  hasContactAccess(){
    let api_req:any = new Object();
    let conct_req:any = new Object();
    conct_req.action="has_contact_access";
    conct_req.user_id=localStorage.getItem('userId');
    api_req.operation="contact";
    api_req.moduleType="contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = conct_req;
    // console.log(api_req);
          this.serverService.sendServer(api_req).subscribe((response:any) => {
              


                  // if(this.predective_dialer_behave == '1'){
                  //   this.h_con= false;
                  // }
                   
                    if(response.result.data.predective_dialer == 1){
                      this.pred_dial = true;
                    }
            // alert( this.pred_dial);

                // }
                }, 
                (error)=>{
                    console.log(error);
                });
            
  }


  predicdownloadZip(column_name,table_name,cmp_id,cmp_pre){
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"pd_zipfile_update","column_name":"'+column_name+'","table_name":"'+table_name+'","user_id":"'+admin_id+'","cmp_id":"'+cmp_id+'","cmp_pre":"'+cmp_pre+'"}}';
 
    this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status == "true"){

          window.open(response.link, "_blank");

        }
    }, 
    (error)=>{
        console.log(error);
    });
  }
}
