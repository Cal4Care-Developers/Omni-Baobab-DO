import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-queue-management',
  templateUrl: './queue-management.component.html',
  styleUrls: ['./queue-management.component.css']
})
export class QueueManagementComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addQueue: FormGroup;
  editQueue: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  queue_status;
  dep_id;
  agents_list;
  userchecked;
  pageLimit = 20;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  hardware_id;
  loginUser;
  websocket;
  user_type;
  admin_id;
  constructor(private serverService: ServerService,private router:Router) { }

  ngOnInit(): void {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.addQueue = new FormGroup({
     'queue_name' : new FormControl(null,Validators.required),
     'queue_number' : new FormControl(null,Validators.required),
     'queue_status' : new FormControl(null)
    });

     this.editQueue = new FormGroup({
      'queue_name' : new FormControl(null,Validators.required),
      'queue_number' : new FormControl(null,Validators.required),
      'queue_status' : new FormControl(null)
    });
    this.queueList({});
    this.user_lists();


    this.hardware_id =localStorage.getItem('hardware_id');

   this.initsocket();
   //alert(this.hardware_id)
  }
  initsocket(){
    this.loginUser = localStorage.getItem('admin_id');
    this.admin_id = localStorage.getItem('admin_id');

    this.user_type = localStorage.getItem('user_type');
    // if(this.loginUser == '64'){
    //   this.websocket = new WebSocket("wss://socket.mconnectapps.com:5013/");
    // } else if(this.loginUser == '164'){
    //   this.websocket = new WebSocket("wss://socket.mconnectapps.com:5014/");
    // } else if(this.loginUser == '201'){
    //   this.websocket = new WebSocket("wss://socket.mconnectapps.com:5014/");
    // } else {
    //   this.websocket = new WebSocket("wss://socket.mconnectapps.com:5012/");
    // }


      this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4023");



    this.websocket.onopen = function(event) {
      $('#sendonload').click();
      console.log('agent socket connected');
    }
    // this.websocket.removeAllListeners();


    this.websocket.onmessage = function(event) {
      var result_message = JSON.parse(event.data);
      console.log(result_message);
      this.hardware_id = localStorage.getItem('hardware_id');
      if(result_message[0].cust_id == this.hardware_id){
        // console.log('matched');
    //  console.log(result_message);
        // setTimeout(()=>{Swal.close();},20000);
      } else {
        console.log('not matched');
        Swal.close();
       // return false;
      }

      if(result_message[0].data[0].status=="true"){
        $('#datagetsucced').click();
        Swal.close();

      } else if(result_message[0].data[0].status=="false"){
        $('#datagetsfailed').click();
        Swal.close();

      }  else if(result_message[0].data[0].Name=="addQueueData"){
        // alert('addQueueData');
      }

      else if(result_message[0].data[0].Name=="AddedQueue"){
        // alert('AddedQueue');

        $('#addinQueuser').val(result_message[0].data[0].inUser);
        $('#addnotinQueuser').val(result_message[0].data[0].notInuser);
        $('#addinQueuser').click();
        Swal.close();
      } else if(result_message[0].data[0].Name=="UpdatedQueue"){
        // alert(' wss UpdateQueueData');

        // $('#editinQueuser').val(result_message[0].data[0].inUser);
        // $('#editnotinQueuser').val(result_message[0].data[0].notInuser);
        // $('#editinQueuser').click();

        Swal.close();
      }
    }
    this.websocket.onerror = function(event){
      Swal.close();

      console.log('error');
    }
    this.websocket.onclose = function(event){
      console.log('close');
      Swal.close();

    }
  }




  datagetsucced(){
    iziToast.success({
      message: "Data Retrived Successfully",
      position: 'topRight'
    });
    this.queueList({});
  }


  datagetsfailed(){
    iziToast.error({
      message: "Sorry Some Error Occur",
      position: 'topRight'
    });
    this.queueList({});
  }



   listDataInfo(list_data){
    list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
    list_data.order_by_name = list_data.order_by_name == undefined ? "queue.queue_id" : list_data.order_by_name;
    list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
    list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
    list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
    return list_data;
  }


  queueList(data){
      var list_data= this.listDataInfo(data);
			let api_req:any = new Object();
			let queue_req:any = new Object();
			queue_req.action="list_queue";
			queue_req.admin_id=localStorage.getItem('admin_id');
      queue_req.search_text=list_data.search_text;
      queue_req.order_by_name=list_data.order_by_name;
      queue_req.order_by_type=list_data.order_by_type;
      queue_req.limit=list_data.limit;
      queue_req.offset=list_data.offset;
			api_req.operation="queue";
			api_req.moduleType="queue";
			api_req.api_type="web";
			api_req.access_token=localStorage.getItem('access_token');
			api_req.element_data = queue_req;
            this.serverService.sendServer(api_req).subscribe((response:any) => {
	            if(response.result.status==1){

	            	this.queue_list=response.result.data.list_data;
                this.offset_count = list_data.offset;
                this.paginationData = this.serverService.pagination({'offset':response.result.data.list_info.offset, 'total':response.result.data.list_info.total, 'page_limit' :this.pageLimit });
                this.recordNotFound = this.queue_list.length == 0 ? true : false;
	            }


            },
            (error)=>{
                console.log(error);
            });

  }



