import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';

import { Renderer2 } from '@angular/core';
declare var $: any;
declare var iziToast: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-emails-unassigned',
  templateUrl: './emails-unassigned.component.html',
  styleUrls: ['./emails-unassigned.component.css']
})
export class EmailsUnassignedComponent implements OnInit {
  @ViewChild('agent_search') inputName;
 

  constructor(private serverService: ServerService, private router: Router, private rd: Renderer2) {
    this.serverService.changeDetectionEmitter.subscribe(
      ($event) => {
        // alert('asas');
        let mData = JSON.parse($event);
        var pagefor = mData.pagefor;
        var pageid = mData.id;

        if (pagefor == 'email_ticketing') {
          this.my_externaltickets_notify();
        }
      },
      (err) => {
      }
    );
  }
  has_robin = 0;
  queue_list;
  queue_list_all;
  priority;
  priority_active;
  department_active;
  department;
  status_active;
  status;
  filterlist_status;
  access_token;
  user_id;
  agents_list;
  admin_type;
  admin_id;
  color = ['#00FFFF', '#d4b19d', '#aad47b', '#6c87f5', '#d264e3', '#e67ab5', '#5d1ce8'];
  closed = false;
  emptyticket = false;
  showtickets = false;
  filter_status = 'All';
  filter_depart = 'All';
  filter_agents = 'All';
  paginationData: any = { "info": "hide" };
  pageLimit: number = 10;
  offset_count: number = 0;
  filter_offset = 0;
  total_offet;
  total_offset_filter;
  showmore_button = false;
  showmore_filter = false;
  user_type;
  bulk_tickets;
  select_status = "Select Status";
  select_depart = "Select Department";
  select_agent = "Select Agent";
  view_name = 'Table View';
  status_all;
  global_search = false;
  search_ticket = false;
  searched_value;
  admin_permission;
  delete_tickets;
  isDisabled: boolean;
  round_robin;
  RowfilterON = false;
  agent_delete_permission;
  showDelete = false;
  changeColour(i, someVar) {
    this.rd.setStyle(someVar, 'background-color', this.color[i]);
  }
   

  ngOnInit(): void {
    this.admin_id = localStorage.getItem('admin_id');
    this.user_id = localStorage.getItem('userId');
    this.user_type = localStorage.getItem('user_type');
    // this.admin_type = localStorage.getItem('user_type');
    this.admin_permission = localStorage.getItem('admin_permision');
    this.round_robin = localStorage.getItem('round_robin');
    this.agent_delete_permission = localStorage.getItem('agent_delete_permission');
    if (this.user_type == 'Admin' || this.admin_permission == '1' || this.agent_delete_permission == '1') {
      this.showDelete = true;
    }

    if (this.user_type == 'Super Admin') {
      this.user_type = 1;
    }
    else if (this.user_type == 'Admin' || this.admin_permission == '1') {
      this.user_type = 2;
      this.admin_type = 'Admin';
    }
    else {
      this.user_type = 3;
      this.admin_type = '';

    }


    if (this.admin_permission == '1')
      this.user_id = localStorage.getItem('admin_id');


    $(document).ready(function () {
      $(".dropdown-title").click(function () {
        $(".pulldown ").toggleClass("active");
      });
      $(".pulldown a").click(function () {
        alert($(this).text());
      })
    });
    this.access_token = localStorage.getItem('access_token');
    this.my_externaltickets();
    this.user_lists();
     this.getuserlist();
    this.changeMylayout('table');
  }


