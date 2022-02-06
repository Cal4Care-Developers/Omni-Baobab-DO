import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-campaign-contacts',
  templateUrl: './campaign-contacts.component.html',
  styleUrls: ['./campaign-contacts.component.css']
})
export class CampaignContactsComponent implements OnInit {
  contacts_list;
  recordNotFound = false;
  pageLimit = 20;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  agent_count;
  show_admin_sett = false;
  user_type;
  user_id;
  addConatct;
  campaigns;
  admin_id;
  editData;
  contact_id;
  isRAK=false;
  show_caller_id='1';
  campaign_status;
  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit(): void {
    this.user_type = localStorage.getItem('user_type');
    this.user_id = localStorage.getItem('userId');
    this.admin_id = localStorage.getItem('admin_id');
    this.show_caller_id = localStorage.getItem('show_caller_id');
    if(this.user_type == 'Admin'){
      this.show_admin_sett = true;
      
    }

    if(this.admin_id==564)
      this.isRAK=true;
    else
      this.isRAK=false;
    

    this.addConatct = new FormGroup({
     'customer_name' : new FormControl(null),
     'address' : new FormControl(null),
     'state' : new FormControl(null),
     'city' : new FormControl(null),
     'zipcode' : new FormControl(null),
     'country' : new FormControl(null),
     'phone_number' : new FormControl(null),
     'source_data' : new FormControl(null),
     'notes' : new FormControl(null),
     'status':  new FormControl(null)
    });

    this.editData = new FormGroup({
      'customer_name' : new FormControl(null),
      'address' : new FormControl(null),
      'state' : new FormControl(null),
      'city' : new FormControl(null),
      'zipcode' : new FormControl(null),
      'country' : new FormControl(null),
      'phone_number' : new FormControl(null),
      'source_data' : new FormControl(null),
      'notes' : new FormControl(null),
      'status':  new FormControl(null)
     });
    this.contactsList({});
    this.getCamps();
  }
  contactsList(data){
    var list_data= this.listDataInfo(data);
    let api_req:any = new Object();
    let agents_req:any = new Object();
    agents_req.action="contact_list";
    agents_req.admin_id=localStorage.getItem('admin_id');
    agents_req.user_id=localStorage.getItem('userId');
    agents_req.search_text=list_data.search_text;
    agents_req.order_by_name=list_data.order_by_name;
    agents_req.order_by_type=list_data.order_by_type;
    agents_req.limit=list_data.limit;
    agents_req.offset=list_data.offset;
    api_req.operation="predective_dialer_contact";
    api_req.moduleType="predective_dialer_contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = agents_req;
    this.serverService.sendServer(api_req).subscribe((response:any) => {
    
        if(response.result.status==1){
    
          this.contacts_list=response.result.data.list_data;
            this.offset_count = list_data.offset;
            this.paginationData = this.serverService.pagination({'offset':response.result.data.list_info.offset, 'total':response.result.data.list_info.total, 'page_limit' :this.pageLimit });
            this.recordNotFound = this.contacts_list.length == 0 ? true : false;
        }
        

    }, 
    (error)=>{
        console.log(error);
    });

}

listDataInfo(list_data){

  list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
  list_data.order_by_name = list_data.order_by_name == undefined ? "predective_dialer_contact.id" : list_data.order_by_name;
  list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
  list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
  list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
  return list_data;
}
  addContact(){
    $('#add_pbxform').modal('show');
  }

