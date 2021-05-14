import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import {Renderer2 } from '@angular/core';
declare var $:any;
declare var iziToast:any;
import { PipeTransform, Pipe } from '@angular/core';
import Swal from 'sweetalert2'
@Pipe({
    name: 'callback',
    pure: false
})
@Component({
selector: 'app-ticketing-system-new',
templateUrl: './ticketing-system-new.component.html',
styleUrls: ['./ticketing-system-new.component.css']
})
export class TicketingSystemNewComponent implements OnInit {

constructor(private serverService: ServerService, private router:Router,private rd: Renderer2) { }
queue_list;
queue_list_all;
priority;
priority_active;
department_active;
department;
status_active;
status;
access_token;
user_id;
admin_id;
color = ['#00FFFF','#d4b19d','#aad47b','#6c87f5','#d264e3','#e67ab5','#5d1ce8'];
closed=false;
emptyticket=false;
filter_status='All';
paginationData:any ={"info":"hide"};
pageLimit = 10;
offset_count = 0;
filter_offset = 0;
total_offet;
total_offset_filter;
showmore_button =false;
showmore_filter=false;
user_type;
bulk_tickets;
changeColour(i,someVar){
	this.rd.setStyle(someVar,'background-color',this.color[i]);
   }
ngOnInit() {


	this.admin_id = localStorage.getItem('admin_id');
	this.user_id = localStorage.getItem('userId');
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
// this.getuserlist();
this.changeMylayout('card');
}
filterSomething(filterArgs: any[]) {
	const firstArg = filterArgs[0];
	const secondArg = filterArgs[1];
	
	return firstArg;
  }
my_externaltickets(){

	let api_req:any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"my_externaltickets","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","ticket_status":"'+this.filter_status+'","limit":"'+this.pageLimit+'","offset":"'+this.offset_count+'"}}';
	this.serverService.sendServer(api_req).subscribe((response:any) => {
	  if(response.status=="true"){
		this.queue_list = response.ticket_options;
		this.queue_list_all = response.ticket_options;
		if(this.queue_list==null){
			
			this.emptyticket=true;

		}
		
		this.priority  = response.priority_options;
		this.department = response.department_options;
		this.status = response.status_options;
		this.total_offet =response.total;
		// localStorage.setItem('ticket_status',this.status);
		// localStorage.setItem('priority_options',this.priority);
		// localStorage.setItem('department_options',this.department);
		if(response.status_option=='closed'){
			$("#dropdown-toggle").prop("disabled", true);
			this.closed=true;
		}
		console.log(this.priority);

		if(response.total >= 10){
			// alert(this.queue_list_all.length)
			this.showmore_button=true;

		}
	  } 
	}, 
	(error)=>{
		console.log(error);
	});
  }

  getuserlist(){
	let api_req:any = '{"operation":"agents","moduleType":"agents","api_type":"web","access_token":"'+this.access_token+'","element_data":{"action":"user_list","user_id":"'+this.user_id+'"}}';
	this.serverService.sendServer(api_req).subscribe((response:any) => {
	  if(response.status==true){
		// this.my_externaltickets();
		
	  } 
	}, 
	(error)=>{
		console.log(error);
	});
  }

  viewMyTicket(ticket_id){
	ticket_id = btoa(ticket_id);
    
    this.router.navigate(['/ticket-view-thread'], { queryParams: { ticket_id: ticket_id } });

  }

  changeMyPriority(ticket_id, priority){
	let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"onchange_priority","priority_id":"'+priority+'","ticket_id":"'+ticket_id+'"}}';
	this.serverService.sendServer(api_req).subscribe((response:any) => {
	  if(response.status==true){
		this.my_externaltickets();
		
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
		
	  } 
	}, 
	(error)=>{
		console.log(error);
	});

  }
  changeMyStatus(ticket_id, status){
	let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"onchange_status","status_id":"'+status+'","ticket_id":"'+ticket_id+'","user_id":"'+this.user_id+'"}}';
	this.serverService.sendServer(api_req).subscribe((response:any) => {
	  if(response.status==true){
		this.my_externaltickets();
		
	  } 
	}, 
	(error)=>{
		console.log(error);
	});

  }

  slectAll(){
   if($("#selectAllQ").prop("checked")) {
	  $(".emailtickets").prop("checked", true);
  } else {
	  $(".emailtickets").prop("checked", false);
  } 
  }
slectunique(){
	$("#selectAllQ").prop("checked",false);

  }
 
  assignbutton(){
	if($(".emailtickets").prop("checked"))
	{
		this.router.navigate(['/assign-tickets']);
		//alert('selected');
	}
	else{
		iziToast.warning({
			message:"Select at least one Ticket",
			position:"topRight"
		});
		

	}
  }

  changeMylayout(theme){
	  if(theme=='table'){
		  $('#table_view').show();
		  $('#card-ticket-view').hide();
		  $(".emailtickets").prop("checked", false);
	  }
	  else{
		$('#table_view').hide();
		$('#card-ticket-view').show();
		$(".emailtickets").prop("checked", false);
	  }

  }
 
   searchdept() {

    var search_txt = $('#deptsearch').val().toLowerCase();
	// alert(search_txt);

    $("#dept-list .dropdown-item").filter(function () {

        $(this).toggle($(this).text().toLowerCase().indexOf(search_txt.toLowerCase()) !== -1);
    });

}