  searchTickets(data) {
    console.log(data);
    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"searchTicketID","user_type":"3","admin_id":"1203","user_id":"1250","is_spam":"0","ticket_search":"507","limit":"10","offset":"0"}}


    let search_value = data.search_text;
    this.searched_value = data.search_text;
    //  RESETING all Filters
    this.filter_status = 'All';
    this.filter_depart = 'All';
    this.filter_agents = 'All';

    this.select_status = "Select Status";
    this.select_depart = "Select Department";
    this.select_agent = "Select Agent";
    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',


    });
    if (this.searched_value == '' || this.searched_value == null) {
      // this.offset_count=0;
      this.my_externaltickets();
      return false;
  }
  let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"searchTicketID","user_type":"' + this.user_type + '","user_id":"' + this.user_id + '","admin_id":"' + this.admin_id + '","ticket_search":"' + search_value + '","limit":"' + this.pageLimit + '", "is_spam":"0" ,"offset":"' + this.offset_count + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    this.filter_status = 'All';
    this.filter_depart = 'All';
    this.filter_agents = 'All';

    this.select_status = "Select Status";
    this.select_depart = "Select Department";
    this.select_agent = "Select Agent";
    Swal.close();
    this.global_search = false;

    if (response.status == "true") {
      this.queue_list = response.ticket_options;
      this.queue_list_all = response.ticket_options;
      if (this.queue_list == null) {

        this.emptyticket = true;
        this.showtickets = false;
      } else {
        this.emptyticket = false;
        this.showtickets = true;

      }

      this.priority = response.priority_options;
      this.department = response.department_options;
      // this.status = response.status_options.filter(t => t.status_id != '9'&& t.status_id != '3');
      this.status = response.status_options.filter(t => t.status_id != '9');
      // this.filterlist_status = response.status_options;
      // this.status_all = response.count_options;
      this.total_offet = response.total;
      // localStorage.setItem('ticket_status',this.status);
      // localStorage.setItem('priority_options',this.priority);
      // localStorage.setItem('department_options',this.department);
      if (response.status_option == 'closed') {
        $("#dropdown-toggle").prop("disabled", true);
        this.closed = true;
      }
      console.log(this.priority);
      this.showmore_filter = false;
      this.showmore_button = false;
      this.search_ticket = false;

      if (response.total > this.pageLimit) {
        // alert(this.queue_list_all.length)
        // this.showmore_button = true;
        this.search_ticket = true;

      }

    }


  },
    (error) => {
      console.log(error);
    });


}
searchTicketsGlobal(data) {
  console.log(data);
  // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"searchTicketID","user_type":"3","admin_id":"1203","user_id":"1250","is_spam":"0","ticket_search":"507","limit":"10","offset":"0"}}

  this.global_search = true;
  let search_value = data.search_text;
  this.searched_value = data.search_text;
  if (this.searched_value == '' || this.searched_value == null || this.searched_value == undefined) {
    iziToast.warning({
      message: "Please Enter the Search text ",
      position: "topRight"
    });
    return false
  }

  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',


  });
  let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"searchTicketID","user_type":"2","user_id":"' + this.admin_id + '","admin_id":"' + this.admin_id + '","ticket_search":"' + search_value + '","limit":"' + this.pageLimit + '", "is_spam":"0" ,"offset":"' + this.offset_count + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    this.filter_status = 'All';
    this.filter_depart = 'All';
    this.filter_agents = 'All';

    this.select_status = "Select Status";
    this.select_depart = "Select Department";
    this.select_agent = "Select Agent";
    Swal.close();
    if (response.status == "true") {
      this.queue_list = response.ticket_options;
      this.queue_list_all = response.ticket_options;
      if (this.queue_list == null) {

        this.emptyticket = true;
        this.showtickets = false;
      } else {
        this.emptyticket = false;
        this.showtickets = true;

      }

      this.priority = response.priority_options;
      this.department = response.department_options;
      // this.status = response.status_options.filter(t => t.status_id != '9'&& t.status_id != '3');
      this.status = response.status_options.filter(t => t.status_id != '9');
      // this.filterlist_status = response.status_options;
      // this.status_all = response.count_options;
      this.total_offet = response.total;
      // localStorage.setItem('ticket_status',this.status);
      // localStorage.setItem('priority_options',this.priority);
      // localStorage.setItem('department_options',this.department);
      if (response.status_option == 'closed') {
        $("#dropdown-toggle").prop("disabled", true);
        this.closed = true;
      }
      console.log(this.priority);
      this.showmore_filter = false;
      this.showmore_button = false;
      this.search_ticket = false;

      if (response.total > this.pageLimit) {
        // alert(this.queue_list_all.length)
        // this.showmore_button = true;
        this.search_ticket = true;
      }

    }


  },
    (error) => {
      console.log(error);
    });


}

