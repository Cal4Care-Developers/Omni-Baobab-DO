import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from '../services/server.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { NgZone } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
// import { truncate } from 'fs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
declare var $: any;
declare var iziToast: any;
@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.css']
})
export class EmailSettingsComponent implements OnInit {
  loginUser;
  admin_id;
  recordNotFound = false;
  addGroup: FormGroup;
  forwarder_list: FormGroup;
  edit_forwarder_list: FormGroup;
  editDept: FormGroup;
  addSmtpData: FormGroup;
  editSmtpDatas: FormGroup;
  dept_list;
  agent_list: any;
  email_setting_list: any;
  selected_dept_id: any;
  get_all_dept_list: any;
  get_admin_ids: any;
  email_dept: any;
  smtp_dept: any;
  add_agent_list;
  select_dept;
  admin_grp_list;
  smtp_list;
  show_email_errors = false;
  email_error_msg;
  edit_sender_value;
  pageLimit = 10;
  paginationData: any = { "info": "hide" };
  offset_count = 0;
  total_agent_count;
  get_id_updates;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addGroupValue = [];
  editwrapUpCode = [];
  editwrapUpCode2 = [];
  priority_list =[];
  round_robin;
  filter_list;
  admin_permission;
  user_type;
  has_round_robin=false;
  limit_count: string = '';
 
  priorityLists;
  priorityQueue;
  new_priorityQueue;
  key_id;
  constructor(public serverService: ServerService, private _ngZone: NgZone, private router: Router,private route: ActivatedRoute) {
   
  }

