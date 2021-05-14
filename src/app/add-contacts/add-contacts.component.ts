import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.css']
})
export class AddContactsComponent implements OnInit {
  addContact:  FormGroup;
  departments;
  uadmin_id;
  auxcodes;
  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit() {
    this.addContact = new FormGroup({
      'contact_owner' :new FormControl(null,Validators.required),
      'first_name' :new FormControl(null),
      'last_name' :new FormControl(null),
      'account_name' :new FormControl(null),
      'lead_source' :new FormControl(null),
      'title' :new FormControl(null),
      'email' :new FormControl(null,[
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      'activity' :new FormControl(null),
      'phone' :new FormControl(null,Validators.required),
      'home_phone' :new FormControl(null),
      'office_phone' :new FormControl(null),
      'fax' :new FormControl(null),
      'mobile' :new FormControl(null),
      'dob' :new FormControl(null),
      'assistant' :new FormControl(null),
      'assitant_phone' :new FormControl(null),
      'reports_to' :new FormControl(null),
      'email_opt_out' :new FormControl(0),
      'skype' :new FormControl(null),
      'secondary_email' :new FormControl(null),
      'twitter' :new FormControl(null),
      'reporting_to' :new FormControl(null),
      'mailing_street' :new FormControl(null),
      'other_street' :new FormControl(null),
      'mailing_city' :new FormControl(null),
      'other_city' :new FormControl(null),
      'mailing_province' :new FormControl(null),
      'other_province' :new FormControl(null),
      'mailing_postal_code' :new FormControl(null),
      'other_postal_code' :new FormControl(null),
      'mailing_country' :new FormControl(null),
      'other_country' :new FormControl(null),
      'created_by' :new FormControl(null),
      'notes' :new FormControl(null),
      'modified_by' :new FormControl(null),
      'whatsapp_number' :new FormControl(null),
      'line' :new FormControl(null),
      'facebook_url' :new FormControl(null),
      'wechat' :new FormControl(null),
      'viber' :new FormControl(null),
      'telegram' :new FormControl(null),
      'instagram_url' :new FormControl(null),
      'linkedin' :new FormControl(null),
      'country_code' : new FormControl(null)
     });
     this.uadmin_id = localStorage.getItem('userId');
     this.getDepartments();
     this.getAuxCode();
  }
  getAuxCode(){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_aux_code","admin_id":"'+this.uadmin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        this.auxcodes = response.result.data;
      } else {
      }
    }, 
    (error)=>{
        console.log(error);
    });
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

  addContactown(){
    console.log($('#sal').val());
    console.log(this.addContact.value.first_name);


if(this.addContact.value.contact_owner ==  null || this.addContact.value.contact_owner ==  ''){
  iziToast.warning({
    message: "Please enter valid Contact Owner",
    position: 'topRight'
});
return false;
}
if(this.addContact.value.first_name == null || this.addContact.value.first_name ==''){
  iziToast.warning({
    message: "Please enter valid Full Name",
    position: 'topRight'
});
return false;
}
if(this.addContact.value.email == null || this.addContact.value.email == ''){
  iziToast.warning({
    message: "Please enter valid Email",
    position: 'topRight'
});
return false;
}
if(this.addContact.value.phone == null || this.addContact.value.phone == '' || this.addContact.value.country_code == '' || this.addContact.value.country_code == null){
  iziToast.warning({
    message: "Please enter valid Phone",
    position: 'topRight'
});
return false;
}
if(this.addContact.value.country_code == '' || this.addContact.value.country_code == null){
  iziToast.warning({
    message: "Please enter valid Country Code",
    position: 'topRight'
});
return false;
}
let full_name = $('#sal').val()+' '+this.addContact.value.first_name;
this.addContact.value.first_name = full_name;
    let assigned_department_id: any= $('#departments').val();
    console.log(assigned_department_id);

    let res_department_id: any= $('#res_departments').val();
    console.log(assigned_department_id);


    let auxcodes: any= $('#auxcodes').val();
console.log(auxcodes);
    let api_req:any = new Object();
    let add_contact_req:any = new Object();
    api_req.operation="contact";
    api_req.moduleType="contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = this.addContact.value;
    api_req.element_data.action='add_contact';
    api_req.element_data.department= assigned_department_id;
    api_req.element_data.res_dept=res_department_id;
    api_req.element_data.auxcode_name=auxcodes;
    api_req.element_data.created_by = localStorage.getItem('userId');
    api_req.element_data.user_id = localStorage.getItem('userId');

    console.log(api_req);
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
                this.addContact.reset();
                iziToast.success({
                    message: "Contact Added successfully",
                    position: 'topRight'
                });
                this.router.navigate(['/contacts']);
            }
            else if(response.result.data.in_table = true){
             
              iziToast.warning({
                message: "Contact already added. ",
                position: 'topRight'
            });
            }


        else{
            
                iziToast.warning({
                    message: "Contact not added. Please try again",
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