filterSomething(filterArgs: any[]) {
  const firstArg = filterArgs[0];
  const secondArg = filterArgs[1];

  return firstArg;
}
my_externaltickets() {
  this.offset_count = 0;
  // this.inputName.nativeElement.value = ' ';
  let admin_id = localStorage.getItem('admin_id');
  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',


  });

  let api_req: any = '{"operation":"get_unassign_tickets", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"get_unassign_tickets","user_type":"' + this.user_type + '","user_id":"' + this.user_id + '","admin_id":"' + admin_id + '","limit":"' + this.pageLimit + '", "is_spam":"0" ,"offset":"' + this.offset_count + '","ticket_department":"' + this.filter_depart + '","ticket_status":"' + this.filter_status + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    Swal.close();
    this.search_ticket = false;// Search option Readmore button
    this.global_search = false;//This will enable for the global search


    if (response.status == "true") {
// alert('123')

  
  this.queue_list = response.ticket_options;    


      console.log(this.queue_list);
      this.queue_list_all = response.ticket_options;
     
      if (this.queue_list == null) {

        this.emptyticket = true;
        this.showtickets = false;
      } else {
      
        this.emptyticket = false;
        this.showtickets = true;

      }

      this.priority = response.priority_options;
      this.department = response.department_options;
      // this.status = response.status_options.filter(t => t.status_id != '9' && t.status_id != '3');
      this.status = response.status_options.filter(t => t.status_id != '9');
      this.filterlist_status = response.status_options;
      this.status_all = response.count_options;
      this.total_offet = response.total;
      // localStorage.setItem('ticket_status',this.status);
      // localStorage.setItem('priority_options',this.priority);
      // localStorage.setItem('department_options',this.department);
      if (response.status_option == 'closed') {
        $("#dropdown-toggle").prop("disabled", true);
        this.closed = true;
      }
      console.log(this.priority);
      //...19-11-21 for test
      this.total_offset_filter = response.total;
      //16-11-21 code for remove filter readmore
      this.showmore_filter = false;
      if (response.total > this.pageLimit) {
      // alert(this.queue_list_all.length)
        this.showmore_button = true;

      }
      //...19-11-21
      else {
        this.showmore_button = false;
      }



    }
  },
    (error) => {
      console.log(error);
    });
}

getuserlist() {
  let api_req: any = '{"operation":"agents","moduleType":"agents","api_type":"web","access_token":"' + this.access_token + '","element_data":{"action":"user_list","user_id":"' + this.user_id + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    if (response.status == true) {
      // this.my_externaltickets();

    }
  },
    (error) => {
      console.log(error);
    });
}

viewMyTicket(ticket_id) {
  ticket_id = btoa(ticket_id);

  this.router.navigate(['/ticket-view-thread'], { queryParams: { ticket_id: ticket_id } });

}

changeMyPriority(ticket, ticket_id, priority, name) {
  let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"onchange_priority","priority_id":"' + priority + '","ticket_id":"' + ticket_id + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    if (response.status == true) {
      // this.my_externaltickets();
      ticket.priority = name;
      // if (this.filter_agents != 'All') {
      //   this.filterByAgent(this.filter_agents, this.select_agent);
      // } else {
      //   this.my_externaltickets();
      // }

    }
  },
    (error) => {
      console.log(error);
    });

}

changeMyDepartment(ticket_id, department, status) {
  // alert(status)
  if (status != 'New' && this.round_robin == 1) {
    Swal.fire({
      title: 'NOTE',
      text: 'RoundRobin Action can only occur when ticket status set to NEW',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Got it",
      //cancelButtonText: "Cancel"
    });
    return false;
  }

  //let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"onchange_department","department_id":"' + department + '","ticket_id":"' + ticket_id + '"}}';
  let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"onchange_department","department_id":"' + department + '","ticket_id":"' + ticket_id + '","admin_id":"' + this.admin_id + '","ticket_status":"' + status + '"}}';

  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',

  });
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    if (response.status == true) {
      // this.my_externaltickets();

      // if(this.round_robin==1)	
      // this.check_robin_queue(ticket_id);
      if (this.filter_agents != 'All') {
        this.filterByAgent(this.filter_agents, this.select_agent);
      } else {
        this.my_externaltickets();
      }

    }
  },
    (error) => {
      console.log(error);
    });

}
changeMyStatus(ticket, ticket_id, status, name) {

  let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"onchange_status","status_id":"' + status + '","ticket_id":"' + ticket_id + '","user_id":"' + this.user_id + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    if (response.status == true) {
      ticket.ticket_status = name;


      if (status == '3') {
        this.check_robin_queue(ticket_id);
      }

      // this.my_externaltickets();
      // if (this.filter_agents != 'All') {
      //   this.filterByAgent(this.filter_agents, this.select_agent);
      // } else {
      //   this.my_externaltickets();
      // }

    }
  },
    (error) => {
      console.log(error);
    });

}

slectAll() {
  if ($("#selectAllQ").prop("checked")) {
    $(".emailtickets").prop("checked", true);
  } else {
    $(".emailtickets").prop("checked", false);
  }
}
slectunique(id) {
  // $("#selectAllQ").prop("checked", false);

  console.log(id)
  if (this.admin_id != this.user_id) {
    $(".emailtickets").prop("checked", false);
    setTimeout(() => {
      if (this.view_name == 'Table View')
        $('#Check_' + id).prop("checked", true)
      else
        $('#Check_Crd' + id).prop("checked", true)

    }, 100);
  }
}

