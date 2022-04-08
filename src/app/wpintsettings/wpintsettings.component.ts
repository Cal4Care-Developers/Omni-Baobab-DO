import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import Swal from 'sweetalert2'
import { interval } from 'rxjs';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-wpintsettings',
  templateUrl: './wpintsettings.component.html',
  styleUrls: ['./wpintsettings.component.css']
})
export class WpintsettingsComponent implements OnInit {
  getWp:FormGroup; 
  assingdept:FormGroup; 
   user_id;admin_id;user_type;
  assign=false;
  hideview=false;
  listdept;listinstacne;instroute;instroutename;insturl;qr_url;
  whatsapp_num;
  alreadyassign=false;deparment;assigneddept;routedept;
  interval;
  realoded=false;
  connected=false;
  assignduplicate=false;
  set;
  settimeout;
  closeall=false;
  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.user_id =localStorage.getItem('admin_id');
   this.admin_id = localStorage.getItem('admin_id');
   this.user_type = "Admin";


   this.getWp = new FormGroup({
    'wp_number' : new FormControl(null,Validators.required),
  });


this.admininsts();
this.listDepts();

  }
  ngOnDestroy(): void {
  
    clearInterval(this.interval);
    clearInterval(this.settimeout);
    clearTimeout(this.settimeout);
    clearTimeout(this.interval);
      
    }
  admininsts(){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"getInstanceDetailsForAdmin","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","user_type":"'+this.user_type+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        this.listinstacne = response.result.data;
        // this.routedept=response.result.data.dept;
        

      } 
    }, 
    (error)=>{
        console.log(error);
    });
  }


  listDepts(){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_dept_settings","user_id":"'+this.user_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        this.listdept = response.result.data;
      } 
     
    }, 
    (error)=>{
        console.log(error);
    });
  }

route(id,name,url,dept,deptname){
  this.assign=false;

  this.hideview=true;

  // console.log(id);
  this.instroute=id;
  this.instroutename=name;
  this.insturl=url;
  this.deparment=dept;
  this.assigneddept=deptname;
  if(dept != undefined || dept != null)
     this.alreadyassign = true;
  else 
     this.alreadyassign = false;
     this.validateQR();

} 

scan(){
  this.closeall=false;
  $('#scan_qr').modal('show');
}

get_wp_number(){
  if(this.closeall==true){
    return false;
  }
  var whatsapp_num = $('#wp_number').val();

  let agent_req:any = this.getWp.value;
  this.whatsapp_num= whatsapp_num;
 
  console.log(this.getWp.value);
    if(this.whatsapp_num=='')
         this.disonnectrevoke();

     if(this.whatsapp_num !=""){
                  $('#scan_qr').modal('hide');
                  $('#show_qr').modal('show')
                // this.reloadQR();
                //alert(this.insturl);
$('#dailyfIframes').html('<iframe src="'+this.insturl+'" padding-left="92" width="393" height="255" frameborder="0">');

$('#dailyfIframes',window.parent.document).attr('src',$('#dailyfIframes',window.parent.document).attr('src'));

// this.interval = setInterval(function () {
//   console.log("logged");

// //   $("iframe").each(function(){
// //   console.log("img");
// // // $('#dailyfIframes').html('<img src="'+this.insturl+'"  width="300" height="275">');
// //   // $('dailyfIframes').attr( 'src',$(this).attr('src'));

// //     // $(this).removeAttr("src").attr("src", $(this).attr("src"));
// //     // $("#img").attr("src", $(this).attr("src"));
// //  });
// },5000);
this.validateQRduplicate();
// console.log("outter");

  
// clearInterval(this.interval);


  this.settimeout= setTimeout(function() {
    // console.log("timeout");

  $('#show_qr').modal('hide');
     clearInterval(this.interval);
}, 10000);

              }
              else {
                iziToast.warning({
                    message: "Enter WhatsApp number",
                    position: 'topRight'
                });
            
        }
 }
     
    
