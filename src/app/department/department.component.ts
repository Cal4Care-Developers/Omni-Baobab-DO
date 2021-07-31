import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
// import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
declare var $: any;
declare var iziToast: any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addDept: FormGroup;
  editDept: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  dep_status; 
  dep_id;
  agents_list;
  userchecked;
  doc_link;
  pre;
  activepre;
  admin_id;
  wraup_cat_list;
  websocket;
  constructor(private serverService: ServerService) { }

  ShowactiveCustomers = [];
  ShowInactiveCustomers = [];
  activeCustomers = [
    // '5241 - Jacinta Matthews',
    // '1740 - Shabina Ali',
    // '5351 - Tracy Sharp',
    // '1725 - Irene Burford',
    // '1713 - Jacinta Ioane',
    // '9277 - Samuel Jenkinson',
    // '1716 - Marilyn Patterson',
  ];

  inactiveCustomers = [
    // '1735 - Glenn Mcgivern',
    // '1763 - Gary Hill',
    // '1710 - Benjamin Orlich',
    // '9303 - Nurul Fateha',
    // '1764 - Katie Giannakopoulos',
    // '3610 - Yvonne Kyriakopoulos',
    // '1760 - Joe Zhou'
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      console.log('dropped Event', `> dropped '${event.item.data}' into '${event.container.id}'`);
      console.log('hello', event.container.data,
        event.previousIndex,
        event.currentIndex);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log('dropped Event', `> dropped '${event.item.data}' into '${event.container.id}'`);
      console.log('else', event.previousContainer.data,
        event.container.data);
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.pre = `activeCustomers:${JSON.stringify(this.activeCustomers, null, ' ')}
inactiveCustomers:${JSON.stringify(this.inactiveCustomers, null, ' ')}`;

    this.activepre = `activeCustomers:${JSON.stringify(this.ShowactiveCustomers, null, ' ')}
inactiveCustomers:${JSON.stringify(this.ShowInactiveCustomers, null, ' ')}`;
    

  }



  ngOnInit() {
    this.uadmin_id = localStorage.getItem('userId');
    this.admin_id = localStorage.getItem('admin_id');
    this.addDept = new FormGroup({
      'department_name': new FormControl(null, Validators.required),
      'department_alias_name': new FormControl(null),
      'status': new FormControl(null)
    });

    this.editDept = new FormGroup({
      'department_name': new FormControl(null, Validators.required),
      'department_alias_name': new FormControl(null),
      'status': new FormControl(null)
    });
    this.dept_settings();
    this.user_lists();
    // this.getwraupcat();
    this.initSocket();
  }
  initSocket(){
    if(this.admin_id == '66'){
      this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4002"); 
    } else if(this.admin_id == '201'){
      this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4003"); 
    } else {
      this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4014"); 
    }
    this.websocket.onopen = function(event) { 
      // $('#sendonload').click();
      // console.log('agent socket connected');
    }
  
    this.websocket.onmessage = function(event) {
      var result_message = JSON.parse(event.data);
      // console.log(result_message);

      this.hardware_id = localStorage.getItem('hardware_id');
      if(result_message[0].cust_id == this.hardware_id){
        // console.log('matched');
      } else {
        console.log('not matched');
        return false;
      }
  
      if(result_message[0].data[0].status=="deptdet_true"){
        $('#datagetsucc').click();
      } else if(result_message[0].data[0].status=="deptdet_false"){
        $('#datagetfailed').click();
      }
      
    }
    this.websocket.onerror = function(event){
      console.log('error');
    }
    this.websocket.onclose = function(event){
      console.log('close');
    } 
  }
  getwraupcat(){
    let access_token: any=localStorage.getItem('access_token');
  
    let api_req:any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_aux_code_category","admin_id":"'+this.admin_id+'","user_id":"'+this.admin_id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
       
        this.wraup_cat_list = response.result.data;
        console.log(this.queue_list);
      } else {
        this.recordNotFound = true;
      }
    }, 
    (error)=>{
        console.log(error);
    });
  }

  dept_settings() {
    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_dept_settings","user_id":"' + this.admin_id + '"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
     
      this.queue_list = response.result.data;
      console.log(this.queue_list);
    } else {
      this.recordNotFound = true;
    }
  }, 
  (error)=>{
      console.log(error);
  });
}


  user_lists() {
    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"user_list","user_id":"' + this.admin_id + '","search_text":"","order_by_name":"user.user_id","order_by_type":"desc","limit":100,"offset":0}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {

      if (response.result.status == 1) {

        this.agents_list = response.result.data.list_data;

        // this.inactiveCustomers = this.agents_list.map(function (val) {
        //   return  val.user_name;
        // }).join(',')

        this.agents_list.forEach(element => {
          var joins = `${element.user_id}${'-'}${element.user_name}${'-'}${element.agent_name}`;
          // var joins = `${element.user_name}${'-'}${element.agent_name}`;
          this.ShowInactiveCustomers.push(joins)
        });

        console.log(this.ShowInactiveCustomers);


      }


                    }, 
                    (error)=>{
                        console.log(error);
                    });

}



  editDepartmentSettings(id) {
    this.activeCustomers= [];
    this.inactiveCustomers= [];
    let access_token: any = localStorage.getItem('access_token');
    let admin_id: any = localStorage.getItem('admin_id');
    let api_req: any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_department","dept_id":"' + id + '","admin_id":"' + admin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        var agent_data = response.result.data;
        this.editDept.setValue({
          'department_name': agent_data.department_name,
          'department_alias_name': agent_data.alias_name,
          'status': agent_data.status,
         });
        this.dep_id = response.result.data.dept_id;

        // activeCustomers list 
        agent_data.active.forEach(element => {
          var joins = `${element.user_id}${'-'}${element.user_name}${'-'}${element.agent_name}`;
          // var joins = `${element.user_name}${'-'}${element.agent_name}`;
          this.activeCustomers.push(joins)
        });

       var arr = agent_data.inactive.filter(function(item) {
          return item.user_id !== admin_id;
      })
         // inActiveCustomers list 
         arr.forEach(element => {
          var joins = `${element.user_id}${'-'}${element.user_name}${'-'}${element.agent_name}`;
          // var joins = `${element.user_name}${'-'}${element.agent_name}`;

          this.inactiveCustomers.push(joins)
          
        });

        // agent_data.active.forEach(element => {
        //   var joins = `${element.user_name}${'-'}${element.agent_name}`;
        //   this.ShowactiveCustomers.push(joins)
        // });
if(agent_data.department_users !='')
        this.userchecked = agent_data.department_users.split(",");
 else
        this.userchecked = agent_data.department_users;
        console.log(this.userchecked)
        if (agent_data.status == 1) {
          $('#status').prop('checked', true);
        } else {
          $('#status').prop('checked', false);
        }
        $('#update_reports').val(agent_data.department_wrapups);
        $('#edit_deptform').modal('show');
        // this.dept_settings();
       



      } else {

        iziToast.warning({
          message: "Department count not retrive. Please try again",
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
    // this.user_lists();
  }


  editDepartment(id) {
    var department_userss = $('.ads_Checkbox:checked').map(function () {
      return this.value;
    }).get();

    console.log(this.activeCustomers);
    let text = [];
    this.activeCustomers.forEach(element => {
      const str = element.split('-')[0];
      text.push(str);
    });
    // return false;
    // var department_users = $('.add_Checkbox:checked').map(function () {
    //   return this.value;
    // }).get();
    var wraps = $('#update_reports').val();

    // var department_users = department_userss.join();
    var department_users = text.join();
    console.log(department_users);
    let agent_req: any = this.editDept.value;
    let access_token: any = localStorage.getItem('access_token');
    if (agent_req.status == true) { this.dep_status = 1 } else { this.dep_status = 0 }
    this.dep_status = 1;
    let api_req: any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"update_department","department_name":"' + agent_req.department_name + '","department_users":"' + department_users + '","alias_name":"' + agent_req.department_alias_name + '","status":"' + this.dep_status + '","dept_id":"' + id + '","admin_id":"' + this.admin_id + '","department_wrapups":"'+wraps+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == 1) {
              $('#edit_deptform').modal('hide');
              this.dept_settings();
              iziToast.success({
                  message: "Department updated successfully",
                  position: 'topRight'
              });
          } else {
          
              iziToast.warning({
                  message: "Department not updated. Please try again",
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

    console.log(this.ShowactiveCustomers);
    let text = [];
    this.ShowactiveCustomers.forEach(element => {
      const str = element.split('-')[0];
      text.push(str);
    });
    // return false;
    // var department_users = $('.add_Checkbox:checked').map(function () {
    //   return this.value;
    // }).get();

    // var department_users = department_users.join();
    var department_users = text.join();
    var wraps = $('#edit_reports').val();

    let agent_req: any = this.addDept.value;
    if (agent_req.status == true) { this.dep_status = 1 } else { this.dep_status = 0 }
    this.dep_status = 1;

    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"add_department","department_name":"' + agent_req.department_name + '","alias_name":"' + agent_req.department_alias_name + '", "department_users":"' + department_users + '","status":"' + this.dep_status + '","admin_id":"' + this.admin_id +'","department_wrapups":"'+wraps+'"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      this.addDept.reset();
      if (response.result.data == 1) {
        $('#add_deptform').modal('hide');
        iziToast.success({
          message: "Department added successfully",
          position: 'topRight',

        });
        this.dept_settings();

      }
      else if (response.result.data == 2) {
        iziToast.warning({
          message: "Department name already inserted",
          position: 'topRight'
        });
      }
      else {

        iziToast.error({
          message: "Department not added. Please try again",
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


  deletedata(id){
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
        let access_token: any=localStorage.getItem('access_token');
        let admin_id: any=localStorage.getItem('admin_id');
  let api_req:any = '{"operation":"ticket", "moduleType": "ticket", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_department","department_id":"'+id+'","admin_id":"'+admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.data==1){
      Swal.fire(
        'Deleted!',
        'success'
      );
      this.dept_settings();
    }

  }, 
  (error)=>{
      console.log(error);
  });
      }
    })
  }
  showdoc(link) {
    this.doc_link = link;
    $("#document_model").modal('show');
  }
  RetrieveDept(){
    Swal.fire({
      title: 'Retrieve Queue',
      text: "This will Retrieve your Queue Names from 3CX",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.value) {
      let hardware_id = localStorage.getItem('hardware_id');
        [{"cust_id":"2AB8-76A1-6E31-4F79-E167-25B3-D7CF-F3B5","data":[{"Name":"getdeptdet"}]}]
        var socket_message  =  '[{"cust_id":"'+hardware_id+'","data":[{"Name":"getdeptdet"}]}]';
        console.log(socket_message)
        this.websocket.send(socket_message);
      }
    })
  }
  datagetsucc(){
    this.dept_settings();
    Swal.fire({
      title: 'Retrieve Queues',
      text: "Data Retrieved",
      icon: 'success',
      showCancelButton: false,    
    });
  }
  datagetfailed(){
    Swal.fire({
      title: 'Retrieve Queues',
      text: "Data Up To Date Already",
      icon: 'success',
      showCancelButton: false,    
    });
  }
  changeStatus(type,id){
   $('#'+type+'_'+id).val();
    if($('#'+type+'_'+id).is(':checked'))
    var value='1';
    else
     value='0';     
    // alert(value)
    let access_token: any = localStorage.getItem('access_token');

    let api_req: any = '{"operation":"ticket", "moduleType":"ticket", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"update_type_settings","dept_id":"'+id+'","type":"'+type+'","value":"'+value+'"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == true) {
        this.dept_settings();

        // iziToast.success({
        //   message:"Added Success",
        //   position:"topRight"
        // });
      } else {
       iziToast.warning({
         message:"Sorry Some error Occured.Please contact Admin",
         position:"topRight"
       });
      }
    },
      (error) => {
        console.log(error);
      });
  }
}