assignbutton() {
  if ($(".emailtickets").prop("checked")) {
    this.router.navigate(['/assign-tickets']);
    //alert('selected');
  }
  else {
    iziToast.warning({
      message: "Select at least one Ticket",
      position: "topRight"
    });


  }
}

changeMylayout(theme) {
  if (theme == 'table') {
    $('#table_view').show();
    $('#card-ticket-view').hide();
    $(".emailtickets").prop("checked", false);
    this.view_name = 'Table View';
  }
  else {
    $('#table_view').hide();
    $('#card-ticket-view').show();
    $(".emailtickets").prop("checked", false);
    this.view_name = 'Card View';

  }

}

searchdept() {

  var search_txt = $('#deptsearch').val().toLowerCase();
  // alert(search_txt);

  $("#dept-list .dropdown-item").filter(function () {

    $(this).toggle($(this).text().toLowerCase().indexOf(search_txt.toLowerCase()) !== -1);
  });

}


callFunction(tic) {
  $('#ticket_' + tic).unbind('click');
}
SelectFilter(value) {
  this.emptyticket = false;

  if (value == "All") {
    this.queue_list = this.queue_list_all;

  }
  else {
    this.queue_list = this.queue_list_all.filter(
      book => book.ticket_status === value);
    if (this.queue_list == '')
      this.emptyticket = true;
    // this.showtickets = false;

  }

}
showmore() {
  // $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  // $('.ticketing-system-panel').scrollTop($('.ticketing-system-panel')[0].scrollHeight);
  let admin_id = localStorage.getItem('admin_id');
  this.search_ticket = false;

  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',


  });

  this.showmore_button = true;
  if (this.offset_count == 0) {
    if (!isNaN(Number(this.pageLimit))) {
      this.offset_count = Number(this.pageLimit);
    }
    else
      this.offset_count = this.pageLimit;
  }
  else
    this.offset_count = +this.offset_count + +this.pageLimit;
  // alert(this.offset_count);
  // this.offset_count = this.offset_count -this.total_offet;
  var offset = this.offset_count;
  console.log(+offset + +this.pageLimit)
  console.log(offset + this.pageLimit)
  if (this.total_offet > +offset + +this.pageLimit) {
    if (this.offset_count >= this.total_offet) {
      this.offset_count = this.total_offet;
      this.showmore_button = false;
    }
  } else {
    // alert('dasds');
    this.showmore_button = false;
  }
  if (this.filter_agents != 'All') {
    this.user_type = '3';
    this.user_id = this.filter_agents;
  }

  let api_req: any = '{"operation":"get_unassign_tickets", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"get_unassign_tickets","user_type":"' + this.user_type + '","user_id":"' + this.user_id + '","admin_id":"' + admin_id + '","ticket_status":"' + this.filter_status + '","is_spam":"0","limit":"' + this.pageLimit + '","offset":"' + this.offset_count + '","ticket_department":"' + this.filter_depart + '","ticket_status":"' + this.filter_status + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    this.search_ticket = false;// Search option Readmore button
    this.global_search = false;//This will enable for the global search
    Swal.close();
    if (response.status == "true") {
      // this.queue_list = response.ticket_options;
      // this.queue_list_all = response.ticket_options;

      var mydatas = [];
      mydatas = response.ticket_options;
      // alert(mydatas.length);		
      // this.queue_list = this.queue_list_all.push(mydatas); 
      for (let index = 0; index < mydatas.length; index++) {
        var data = mydatas[index];
        this.queue_list.push(data);
      }

    }
  },
    (error) => {
      console.log(error);
    });
}

testing() {
  // Swal.fire({
  // 	html:
  // 	  '<div style="display: flex;justify-content: center;"><div class="loaders"></div></div>',
  // 	showCloseButton: false,
  // 	showCancelButton: false,
  // 	showConfirmButton: false,
  // 	focusConfirm: false,
  // 	background: 'transparent',


  //   })

  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',


  });

}


