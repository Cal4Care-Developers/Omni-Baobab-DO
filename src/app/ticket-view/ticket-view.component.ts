import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent implements OnInit {
  ticket_id;
  respon_list;
  departments;
  uadmin_id;
  main_list;
  replay_list;
  tic_details;
  ticket_status;
  ticket_closed_by;
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute) { }

  ngOnInit() {
    this.uadmin_id = localStorage.getItem('userId');
    this.ticket_id = this.route.snapshot.queryParamMap.get('ticket_id');
    this.viewMaTicket(this.ticket_id);
    this.getDepartments();
  }

viewMaTicket(ticket){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"view_tickets","ticket_id":"'+ticket+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){

      this.main_list = response.result.data['main_data'];
      this.replay_list = response.result.data['replies'];
      this.tic_details = response.result.data['tic_details'];
      this.ticket_status = this.tic_details['ticket_status'];

      this.ticket_closed_by = this.tic_details.closed
    } 
  }, 
  (error)=>{
      console.log(error);
  });
}

genTicket(ticket_id){ 
  this.ticket_id = ticket_id; 
    $('#assign_ticket').modal('show');
}

assignTicket(ticket_id){  

  let assigned_department_id: any= $('#departments').val();
  console.log(assigned_department_id);
if(assigned_department_id == '0'){
  iziToast.warning({
    message: "Please select department",
    position: 'topRight'
});
return false;
}

    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"re_assign_ticket","user_id":"'+this.uadmin_id+'","department_id":"'+assigned_department_id+'","ticket_id":"'+ticket_id+'"}}';
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == 1) {
                iziToast.success({
                    message: "Ticket Assigned Successfully",
                    position: 'topRight'
                });
                this.viewMaTicket(this.ticket_id);
                $('#assign_ticket').modal('hide');
            } else {
            
                iziToast.warning({
                    message: "Ticket Not Assigned. Please try again",
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


rplyTicket(ticket_id){ 
  this.ticket_id = ticket_id; 
    $('#reply_ticket').modal('show');
}






ReplyTicket(ticket_id){  

  let reply_msg: any= $('#reply_editor').val();

if(reply_msg == ''){
  iziToast.warning({
    message: "Please Enter the message",
    position: 'topRight'
});
return false;
}

    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type":"web", "access_token":"'+access_token+'", "element_data":{"action":"replay_ticket","user_id":"'+this.uadmin_id+'","ticket_id":"'+ticket_id+'","message":"'+reply_msg+'"}}';
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == 1) {
                iziToast.success({
                    message: "Replied Successfully",
                    position: 'topRight'
                });
                this.viewMaTicket(this.ticket_id);
                $('#reply_ticket').modal('hide');
            } else {
            
                iziToast.warning({
                    message: "Ticket Not Replied. Please try again",
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



closeTicket(ticket_id){

  if(window.confirm("Are you sure to close this ticket?")) {
    console.log("Implement delete functionality here");
  } else {
    console.log("Implement delete ");
    return false;
  }

  let access_token: any=localStorage.getItem('access_token');

  let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"close_my_ticket","user_id":"'+this.uadmin_id+'","ticket_id":"'+ticket_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
      iziToast.success({
        message: "Ticket closed Successfully",
        position: 'topRight'
    });
    this.viewMaTicket(this.ticket_id);
    } else {
    }
  }, 
  (error)=>{
      console.log(error);
  });
}


}