  uploadCSV(){
      var detail_id = this.user_id+'forpredictiveDialerContacts';
              detail_id = btoa(detail_id); // Base64 encode the String
    this.router.navigate(['../csv-contact-upload'], { queryParams: { for: detail_id} });
  }


 
  deleteContact(contact_id){
    
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
      let access_token: any=localStorage.getItem('access_token');
    
      let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_contact","user_id":"'+this.admin_id+'","contact_id":"'+contact_id+'"}}';
    
      this.serverService.sendServer(api_req).subscribe((response:any) => {

        console.log(response);
        if(response.result.data==true){
          iziToast.success({
            message: "Contact deleted successfully",
            position: 'topRight'
        });
        this.contactsList({});
        } else {
          iziToast.warning({
            message: "Contact not deleted, Please try again!",
            position: 'topRight'
        });
        }
      }, 
      (error)=>{
          console.log(error);
      });
    
  }  
})
}


  getCamps(){
    let access_token: any=localStorage.getItem('access_token');
    let user_is: any=localStorage.getItem('userId');
  
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_campaign","admin_id":"'+this.admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        this.campaigns = response.result.data;
        console.log(this.campaigns);
      } else {
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }

 



  editContact(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_is: any=localStorage.getItem('userId');
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType": "predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_contact","contact_id":"'+id+'","user_id":"'+this.admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {

      if(response.status=='true'){
        this.editData.setValue({
          'customer_name' : response.customer_name,
          'address' : response.address,
          'state' : response.state,
          'city' : response.city,
          'zipcode' : response.zipcode,
          'country' : response.country,
          'phone_number' : response.phone_number,
          'source_data' : response.source_data,
          'notes' : response.notes,
          'status':  response.status,
       });
       this.contact_id = response.id;
       $('#camp_names').val(response.campaign_id).prop('selected', true);
       $('#edt_agent_name').val(response.agent_name)
       $('#edit_adminform').modal('show');
      }   else{
              
        iziToast.warning({
            message: "Data could not retrive. Please try again",
            position: 'topRight'
        });
    
  }
    }, 
    (error)=>{
        console.log(error);
    });
  }











  addConatctData(){
    let camp_name: any= $('#camp_name').val();
    console.log(camp_name);  
    let api_req:any = new Object();
    let add_contact_req:any = new Object();
    api_req.operation="predective_dialer_contact";
    api_req.moduleType="predective_dialer_contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = this.addConatct.value;
    api_req.element_data.action='add_contact';
    api_req.element_data.campaign_id= camp_name;
    if(this.admin_id == 1232)
    api_req.element_data.agent_name= $('#agent_name').val();
    else
    api_req.element_data.agent_name=" ";

    api_req.element_data.user_id = localStorage.getItem('admin_id');
    api_req.element_data.admin_id = localStorage.getItem('admin_id');    
    console.log(api_req);
    this.serverService.sendServer(api_req).subscribe((response: any) => {
    if (response.result.data == 1) {
      $('#add_pbxform').modal('hide');
            iziToast.success({
                message: "Contact Added successfully",
                position: 'topRight'
            });
            this.contactsList({});
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




updateData(contact_id){
  let camp_name: any= $('#camp_names').val();
  console.log(camp_name);  
  let api_req:any = new Object();
  let add_contact_req:any = new Object();
  api_req.operation="predective_dialer_contact";
  api_req.moduleType="predective_dialer_contact";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  api_req.element_data = this.editData.value;
  api_req.element_data.action='update_contact';
  api_req.element_data.campaign_id= camp_name;
    if(this.admin_id == 1232)
    api_req.element_data.agent_name= $('#edt_agent_name').val();
    else
    api_req.element_data.agent_name=" ";
  api_req.element_data.contact_id= contact_id;
  api_req.element_data.user_id = localStorage.getItem('admin_id');
  api_req.element_data.admin_id = localStorage.getItem('admin_id');    
  console.log(api_req);
  this.serverService.sendServer(api_req).subscribe((response: any) => {
  if (response.result.data == 1) {
    $('#add_pbxform').modal('hide');
          iziToast.success({
              message: "Contact updated successfully",
              position: 'topRight'
          });
          $('#edit_adminform').modal('hide');
          this.contactsList({});
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

slectAll(){
  // alert("sjd");
  if($("#selectAllQ").prop("checked")) {
    // this.isSelected= true;
    $(".invalidContacts").prop("checked", true);
} else {
  // this.isSelected= false;

    $(".invalidContacts").prop("checked", false);
} 
}
slectunique(){
	$("#selectAllQ").prop("checked",false)
  }
deleteAllContact(){
  

  var i = 0;
  var invalidContacts = [];
  $('.invalidContacts:checked').each(function () {
    invalidContacts[i++] = $(this).val();
  }); 
console.log(invalidContacts.length);
if(invalidContacts.length==0){
  iziToast.warning({
    message: "Please Choose atleast 1 Contact",
    position: 'topRight'
});
return false;
}

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
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_contact","user_id":"'+this.admin_id+'","contact_id":"'+invalidContacts+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {

      console.log(response);
      if(response.result.data==true){
        iziToast.success({
          message: "Contact deleted successfully",
          position: 'topRight'
      });
      this.contactsList({});
      } else {
        iziToast.warning({
          message: "Contact not deleted, Please try again!",
          position: 'topRight'
      });
      }
    }, 
    (error)=>{
        console.log(error);
    });
  
}  
})
}



decode(content){
  // console.log(atob(content))
  return atob(content);
}
clictToCall(to,campaign_id){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"campaign", "moduleType": "campaign", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_camp_status","id":"'+campaign_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if( response.result.data.camp_status=='1'){
      this.campaign_status= response.result.data.camp_status;
    
        // if(to == 'phone'){  this.to_num = $('#phone').val(); } else {  this.to_num = $('#mobile').val(); }
       
        if(to == ''){
             iziToast.warning({
               message: "No Number To Call",
               position: 'topRight'
             });
         } else {       
           let access_token: any=localStorage.getItem('access_token');
         
           var extention = localStorage.getItem('ext_int_status');
           if(extention == '2'){
            let api_reqs:any = '{"type": "makecall", "number": "'+to+'","show_caller_id":"'+this.show_caller_id+'"}';
            this.serverService.show.next(api_reqs);
           } else {
            let api_reqs:any = '{"type": "makecallauto", "number": "'+to+'"}';
            this.serverService.show.next(api_reqs);
           }
       
         }
     
    } 
    else{
            
      iziToast.warning({
          message: "Campaign is not active. Please activate",
          position: 'topRight'
      });
  
}
  }, 
  (error)=>{
      console.log(error);
  });
}
}
