import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-ticketing-system',
  templateUrl: './ticketing-system.component.html',
  styleUrls: ['./ticketing-system.component.css']
})
export class TicketingSystemComponent implements OnInit {
  user_id;
  recordNotFound= false;
  queue_list;
  user_type;
  show_admin_sett;
  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit() {
    this.user_id = localStorage.getItem('userId');
    this.myTickets();


    this.user_type = localStorage.getItem('user_type');
    if(this.user_type == 'Admin'){
      this.show_admin_sett = true;
    }
  }
  myTickets(){
    let access_token: any=localStorage.getItem('access_token');
    this.user_type = localStorage.getItem('user_type');
    if(this.user_type == 'Super Admin'){
      this.user_type = 1;
    }
    else if(this.user_type == 'Admin'){
      this.user_type = 2;
    }
    else {
      this.user_type = 3;
    }

    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"my_tickets","user_type":"'+this.user_type +'","user_id":"'+this.user_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        this.queue_list = response.result.data;
      } else {
        this.recordNotFound = true;
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }

  viewTicket(ticket_id){
    
    this.router.navigate(['/ticket-view'], { queryParams: { ticket_id: ticket_id } });

  }

  ticketReport(){
    this.router.navigate(['/ticket-report'])
  }
}
