import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
import Swal from 'sweetalert2';
declare var $: any;
declare var iziToast: any;
@Component({
	selector: 'app-call-history',
	templateUrl: './call-history.component.html',
	styleUrls: ['./call-history.component.css']
})
export class CallHistoryComponent implements OnInit {

	call_history_list;
	recordNotFound = false;
	pageLimit = 20;
	paginationData: any = { "info": "hide" };
	offset_count = 0;
	getRep: FormGroup;
	auxcodes;
	admin_permission;
	uadmin_id;
	auxcode_catagory;
	res;
	constructor(private serverService: ServerService) { }

	ngOnInit() {
		this.callHistoryList({});
		this.getRep = new FormGroup({
			'auxcode_name': new FormControl(null),
			'from_date': new FormControl(null),
			'to_date': new FormControl(null),
			'cat_ids': new FormControl(null),
		});


		this.admin_permission = localStorage.getItem('admin_permision');
		if (this.admin_permission == '1') {
			this.uadmin_id = localStorage.getItem('admin_id');
		} else {
			this.uadmin_id = localStorage.getItem('userId');
		}
		// this.getAuxCode();
		this.getAuxCatogory();

	}



	getAuxCatogory() {

		if (this.auxcode_catagory != null)
		  return false;
	
		let access_token: any = localStorage.getItem('access_token');
		let admin_id: any = localStorage.getItem('admin_id');
		let api_req: any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_aux_code_category","admin_id":"' + admin_id + '","user_id":"' + this.uadmin_id + '"}}';
	
		this.serverService.sendServer(api_req).subscribe((response: any) => {
		  if (response.result.status == true) {
			this.auxcode_catagory = response.result.data;
		  } else {
		  }
		},
		  (error) => {
			console.log(error);
		  });
	  }
	

	  getAuxCode() {
		// if(this.auxcodes!=null)
		//  return false;
		let cat_id = $('#auxcodes_pop2').val();
		// this.getCatname(cat_id);
		let access_token: any = localStorage.getItem('access_token');
		let admin_id: any = localStorage.getItem('admin_id');
	
		let api_req: any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"getuax_by_cat","cat_id":"' + cat_id + '","admin_id":"' + admin_id + '"}}';
	
		this.serverService.sendServer(api_req).subscribe((response: any) => {
		  if (response.result.status == true) {
			this.auxcodes = response.result.data;
		  } else {
		  }
		},
		  (error) => {
			console.log(error);
		  });
	  }


	//   getCatname(id) {
	// 	let access_token: any = localStorage.getItem('access_token');
	// 	let api_req: any = '{"operation":"getAuxcode_data", "moduleType": "contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"edit_aux_code_category","cat_id":"' + id + '","admin_id":"' + this.admin_id + '"}}';
	
	// 	this.serverService.sendServer(api_req).subscribe((response: any) => {
	// 	  if (response.result.status == true) {
	// 		var agent_data = response.result.data;
	// 		this.category_name = agent_data.category_name;
	
	// 	  } else {
	// 		iziToast.warning({
	// 		  message: "Wrap Up codes not retrive. Please try again",
	// 		  position: 'topRight'
	// 		});
	
	// 	  }
	// 	},
	// 	  (error) => {
	// 		console.log(error);
	// 	  });
	//   }
	


	// getAuxCode() {
	// 	let access_token: any = localStorage.getItem('access_token');

	// 	let api_req: any = '{"operation":"getAuxcode", "moduleType":"contact", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_aux_code","admin_id":"' + this.uadmin_id + '"}}';

	// 	this.serverService.sendServer(api_req).subscribe((response: any) => {
	// 		if (response.result.status == true) {
	// 			this.auxcodes = response.result.data;
	// 		} else {
	// 		}
	// 	},
	// 		(error) => {
	// 			console.log(error);
	// 		});
	// }

	
	listDataInfo(list_data) {

		list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
		list_data.order_by_name = list_data.order_by_name == undefined ? "history.callid" : list_data.order_by_name;
		list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
		list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
		list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
		return list_data;
	}



	callHistoryList(data) {
		var new_user_id;
		var admin_permission = localStorage.getItem('admin_permision');
		if (admin_permission == '1') {
			new_user_id = localStorage.getItem('admin_id');
		} else {
			new_user_id = localStorage.getItem('userId');
		}

		var list_data = this.listDataInfo(data);
		let api_req: any = new Object();
		let history_req: any = new Object();
		history_req.action = "recent_list";
		history_req.search_text = list_data.search_text;
		history_req.order_by_name = list_data.order_by_name;
		history_req.order_by_type = list_data.order_by_type;
		history_req.limit = list_data.limit;
		history_req.offset = list_data.offset;
		history_req.user_id = new_user_id;
		api_req.operation = "call";
		api_req.moduleType = "call";
		api_req.api_type = "web";
		api_req.access_token = localStorage.getItem('access_token');
		api_req.element_data = history_req;
		this.serverService.sendServer(api_req).subscribe((response: any) => {

			if (response.result.status == 1) {

				this.call_history_list = response.result.data.list_data;
				this.offset_count = list_data.offset;
				this.paginationData = this.serverService.pagination({ 'offset': response.result.data.list_info.offset, 'total': response.result.data.list_info.total, 'page_limit': this.pageLimit });
				this.recordNotFound = this.call_history_list.length == 0 ? true : false;
			}

		},
			(error) => {
				console.log(error);
			});

	}


	getReports() {

		var new_user_id;
		var admin_permission = localStorage.getItem('admin_permision');
		if (admin_permission == '1') {
			new_user_id = localStorage.getItem('admin_id');
		} else {
			new_user_id = localStorage.getItem('userId');
		}

		let auxcode_name: any = $('#auxcode_name').val();
		let fromDate: any = $('#from_date').val();
		let to_date: any = $('#to_date').val();
		if (fromDate == null || fromDate == '') {
			iziToast.warning({
				message: "Please Select From Date",
				position: 'topRight'
			});
			return false;
		}
		if (to_date == null || to_date == '') {
			iziToast.warning({
				message: "Please Select To Date",
				position: 'topRight'
			});
			return false;
		}



		console.log(this.getRep.value);
		let api_req: any = new Object();
		let agents_req: any = new Object();
		agents_req.action = "auxcode_reports";
		agents_req.user_id =  new_user_id;
		agents_req.auxcode_name = this.getRep.value.auxcode_name;
		agents_req.cat_ids = this.getRep.value.cat_ids;
		agents_req.fromDate = this.getRep.value.from_date;
		agents_req.toDate = this.getRep.value.to_date;
		api_req.operation = "auxcodeReport";
		api_req.moduleType = "call";
		api_req.api_type = "web";
		api_req.access_token = localStorage.getItem('access_token');
		api_req.element_data = agents_req;
		console.log(api_req);
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
			console.log(response);
Swal.close();

			if (response.result.status == true) {
				this.res = response;
				var arrStr = encodeURIComponent(JSON.stringify(this.res));
				// document.location.href = 'https://uatassaabloyccapi.mconnectapps.com/api/storage/contact/download.php?res='+arrStr;


				var url = 'https://uatassaabloyccapi.mconnectapps.com/api/storage/contact/aux_code_report.php';
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
			(error) => {
				console.log(error);
			});
	}








}