filterByStatus(id) {
  // alert(id);
  this.inputName.nativeElement.value = ' ';
  let name = 'Reset Filter';
  if (id != 'All') {
    id = $('.flexCheckDefault:checked').map(function () {
      return this.value;
    }).get();
    if (id == '' || id == undefined) {
      iziToast.warning({
        message: "Choose the status to be Filtered",
        position: "topRight"
      });
      return false;
    }
  }

  let admin_id = localStorage.getItem('admin_id');
  this.emptyticket = false;
  this.filter_status = id;
  this.offset_count = 0;
  this.filter_offset = 0;
  this.showmore_button = false;
  this.search_ticket = false;

  this.select_status = name;
  // alert(this.filter_status);

  if (id == 'All') {
    this.select_status = 'Select Status';
    // $(".flexCheckDefault").each(function() {
    // 	$("#checkedAll").prop("checked", true);
    // });
    $(".flexCheckDefault").prop("checked", false);

  }
  if (id == 'All' && this.filter_agents == 'All') {
    this.select_status = 'Select Status';
    this.my_externaltickets();
    return false;
  } else {
    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',


    });
  }


  // 	if(this.filter_offset >= this.total_offet){
  // 		this.filter_offset = this.total_offet;
  this.showmore_filter = false;
  //16-11-21 code for filter button
  this.showmore_button = false;
  // 	//   return false;
  //    }
  if (this.filter_agents == 'All') {

    let api_req: any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"get_unassign_tickets","user_type":"' + this.user_type + '","user_id":"' + this.user_id + '","admin_id":"' + admin_id + '","ticket_status":"' + this.filter_status + '","is_spam":"0" ,"limit":"' + this.pageLimit + '","offset":"' + this.filter_offset + '","ticket_department":"' + this.filter_depart + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      Swal.close();
      this.search_ticket = false;// Search option Readmore button
      this.global_search = false;//This will enable for the global search
      if (response.status == "true") {

        this.queue_list = response.ticket_options;
        this.total_offset_filter = response.total;
        //this.filter_status='All';
        if (this.total_offset_filter > this.pageLimit) {
          // alert(this.queue_list_all.length)
          this.showmore_filter = true;

        }
        if (this.queue_list == null) {
          this.emptyticket = true;
          this.showtickets = false;
        } else {
          this.emptyticket = false;
          this.showtickets = true;
        }

      }
    },
      (error) => {
        console.log(error);
      });

  } else {
    this.filterByAgent(this.filter_agents, this.select_agent);
  }

}
filterByDepartment(id, name) {
  this.inputName.nativeElement.value = ' ';

  let admin_id = localStorage.getItem('admin_id');
  this.emptyticket = false;
  this.filter_depart = id;
  this.offset_count = 0;
  this.filter_offset = 0;
  this.showmore_button = false;
  this.search_ticket = false;

  this.select_depart = name;
  if (id == 'All') {
    this.select_depart = "Select Department"
  }
  if (id == 'All' && this.filter_agents == 'All') {
    this.select_depart = "Select Department"
    this.my_externaltickets();
    return false;
  } else {
    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',


    });
  }

  // 	if(this.filter_offset >= this.total_offet){
  // 		this.filter_offset = this.total_offet;
  this.showmore_filter = false;
  // 	//   return false;
  //    }
  // let api_req:any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"my_externaltickets","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","ticket_status":"'+this.filter_status+'","limit":"'+this.pageLimit+'","offset":"'+this.filter_offset+'","ticket_department":"'+this.filter_depart+'"}}';
  if (this.filter_agents == 'All') {

    let api_req: any = '{"operation":"get_unassign_tickets", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"get_unassign_tickets","user_type":"' + this.user_type + '","user_id":"' + this.user_id + '","admin_id":"' + admin_id + '","ticket_department":"' + this.filter_depart + '","is_spam":"0" ,"limit":"' + this.pageLimit + '","offset":"' + this.filter_offset + '","ticket_status":"' + this.filter_status + '","ticket_status":"' + this.filter_status + '"}}';
    // let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"getmyDepartmentTicket","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","ticket_department":"'+this.filter_depart+'","limit":"'+this.pageLimit+'","offset":"'+this.filter_offset+'","ticket_status":"'+this.filter_status+'"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      Swal.close();
      this.search_ticket = false;// Search option Readmore button
      this.global_search = false;//This will enable for the global search
      if (response.status == "true") {

        this.queue_list = response.ticket_options;
        this.total_offset_filter = response.total;
        this.status_all = response.count_options;
        //this.filter_status='All';
        if (this.total_offset_filter >= this.pageLimit) {
          // alert(this.queue_list_all.length)
          this.showmore_filter = true;

        }
        if (this.queue_list == null) {
          this.emptyticket = true;
          this.showtickets = false;
        } else {
          this.emptyticket = false;
          this.showtickets = true;
        }

      }
    },
      (error) => {
        console.log(error);
      });

  } else {
    this.filterByAgent(this.filter_agents, this.select_agent);
  }
}
showmoreFilter() {
  this.showmore_filter = true;
  this.filter_offset = +this.filter_offset + +this.pageLimit;
  //   alert('showmoreFilter');
  // alert(this.offset_count);
  // this.offset_count = this.offset_count -this.total_offet;
  let admin_id = localStorage.getItem('admin_id');
  var offset = this.filter_offset;
  console.log(offset + this.pageLimit)
  console.log(+offset + +this.pageLimit)
  if (this.total_offset_filter >= +offset + +this.pageLimit) {
    if (this.filter_offset >= this.total_offset_filter) {
      this.filter_offset = this.total_offset_filter;
      this.showmore_filter = false;
    }
  } else {
    // alert('filter');
    this.showmore_filter = false;
  }
  if (this.filter_agents != 'All') {
    this.user_type = '3';
    this.user_id = this.filter_agents;
  }

  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',


  });

  let api_req: any = '{"operation":"get_unassign_tickets", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"get_unassign_tickets","user_type":"' + this.user_type + '","user_id":"' + this.user_id + '","admin_id":"' + admin_id + '","ticket_status":"' + this.filter_status + '","is_spam":"0" ,"limit":"' + this.pageLimit + '","offset":"' + this.filter_offset + '","ticket_department":"' + this.filter_depart + '","ticket_status":"' + this.filter_status + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    Swal.close();
    this.search_ticket = false;// Search option Readmore button
    this.global_search = false;//This will enable for the global search
    if (response.status == "true") {

      // this.queue_list = response.ticket_options;
      // this.queue_list_all = response.ticket_options;
      var mydatas = [];
      mydatas = response.ticket_options;
      // alert(mydatas.length);		
      // this.queue_list = this.queue_list_all.push(mydatas); 
      for (let index = 0; index < mydatas.length; index++) {
        var data = mydatas[index];
        this.queue_list.push(data);
      }

    }
  },
    (error) => {
      console.log(error);
    });

}
BulkAssign(val) {
  var queues = $('.emailtickets:checked').map(function () {
    return this.value;
  }).get();


  // alert(queues);
  if (queues == '' || queues == '0') {
    iziToast.warning({
      message: "Please Select atleast one Ticket",
      position: 'topRight'
    });
    return false;
  }
  this.bulk_tickets = queues;
  if (val == '' || val == undefined)
    val = "";
  var options = {};
  $.map(this.department, function (o) {
    options[o.department_id] = o.department_name;
  });
  // console.log(options);
  const trans = Swal.fire({
    title: 'Assign to Department',
    input: 'select',
    inputOptions: options,
    inputPlaceholder: 'Select Department',
    confirmButtonText: 'Assign',
    showCancelButton: true,
    inputValue: val,
  }).then(function (inputValue) {
    if (inputValue.value != "" && inputValue.value != null) {

      $('#BAssignTickets').val(inputValue.value);
      $('#BAssignTickets').click();

    } else {
      // iziToast.error({
      //   message: "You have not selected any schedule",
      //   position: 'topRight'
      //   });
    }
  });
}
BAssignTickets() {
  var department = $('#BAssignTickets').val();
  let access_token: any = localStorage.getItem('access_token');

  // alert(this.bulk_tickets);
  // let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"external_ticket_bulk_assign","ticket_id":"' + this.bulk_tickets + '","department":"' + department + '","agent_id":" ","user_id":"' + this.user_id + '","admin_id":"' + this.admin_id + '"}}';
  let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"external_ticket_bulk_assign","ticket_id":"' + this.bulk_tickets + '","department":"' + department + '","agent_id":" ","user_id":"' + this.user_id + '","admin_id":"' + this.admin_id + '"}}';
  if (this.round_robin == 1)
    api_req = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"Bulk_Reassign","value":"' + this.bulk_tickets + '","dept_id":"' + department + '","admin_id":"' + this.admin_id + '"}}';
  console.log(api_req)

  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',

  });
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    Swal.close();
    if (response.result.status == true) {
      this.bulk_tickets = '';
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
    (error) => {
      console.log(error);
    });
}