  ngOnInit() {
    this.loginUser = localStorage.getItem('userId');
    this.admin_id = localStorage.getItem('admin_id');
    this.selected_dept_id = 3;
    this.admin_permission = localStorage.getItem('admin_permision');
		this.user_type = localStorage.getItem('user_type');

    if (this.user_type == 'Super Admin') {
			this.user_type = 1;          
		}
		else if (this.user_type == 'Admin' || this.admin_permission =='1') {
			this.user_type = 2;		
		}
		else {
			this.user_type = 3;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You have no access view that page!',
      });
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
      return false;
		}

   


    this.deptList();
    this.getalldeptList();
    // this.listEmailDetails(this.selected_dept_id);
    this.agentsList({});
    this.listAdminGroup();
    this.smtpList();
    this.filterList();
    this.PriorityFilterList();
    this.getpriority();
    this.select_dept = "Select Department";



    this.addGroup = new FormGroup({
      'add_group_name': new FormControl(null, Validators.required),
    });


    this.editDept = new FormGroup({
      'edit_group_name': new FormControl(null, Validators.required),
    });

    this.forwarder_list = new FormGroup({
      'alias_name': new FormControl(null, Validators.required),
      'sender_id': new FormControl(null),
    });
    this.edit_forwarder_list = new FormGroup({
      'edit_alias_name': new FormControl(null, Validators.required),
      //  'edit_sender_id': new FormControl('', Validators.required),
    });

    this.addSmtpData = new FormGroup({
      'host_name': new FormControl(null, Validators.required),
      'port_num': new FormControl(null, Validators.required),
      'smtp_username': new FormControl(null, Validators.required),
      'smtp_pasword': new FormControl(null, Validators.required),
    });

    this.editSmtpDatas = new FormGroup({
      'edit_host_name': new FormControl(null, Validators.required),
      'edit_port_num': new FormControl(null, Validators.required),
      'edit_smtp_username': new FormControl(null, Validators.required),
      'edit_smtp_pasword': new FormControl(null, Validators.required),
    });

  }


  // notifyme() {

  //   this.serverService.sendNotifications();

  // }


  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  // editadd(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;


  //   if ((value || '').trim()) {
  //     this.editwrapUpCode.push({ name: value.trim() });
  //   }
  //   if (input) {
  //     input.value = '';
  //   }

  // }

  editremove(code): void {
    const index = this.editwrapUpCode.indexOf(code);
    if (index >= 0) {
      this.editwrapUpCode.splice(index, 1);
    }
  }



  editadd(event: MatChipInputEvent): void {
    // console.log(this.addDept.status);
    const input = event.input;
    const value = event.value;


    const test = this.validateEmail(event.value);

    if (this.validateEmail(event.value)) {

      let api_req: any = new Object();
      let chat_req: any = new Object();
      chat_req.action = "check_email";
      chat_req.user_id = this.admin_id;
      chat_req.email = event.value;
      api_req.operation = "ticket";
      api_req.moduleType = "ticket";
      api_req.api_type = "web";
      api_req.access_token = localStorage.getItem('access_token');
      api_req.element_data = chat_req;
      this.serverService.sendServer(api_req).subscribe((response: any) => {

        if (response.result.data == 0) {

          this.show_email_errors = true;
          this.email_error_msg = 'The EmailID already existed';
          return false;
        } else if (response.result.data == 1) {

          this.show_email_errors = false;
          if ((value || '').trim()) {
            this.editwrapUpCode.push({ name: value.trim() });
          }
          if (input) {
            input.value = '';
          }

        } else {

          this.show_email_errors = false;
          if ((value || '').trim()) {
            this.editwrapUpCode.push({ name: value.trim() });
          }
          if (input) {
            input.value = '';
          }

        }

      });

    } else {
      this.show_email_errors = true;
      this.email_error_msg = 'Not an Valid EmailID';
    }
  }


  add(event: MatChipInputEvent): void {
    // console.log(this.addDept.status);
    const input = event.input;
    const value = event.value;


    const test = this.validateEmail(event.value);

    if (this.validateEmail(event.value)) {

      let api_req: any = new Object();
      let chat_req: any = new Object();
      chat_req.action = "check_email";
      chat_req.user_id = this.admin_id;
      chat_req.email = event.value;
      api_req.operation = "ticket";
      api_req.moduleType = "ticket";
      api_req.api_type = "web";
      api_req.access_token = localStorage.getItem('access_token');
      api_req.element_data = chat_req;
      this.serverService.sendServer(api_req).subscribe((response: any) => {

        if (response.result.data == 0) {

          this.show_email_errors = true;
          this.email_error_msg = 'The EmailID already existed';
          return false;
        } else if (response.result.data == 1) {

          this.show_email_errors = false;
          if ((value || '').trim()) {
            this.addGroupValue.push({ name: value.trim() });
          }
          if (input) {
            input.value = '';
          }

        } else {

          this.show_email_errors = false;
          if ((value || '').trim()) {
            this.addGroupValue.push({ name: value.trim() });
          }
          if (input) {
            input.value = '';
          }

        }




      });

    } else {
      this.show_email_errors = true;
      this.email_error_msg = 'Not an Valid EmailID';
    }
  }

  toggleClasss() {
    $(event.target).toggleClass("fa-eye fa-eye-slash");
    var input = $($(event.target).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  };

  private checkEmailinDB(emails) {


    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "check_email";
    chat_req.user_id = this.admin_id;
    chat_req.email = emails;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {

      // if (response.result.data == 0) {
      //   return true;
      // } else if (response.result.data == 1) {
      //   return false;
      // } else {
      //   return false;
      // }

    });

  }

  remove(code): void {
    const index = this.addGroupValue.indexOf(code);
    if (index >= 0) {
      this.addGroupValue.splice(index, 1);
    }
  }


  onChangeDept(id, names) {
    this.selected_dept_id = id;
    this.select_dept = names;
    this.listEmailDetails(id);
  }

  onChangeAddDept() {

    let id = $("#add_dept_ids").val();
    this.addlistEmailDetails(id);
  }


  addEmail() {
    $("#sender_id").val(''); 
    $("#alias_name").val('');
    $("#add_dept_name").val('0');
    $("#add_default_email").val('0');

    $('#add_deptform').modal('show');
  }

  // canceldata(){
        
  // }

  addAgent() {
    $('#add_agentform').modal('show');
  }

  addAdminGroup() {
    $('#add_admingroup').modal('show');
  }

  listEmailDetails(ids) {

    // {"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"", "element_data":{"action":"agentAlertSettingsList","dept_id":"3","admin_id":"1203"}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "agentAlertSettingsList";
    chat_req.dept_id = ids;
    chat_req.admin_id = this.admin_id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      this.agent_list = response.result.data.dept_users;
      this.email_setting_list = response.result.data.email_settings;
    },
      (error) => {
        console.log(error);
      });

  }

  addlistEmailDetails(ids) {

    // {"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"", "element_data":{"action":"agentAlertSettingsList","dept_id":"3","admin_id":"1203"}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "agentAlertSettingsList";
    chat_req.dept_id = ids;
    chat_req.admin_id = this.admin_id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      this.add_agent_list = response.result.data.dept_users;
    },
      (error) => {
        console.log(error);
      });

  }


  deptList() {
    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"get_dept_settings","user_id":"1203"}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "get_dept_settings";
    chat_req.user_id = this.admin_id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {
        const arr1 = response.result.data;
        const arr2 = response.result.data;

        this.email_dept = arr1.filter(d => d.has_email == 1);
        this.smtp_dept = arr1.filter(d => d.has_email == 1);
        this.dept_list = arr2.filter(d => d.has_email == 1);

      }
    },
      (error) => {
        console.log(error);
      });

  }


  // updateAgentSettings(agent_ids, index) {

  //   let new_email_alert_value;
  //   let reply_email_alert_value;
  //   let close_email_alert_value;
  //   let send_fullthread_value;


  //   if ($("#new_email_alert_" + index).prop("checked") == true) {
  //     new_email_alert_value = 1;
  //   } else if ($("#new_email_alert_" + index).prop("checked") == false) {
  //     new_email_alert_value = 0;
  //   }

  //   if ($("#reply_email_alert_" + index).prop("checked") == true) {
  //     reply_email_alert_value = 1;
  //   } else if ($("#reply_email_alert_" + index).prop("checked") == false) {
  //     reply_email_alert_value = 0;
  //   }
  //   if ($("#close_email_alert_" + index).prop("checked") == true) {
  //     close_email_alert_value = 1;
  //   } else if ($("#close_email_alert_" + index).prop("checked") == false) {
  //     close_email_alert_value = 0;
  //   }
  //   if ($("#send_full_thread_" + index).prop("checked") == true) {
  //     send_fullthread_value = 1;
  //   } else if ($("#send_full_thread_" + index).prop("checked") == false) {
  //     send_fullthread_value = 0;
  //   }


  //   let api_req: any = new Object();
  //   let chat_req: any = new Object();
  //   chat_req.action = "addAgentMailSetting";
  //   chat_req.agent_id = agent_ids;
  //   chat_req.admin_id = this.admin_id;
  //   chat_req.new_email_alert = new_email_alert_value;
  //   chat_req.reply_email_alert = reply_email_alert_value;
  //   chat_req.close_email_alert = close_email_alert_value;
  //   chat_req.send_fullthread = send_fullthread_value;
  //   api_req.operation = "ticket";
  //   api_req.moduleType = "ticket";
  //   api_req.api_type = "web";
  //   api_req.access_token = localStorage.getItem('access_token');
  //   api_req.element_data = chat_req;
  //   this.serverService.sendServer(api_req).subscribe((response: any) => {
  //     console.log(response);
  //     if (response.result.status == true) {

  //       this.listEmailDetails(this.selected_dept_id);

  //       iziToast.success({
  //         message: "Updated Agent Settings successfully",
  //         position: 'topRight'
  //       });

  //     } else {
  //       iziToast.error({
  //         message: "Failed to Update Agent Settings",
  //         position: 'topRight'
  //       });
  //     }

  //   },
  //     (error) => {
  //       console.log(error);
  //     });

  // }

  updateAgentSettings(agent_ids, index) {



    let new_email_alert_value;
    let reply_email_alert_value;
    let close_email_alert_value;
    let send_fullthread_value;


    if ($("#new_email_alert_" + index).prop("checked") == true) {
      new_email_alert_value = 1;
    } else if ($("#new_email_alert_" + index).prop("checked") == false) {
      new_email_alert_value = 0;
    }

    if ($("#reply_email_alert_" + index).prop("checked") == true) {
      reply_email_alert_value = 1;
    } else if ($("#reply_email_alert_" + index).prop("checked") == false) {
      reply_email_alert_value = 0;
    }
    if ($("#close_email_alert_" + index).prop("checked") == true) {
      close_email_alert_value = 1;
    } else if ($("#close_email_alert_" + index).prop("checked") == false) {
      close_email_alert_value = 0;
    }
    if ($("#send_full_thread_" + index).prop("checked") == true) {
      send_fullthread_value = 1;
    } else if ($("#send_full_thread_" + index).prop("checked") == false) {
      send_fullthread_value = 0;
    }

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"
    // ", "element_data":{"action":"update_agent_alert","user_id":"","new_email_alert":"","reply_email_alert":"","close_email_alert":"","send_fullthread":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "update_agent_alert";
    chat_req.user_id = agent_ids;
    chat_req.new_email_alert = new_email_alert_value;
    chat_req.reply_email_alert = reply_email_alert_value;
    chat_req.close_email_alert = close_email_alert_value;
    chat_req.send_fullthread = send_fullthread_value;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {

        // this.listEmailDetails(this.selected_dept_id);
        this.agentsList({});
        iziToast.success({
          message: "Updated Agent Settings successfully",
          position: 'topRight'
        });

      } else {
        iziToast.error({
          message: "Failed to Update Agent Settings",
          position: 'topRight'
        });
      }

    },
      (error) => {
        console.log(error);
      });

  }



  listDataInfo(list_data) {

    list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
    list_data.order_by_name = list_data.order_by_name == undefined ? "user.agent_name" : list_data.order_by_name;
    list_data.order_by_type = list_data.order_by_type == undefined ? "asc" : list_data.order_by_type;
    list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
    list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
    return list_data;
  }


  agentsList(data) {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"get_agents","user_id":"1250","limit":"5","offset":"0","search_text":""}}

    var list_data = this.listDataInfo(data);
    let api_req: any = new Object();
    let agents_req: any = new Object();
    agents_req.action = "get_agents";
    agents_req.user_id = localStorage.getItem('userId');
    agents_req.limit = list_data.limit;
    agents_req.offset = list_data.offset;
    agents_req.search_text = list_data.search_text;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = agents_req;

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      // this.agents_list = response.result.data.list_data;
      this.agent_list = response.result.data.list_data;
      this.offset_count = list_data.offset;
      this.total_agent_count = response.result.data.list_info.available_users;
      // this.able_to_add = response.result.data.list_info.can_add;
      this.paginationData = this.serverService.pagination({ 'offset': response.result.data.list_info.offset, 'total': response.result.data.list_info.total, 'page_limit': this.pageLimit });
      this.recordNotFound = this.agent_list.length == 0 ? true : false;


    },
      (error) => {
        console.log(error);
      });
  }



  addAgentSettings() {

    // {"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"", "element_data":{"action":"addAgentMailSetting","agent_id":"1277","admin_id":"1203","new_email_alert":"1","reply_email_alert":"0","close_email_alert":"1","send_fullthread":"0"}}

    // $('#voice_3cx').prop('checked', true);
    let new_email_alert_value;
    let reply_email_alert_value;
    let close_email_alert_value;
    let send_fullthread_value;
    let agent_ids = $("#add_agent_name").val();

    if ($("#new_email_alert_add").prop("checked") == true) {
      new_email_alert_value = 1;
    } else if ($("#new_email_alert_add").prop("checked") == false) {
      new_email_alert_value = 0;
    }

    if ($("#reply_email_alert_add").prop("checked") == true) {
      reply_email_alert_value = 1;
    } else if ($("#reply_email_alert_add").prop("checked") == false) {
      reply_email_alert_value = 0;
    }
    if ($("#close_email_alert_add").prop("checked") == true) {
      close_email_alert_value = 1;
    } else if ($("#close_email_alert_add").prop("checked") == false) {
      close_email_alert_value = 0;
    }
    if ($("#fullthread_add").prop("checked") == true) {
      send_fullthread_value = 1;
    } else if ($("#fullthread_add").prop("checked") == false) {
      send_fullthread_value = 0;
    }


    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "addAgentMailSetting";
    chat_req.agent_id = agent_ids;
    chat_req.admin_id = this.admin_id;
    chat_req.new_email_alert = new_email_alert_value;
    chat_req.reply_email_alert = reply_email_alert_value;
    chat_req.close_email_alert = close_email_alert_value;
    chat_req.send_fullthread = send_fullthread_value;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {

        $('#add_agentform').modal('hide');
        this.listEmailDetails(this.selected_dept_id);

        iziToast.success({
          message: "Updated Agent Settings successfully",
          position: 'topRight'
        });

      } else {
        iziToast.error({
          message: "Failed to Update Agent Settings",
          position: 'topRight'
        });
      }

    },
      (error) => {
        console.log(error);
      });

  }

  getalldeptList() {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"getAllEmailDept","admin_id":"1203"}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "getAllEmailDept";
    chat_req.admin_id = this.admin_id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {
        // aliseEmail: null
        // departments: "3"
        // emailAddr: "nzassaaloycc@pipe.mconnectapps.com"
        // id: "1";

        this.get_all_dept_list = response.result.data.alldata;
        this.get_admin_ids = response.result.data.adminEmail;
        this.round_robin = response.result.data.roundrobin;
        this.limit_count= response.result.data.ticket_limit;
        if(response.result.data.profile_picture_permission =='0'){
          $('#profile_pic_share').prop('checked',true);
        }
        else{
          $('#profile_pic_share').prop('checked',false);
          
        }
        //Delete ticket perm toggle
        if(response.result.data.agent_delete_permission =='1'){
          $('#delete_ticket_prem').prop('checked',true);
        }
        else{
          $('#delete_ticket_prem').prop('checked',false);
          
        }
  if(this.round_robin =='0'){
    $('#round_rob_set').prop('checked',false);
    $(".font-medium3").addClass('ring-all');
    $(".font-medium2").removeClass('round-rob');
    // alert('asas')
    this.has_round_robin=false;
  }
  else{
    $('#round_rob_set').prop('checked',true);
    $(".font-medium2").addClass('round-rob');
    $(".font-medium3").removeClass('ring-all');
    this.has_round_robin=true;


  }

      }
    },
      (error) => {
        console.log(error);
      });

  }


  addEmailData() {




    let depts = $("#add_dept_name").val();
    let alias = this.forwarder_list.controls['alias_name'].value;
    let sender_ids = this.forwarder_list.controls['sender_id'].value;
    let emails = $("#add_default_email").val();

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "addUpdateDeptToEmail";
    chat_req.admin_id = this.admin_id;
    chat_req.email = emails;
    chat_req.aliseEmail = alias;
    // chat_req.senderID = sender_ids;
    chat_req.senderID = alias;
    chat_req.departments = depts;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {
        $('#add_deptform').modal('hide');
        this.getalldeptList();
        iziToast.success({
          message: "Created Forwarder Email successfully",
          position: 'topRight'
        });
      }
    },
      (error) => {
        console.log(error);
      });

  }


  updateEmailData() {



    let depts = $("#edit_dept_name").val();
    let emails = $("#edit_default_email").val();
    let sender_ids = $("#edit_sender_id").val();
    let alias = $("#edit_alias_name").val();
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "addUpdateDeptToEmail";
    chat_req.admin_id = this.admin_id;
    chat_req.email = emails;
    chat_req.departments = depts;
    chat_req.aliseEmail = alias;
    // chat_req.senderID = sender_ids;
    chat_req.senderID = alias;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.data == true) {
        $('#edit_deptform').modal('hide');
        this.getalldeptList();
        iziToast.success({
          message: "Updated Forwarder Email successfully",
          position: 'topRight'
        });
      } else {
        iziToast.success({
          message: "Updated Forwarder Email Failed",
          position: 'topRight'
        });
      }
    },
      (error) => {
        console.log(error);
      });

  }



  editEmailSettings(emailAdds) {



    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "getEmailDept";
    chat_req.admin_id = this.admin_id;
    chat_req.id = emailAdds;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.status == 'true') {


        // senderID
        var spliting = response.values.options;
        var filtered = spliting.split(",");
        this.edit_sender_value = filtered.filter(function (e) { return e != ""; });

        $("#edit_dept_name").val(response.data.deprtments);
        $("#edit_default_email").val(response.data.emailAddr);
        $("#edit_alias_name").val(response.data.aliseEmail);

        setTimeout(() => {
          $("#edit_sender_id").val(response.data.senderID);

        }, 1000);
        $('#edit_deptform').modal('show');

      }
    },
      (error) => {
        console.log(error);
      });

  }

  deletedata(ids) {

  

    Swal.fire({
      title: 'Are you sure?',
      text: "Would like to delete the Forwarder Email!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        let api_req: any = new Object();
        let chat_req: any = new Object();
        chat_req.action = "delEmailDept";
        chat_req.admin_id = this.admin_id;
        // chat_req.email = emailds;
        chat_req.id = ids;
        api_req.operation = "ticket";
        api_req.moduleType = "ticket";
        api_req.api_type = "web";
        api_req.access_token = localStorage.getItem('access_token');
        api_req.element_data = chat_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          console.log(response);
          if (response.result.status == true) {
            this.getalldeptList();
            iziToast.success({
              message: "Delete Forwarder Email successfully",
              position: 'topRight'
            });
          } else {

            iziToast.error({
              message: "Delete Forwarder Email Failed",
              position: 'topRight'
            });
          }
        },
          (error) => {
            console.log(error);
          });


      }
    });




  }



  // ========================================== ADMIN EMAIL SETTINGS =================================================

  createAdminGroup() {
    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"add_email_group","user_id":"","group_name":"","email":""}}


    var new_array = [];
    this.addGroupValue.forEach(element => {
      new_array.push(element.name);
    });
    var group_emails = new_array.join(",");


    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "add_email_group";
    chat_req.user_id = this.loginUser;
    chat_req.group_name = this.addGroup.controls['add_group_name'].value;
    chat_req.email = group_emails;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.data == 1) {
        $('#add_admingroup').modal('hide');
        this.addGroupValue = [];
        iziToast.success({
          message: "Created Admin Group successfully",
          position: 'topRight'
        });
        this.listAdminGroup();
      } else {

        iziToast.error({
          message: "Failed to Created Admin Group",
          position: 'topRight'
        });
      }
    },
      (error) => {
        console.log(error);
      });

  }


  listAdminGroup() {
    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"list_email_group","user_id":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "list_email_group";
    chat_req.user_id = this.loginUser;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        this.admin_grp_list = response.result.data;
      }


    },
      (error) => {
        console.log(error);
      });

  }


  editGroupSettings(ids) {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"edit_email_group","group_id":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "edit_email_group";
    chat_req.group_id = ids,
      api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {


        $('#edit_admingroup').modal('show');
        $('#edit_group_name').val(response.result.data[0].group_name);
        $('#edit_grp_ids').val(response.result.data[0].id);


        if (response.result.data[0].new_email_alert == 1) {
          $('#new_email_alert_group').prop('checked', true);
        } else if (response.result.data[0].new_email_alert == 0) {
          $('#new_email_alert_group').prop('checked', false);

        }

        if (response.result.data[0].reply_email_alert == 1) {
          $('#reply_email_alert_group').prop('checked', true);
        } else if (response.result.data[0].reply_email_alert == 0) {
          $('#reply_email_alert_group').prop('checked', false);
        }

        if (response.result.data[0].close_email_alert == 1) {
          $('#close_email_alert_group').prop('checked', true);
        } else if (response.result.data[0].close_email_alert == 0) {
          $('#close_email_alert_group').prop('checked', false);
        }

        if (response.result.data[0].send_fullthread == 1) {
          $('#fullthread_group').prop('checked', true);
        } else if (response.result.data[0].send_fullthread == 0) {
          $('#fullthread_group').prop('checked', false);
        }



        var agent_data = response.result.data[0];
        this.editwrapUpCode = [];

        var edit_splits = agent_data.email.split(',');
        console.log(edit_splits);
        edit_splits.forEach(element => {
          this.editwrapUpCode.push({ name: element });
        });



      }


    },
      (error) => {
        console.log(error);
      });

  }


  deleteGroupSettings(ids) {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":", "element_data":{"action":"delete_email_group","group_id":""}}

    Swal.fire({
      title: 'Are you sure?',
      text: "Would like to delete the Group!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        let api_req: any = new Object();
        let chat_req: any = new Object();
        chat_req.action = "delete_email_group";
        chat_req.group_id = ids,
          api_req.operation = "ticket";
        api_req.moduleType = "ticket";
        api_req.api_type = "web";
        api_req.access_token = localStorage.getItem('access_token');
        api_req.element_data = chat_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.status == true) {

            iziToast.success({
              message: "Delete Group successfully",
              position: 'topRight'
            });
            this.listAdminGroup();

          } else {

            iziToast.error({
              message: "Delete Group Failed",
              position: 'topRight'
            });
          }


        },
          (error) => {
            console.log(error);
          });

      }

    });
  }



  updatedEditGroup() {

    let new_email_alert_value;
    let reply_email_alert_value;
    let close_email_alert_value;
    let send_fullthread_value;

    let group_name = $('#edit_group_name').val();
    let group_ids = $('#edit_grp_ids').val();

    if ($("#new_email_alert_group").prop("checked") == true) {
      new_email_alert_value = 1;
    } else if ($("#new_email_alert_group").prop("checked") == false) {
      new_email_alert_value = 0;
    }

    if ($("#reply_email_alert_group").prop("checked") == true) {
      reply_email_alert_value = 1;
    } else if ($("#reply_email_alert_group").prop("checked") == false) {
      reply_email_alert_value = 0;
    }
    if ($("#close_email_alert_group").prop("checked") == true) {
      close_email_alert_value = 1;
    } else if ($("#close_email_alert_group").prop("checked") == false) {
      close_email_alert_value = 0;
    }
    if ($("#fullthread_group").prop("checked") == true) {
      send_fullthread_value = 1;
    } else if ($("#fullthread_group").prop("checked") == false) {
      send_fullthread_value = 0;
    }

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"update_email_group","group_id":"","group_name":"","email":"","new_email_alert":"","reply_email_alert":"","close_email_alert":"","send_fullthread":""}}

    var new_array = [];
    this.editwrapUpCode.forEach(element => {
      new_array.push(element.name);
    });

    var group_emails = new_array.join(",");


    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "update_email_group";
    chat_req.group_id = group_ids;
    chat_req.group_name = group_name;
    chat_req.email = group_emails;
    chat_req.new_email_alert = new_email_alert_value;
    chat_req.reply_email_alert = reply_email_alert_value;
    chat_req.close_email_alert = close_email_alert_value;
    chat_req.send_fullthread = send_fullthread_value;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.data == 1) {


        $('#edit_admingroup').modal('hide');
        this.listAdminGroup();
        iziToast.success({
          message: "Updated Group Settings successfully",
          position: 'topRight'
        });

      } else {
        iziToast.error({
          message: "Failed to Update Group Settings",
          position: 'topRight'
        });
      }

    },
      (error) => {
        console.log(error);
      });


  }

  updateGroupSettings(grp_id, index) {

    let new_email_alert_value;
    let reply_email_alert_value;
    let close_email_alert_value;
    let send_fullthread_value;


    if ($("#grp_new_email_alert_" + index).prop("checked") == true) {
      new_email_alert_value = 1;
    } else if ($("#grp_new_email_alert_" + index).prop("checked") == false) {
      new_email_alert_value = 0;
    }

    if ($("#grp_reply_email_alert_" + index).prop("checked") == true) {
      reply_email_alert_value = 1;
    } else if ($("#grp_reply_email_alert_" + index).prop("checked") == false) {
      reply_email_alert_value = 0;
    }
    if ($("#grp_close_email_alert_" + index).prop("checked") == true) {
      close_email_alert_value = 1;
    } else if ($("#grp_close_email_alert_" + index).prop("checked") == false) {
      close_email_alert_value = 0;
    }
    if ($("#grp_send_full_thread_" + index).prop("checked") == true) {
      send_fullthread_value = 1;
    } else if ($("#grp_send_full_thread_" + index).prop("checked") == false) {
      send_fullthread_value = 0;
    }


    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"addGroupMailSetting","group_id":"1","new_email_alert":"1","reply_email_alert":"0","close_email_alert":"1","send_fullthread":"0"}}
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "addGroupMailSetting";
    chat_req.group_id = grp_id;
    chat_req.new_email_alert = new_email_alert_value;
    chat_req.reply_email_alert = reply_email_alert_value;
    chat_req.close_email_alert = close_email_alert_value;
    chat_req.send_fullthread = send_fullthread_value;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {

        this.listAdminGroup();
        iziToast.success({
          message: "Updated Group Settings successfully",
          position: 'topRight'
        });

      } else {
        iziToast.error({
          message: "Failed to Update Group Settings",
          position: 'topRight'
        });
      }

    },
      (error) => {
        console.log(error);
      });


  }



  // ================================= SMTP SETTINGS====================================


  smtpList() {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"list_smtp","user_id":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "list_smtp";
    chat_req.user_id = this.loginUser;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {

        this.smtp_list = response.result.data;
      }


    },
      (error) => {
        console.log(error);
      });

  }

  addSMTP() {
    $('#add_smtpform').modal('show');
  }


  createsmtpList() {


    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"addSmtpSetting","user_id":"","hostname":"","port":"","username":"","password":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "addSmtpSetting";
    chat_req.user_id = this.loginUser;
    chat_req.hostname = this.addSmtpData.controls['host_name'].value;
    chat_req.port = this.addSmtpData.controls['port_num'].value;
    chat_req.username = this.addSmtpData.controls['smtp_username'].value;
    chat_req.password = btoa(this.addSmtpData.controls['smtp_pasword'].value);
    chat_req.departments = $("#add_smtp_dept").val();
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {

        $('#add_smtpform').modal('hide');
        this.smtpList();
        iziToast.success({
          message: "Create SMTP successfully",
          position: 'topRight'
        });

      } else {
        iziToast.error({
          message: "Create SMTP Failed",
          position: 'topRight'
        });
      }


    },
      (error) => {
        console.log(error);
      });

  }

  editsmtpData(ids) {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"get_smtp_byid","id":""}}
    this.get_id_updates = ids;
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "get_smtp_byid";
    chat_req.id = ids;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {

        $('#edit_smtpform').modal('show');

        this.editSmtpDatas.patchValue({
          edit_host_name: response.result.data[0].hostname,
          edit_port_num: response.result.data[0].port,
          edit_smtp_username: response.result.data[0].username,
          edit_smtp_pasword: atob(response.result.data[0].password)
        });
        $("#edit_smtp_dept").val(response.result.data[0].departments);

      }

    },
      (error) => {
        console.log(error);
      });

  }


  updatesmtpList() {

    //   {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"
    // ", "element_data":{"action":"updateSmtpSetting","id":"","hostname":"","port":"","username":"","password":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "updateSmtpSetting";
    chat_req.id = this.get_id_updates;
    chat_req.hostname = this.editSmtpDatas.controls['edit_host_name'].value;
    chat_req.port = this.editSmtpDatas.controls['edit_port_num'].value;
    chat_req.username = this.editSmtpDatas.controls['edit_smtp_username'].value;
    chat_req.password = btoa(this.editSmtpDatas.controls['edit_smtp_pasword'].value);
    chat_req.departments = $("#edit_smtp_dept").val();
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {

        $('#edit_smtpform').modal('hide');
        this.smtpList();
        iziToast.success({
          message: "Update SMTP successfully",
          position: 'topRight'
        });

      } else {
        iziToast.error({
          message: "Update SMTP Failed",
          position: 'topRight'
        });
      }


    },
      (error) => {
        console.log(error);
      });

  }

  deletesmtpdata(ids) {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"delete_smtp","id":""}}
    Swal.fire({
      title: 'Are you sure?',
      text: "Would like to delete this SMTP Details!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        let api_req: any = new Object();
        let chat_req: any = new Object();
        chat_req.action = "delete_smtp";
        chat_req.id = ids;
        api_req.operation = "ticket";
        api_req.moduleType = "ticket";
        api_req.api_type = "web";
        api_req.access_token = localStorage.getItem('access_token');
        api_req.element_data = chat_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.status == true) {
            this.smtpList();
            iziToast.success({
              message: "Delete SMTP successfully",
              position: 'topRight'
            });

          } else {
            iziToast.error({
              message: "Deleting SMTP Failed",
              position: 'topRight'
            });
          }


        },
          (error) => {
            console.log(error);
          });

      }

    });

  }

  toggleSmtpStatus(ids, index) {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"set_default_smtp","id":"2","value":"1"}}


    let values;

    if ($("#smtp_status_" + index).prop("checked") == true) {
      values = 1;
    } else if ($("#smtp_status_" + index).prop("checked") == false) {
      values = 0;
    }
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "set_default_smtp";
    chat_req.id = ids;
    chat_req.value = values;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {

        this.smtpList();
        iziToast.success({
          message: "Update SMTP status successfully",
          position: 'topRight'
        });

      } else {
        iziToast.error({
          message: "Update SMTP status Failed",
          position: 'topRight'
        });
      }

    },
      (error) => {
        console.log(error);
      });




  }
  robin_update() {
    var rob = '0';
    var limit='0';
    var text="Would you Need to Assign incoming email to all agents in the department?";
      if($('#round_rob_set').prop('checked')){ rob = '1'; limit=this.limit_count; text="Do you want to change, and be assigned a round-robin system for incoming email to Department agents?"; }
    // let rob=$('#round_rob_set').val();

// return false;
    Swal.fire({
      title: 'Are you sure?',
      text: text ,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.value) {
        let api_req: any = new Object();
        let chat_req: any = new Object();
        chat_req.action = "update_override";
        chat_req.admin_id = this.admin_id;
        chat_req.value = rob;
        chat_req.ticket_limit = limit;
        api_req.operation = "ticket";
        api_req.moduleType = "ticket";
        api_req.api_type = "web";
        api_req.access_token = localStorage.getItem('access_token');
        api_req.element_data = chat_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.status == true) {
            this.getalldeptList();
            iziToast.success({
              message: "Changed Incomming Email strategy successfully",
              position: 'topRight'
            });

          } else {
            iziToast.error({
              message: "Deleting SMTP Failed",
              position: 'topRight'
            });
          }


        },
          (error) => {
            console.log(error);
          });

      }
