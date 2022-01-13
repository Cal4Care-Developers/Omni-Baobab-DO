import { Component, OnInit, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  call_history_list;
	recordNotFound = false;
	pageLimit = 20;
	paginationData: any = { "info": "hide" };
	offset_count = 0;
  contact_id;
  addnotes: FormGroup;
  oldNotes;
  uadmin_id;
  users;
  departments;
  note_id;
  call_note;
  auxcode_name;
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute) { 
    this.contact_id = this.route.snapshot.queryParamMap.get('contact_id');
   // this.call_note = this.route.snapshot.queryParamMap.get('call_note');
   // this.auxcode_name= this.route.snapshot.queryParamMap.get('auxcode_name');

  }

  ngOnInit() {
    this.uadmin_id = localStorage.getItem('userId');
 this.get_activity(this.contact_id);
  this.addnotes= new FormGroup({
    'modified_by' :new FormControl(null)
  });
  //this.callHistoryList({});
  this.getDepartments();
  }
  get_activity(contact_id){
    let conct_req:any = new Object();
    let api_req:any = new Object();
    conct_req.user_id=localStorage.getItem('userId');
    conct_req.action="get_activity";
    conct_req.contact_id=contact_id;
    //conct_req.auxcode_name= auxcode_name;
    //conct_req.call_note=this.call_note;
    //alert(this.call_note)
    api_req.operation="contact";
    api_req.moduleType="contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = conct_req;
  
      this.serverService.sendServer(api_req).subscribe((response:any) => {
  
        if(response.result.status==true){
          this.oldNotes=response.result.data;
          console.log(this.oldNotes)
          //alert( this.oldNotes)
        }
    }, 
    (error)=>{
        console.log(error);
    });
  }
  // getNotes(contact_id){
  //   let conct_req:any = new Object();
  //   let api_req:any = new Object();
  //   conct_req.user_id=localStorage.getItem('userId');
  //   conct_req.action="get_contact_notes";
  //   conct_req.contact_id=contact_id;
  //   api_req.operation="contact";
  //   api_req.moduleType="contact";
  //   api_req.api_type="web";
  //   api_req.access_token=localStorage.getItem('access_token');
  //   api_req.element_data = conct_req;
  
  //     this.serverService.sendServer(api_req).subscribe((response:any) => {

  //       if(response.result.status==true){
  //         this.oldNotes=response.result.data;
  //       }
  //   }, 
  //   (error)=>{
  //       console.log(error);
  //   });
  // }

bcktoContc(contact_id){
      console.log(contact_id);
      var b_phone_num = btoa(b_phone_num); // Base64 encode the String
  var conct_num =btoa(contact_id);
      let conct_req:any = new Object();
      let api_req:any = new Object();
      conct_req.user_id=localStorage.getItem('userId');
      conct_req.action="get_contact_by_id";
      conct_req.contact_id=contact_id;
      api_req.operation="contact";
      api_req.moduleType="contact";
      api_req.api_type="web";
      api_req.access_token=localStorage.getItem('access_token');
      api_req.element_data = conct_req;
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.result.status==true){
         // var decodedString = btoa(response.result.data[0].phone );
          var cont_id = btoa(this.contact_id );
          this.router.navigate(['/edit-contacts'], { queryParams: { phone: b_phone_num,cont_id:cont_id,ids:conct_num,calltype:'outgoing'} });
         // this.router.navigate(['/edit-contacts'], { queryParams: { phone:  decodedString,cont_id:cont_id} });
        }
      }, 
      (error)=>{
          console.log(error);
      });
}


genTicket(note_id){ 
  this.note_id = note_id; 
    $('#assign_ticket').modal('show');
}


getDepartments(){
  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_dept_settings","user_id":"'+this.uadmin_id+'"}}';

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

getDeptUsers(){
  let access_token: any=localStorage.getItem('access_token');
  let department_id: any= $('#departments').val();
  let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"get_agents_by_department","dept_id":"'+department_id+'","admin_id":"'+this.uadmin_id+'"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    if (response.result.status == true) {
          this.users = response.result.data;
    } else {
          iziToast.warning({
              message: "Please try again",
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


assignTicket(note_id){  

  let assigned_department_id: any= $('#departments').val();
  let res_departments: any= $('#res_departments').val();
  let activity: any= $('#activity').val();
 
if(assigned_department_id == '0'){
  iziToast.warning({
    message: "Please select department",
    position: 'topRight'
});
return false;
}
if(res_departments == '0'){
  iziToast.warning({
    message: "Please select responsible department",
    position: 'topRight'
});
return false;
}
if(activity == '0'){
  iziToast.warning({
    message: "Please select activity",
    position: 'topRight'
});
return false;
}


    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"generate_ticket","user_id":"'+this.uadmin_id+'","department_id":"'+assigned_department_id+'","activity":"'+activity+'","res_departments":"'+res_departments+'","note_id":"'+note_id+'"}}';
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == 1) {
                iziToast.success({
                    message: "Ticket Generated Successfully",
                    position: 'topRight'
                });
                $('#assign_ticket').modal('hide');
                this.get_activity(this.contact_id );
            } else {
            
                iziToast.warning({
                    message: "Ticket Not Generated. Please try again",
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
listDataInfo(list_data) {

  list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
  list_data.order_by_name = list_data.order_by_name == undefined ? "history.callid" : list_data.order_by_name;
  list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
  list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
  list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
  return list_data;
}
callHistoryList(data) {
  var new_user_id;
  var admin_permission = localStorage.getItem('admin_permision');
  if (admin_permission == '1') {
    new_user_id = localStorage.getItem('admin_id');
  } else {
    new_user_id = localStorage.getItem('userId');
  }

  var list_data = this.listDataInfo(data);
  let api_req: any = new Object();
  let history_req: any = new Object();
  history_req.action = "recent_list";
  history_req.search_text = list_data.search_text;
  history_req.order_by_name = list_data.order_by_name;
  history_req.order_by_type = list_data.order_by_type;
  history_req.limit = list_data.limit;
  history_req.offset = list_data.offset;
  history_req.user_id = new_user_id;
  api_req.operation = "call";
  api_req.moduleType = "call";
  api_req.api_type = "web";
  api_req.access_token = localStorage.getItem('access_token');
  api_req.element_data = history_req;
  this.serverService.sendServer(api_req).subscribe((response: any) => {

    if (response.result.status == 1) {

      this.call_history_list = response.result.data.list_data;
      this.offset_count = list_data.offset;
      this.paginationData = this.serverService.pagination({ 'offset': response.result.data.list_info.offset, 'total': response.result.data.list_info.total, 'page_limit': this.pageLimit });
      this.recordNotFound = this.call_history_list.length == 0 ? true : false;
    }

  },
    (error) => {
      console.log(error);
    });

}
// get_activity(contact_id){
//   let conct_req:any = new Object();
//   let api_req:any = new Object();
//   conct_req.user_id=localStorage.getItem('userId');
//   conct_req.action="get_activity";
//   conct_req.contact_id=contact_id;
//   api_req.operation="contact";
//   api_req.moduleType="contact";
//   api_req.api_type="web";
//   api_req.access_token=localStorage.getItem('access_token');
//   api_req.element_data = conct_req;

//     this.serverService.sendServer(api_req).subscribe((response:any) => {

//       if(response.result.status==true){
//         this.oldNotes=response.result.data;
//       }
//   }, 
//   (error)=>{
//       console.log(error);
//   });
// }

}