user_lists() {
  let access_token: any = localStorage.getItem('access_token');
  let api_req: any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"user_list","user_id":"' + this.user_id + '","search_text":"","order_by_name":"user.agent_name","order_by_type":"asc","limit":250,"offset":0}}';

  this.serverService.sendServer(api_req).subscribe((response: any) => {

    if (response.result.status == 1) {

      this.agents_list = response.result.data.list_data;
      this.agents_list = this.agents_list.sort((a, b) => a.agent_name > b.agent_name);


    }


  },
    (error) => {
      console.log(error);
    });
}

filterByAgent(id, name) {
  this.inputName.nativeElement.value = ' ';

  let admin_id = localStorage.getItem('admin_id');
  this.emptyticket = false;
  this.filter_agents = id;
  this.offset_count = 0;
  this.filter_offset = 0;
  this.showmore_button = false;
  this.search_ticket = false;

  this.select_agent = name;
  if (id == 'All') {
    this.select_agent = "Select Agent"
    if (this.admin_permission == '1')
      this.user_id = localStorage.getItem('admin_id');
    else
      this.user_id = localStorage.getItem('userId');

    this.my_externaltickets();
    return false; ``
  } else {
    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',


    });
  }

  // 	if(this.filter_offset >= this.total_offet){
  // 		this.filter_offset = this.total_offet;
  this.showmore_filter = false;
  // 	//   return false;
  //    }
  // let api_req:any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"my_externaltickets","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","ticket_status":"'+this.filter_status+'","limit":"'+this.pageLimit+'","offset":"'+this.filter_offset+'","ticket_department":"'+this.filter_depart+'"}}';

  let api_req: any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"my_externaltickets","user_type":"3", "is_spam":"0" ,"user_id":"' + this.filter_agents + '","admin_id":"' + admin_id + '","ticket_department":"' + this.filter_depart + '","limit":"' + this.pageLimit + '","offset":"' + this.filter_offset + '","ticket_status":"' + this.filter_status + '"}}';
  // let api_req:any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"'+this.access_token+'", "element_data":{"action":"getmyDepartmentTicket","user_type":"'+this.user_type+'","user_id":"'+this.user_id+'","admin_id":"'+this.admin_id+'","ticket_department":"'+this.filter_depart+'","limit":"'+this.pageLimit+'","offset":"'+this.filter_offset+'","ticket_status":"'+this.filter_status+'"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {
    Swal.close();
    this.search_ticket = false;// Search option Readmore button
    this.global_search = false;//This will enable for the global search
    if (response.status == "true") {

      this.queue_list = response.ticket_options;
      this.total_offset_filter = response.total;
      this.status_all = response.count_options;
      //this.filter_status='All';
      if (this.total_offset_filter > this.pageLimit) {
        // alert(this.queue_list_all.length)
        this.showmore_filter = true;

      }
      if (this.queue_list == null) {
        this.emptyticket = true;
        this.showtickets = false;
      } else {
        this.emptyticket = false;
        this.showtickets = true;
      }

    }
  },
    (error) => {
      console.log(error);
    });

}