callFunction(tic){
	$('#ticket_'+tic).unbind('click');
}
SelectFilter(value){
	this.emptyticket=false;
	
	if(value=="All")
	{
		this.queue_list = this.queue_list_all;

	}
	else{
		this.queue_list = this.queue_list_all.filter(
			book => book.ticket_status === value);
			if(this.queue_list =='')
			 this.emptyticket=true;
			 
	}
	       	 
}
showmore(){
	// $("html, body").animate({ scrollTop: $(document).height() }, "slow");
	// $('.ticketing-system-panel').scrollTop($('.ticketing-system-panel')[0].scrollHeight);

	this.showmore_button=true;
	this.offset_count= this.offset_count+10;
	// alert(this.offset_count);
	// this.offset_count = this.offset_count -this.total_offet;
	var offset=this.offset_count;
	if(this.total_offet>=offset+10)
	{
	if(this.offset_count >= this.total_offet){
		this.offset_count = this.total_offet;
	   this.showmore_button=false;
   }
}else{
	// alert('dasds');
	this.showmore_button=false;
}
	let api_req:any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"my_externaltickets","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","ticket_status":"'+this.filter_status+'","limit":"'+this.pageLimit+'","offset":"'+this.offset_count+'"}}';
	this.serverService.sendServer(api_req).subscribe((response:any) => {
	  if(response.status=="true"){
		// this.queue_list = response.ticket_options;
		// this.queue_list_all = response.ticket_options;
		var mydatas= [];
		mydatas = response.ticket_options;              
// alert(mydatas.length);		
// this.queue_list = this.queue_list_all.push(mydatas); 
		for (let index = 0; index < mydatas.length; index++) { 
		  var data = mydatas[index];	
		  this.queue_list.push(data); 
		 }
		
	  } 
	}, 
	(error)=>{
		console.log(error);
	});
}

filterByStatus(id){
	this.emptyticket=false;
	this.filter_status=id;
	this.offset_count=0;
	this.filter_offset=0;
	this.showmore_button=false;
	if(id=='All'){	  
		 this.my_externaltickets();
		return false;
	}

// 	if(this.filter_offset >= this.total_offet){
// 		this.filter_offset = this.total_offet;
// 	   this.showmore_filter=false;
// 	//   return false;
//    }

	let api_req:any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"my_externaltickets","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","ticket_status":"'+this.filter_status+'","limit":"'+this.pageLimit+'","offset":"'+this.filter_offset+'"}}';
	this.serverService.sendServer(api_req).subscribe((response:any) => {
	  if(response.status=="true"){
		this.queue_list = response.ticket_options;
		this.total_offset_filter=response.total;
	//this.filter_status='All';
	if(this.total_offset_filter >= 10){
		// alert(this.queue_list_all.length)
		this.showmore_filter=true;

	}
	if(this.queue_list ==null)
	this.emptyticket=true;

	  } 
	}, 
	(error)=>{
		console.log(error);
	});
}

showmoreFilter(){
		this.showmore_filter=true;
		this.filter_offset= this.filter_offset+10;
		// alert(this.offset_count);
		// this.offset_count = this.offset_count -this.total_offet;
		var offset=this.filter_offset;
		if(this.total_offset_filter>=offset+10)
		{
		if(this.filter_offset >= this.total_offset_filter){
			this.filter_offset = this.total_offset_filter;
		   this.showmore_filter=false;
	   }
	}else{
		// alert('filter');
		this.showmore_filter=false;
	}
		let api_req:any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"my_externaltickets","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","ticket_status":"'+this.filter_status+'","limit":"'+this.pageLimit+'","offset":"'+this.filter_offset+'"}}';
		this.serverService.sendServer(api_req).subscribe((response:any) => {
		  if(response.status=="true"){
			// this.queue_list = response.ticket_options;
			// this.queue_list_all = response.ticket_options;
			var mydatas= [];
			mydatas = response.ticket_options;              
	// alert(mydatas.length);		
	// this.queue_list = this.queue_list_all.push(mydatas); 
			for (let index = 0; index < mydatas.length; index++) { 
			  var data = mydatas[index];	
			  this.queue_list.push(data); 
			 }
			
		  } 
		}, 
		(error)=>{
			console.log(error);
		});
	
}
BulkAssign(val){
	var queues = $('.emailtickets:checked').map(function(){
        return this.value;
    }).get();


// alert(queues);
    if(queues ==''|| queues=='0' ){
        iziToast.warning({
            message: "Please Select atleast one Ticket",
            position: 'topRight'
        }); 
        return false;
    }
	this.bulk_tickets=queues;
	if(val == '' || val == undefined)
	val = "";
var options = {}; 
$.map(this.department,function(o){
	options[o.department_id]=o.department_name;
});
// console.log(options);
const trans =   Swal.fire({
title: 'Assign to Department',
input: 'select',
inputOptions:options,
inputPlaceholder: 'Select Department',
confirmButtonText: 'Assign',
showCancelButton: true,
inputValue: val,
}).then(function (inputValue) {
if (inputValue.value != "" && inputValue.value != null) {
	
	  $('#BAssignTickets').val(inputValue.value);
	  $('#BAssignTickets').click();       

			 }else{
			  // iziToast.error({
			  //   message: "You have not selected any schedule",
			  //   position: 'topRight'
			  //   });
			 }
 });
}
BAssignTickets(){
	var department=$('#BAssignTickets').val();
    let access_token: any=localStorage.getItem('access_token');

	// alert(this.bulk_tickets);
	let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"external_ticket_bulk_assign","ticket_id":"'+this.bulk_tickets+'","department":"'+department+'","agent_id":" ","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status == true){
        this.bulk_tickets='';
        iziToast.success({
            message: "Assigned Successfully",
            position: 'topRight'
        });
        this.my_externaltickets();
      } else {
        iziToast.error({
            message: "Sorry some error occured.Please Contact Admin",
            position: 'topRight'
        });
       
      }
    }, 
    (error)=>{
        console.log(error);
    });
}
}
