import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-contact-report',
  templateUrl: './contact-report.component.html',
  styleUrls: ['./contact-report.component.css']
})
export class ContactReportComponent implements OnInit {
  res;
  getRep: FormGroup;
  usersL;
  selected_price : any;
  userData = {"licensce_key": ""};
  public isKeyAvail = false;
  public isItemAvailable = false;
  s_licence_key : any;
  items: any;
  accessToken:any;
  user_id:any;
  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit() {
    this.getRep = new FormGroup({
      'aget_ids' :new FormControl(null),
      'from_date' :new FormControl(null),
      'to_date' :new FormControl(null),
    });
    this.getUsers();
  }
  getUsers(){
    let api_req:any = new Object();
    let agents_req:any = new Object();
    agents_req.action="get_all_my_users";
    agents_req.user_id=localStorage.getItem('userId');
    api_req.operation="contact";
    api_req.moduleType="contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = agents_req;
    console.log(api_req);
        this.serverService.sendServer(api_req).subscribe((response:any) => {
          console.log(response.result.data);
          if(response.result.status==true){
            this.usersL = response.result.data;
          }
        }, 
        (error)=>{
            console.log(error);
        });
  }


  getReports(){
    let phone_num: any= $('#phone_num').val();
    console.log(this.getRep.value);
    var agents = this.getRep.value.aget_ids.join();
    let api_req:any = new Object();
    let agents_req:any = new Object();
    agents_req.action="contact_reports";
    agents_req.user_id=localStorage.getItem('userId');
    agents_req.agents = agents;
    agents_req.fromDate = this.getRep.value.from_date;
    agents_req.toDate = this.getRep.value.to_date;
    agents_req.phone = phone_num;
    api_req.operation="contact";
    api_req.moduleType="contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = agents_req;
    console.log(api_req);
        this.serverService.sendServer(api_req).subscribe((response:any) => {
        console.log(response);

  
          if(response.result.status==true){
          this.res = response;
          var arrStr = encodeURIComponent(JSON.stringify(this.res));
          // document.location.href = 'https://baobabgroup.mconnectapps.com/api/storage/contact/download.php?res='+arrStr;
       
        
          var url = 'https://baobabgroup.mconnectapps.com/api/storage/contact/download.php';
          var form = $('<form action="' + url + '" method="post">' +
            '<input type="text" name="res" value="' + arrStr + '" />' +
            '</form>');
          $('body').append(form);
          form.submit();
        
        } else {
          iziToast.warning({
            message: "No Records Found. Please try again",
            position: 'topRight'
        });
        }
        }, 
    (error)=>{
        console.log(error);
    });
  }








  searchLK(key, phone){
    this.s_licence_key = phone;
    this.isItemAvailable = false;
  }

  initializeItems(val){
    this.accessToken=localStorage.getItem('access_token');
    this.user_id=localStorage.getItem('userId');
    let phone_num: any= $('#phone_num').val();


    let api_req:any = new Object();
    let agents_req:any = new Object();
    agents_req.action="contacts_number_list";
    agents_req.user_id=localStorage.getItem('userId');
    agents_req.phone_num = phone_num;
    api_req.operation="contact";
    api_req.moduleType="contact";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = agents_req;
    console.log(api_req);
        this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){

        this.items = response.result.data;
        this.isItemAvailable = true;
      } else {
        iziToast.warning({
          message: "No Records Found. Please try again",
          position: 'topRight'
      });
      }
    });
    }
  
    getItems(ev: any) {
      const val = ev.target.value;
      this.initializeItems(val);
    if (val && val.trim() != '') {
          this.isItemAvailable = true;
          this.isKeyAvail = false;
          this.items = this.items.filter((item) => {
          return item;
          }
     )}
    }



}