// test(){
// 	// $('#testModal').modal('show');
// 	$('#loading').removeClass('loading-hide');
// 	$('#loading').addClass('loading-show');
// 	console.log('test');
// }
showmoreSearch() {
  // $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  // $('.ticketing-system-panel').scrollTop($('.ticketing-system-panel')[0].scrollHeight);
  let admin_id = localStorage.getItem('admin_id');
  //  RESETING all Filters
  this.filter_status = 'All';
  this.filter_depart = 'All';
  this.filter_agents = 'All';

  this.select_status = "Select Status";
  this.select_depart = "Select Department";
  this.select_agent = "Select Agent";
  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',


  });

  this.search_ticket = true;
  this.offset_count = +this.offset_count + +this.pageLimit;
  // this.offset_count = this.offset_count -this.total_offet;
  var offset = this.offset_count;
  console.log(+offset + +this.pageLimit)
  console.log(offset + this.pageLimit)
  if (this.total_offet >= +offset + +this.pageLimit) {
    if (this.offset_count >= this.total_offet) {
      this.offset_count = this.total_offet;
      this.search_ticket = false;
    }
  } else {
    // alert('dasds');
    this.search_ticket = false;
  }
  if (this.global_search == true) {
    var ser_user_id = this.admin_id;
    var ser_user_type = '2';
  }
  else {
    ser_user_id = this.user_id;
    ser_user_type = this.user_type;
  }
  // let api_req: any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"my_externaltickets","user_type":"' + this.user_type + '","user_id":"' + this.user_id + '","admin_id":"' + admin_id + '","ticket_status":"' + this.filter_status + '","is_spam":"0","limit":"' + this.pageLimit + '","offset":"' + this.offset_count + '","ticket_department":"' + this.filter_depart + '"}}';
  let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"searchTicketID","user_type":"' + ser_user_type + '","user_id":"' + ser_user_id + '","admin_id":"' + this.admin_id + '","ticket_search":"' + this.searched_value + '","limit":"' + this.pageLimit + '", "is_spam":"0" ,"offset":"' + this.offset_count + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {

    Swal.close();
    if (response.status == "true") {
      // this.queue_list = response.ticket_options;
      // this.queue_list_all = response.ticket_options;

      var mydatas = [];
      mydatas = response.ticket_options;
      // alert(mydatas.length);		
      // this.queue_list = this.queue_list_all.push(mydatas); 
      for (let index = 0; index < mydatas.length; index++) {
        var data = mydatas[index];
        this.queue_list.push(data);
      }

    }
  },
    (error) => {
      console.log(error);
    });

}

