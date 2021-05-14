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
  contact_id;
  addnotes: FormGroup;
  oldNotes;
  uadmin_id;
  users;
  departments;
  note_id;
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute) { 
    this.contact_id = this.route.snapshot.queryParamMap.get('contact_id');
  }

  ngOnInit() {
    this.uadmin_id = localStorage.getItem('userId');
  this.getNotes(this.contact_id );
  this.addnotes= new FormGroup({
    'modified_by' :new FormControl(null)
  });
  this.getDepartments();
  }
  getNotes(contact_id){
    let conct_req:any = new Object();
    let api_req:any = new Object();
    conct_req.user_id=localStorage.getItem('userId');
    conct_req.action="get_contact_notes";
    conct_req.contact_id=contact_id;
    api_req.operation="contact";
    api_req.moduleType="contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = conct_req;
  
      this.serverService.sendServer(api_req).subscribe((response:any) => {

        if(response.result.status==true){
          this.oldNotes=response.result.data;
        }
    }, 
    (error)=>{
        console.log(error);
    });
  }

bcktoContc(contact_id){
      console.log(contact_id);
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
          var decodedString = btoa(response.result.data[0].phone );
          this.router.navigate(['/edit-contacts'], { queryParams: { phone:  decodedString} });
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
                this.getNotes(this.contact_id );
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



}