user_lists(){

      let access_token: any=localStorage.getItem('access_token');
      let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"user_list","user_id":"'+this.uadmin_id+'","search_text":"","order_by_name":"user.user_id","order_by_type":"desc","limit":100,"offset":0}}';

  	                this.serverService.sendServer(api_req).subscribe((response:any) => {

                        if(response.result.status==1){

                        	this.agents_list=response.result.data.list_data;

                        }


                    },
                    (error)=>{
                        console.log(error);
                    });

}



editQueueSettings(id){
  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"queue", "moduleType": "queue", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_queue","id":"'+id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.status==true){
      var agent_data = response.result.data;
      this.editQueue.setValue({
        'queue_name' : agent_data.queue_name,
         'queue_number' : agent_data.queue_number,
         'queue_status' : agent_data.queue_status,
     });
     this.dep_id = id;
     this.userchecked = agent_data.queue_users.split(",");
     if(agent_data.queue_status == 1){
      $('#queue_status').prop('checked', true);
     } else {
      $('#queue_status').prop('checked', false);
     }

     $('#edit_deptform').modal('show');
     this.queueList({});
    }   else{

      iziToast.warning({
          message: "Queue count not retrive. Please try again",
          position: 'topRight'
      });

}
  },
  (error)=>{
      console.log(error);
  });
}

addQueues(){
  $('#add_deptform').modal('show');
}



getMainQueues(){
  var department_users = $('.add_Checkbox:checked').map(function(){
    return this.value;
}).get();
  department_users = department_users.join();
   //alert(department_users);
// return false;
  let agent_req:any = this.addQueue.value;
  var has_hard_id = localStorage.getItem('hardware_id');
  // var mainAgentss = '[{"cust_id":"'+has_hard_id+'","data":[{"Name":"addQueueData","queueno":"'+agent_req.queue_number+'","queuename":"'+agent_req.queue_name+'","agents":"'+department_users+'"}]}]';
  console.log('sended');
  // this.websocket.send(mainAgentss);
  // alert('send add queue');
}


AddQueue(){
  var department_users = $('.add_Checkbox:checked').map(function(){
    return this.value;
}).get();
  department_users = department_users.join();
  let agent_req:any = this.addQueue.value;
  var has_hard_id = localStorage.getItem('hardware_id');
  var mainAgentss = '[{"cust_id":"'+has_hard_id+'","data":[{"Name":"addQueueData","queueno":"'+agent_req.queue_number+'","queuename":"'+agent_req.queue_name+'","agents":"'+department_users+'"}]}]';
  console.log('sended');
  this.websocket.send(mainAgentss);
}
getMainQueuesEdit(){
  var department_users = $('.ads_Checkbox:checked').map(function(){
    return this.value;
}).get();
  department_users = department_users.join();
  let agent_req:any = this.editQueue.value;
  var has_hard_id = localStorage.getItem('hardware_id');
  var mainAgents = '[{"cust_id":"'+has_hard_id+'","data":[{"Name":"UpdateQueueData","queueno":"'+agent_req.queue_number+'","queuename":"'+agent_req.queue_name+'","agents":""}]}]';
  this.websocket.send(mainAgents);
  $('#editinQueuser').click();
}

