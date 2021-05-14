import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-unassigned-tickets',
  templateUrl: './unassigned-tickets.component.html',
  styleUrls: ['./unassigned-tickets.component.css']
})
export class UnassignedTicketsComponent implements OnInit {
  constructor(private serverService: ServerService, private router:Router) { }
  queue_list;
  priority;
  priority_active;
  department_active;
  department;
  status_active;
  status;
  access_token
  admin_id;
  user_id
  ngOnInit() {
	this.admin_id = localStorage.getItem('admin_id');
	this.user_id = localStorage.getItem('userId');
    $(document).ready(function(){
     $(".dropdown-title").click(function(){
       $(".pulldown ").toggleClass("active");
     });
     $(".pulldown a").click(function(){
       alert($(this).text());
     })
    });
    this.access_token =localStorage.getItem('access_token');
  this.my_externaltickets();
  }
  
  my_externaltickets(){
  
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"list_notAssigned_tickets","admin_id":"'+this.admin_id+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
      this.queue_list = response.result.data;
      console.log(this.priority);
      } 
    }, 
    (error)=>{
      console.log(error);
    });
    }
  
  
  
    viewMyTicket(ticket_id){
      
      this.router.navigate(['/ticket-view-thread'], { queryParams: { ticket_id: ticket_id } });
  
    }
  
    changeMyPriority(ticket_id, priority){
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"onchange_priority","priority_id":"'+priority+'","ticket_id":"'+ticket_id+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
      this.my_externaltickets();
      console.log(this.priority);
      } 
    }, 
    (error)=>{
      console.log(error);
    });
  
    }
  
    changeMyDepartment(ticket_id, department){
  
    console.log(ticket_id +' '+department)
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"onchange_department","department_id":"'+department+'","ticket_id":"'+ticket_id+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
      this.my_externaltickets();
      console.log(this.priority);
      } 
    }, 
    (error)=>{
      console.log(error);
    });
  
    }
    changeMyStatus(ticket_id, status){
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"onchange_status","status_id":"'+status+'","ticket_id":"'+ticket_id+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
      this.my_externaltickets();
      console.log(this.priority);
      } 
    }, 
    (error)=>{
      console.log(error);
    });
  
    }
  
  }
  