DeleteTickets() {
  var i = 0;
  var invalidContacts = [];
  $('.emailtickets:checked').each(function () {
    invalidContacts[i++] = $(this).val();
  });

  console.log(invalidContacts.length);
  if (invalidContacts.length == 0) {
    iziToast.warning({
      message: "Please Choose a Ticket",
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
      let access_token: any = localStorage.getItem('access_token');

      //   let api_req:any = '{"operation":"predective_dialer_contact", "moduleType":"predective_dialer_contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_contact","user_id":"'+this.user_id+'","contact_id":"'+invalidContacts+'"}}';
      let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"delete_multiple_ticket","value":"' + invalidContacts + '","admin_id":"' + this.admin_id + '"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {

        console.log(response);
        if (response.result.data == true) {
          iziToast.success({
            message: "Ticket deleted successfully",
            position: 'topRight'
          });
          this.my_externaltickets();
        } else {
          iziToast.warning({
            message: "Contact not deleted, Please try again!",
            position: 'topRight'
          });
        }
      },
        (error) => {
          console.log(error);
        });

    }
  })
}
offsetValue(val: number) {

  // if (val > this.total_offset_filter) {
  //   iziToast.warning({
  //     message: "You currently have a maximum of" + this.total_offset_filter + " rows",
  //     position: "topRight"
  //   });
  //   return false;
  // }
  // if (val > 200) {
  //   iziToast.warning({
  //     message: "Maximum Row limit was 200",
  //     position: "topRight"
  //   });
  //   return false;
  // }
  // if (val <= 10) {
  //   iziToast.warning({
  //     message: "The filter default gives you 10 rows",
  //     position: "topRight"
  //   });
  //   return false;
  // }
  $('#drop_down2').click();
  this.pageLimit = val;
  // this.offset_count=0;
  this.my_externaltickets();
  this.RowfilterON = true;

}
resetRowCount() {
  this.RowfilterON = false;
  this.pageLimit = 10;
  this.my_externaltickets();
}
check_robin_queue(id) {
  let access_token: any = localStorage.getItem('access_token');
  let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"check_rounrobin","admin_id":"' + this.admin_id + '","user_id":"' + this.user_id + '","ticket_id":"' + id + '"}}';

  this.serverService.sendServer(api_req).subscribe((response: any) => {

    // console.log(response);

  },
    (error) => {
      console.log(error);
    });
}
my_externaltickets_notify() {
  this.offset_count = 0;
  // this.inputName.nativeElement.value = ' ';
  let admin_id = localStorage.getItem('admin_id');


  let api_req: any = '{"operation":"get_unassign_tickets", "moduleType":"ticket", "api_type": "web", "access_token":"' + this.access_token + '", "element_data":{"action":"get_unassign_tickets","user_type":"' + this.user_type + '","user_id":"' + this.user_id + '","admin_id":"' + admin_id + '","limit":"' + this.pageLimit + '", "is_spam":"0" ,"offset":"' + this.offset_count + '","ticket_department":"' + this.filter_depart + '","ticket_status":"' + this.filter_status + '"}}';
  this.serverService.sendServer(api_req).subscribe((response: any) => {

    this.search_ticket = false;// Search option Readmore button
    this.global_search = false;//This will enable for the global search


    if (response.status == "true") {

      this.queue_list = response.ticket_options;
      this.queue_list_all = response.ticket_options;
      if (this.queue_list == null) {

        this.emptyticket = true;
        this.showtickets = false;
      } else {
        this.emptyticket = false;
        this.showtickets = true;

      }

      this.priority = response.priority_options;
      this.department = response.department_options;
      // this.status = response.status_options.filter(t => t.status_id != '9' && t.status_id != '3');
      this.status = response.status_options.filter(t => t.status_id != '9');
      this.filterlist_status = response.status_options;
      this.status_all = response.count_options;
      this.total_offet = response.total;
      // localStorage.setItem('ticket_status',this.status);
      // localStorage.setItem('priority_options',this.priority);
      // localStorage.setItem('department_options',this.department);
      if (response.status_option == 'closed') {
        $("#dropdown-toggle").prop("disabled", true);
        this.closed = true;
      }
      console.log(this.priority);
      //... ..19-11-21
      this.total_offset_filter = response.total;
      //16-11-21 code for remove filter readmore
      this.showmore_filter = false;
      if (response.total > this.pageLimit) {
        // alert(this.queue_list_all.length)
        this.showmore_button = true;

      }
      else {
        this.showmore_button = false;
      }


    }
  },
    (error) => {
      console.log(error);
    });
}

}
