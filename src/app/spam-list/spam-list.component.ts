import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServerService } from '../services/server.service';
declare var $: any;
declare var iziToast: any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-spam-list',
  templateUrl: './spam-list.component.html',
  styleUrls: ['./spam-list.component.css']
})
export class SpamListComponent implements OnInit {
  uadmin_id;
  user_id;
  spamlist;
  addSpams: FormGroup;
  emailList;
  showmore_button = false;
  user_type;
  pageLimit = 10;
  offset_count = 0;
  filter_offset = 0;
  total_offet;
  department;
  filter_agents = 'All';
  new_queue_list;
  recordNotFound = false;
  constructor(private serverService: ServerService, private router: Router,) { }

  ngOnInit(): void {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.user_id = localStorage.getItem('admin_id');
    this.user_type = localStorage.getItem('user_type');
    this.addSpams = new FormGroup({
      'emailids': new FormControl(null, Validators.required),
      'status': new FormControl(null)
    });
    if (this.user_type == 'Super Admin') {
      this.user_type = 1;
    }
    else if (this.user_type == 'Admin') {
      this.user_type = 2;
    }
    else {
      this.user_type = 2;//This is page can see if agent have admin_permission
    }


    this.getspamlist();
    this.my_spamtickets();
  }


  getspamlist() {
    let access_token: any = localStorage.getItem('access_token');

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"getIncomingEmailIds","admin_id":"1203"}}

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"getIncomingEmailIds","admin_id":"' + this.uadmin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {
        this.spamlist = response.result.spamLists;
        this.emailList = response.result.data;
      } else {
        this.recordNotFound == true;
      }
    },
      (error) => {
        console.log(error);
      });

  }

  addSpam() {
    $('#add_spamform').modal('show');
  }

  changespamStatus(words, events, email_id) {
    let spam_status = '';
    let black_status = '';

    if (events.target.checked == true) {
      spam_status = '1';
      black_status = '0';
    } else {
      spam_status = '0';
      black_status = '0';
    }



    let access_token: any = localStorage.getItem('access_token');
    let user_id = localStorage.getItem('admin_id');
    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"blockEmailIds","admin_id":"1203","user_id":"1253","email_id":"Cal4Care | MR < mr@cal4care.com >","spam_status":"0","blacklist_status":"1"}}

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"blockEmailIds","admin_id":"' + this.uadmin_id + '","user_id":"' + user_id + '","email_id":"' + email_id + '","spam_status":"' + spam_status + '","blacklist_status":"' + black_status + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {
        var messages = '';
        messages = "Spam Updated Successfully";

        iziToast.success({
          message: messages,
          position: 'topRight'
        });

        if (events.target.checked == false) {
          this.router.navigate(['/ticketing-system-new']);
        } else {
          this.getspamlist();
          this.my_spamtickets();
        }
      } else {
        iziToast.error({
          message: "Spam Updated Failed",
          position: 'topRight'
        });

      }
    },
      (error) => {
        console.log(error);
      });

  }


  changeblackStatus(words, events, email_id) {
    let spam_status = '';
    let black_status = '';

    if (events.target.checked == true) {
      spam_status = '0';
      black_status = '1';
    } else {
      spam_status = '0';
      black_status = '0';
    }


    let access_token: any = localStorage.getItem('access_token');
    let user_id = localStorage.getItem('admin_id');
    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"blockEmailIds","admin_id":"1203","user_id":"1253","email_id":"Cal4Care | MR < mr@cal4care.com >","spam_status":"0","blacklist_status":"1"}}

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"blockEmailIds","admin_id":"' + this.uadmin_id + '","user_id":"' + user_id + '","email_id":"' + email_id + '","spam_status":"' + spam_status + '","blacklist_status":"' + black_status + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {
        var messages = '';
        messages = "Blacklist Updated Successfully";

        iziToast.success({
          message: messages,
          position: 'topRight'
        });
        this.getspamlist();
        this.my_spamtickets();

      } else {

        iziToast.error({
          message: "BlackList Updated Failed",
          position: 'topRight'
        });

      }
    },
      (error) => {
        console.log(error);
      });

  }

  deletespam(email) {

    Swal.fire({
      title: 'Are you sure?',
      text: "Would you like to delete this Email from spam list!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        let access_token: any = localStorage.getItem('access_token');
        // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"s", "element_data":{"action":"delSpamEmail","admin_id":"1203","email":"Cal4Care | RT < rt@cal4care.com >"}}
        let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"delSpamEmail","admin_id":"' + this.uadmin_id + '","email":"' + email + '"}}';

        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.status == true) {
            iziToast.success({
              message: "Spam Delete Successfully",
              position: 'topRight'
            });
            this.getspamlist();


          } else {
            iziToast.error({
              message: "Failed to Delete",
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


  createSpamList() {

    let access_token: any = localStorage.getItem('access_token');
    let user_id = localStorage.getItem('admin_id');
    let agent_values: any = this.addSpams.value;
    let spam_status = '';
    let black_status = '';
    if (agent_values.status == 'spam') {
      spam_status = '1';
      black_status = '0';
    } else if (agent_values.status == 'black') {
      spam_status = '0';
      black_status = '1';
    }

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"blockEmailIds","admin_id":"1203","user_id":"1253","email_id":"Cal4Care | MR < mr@cal4care.com >","spam_status":"0","blacklist_status":"1"}}

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"blockEmailIds","admin_id":"' + this.uadmin_id + '","user_id":"' + user_id + '","email_id":"' + agent_values.emailids + '","spam_status":"' + spam_status + '","blacklist_status":"' + black_status + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {

      if (response.result.status == true) {
        var messages = '';
        messages = "Spam Updated Successfully";
        $('#add_spamform').modal('hide');
        iziToast.success({
          message: messages,
          position: 'topRight'
        });
        this.getspamlist();

      } else {
        iziToast.error({
          message: "Spam Updated Failed",
          position: 'topRight'
        });

      }

    },
      (error) => {
        console.log(error);
      });
  }



  // ================================== TICKET LIST FUNCTIONS================================


  my_spamtickets() {

    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',


    });
    let access_token: any = localStorage.getItem('access_token');
    let user_id = localStorage.getItem('admin_id');
    let api_req: any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"my_externaltickets","user_type":"' + this.user_type + '","user_id":"' + user_id + '","admin_id":"' + this.uadmin_id + '","ticket_status":"All","limit":"100","offset":"0","ticket_department":"All","is_spam":"1"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      Swal.close();
      if (response.status == "true") {
        this.new_queue_list = response.ticket_options;
        this.department = response.department_options;
        // if (response.total >= 10) {
        // 	// alert(this.queue_list_all.length)
        // 	this.showmore_button = true;

        // }
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

  callFunction(tic) {
    $('#ticket_' + tic).unbind('click');
  }
  // showmore() {
  // 	// $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  // 	// $('.ticketing-system-panel').scrollTop($('.ticketing-system-panel')[0].scrollHeight);
  // 	let admin_id = localStorage.getItem('admin_id');

  // 	Swal.fire({
  // 		html:
  // 			'<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
  // 	showCloseButton: false,
  // 		showCancelButton: false,
  // 		showConfirmButton: false,
  // 		focusConfirm: false,
  // 		background: 'transparent',


  // 	});

  //   let access_token: any = localStorage.getItem('access_token');
  //   let user_id = localStorage.getItem('userId');
  // 	this.showmore_button = true;
  // 	this.offset_count = this.offset_count + 10;
  // 	// alert(this.offset_count);
  // 	// this.offset_count = this.offset_count -this.total_offet;
  // 	var offset = this.offset_count;
  // 	if (this.total_offet >= offset + 10) {
  // 		if (this.offset_count >= this.total_offet) {
  // 			this.offset_count = this.total_offet;
  // 			this.showmore_button = false;
  // 		}
  // 	} else {
  // 		// alert('dasds');
  // 		this.showmore_button = false;
  // 	}
  // 	if (this.filter_agents != 'All') {
  // 		this.user_type = '3';
  // 		this.user_id = this.filter_agents;
  // 	}

  // 	let api_req: any = '{"operation":"getmyExternalTicket", "moduleType":"ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"my_externaltickets","user_type":"' + this.user_type + '","user_id":"' + user_id + '","admin_id":"' + admin_id + '","ticket_status":"All","is_spam":"0","limit":"' + this.pageLimit + '","offset":"' + this.offset_count + '","ticket_department":"All"}}';
  // 	this.serverService.sendServer(api_req).subscribe((response: any) => {

  // 		Swal.close();
  // 		if (response.status == "true") {
  // 			// this.queue_list = response.ticket_options;
  // 			// this.queue_list_all = response.ticket_options;

  // 			var mydatas = [];
  // 			mydatas = response.ticket_options;
  // 			// alert(mydatas.length);		
  // 			// this.queue_list = this.queue_list_all.push(mydatas); 
  // 			for (let index = 0; index < mydatas.length; index++) {
  // 				var data = mydatas[index];
  // 				this.queue_list.push(data);
  // 			}

  // 		}
  // 	},
  // 		(error) => {
  // 			console.log(error);
  // 		});
  // }



  slectunique() {
    $("#selectAllQ").prop("checked", false);

  }




  changeMyDepartment(ticket_id, department) {
    let access_token: any = localStorage.getItem('access_token');
    console.log(ticket_id + ' ' + department)
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"onchange_department","department_id":"' + department + '","ticket_id":"' + ticket_id + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {
        // this.my_externaltickets();

        if (this.filter_agents != 'All') {
          // this.filterByAgent(this.filter_agents, this.select_agent);
        } else {
          this.my_spamtickets();
        }

      }
    },
      (error) => {
        console.log(error);
      });

  }



  changeMyPriority(ticket_id, priority) {

    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"onchange_priority","priority_id":"' + priority + '","ticket_id":"' + ticket_id + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {
        // this.my_externaltickets();

        if (this.filter_agents != 'All') {
          // this.filterByAgent(this.filter_agents, this.select_agent);
        } else {
          this.my_spamtickets();
        }

      }
    },
      (error) => {
        console.log(error);
      });

  }

  changeMyStatus(ticket_id, status) {

    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"onchange_status","status_id":"' + status + '","ticket_id":"' + ticket_id + '","user_id":"' + this.user_id + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {

        // this.my_externaltickets();
        if (this.filter_agents != 'All') {
          // this.filterByAgent(this.filter_agents, this.select_agent);
        } else {
          this.my_spamtickets();
        }

      }
    },
      (error) => {
        console.log(error);
      });

  }


}