editQueues(id){
  var department_users = $('#editinQueuser').val();
//  alert('"UpdateQueueData"');
  let agent_req:any = this.editQueue.value;
  if(agent_req.queue_name == null){
    return false;
  }
  let access_token: any=localStorage.getItem('access_token');
  if(agent_req.queue_status == true){  this.queue_status = 1 } else { this.queue_status  = 0 }
  let api_req:any = '{"operation":"queue", "moduleType": "queue", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_queue","queue_users":"'+department_users+'","queue_name":"'+agent_req.queue_name+'","queue_number":"'+agent_req.queue_number+'","queue_status":"'+this.queue_status+'","id":"'+id+'"}}';

      this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.status == 1) {
              $('#edit_deptform').modal('hide');
              this.queueList({});
              iziToast.success({
                  message: "Queue updated successfully",
                  position: 'topRight'
              });


              var addnotinQueuser = $('#editnotinQueuser').val();

              if(addnotinQueuser != ''){
               iziToast.warning({
                 message: "Sorry This "+addnotinQueuser+" users not in your queue",
                 position: 'topRight'
             });
              }


          } else {

              iziToast.warning({
                  message: "Queue not updated. Please try again",
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



addQueueData(){
var department_users = $('#addinQueuser').val();
// alert(department_users);

let agent_req:any = this.addQueue.value;

if(agent_req.queue_name == null){
  iziToast.warning({
    message: "Sorry,Please type queue Name",
    position: 'topRight'
});
  return false;
}
if(agent_req.queue_number == null){
  iziToast.warning({
    message: "Can't get Queue number",
    position: 'topRight'
});
  return false;
}



if(agent_req.queue_status == true){  this.queue_status = 1 } else { this.queue_status  = 0 }
    let access_token: any=localStorage.getItem('access_token');
    let admin_id: any=localStorage.getItem('admin_id');
    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',
    });
    let api_req:any = '{"operation":"queue", "moduleType": "queue", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_up_queue","queue_users":"'+department_users+'","queue_name":"'+agent_req.queue_name+'","queue_number":"'+agent_req.queue_number+'","queue_status":"'+this.queue_status+'","created_by":"'+this.uadmin_id+'","admin_id":"'+admin_id+'","hardware_id":"'+this.hardware_id+'"}}';

        this.serverService.sendServer(api_req).subscribe((response: any) => {
          Swal.close();
        if (response.status == true) {
                $('#add_deptform').modal('hide');
                // iziToast.success({
                //     message: "Queue added successfully",
                //     position: 'topRight'
                // });

               var addnotinQueuser = $('#addnotinQueuser').val();

               if(addnotinQueuser != ''){
                iziToast.warning({
                  message: "is "+addnotinQueuser+" users not in your queue",
                  position: 'topRight'
              });
               }
                this.queueList({});
            }
            else if (response.result.data == 2) {
              iziToast.warning({
                  message: "Queue name already inserted",
                  position: 'topRight'
              });
          }
        else{

                iziToast.error({
                    message: "Queue not added. Please try again",
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
  let api_req:any = '{"operation":"queue", "moduleType": "queue", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_queue","id":"'+id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.data==1){
      Swal.fire(
        'Deleted!',
        'success'
      );
      this.queueList({});
    }

  },
  (error)=>{
      console.log(error);
  });
      }
    })
  }

  retriveFrom3cx(){
    Swal.fire({
      title: 'Please Wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
    //  background: '#19191a',
      showConfirmButton: false,
      onOpen: ()=>{
          Swal.showLoading();
      }
    });
    // if(this.hardware_id !=''){
      var socket_message  =  '[{"cust_id":"'+this.hardware_id+'","data":[{"Name":"getqueuedet"}]}]';
      this.websocket.send(socket_message);
    // }
}





viewQuePerformance(id){
  this.router.navigate(['/call-q-m'], { queryParams: { queue: id } });
}
}
