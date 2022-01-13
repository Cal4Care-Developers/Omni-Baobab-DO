import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
declare var $: any;
declare var iziToast: any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-aux-code',
  templateUrl: './aux-code.component.html',
  styleUrls: ['./aux-code.component.css']
})
export class AuxCodeComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addDept: FormGroup;
  addCat: FormGroup;
  editDept: FormGroup;
  editCategory: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  dep_status;
  dep_id;
  dep_cat_id;
  new_queue_lists;
  cate_id;
  agents_list;
  new_cat_query_list;
  userchecked;
  doc_link;
  cat_query_list;
  dept_name_list;
  user_id;

  email_error_msg;
  show_email_errors= false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  presentEmails = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  wrapUpCode = [];
  editwrapUpCode = [];

  constructor(private serverService: ServerService) { }



  add(event: MatChipInputEvent): void {
    // console.log(this.addDept.status);
    const input = event.input;
    const value = event.value;


    let myItems = this.wrapUpCode.filter(item => item.name === value);
    console.log(myItems.length);
    // Add our fruit
    if (myItems.length < 1) {
      if ((value || '').trim()) {
        this.wrapUpCode.push({ name: value.trim() });
      }
      if (input) {
        input.value = '';
      }
    } else {
      this.presentEmails = true;
    }

  }



  remove(code): void {
    const index = this.wrapUpCode.indexOf(code);
    if (index >= 0) {
      this.wrapUpCode.splice(index, 1);
    }
  }


  editadd(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // {"operation":"contact","moduleType":"contact","api_type":"web","access_token":"","element_data":{"action":"check_aux_code","admin_id":"1203","cat_id":"38","aux_code":"Complaint - Case"}}

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "check_aux_code";
    chat_req.admin_id = this.uadmin_id;
    chat_req.cat_id = this.dep_id;
    chat_req.aux_code = event.value;
    api_req.operation = "contact";
    api_req.moduleType = "contact";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {


      if (response.result.data == 0) {
        this.show_email_errors = true;
        this.email_error_msg = 'This wrapCode already existed';
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


  }

  editremove(code): void {
    const index = this.editwrapUpCode.indexOf(code);
    if (index >= 0) {
      this.editwrapUpCode.splice(index, 1);
    }
  }




  ngOnInit() {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.user_id = localStorage.getItem('admin_id');
    this.addDept = new FormGroup({
      'department_name': new FormControl(null, Validators.required),
    });

    this.addCat = new FormGroup({
      'cat_name': new FormControl(null, Validators.required),
    });

    this.editDept = new FormGroup({
      'department_name': new FormControl(null, Validators.required),
    });
    this.editCategory = new FormGroup({
      'cat_name': new FormControl(null, Validators.required),
    });
    this.dept_settings();
    this.category_list();
    this.dept_list();
  }

  dept_settings() {
    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_aux_code","admin_id":"' + this.uadmin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        this.queue_list = response.result.data;
        this.new_queue_lists = [];

        this.queue_list.forEach(element => {
          var splitted = element.auxcode_name.split(",");
          this.new_queue_lists.push({ category_name: element.category_name, auxcode_name: splitted, cat_id: element.cat_id });

        });

        console.log(this.queue_list);
      } else {
        this.recordNotFound = true;
      }
    },
      (error) => {
        console.log(error);
      });
  }






  editDepartmentSettings(id) {
    let access_token: any = localStorage.getItem('access_token');


    // {"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"", "element_data":{"action":"edit_aux_code","cat_id":"6","admin_id":"1203"}}

    let api_req: any = '{"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"edit_aux_code","cat_id":"' + id + '","admin_id":"' + this.uadmin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        var agent_data = response.result.data;
        this.editwrapUpCode = [];
        //   this.editDept.setValue({
        //      'department_name' : agent_data.auxcode_name,
        //  });
        var edit_splits = agent_data.auxcode_name.split(',');
        console.log(edit_splits);
        edit_splits.forEach(element => {
          this.editwrapUpCode.push({ name: element });
        });
        console.log(this.editwrapUpCode);
        this.dep_id = response.result.data.cat_id;
        $('#catecodes').val(response.result.data.cat_id);



        $('#edit_deptform').modal('show');
        //  this.dept_settings();
      } else {

        iziToast.warning({
          message: "Wrap Up codes not retrive. Please try again",
          position: 'topRight'
        });

      }
    },
      (error) => {
        console.log(error);
      });
  }

  addDepartment() {
    $('#add_deptform').modal('show');
  }


  editDepartment(id) {

    let agent_req: any = this.editDept.value;
    let access_token: any = localStorage.getItem('access_token');
    let new_cat_id = $('#catecodes').val();

    // {"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"", "element_data":{"action":"update_aux_code","auxcode_name":"Priority 1,General Inquiry,P5","admin_id":"1203","cat_id":"6"}}
    var new_array = [];
    this.editwrapUpCode.forEach(element => {
      new_array.push(element.name);
    });
    var agent_dept = new_array.join(",");
    if (agent_req.status == true) { this.dep_status = 1 } else { this.dep_status = 0 }
    let api_req: any = '{"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"update_aux_code","auxcode_name":"' + agent_dept + '","cat_id":"' + new_cat_id + '","admin_id":"' + this.uadmin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == 1) {
        $('#edit_deptform').modal('hide');
        this.dept_settings();
        iziToast.success({
          message: "WrapUp updated successfully",
          position: 'topRight'
        });
      } else {

        iziToast.warning({
          message: "WrapUp not updated. Please try again",
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



  addDeptData() {

    let agent_req: any = this.addDept.value;
    let add_cat_id: any = $('#add_cat_id').val();
    if (agent_req.status == true) { this.dep_status = 1 } else { this.dep_status = 0 }
    let access_token: any = localStorage.getItem('access_token');

    // {"operation":"addAuxcode", "moduleType": "contact", "api_type": "web", "access_token":"", "element_data":{"action":"add_aux_code","auxcode_name":"test1,test2,test3","status":"0","cat_id":"5","admin_id":"1203"}}
    var new_array = [];
    this.wrapUpCode.forEach(element => {
      new_array.push(element.name);
    });
    var agent_dept = new_array.join(",");
    // console.log(agent_dept);
    // return false;
    let api_req: any = '{"operation":"addAuxcode", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"add_aux_code","auxcode_name":"' + agent_dept + '","status":"' + this.dep_status + '","cat_id":"' + add_cat_id + '","admin_id":"' + this.uadmin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      this.addDept.reset();
      if (response.result.data == 1) {
        $('#add_deptform').modal('hide');
        iziToast.success({
          message: "Wrap Up Code added successfully",
          position: 'topRight'
        });
        this.dept_settings();
      }
      else if (response.result.data == 2) {
        iziToast.warning({
          message: "Wrap Up Code name already inserted",
          position: 'topRight'
        });
      }
      else {

        iziToast.error({
          message: "Wrap Up Code not added. Please try again",
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

  deletedata(id) {
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
        let admin_id: any = localStorage.getItem('admin_id');

        // {"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"", "element_data":{"action":"delete_auxcode","admin_id":"1203","cat_id":"6"}}
        let api_req: any = '{"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"delete_auxcode","cat_id":"' + id + '","admin_id":"' + admin_id + '"}}';

        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.data == 1) {
            Swal.fire(
              'Deleted!',
              'success'
            );
            this.dept_settings();
          }

        },
          (error) => {
            console.log(error);
          });
      }
    })
  }

  showdoc(link) {
    this.doc_link = link;
    $("#document_model").modal('show');
  }



  //  ============================================= CATEGORY FUNCTIONS =======================================================


  category_list() {
    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_aux_code_category","admin_id":"' + this.uadmin_id + '","user_id":"' + this.user_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {

        this.cat_query_list = response.result.data;


        this.new_cat_query_list = [];
        // admin_id: "1203"
        // category_name: "New Zealand"
        // created_at: "2021-06-05 14:12:55"
        // delete_status: "0"
        // department_name: "Customer Service NZ"
        // dept_id: "3"
        // id: "5"

        this.cat_query_list.forEach(element => {
          var splitted = element.department_name.split(",");
          this.new_cat_query_list.push({ category_name: element.category_name, department_name: splitted, id: element.id });
        });
        console.log(this.queue_list);
      } else {
        this.recordNotFound = true;
      }
    },
      (error) => {
        console.log(error);
      });
  }

  addCategory() {
    $('#add_catogoryform').modal('show');
  }

  addCatData() {

    let agent_req: any = this.addCat.value;
    let new_dept_id = $('#newdepartments').val();

    var new_agent_dept = new_dept_id.join(",");
    console.log(new_agent_dept);
    if (agent_req.status == true) { this.dep_status = 1 } else { this.dep_status = 0 }
    let access_token: any = localStorage.getItem('access_token');

    // {"operation":"addAuxcode", "moduleType": "contact", "api_type": "web", "access_token":"", "element_data":{"action":"add_aux_code_category","category_name":"New Zealand1","status":"0","admin_id":"1203","dept_id":"6,7"}}


    let api_req: any = '{"operation":"addAuxcode", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"add_aux_code_category","category_name":"' + agent_req.cat_name + '","status":"' + this.dep_status + '","admin_id":"' + this.uadmin_id + '","dept_id":"' + new_agent_dept + '"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {
        $('#add_catogoryform').modal('hide');
        iziToast.success({
          message: "Wrap Up Code added successfully",
          position: 'topRight'
        });
        this.category_list();
      }
      else if (response.result.data == 2) {
        iziToast.warning({
          message: "Wrap Up Code name already inserted",
          position: 'topRight'
        });
      }
      else {
        iziToast.error({
          message: "Wrap Up Code not added. Please try again",
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

  editCat(id) {
    let access_token: any = localStorage.getItem('access_token');


    let api_req: any = '{"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"edit_aux_code_category","cat_id":"' + id + '","admin_id":"' + this.uadmin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        var agent_data = response.result.data;
        this.editCategory.setValue({
          'cat_name': agent_data.category_name,
        });


        var splitted = response.result.data.dept_id.split(",");
        $('#departments').val(splitted);
        this.cate_id = response.result.data.id;


        //  $('#departments option[value=' + response.result.data.dept_id + ']').attr('selected', true);
        $('#edit_catform').modal('show');
        this.category_list();
      } else {
        iziToast.warning({
          message: "Wrap Up codes not retrive. Please try again",
          position: 'topRight'
        });

      }
    },
      (error) => {
        console.log(error);
      });
  }



  UpdateCat(id) {
    let new_dept_id = $('#departments').val();
    let agent_req: any = this.editCategory.value;
    let access_token: any = localStorage.getItem('access_token');
    if (agent_req.status == true) { this.dep_status = 1 } else { this.dep_status = 0 }

    var new_array = [];
    this.editwrapUpCode.forEach(element => {
      new_array.push(element.name);
    });
    var agent_dept = new_array.join(",");

    let api_req: any = '{"operation":"updateAuxcode", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"update_aux_code_category","category_name":"' + agent_req.cat_name + '","cat_id":"' + id + '","admin_id":"' + this.uadmin_id + '","dept_id":"' + new_dept_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == 1) {
        $('#edit_catform').modal('hide');
        this.category_list();
        iziToast.success({
          message: "WrapUp updated successfully",
          position: 'topRight'
        });
      } else {

        iziToast.warning({
          message: "WrapUp not updated. Please try again",
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


  deleteCat(id) {
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
        let admin_id: any = localStorage.getItem('admin_id');
        let api_req: any = '{"operation":"updateAuxcode", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"delete_auxcode_category","id":"' + id + '","admin_id":"' + admin_id + '"}}';

        this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.data == 1) {
            Swal.fire(
              'Deleted!',
              'success'
            );
            this.category_list();
            this.dept_settings();
          }

        },
          (error) => {
            console.log(error);
          });
      }
    })
  }

  dept_list() {
    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_dept_settings","user_id":"' + this.uadmin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {

        this.dept_name_list = response.result.data;
        console.log(this.dept_name_list);
      } else {
        this.recordNotFound = true;
      }
    },
      (error) => {
        console.log(error);
      });
  }


}