validateQR(){
  // this.assign=true;

  let access_token: any=localStorage.getItem('access_token');

    let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"readInstance","instance_id":"'+this.instroute+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status == true){
    //  clearInterval(this.interval);
       
   if(response.result.data == 'CONNECTED'){
  //  alert("connect");
          // this.assign=true;
           this.connected=true;
   }
  else if(response.result.data == "CONFLICT"){
      iziToast.warning({
        message: "Instance was Conflicted.",
        position: 'topRight'
    });
    iziToast.warning({
      message: "May your WhatsApp is opend on another Brower/Computer. Please refresh our page once and send message",
      position: 'topRight'
  });
    this.alreadyassign=false;
    this.assign=false;
    this.connected=false;
   }
   
   else{
   this.alreadyassign=false;
   this.assign=false;
   this.connected=false;
   this.disonnectrevoke();
   }
  } 
      else{
        // this.revokeinstant();
        this.alreadyassign=false;
        this.assign=false;
        this.connected=false;
       
     

      }
    }, 
    (error)=>{
        console.log(error);
    });
}
assingtodept(){
  var dept = $('#dept_assign').val();
  // this.dept=$('#dept_assign').val();
// alert(dept);
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"updateNumWithDeptToInst","whatsapp_num":"'+this.whatsapp_num+'","department_id":"'+dept+'","instance_id":"'+this.instroute+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      // alert("ths");
      if(response.result.data=='Scanned'){
        iziToast.success({
          message: "Instance Assigned Successfully!",
          position: 'topRight'
      });
      this.assign=true;
      this.alreadyassign=true;
      this.route(this.instroute,this.instroutename,this.insturl,dept,this.assigneddept);

      this.admininsts();
      this.route(this.instroute,this.instroutename,this.insturl,dept,this.assigneddept);
      $('#scan_qr_again').modal('hide');
     

      } else if(response.result.data=='mismatch') {
        // $('#scan_qr').model('show');
        $('#scan_qr_again').modal('show');

        iziToast.error({
          message: "Please Enter Correct WhatsApp number that you scanned the QR in previous step",
          position: 'topRight'
      });

      } else {
        iziToast.error({
          message: "Some Error Occured, Please Scan Again",
          position: 'topRight'
      });
    

      }
    }, 
    (error)=>{
        console.log(error);
    });
}


reloadQR(){
  $('#show_qr').modal('hide');
  this.closeall=true;

  Swal.fire({
    title:'Are you sure?',
    text:'Restarting the instance will Delete Data and must be scan again. You may Reload Once for better Performance',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, Reload it!'
  }).then((result) => {
    if (result.value) {
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
  
      let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"reloadInstance","instance_id":"'+this.instroute+'"}}';
    
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status==true){
         this.realoded=true;
        // location.reload();
 setTimeout(function() { this.realoded=false;}, 3000);
//  setTimeout(() => this.scan(), 5000);
 setTimeout(() => this.closeLoading(), 6000);
        } 
      }, 
      (error)=>{
        this.closeLoading();
        iziToast.warning({
        message: 'Sorry, Some error occured',
          possition:'topRight'
        });
          console.log(error);
      });
    }
  })
  }
  closeLoading(){
    Swal.close();
  }
  
  submitscan(){



    let access_token: any=localStorage.getItem('access_token');

    let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"readInstance","instance_id":"'+this.instroute+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status == true){
       
   if(response.result.data == 'CONNECTED'){ 
          $('#show_qr').modal('hide');
          this.assign=true;
     clearInterval(this.interval);

   } else {
    clearInterval(this.interval);

    iziToast.error({
      message: "Some Error Occured, Please Scan Again",
      position: 'topRight'
  });
   }
  }
  },  (error)=>{
    iziToast.error({
      message: "Some Error Occured, Please Scan Again",
      position: 'topRight'
  });
    console.log(error);
});
}

  revokeinstant(){

    // Swal.fire({
    //   title: 'Are you sure?',
    //    text:'Disconnect Instance will disable it for a few minutes. You should wait atleast 5 minutes',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#3085d6',
    //   confirmButtonText: 'DISCONNECT'
    // }).then((result) => {
    //   if (result.value) {
   
    let access_token: any=localStorage.getItem('access_token');
  
      let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"revokeInstance","instance_id":"'+this.instroute+'"}}';
    
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status==true){

         this.route(this.instroute,this.instroutename,this.insturl,this.deparment,this.assigneddept);
         this.alreadyassign=false;
         this.assign=false;
         this.connected=false;
          //alert(this.deparment);

        //  this.admininsts();
        } 
      }, 
      (error)=>{
          console.log(error);
      });
  //   } 
  // })
  }
 

  disconnectinstant(){
    // $('#disconnect').model('show');
  $('#disconnect').modal('show');

  }


  disonnectrevoke(){

    // Swal.fire({
    //   title: 'Are you sure?',
    //    text:'Disconnect Instance will disable it for a few minutes. You should wait atleast 5 minutes',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#3085d6',
    //   confirmButtonText: 'DISCONNECT'
    // }).then((result) => {
    //   if (result.value) {
   
    let access_token: any=localStorage.getItem('access_token');
  
      let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"revokeInstance","instance_id":"'+this.instroute+'"}}';
    
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.status==true){

        //  this.route(this.instroute,this.instroutename,this.insturl,this.deparment,this.assigneddept);
         this.alreadyassign=false;
         this.assign=false;
         this.connected=false;
          //alert(this.deparment);

        //  this.admininsts();
        } 
      }, 
      (error)=>{
          console.log(error);
      });
  //   } 
  // })
  }

  get_miss_wp_number(){
    this.disonnectrevoke();
   var dept = $('#dept_assign').val();
  var whatsapp_num = $('#miss_wp_number').val();

  let agent_req:any = this.getWp.value;
  this.whatsapp_num= whatsapp_num;
 
  console.log(this.whatsapp_num);
    
     if(this.whatsapp_num !=""){
      // $('#scan_qr_again').modal('hide');
                this.assign=true;
                 this.assingtodept();

              }
      else {
                iziToast.warning({
                    message: "Enter WhatsApp number",
                    position: 'topRight'
       });
            
        }
      }

