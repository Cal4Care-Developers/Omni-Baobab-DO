import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.css']
})
export class DndComponent implements OnInit {
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
  param1;
  page_for;
  pass_string;
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute,) { 
    this.param1 = this.route.snapshot.queryParamMap.get('page');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    var decodedString = atob(this.param1 );
    this.param1 = decodedString;
  }
 
  ngOnInit(): void {
    this.user_type = localStorage.getItem('user_type');
    this.user_id = localStorage.getItem('userId');
    this.admin_id = localStorage.getItem('admin_id');
    if(this.user_type == 'Admin'){
      this.show_admin_sett = true;
    }

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
  }
  contactsList(data){
    if(this.param1 == "predic_FAX_VM"){
      this.page_for ='Fax & VM';
      this.pass_string ='fax&vm';
    }else if(this.param1 == "predic_DND"){
      this.page_for ='DND';
      this.pass_string ='dnd';
    }else if(this.param1 == "predic_Call_Back"){
      this.page_for ='Call Back';
      this.pass_string ='call-back';
    }else if(this.param1 == "predic_No_Answer"){
      this.page_for ='No Answer';
      this.pass_string ='unanswered';
    }else if(this.param1 == "predic_Interested"){
      this.page_for ='Interested';
      this.pass_string ='interested';
    }else if(this.param1 == "predic_answered"){
      this.page_for ='Answered';
      this.pass_string ='answered';
    }
    
    var list_data= this.listDataInfo(data);
    let api_req:any = new Object();
    let agents_req:any = new Object();
    agents_req.action="dnd_list";
    agents_req.admin_id=localStorage.getItem('admin_id');
    agents_req.user_id=localStorage.getItem('userId');
    agents_req.search_text=list_data.search_text;
    agents_req.order_by_name=list_data.order_by_name;
    agents_req.order_by_type=list_data.order_by_type;
    agents_req.limit=list_data.limit;
    agents_req.offset=list_data.offset;
    agents_req.stat=this.pass_string;
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
    this.router.navigate(['../csv-contact-upload']);
  }








 









resetContact(){
  let access_token: any=localStorage.getItem('access_token');
  var i = 0;
  var invalidContacts = [];
  $('.invalidContacts:checked').each(function () {
    invalidContacts[i++] = $(this).val();
  }); 
  if(invalidContacts.length==0){
    iziToast.warning({
      message: "Please Choose atleast 1 Contact",
      position: 'topRight'
  });
  return false;
  }

  let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"dnd_update","id":"'+invalidContacts+'","user_id":"'+this.user_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      iziToast.success({
        message: "Updated successfully",
        position: 'topRight'
    });
    this.contactsList({});
    } else {
     
    }
  }, 
  (error)=>{
      console.log(error);
  });
}




slectAll(){
 
  if($("#selectAllQ").prop("checked")) {
    $(".invalidContacts").prop("checked", true);
} else {
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
  
    let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_contact","user_id":"'+this.user_id+'","contact_id":"'+invalidContacts+'"}}';
  
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
}