else{
  this.getalldeptList();
}
    });

  }
  filterList() {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"list_smtp","user_id":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "list_email_filter";
    chat_req.user_id = this.admin_id;
    chat_req.admin_id = this.admin_id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {

        this.filter_list = response.result.data;
      }

    },
      (error) => {
        console.log(error);
      });

  }
  createFilter() {

let keyword=$('#Add_keyword').val();
    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"addSmtpSetting","user_id":"","hostname":"","port":"","username":"","password":""}}
if(keyword==''){
  iziToast.warning({
    message:'Please enter the keyword',
    position:"topRight"
  });
  return false;
}
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "add_email_filter";
    chat_req.admin_id = this.admin_id;
    chat_req.user_id = this.admin_id;
    chat_req.keyword = keyword;
    
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {

        $('#createNewFilter').modal('hide');
        this.filterList();
        iziToast.success({
          message: "Filter Keyword Created",
          position: 'topRight'
        });

      } 
      else if (response.result.data == 2) {
        iziToast.warning({
            message: "Keyword Already Inserted",
            position: 'topRight'
        });
    }else {
        iziToast.error({
          message: "Filter  Creation Failed",
          position: 'topRight'
        });
      }


    },
      (error) => {
        console.log(error);
      });

  }
  EditFilter(ids) {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"get_smtp_byid","id":""}}
    this.get_id_updates = ids;
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "get_smtp_byid";
    chat_req.id = ids;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {

        $('#edit_smtpform').modal('show');

        this.editSmtpDatas.patchValue({
          edit_host_name: response.result.data[0].hostname,
          edit_port_num: response.result.data[0].port,
          edit_smtp_username: response.result.data[0].username,
          edit_smtp_pasword: atob(response.result.data[0].password)
        });
        $("#edit_smtp_dept").val(response.result.data[0].departments);

      }

    },
      (error) => {
        console.log(error);
      });

  }


  updateFilterList() {

    //   {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"
    // ", "element_data":{"action":"updateSmtpSetting","id":"","hostname":"","port":"","username":"","password":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "updateSmtpSetting";
    chat_req.id = this.get_id_updates;
    chat_req.hostname = this.editSmtpDatas.controls['edit_host_name'].value;
    chat_req.port = this.editSmtpDatas.controls['edit_port_num'].value;
    chat_req.username = this.editSmtpDatas.controls['edit_smtp_username'].value;
    chat_req.password = btoa(this.editSmtpDatas.controls['edit_smtp_pasword'].value);
    chat_req.departments = $("#edit_smtp_dept").val();
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {

        $('#edit_smtpform').modal('hide');
        this.smtpList();
        iziToast.success({
          message: "Update SMTP successfully",
          position: 'topRight'
        });

      } else {
        iziToast.error({
          message: "Update SMTP Failed",
          position: 'topRight'
        });
      }


    },
      (error) => {
        console.log(error);
      });

  }

  DeleteFilter(ids) {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"delete_smtp","id":""}}
    Swal.fire({
      title: 'Would like to Remove this Keyword?',
      text: "This means that you will receive the email even though it has keyword",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove'
    }).then((result) => {
      if (result.value) {
        let api_req: any = new Object();
        let chat_req: any = new Object();
        chat_req.action = "delete_email_filter";
        chat_req.key_id = ids;
        api_req.operation = "ticket";
        api_req.moduleType = "ticket";
        api_req.api_type = "web";
        api_req.access_token = localStorage.getItem('access_token');
        api_req.element_data = chat_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.status == true) {
            this.filterList();
            iziToast.success({
              message: "Keyword Removed successfully",
              position: 'topRight'
            });

          } else {
            iziToast.error({
              message: "Deleting Failed",
              position: 'topRight'
            });
          }


        },
          (error) => {
            console.log(error);
          });

      }

    });

  }
  shareMyTicket(agent_ids,index){
    let share_tick=1;
    if ($("#share_my_ticket" + index).prop("checked") == true) {
      share_tick = 1;
    } else {
      share_tick = 0;
    }
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "update_share_ticket";
    chat_req.share_ticket =share_tick;
    chat_req.user_id = agent_ids;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1){
          // this.agentsList({});
          iziToast.success({
            message:"Settings updated",
            position:"topRight"
          });
      }
    },
      (error) => {
        console.log(error);
      });
  }
  shareMyPciture(){
    let share_tick=0;
    if ($("#profile_pic_share").prop("checked") == true) {
      share_tick = 0;
    } else {
      share_tick = 1;
    }
    Swal.fire({
      title: 'Show Profile Picture',
      text: "Users' profile picture will be displayed in outgoing emails",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update!'
    }).then((result) => {
      if (result.value) {
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "agent_picture_permission";
    chat_req.value =share_tick;
    chat_req.user_id = this.admin_id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1){
          // this.agentsList({});
          iziToast.success({
            message:"Settings updated",
            position:"topRight"
          });
      }
    },
      (error) => {
        console.log(error);
      });
    }
    else{
      this.getalldeptList();
    }
    });
 
  } 

  add2(event: MatChipInputEvent): void {
    // console.log(this.addDept.status);
    const input = event.input;
    const value = event.value; 
   
 
      if ((value || '').trim()) {
        this.priority_list.push({ name: value.trim() });
      }
      if (input) {
        input.value = '';
      }
  

  }



  remove2(code): void {
    const index = this.priority_list.indexOf(code);
    if (index >= 0) {
      this.priority_list.splice(index, 1);
    }
  }


  editadd2(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.editwrapUpCode2.push({ name: value.trim() });
    }
    if (input) {
      input.value = '';
    }


  }

  editremove2(code): void {
    const index = this.editwrapUpCode2.indexOf(code);
    if (index >= 0) {
      this.editwrapUpCode2.splice(index, 1);
    }
  }

  PriorityFilterList() {

    // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"list_smtp","user_id":""}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "list_priority_filter";
    chat_req.user_id = this.admin_id;  
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {

        this.priorityQueue = response.result.data;
        console.log(this.priorityQueue);
        this.new_priorityQueue = [];

        this.priorityQueue.forEach(element => {
          var splitted = element.key_word.split(",");
          this.new_priorityQueue.push({ priority: element.priority,priority_id: element.priority_id, key_word: splitted, id: element.id });

        });
      }

    },
      (error) => {
        console.log(error);
      });

  }
  getpriority() {   
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "getPriorities";  
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {
        this.priorityLists = response.result.data;
        console.log(this.priorityLists)
        
      }

    },
      (error) => {
        console.log(error);
      });

  }
  addPriorityFilter(){
    let access_token: any=localStorage.getItem('access_token');
    var new_array = [];
    this.priority_list.forEach(element => {
      new_array.push(element.name);
    });
    
    var keyword = new_array.join(",");
    if(keyword==""){
      iziToast.warning({
        message:"Type keywords",
        position:"topRight"
      })
      return false;
    }
    if($('#add_pri_id').val()==''||$('#add_pri_id').val()==null ||$('#add_pri_id').val()==0)
    return false;

    this.priority_list = [];
    Swal.fire({
			html:
				'<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
		showCloseButton: false,
			showCancelButton: false,
			showConfirmButton: false,
			focusConfirm: false,
			background: 'transparent',
		});
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "add_priority_filter";  
    chat_req.user_id = this.admin_id;  
    chat_req.admin_id = this.admin_id;  
    chat_req.keyword = keyword;  
    chat_req.priority= $('#add_pri_id').val();
    chat_req.action = "add_priority_filter";  
    api_req.operation = "add_priority_filter";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      Swal.close();
      if (response.status == true) {
      
 this.PriorityFilterList();  
 $('#add_priority').modal('hide');  
      }

    },
      (error) => {
        console.log(error);
      });

  }
  statusChange() {

    var status_ids = $('#add_pri_id').val();
        var present = this.new_priorityQueue.filter(function (item) {
      return item.priority_id == status_ids;
    });
   
    console.log(present.length);
    if (present.length >0) {
    iziToast.warning({
      message:"Already Exists",
      position:"topRight"
    });  
    $('#add_pri_id').val(0);
    } 
  }
  editprioritySettings(ids){
 
   

      // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"edit_email_group","group_id":""}}
  
      let api_req: any = new Object();
      let chat_req: any = new Object();
      chat_req.action = "edit_priority_filter";
      chat_req.key_id = ids,
      api_req.operation = "edit_priority_filter";
      api_req.moduleType = "ticket";
      api_req.api_type = "web";
      api_req.access_token = localStorage.getItem('access_token');
      api_req.element_data = chat_req;
      this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == true) {  
          $('#edit_priority').modal('show');        
          var agent_data = response.result.data[0];
          this.editwrapUpCode2 = [];
          var edit_splits = agent_data.key_word.split(',');
          console.log(edit_splits);
          edit_splits.forEach(element => {
            this.editwrapUpCode2.push({ name: element });
          });
  
  this.key_id=agent_data.id;
  
        }
  
  
      },
        (error) => {
          console.log(error);
        });
  
    }
    updatePriority(){
   

    
      
        // {"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"", "element_data":{"action":"update_email_group","group_id":"","group_name":"","email":"","new_email_alert":"","reply_email_alert":"","close_email_alert":"","send_fullthread":""}}
    
        var new_array = [];
        this.editwrapUpCode2.forEach(element => {
          new_array.push(element.name);
        });
    
        var keys = new_array.join(",");    
    
        let api_req: any = new Object();
        let chat_req: any = new Object();
        chat_req.action = "update_priority_filter";
        chat_req.key_id = this.key_id;
        chat_req.key_word = keys;
        api_req.operation = "update_priority_filter";
        api_req.moduleType = "ticket";
        api_req.api_type = "web";
        api_req.access_token = localStorage.getItem('access_token');
        api_req.element_data = chat_req;
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          console.log(response);
          if (response.result.data == 1) {        
            $('#edit_priority').modal('hide');
            this.PriorityFilterList();
            iziToast.success({
              message: "Keywords Updated successfully",
              position: 'topRight'
            });
    
          } else {
            iziToast.error({
              message: "Failed to Update,Please try again",
              position: 'topRight'
            });
          }
    
        },
          (error) => {
            console.log(error);
          });
    
    
         
    }
    deletefilterdata(ids) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Would like to delete the keyword!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
  
          let api_req: any = new Object();
          let chat_req: any = new Object();
          chat_req.action = "delete_priority_filter";
          chat_req.key_id = ids;
          api_req.operation = "delete_priority_filter";
          api_req.moduleType = "ticket";
          api_req.api_type = "web";
          api_req.access_token = localStorage.getItem('access_token');
          api_req.element_data = chat_req;
          this.serverService.sendServer(api_req).subscribe((response: any) => {
            if (response.result.status == true) {
              this.PriorityFilterList();
              iziToast.success({
                message: "Keyword Deleted successfully",
                position: 'topRight'
              });
            } else {  
              iziToast.error({
                message: "Delete Failed,please try again",
                position: 'topRight'
              });
            }
          },
            (error) => {
              console.log(error);
            });
        }
      });
  }
  manageDeletePerm(){
    let share_tick=0;
    var text;
    if ($("#delete_ticket_prem").prop("checked") == true) {
      share_tick = 1;
      text="Users can delete their tickets!";
    
    } else {
      share_tick = 0;
      text="Users will not be allowed to delete their tickets!";
    }
    Swal.fire({
      title: 'Delete Ticket Permission',
      text: text,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update!'
    }).then((result) => {
      if (result.value) {
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "agent_delete_setting";
    chat_req.value =share_tick;
    chat_req.admin_id = this.admin_id;
    api_req.operation = "ticket";
    api_req.moduleType = "ticket";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1){
          // this.agentsList({});
          iziToast.success({
            message:"Settings updated",
            position:"topRight"
          });
      }
    },
      (error) => {
        console.log(error);
      });
    }
    else{
      this.getalldeptList();
    }
    });
 
  } 
}