assigndeptagain(){
  // alert(this.instroute);
  // alert(this.whatsapp_num);
  $('#assginagain').modal('show');
      //  $('#assginagain').model('show');
 }


      assigndeptduplicate(){
        var dept = $('#dept_assign_again').val();
        // this.dept=$('#dept_assign').val();
          // alert(this.instroute);
if(this.whatsapp_num == ''||this.whatsapp_num == undefined ){
  iziToast.warning({
    message: "Your WhatsApp not registerd.Please logout and login again",
    position: 'topRight'
    
  });
  return false;
}
      
        let access_token: any=localStorage.getItem('access_token');
      
        let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"updateNumWithDeptToInst","whatsapp_num":"'+this.whatsapp_num+'","department_id":"'+dept+'","instance_id":"'+this.instroute+'"}}';
        
          this.serverService.sendServer(api_req).subscribe((response:any) => {
            // alert("ths");
            if(response.result.status==true){
location.reload();
            }else {
              iziToast.error({
                message: "Some Error Occured, Please Scan Again",
                position: 'topRight'
            });
          
      
            }
          }, 
          (error)=>{
              console.log(error);
          });
      }




      validateQRduplicate(){
        // this.assign=true;
      // alert("called");
        let access_token: any=localStorage.getItem('access_token');
      
          let api_req:any = '{"operation":"wp_instance", "moduleType": "wp_instance", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"readInstance","instance_id":"'+this.instroute+'"}}';
        
          this.serverService.sendServer(api_req).subscribe((response:any) => {
            if(response.result.status == true){
          //  clearInterval(this.interval);
        // $('#checkreadinst').click();
             
         if(response.result.data == 'CONNECTED'){
        $('#checkreadinst').click();
        clearTimeout(this.interval);

                //  this.connected=true;
         }
        else if(response.result.data == "CONFLICT"){
        // $('#checkreadinst').click();
        clearTimeout(this.interval);
        setTimeout(() => { this.get_wp_number(); }, 5000); //5s
        // NEW change settimeout 27-10-2020
        clearTimeout(this.settimeout);
          //   iziToast.warning({
          //     message: "Your Instance was Conflicted. Please Reload It.",
          //     position: 'topRight'
          // });
         }
         
         else{
          // alert('else')
       // clearTimeout(this.interval);

          setTimeout(() => { this.get_wp_number();clearTimeout(this.interval); }, 5000); //5s
          clearTimeout(this.settimeout);
         }
        } 
            else{
              iziToast.warning({
                message: "Please Reload Instance and Try again.",
                position: 'topRight'
            });
            }
          }, 
          (error)=>{
              console.log(error);
          });
      }
     
      closeAll(){
        this.closeall=true;
        clearInterval(this.interval);
        // clearInterval(this.interval);
        // return false;
      }
      // closemodel(){
       
      // }
}
