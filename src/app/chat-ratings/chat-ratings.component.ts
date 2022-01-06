import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-chat-ratings',
  templateUrl: './chat-ratings.component.html',
  styleUrls: ['./chat-ratings.component.css']
})
export class ChatRatingsComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  addDept: FormGroup;
  editDept: FormGroup;
  old_sip_url;
  uadmin_id;
  pbx_count;
  dep_status; 
  dep_id;
  chat_panel_list
  loginUser;
  res;
  pageLimit = 20;
  paginationData:any ={"info":"hide"};
  offset_count = 0;

  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.uadmin_id = localStorage.getItem('admin_id');
    this.loginUser = localStorage.getItem('userId');
    this.addDept = new FormGroup({
     'department_name' : new FormControl(null,Validators.required),
    });
 
     this.editDept = new FormGroup({
      'department_name' : new FormControl(null,Validators.required),
    });
    this.searchData({});
   }

   listDataInfo(list_data){

		list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
		list_data.order_by_name = list_data.order_by_name == undefined ? "history.callid" : list_data.order_by_name;
		list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
		list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
		list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
		return list_data;
	}

  searchData(data){
			// var list_data= this.listDataInfo(data);

  let access_token: any=localStorage.getItem('access_token');

  // let api_req:any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_list","user_id":"'+this.loginUser+'"}}';

  var list_data= this.listDataInfo(data);
  let api_req:any = new Object();
  let history_req:any = new Object();
  history_req.action="chat_list";
  history_req.search_text=list_data.search_text;
  history_req.limit=list_data.limit;
  history_req.offset=list_data.offset;
  history_req.user_id=localStorage.getItem('admin_id');
  api_req.operation="chat";
  api_req.moduleType="chat";
  api_req.api_type="web";
  api_req.access_token=localStorage.getItem('access_token');
  api_req.element_data = history_req;

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
     
      this.chat_panel_list = response.result.data.list_data;
      this.offset_count = list_data.offset;
      this.paginationData = this.serverService.pagination({'offset':response.result.data.list_info.offset, 'total':response.result.data.list_info.total, 'page_limit' :this.pageLimit });
      this.recordNotFound = this.chat_panel_list.length == 0 ? true : false;
    } else {
      this.recordNotFound = true;
    }
  }, 
  (error)=>{
      console.log(error);
  });
}
exportcsv(){
let from_date = $('#from_date').val();
let to_date = $('#to_date').val();

  if(from_date == null ||from_date == ''){
    iziToast.warning({
      message: "Please fill From Date",
      position: 'topRight'
  });
  return false;
  }
  if(to_date == null ||to_date == ''){
    iziToast.warning({
      message: "Please fill To Date",
      position: 'topRight'
  });
  return false;
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
  let access_token: any=localStorage.getItem('access_token');
    
  // let report_details:any =  new Object();
  // let api_req:any = new Object();

  // report_details.action="list_meeting_participants_report";
  // report_details.meetingid = this.meet_id;
  // api_req.operation="list_meeting_participants";
  // api_req.moduleType="webinar_configuration";
  // api_req.api_type="web";
  // api_req.access_token=localStorage.getItem('access_token');
  // api_req.element_data = report_details;
  let api_req:any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_list_report","user_id":"'+this.loginUser+'","from_date":"'+from_date+'","to_date":"'+to_date+'"}}';
  

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    console.log(response);
    Swal.close();
    if(response.status==true){
    this.res = response;
    var arrStr = encodeURIComponent(JSON.stringify(this.res));
    // document.location.href = 'https://omni.mconnectapps.com/api/storage/contact/download.php?res='+arrStr;
    var url = 'https://uatassaabloyccapi.mconnectapps.com/api/storage/chat/chat_rating.php';
    var form = $('<form target="_blank" action="' + url + '" method="post">' +
    '<input type="text" name="res" value="' + arrStr + '" />' +
    '</form>');
    $('body').append(form);
    form.submit();
  
  } else {
    iziToast.warning({
    message: "No Records Found. Please try again",
    position: 'topRight'
  });
  }
  }, 
  (error)=>{
      console.log(error);
  });
}
}
