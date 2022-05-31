import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'
import { NgZone } from '@angular/core';
// import { truncate } from 'fs';
declare var $: any;
declare var iziToast: any;
@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	@ViewChild('chat_message', { static: false }) chat_message: ElementRef;
	@ViewChild('chat_detail_id', { static: false }) chat_detail_id: ElementRef;
	chat_panel_list;
	chat_panel_details;
	chat_panel_detail_type = "chat_screen";
	loginUser;
	chat_detail_key;
	customer_name;
	socketData;
	websocket;
	profile_image;
	chat_id;
	chat_status_detail_id;
	param1
	c_status;
	botlisting;
	public is_chat_closed = false;
	widget_name = 'OmniChat';
	temp_list;
	adminid;
	doc_link;
	data_view = '';
	search_text = '';
	constructor(public serverService: ServerService, private _ngZone: NgZone, private route: ActivatedRoute) {

		this.param1 = this.route.snapshot.queryParamMap.get('c');
		this.serverService.changeDetectionEmitter.subscribe(
			($event) => {

				let mData = JSON.parse($event);
				var pagefor = mData.pagefor;
				var pageid = mData.id;


				if (pagefor == 'chat') {
					// this.chatPanelDetail(pageid);
					// this.chatPanelView(pageid);
					this.chatPanelView2("all");
					// setTimeout(()=>{
					//   $(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);
					//   }, 4000);
					// alert('asas')
				}

			},
			(err) => {
			}
		);
	}

	ngOnInit() {
		this.loginUser = localStorage.getItem('userId');
		this.adminid = localStorage.getItem('admin_id');
		if (this.param1) {
			this.param1 = atob(this.param1);
			this.chatPanelView(this.param1);
			// this.chatPanelDetail(this.param1,this.c_status)
		} else {
			this.chatPanelView("all");
			// alert('asass12345678')
		}

		//this.websocket = new WebSocket("wss://cal4care.info:8089/");
		this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4004");


		this.websocket.onopen = function (event) {
			console.log('socket chat connected');

		}

		this.websocket.onmessage = function (event) {


			this.socketData = JSON.parse(event.data);

			if (this.socketData.message_type == "chat") {


				if (this.socketData.message_status == "end") {
					if (this.socketData.message_info.chat_id == $('#chat_detail_id').val()) {
						let chatToClose = 'chat_' + this.socketData.message_info.chat_id;

						// iziToast.error({
						// 	message: "Sorry, Chat has been closed by customer",
						// 	position: 'topRight'
						// });
						console.log('end')
						$('#chatPanelView').click();
						return false;
					}
				}

				if (this.socketData.message_info.chat_id == $('#chat_detail_id').val()) {
					//this.chatPanelDetail(this.socketData.message_info.chat_id);
					$('#open_chat_detail_id').val(this.socketData.message_info.chat_id);
					$('#open_chat_detail_id').click();

				} else {
					$('#chatPanelView').click();
				}
				//NB else IF Code for mobile App
			} else if (this.socketData.message_type == "mobile_chat") {

				if (this.socketData.message_info.chat_id == $('#chat_detail_id').val()) {
					//this.chatPanelDetail(this.socketData.message_info.chat_id);
					$('#open_chat_detail_id').val(this.socketData.message_info.chat_id);
					$('#open_chat_detail_id').click();

				} else {
					$('#chatPanelView').click();
				}

			}

		}
		this.websocket.onerror = function (event) {
			console.log('error');
		}
		this.websocket.onclose = function (event) {
			console.log('close');
		}
		this.get_temps();

	}

	ngAfterViewInit() {
		this.chatautoScroll();
	}

	chatautoScroll() {

		// if ($(".card-body.chat-content").length > 0) {
		setTimeout(() => {
			$(".card-body.chat-content").scrollTop($(".card-body.chat-content")[0].scrollHeight);

		}, 10);
		// }

	}


	chatSearch(chatSearch) {

	}

	sendChatMessageData() {

		this.profile_image = localStorage.getItem('profile_image');


		if (this.profile_image == null || this.profile_image == 'null' || this.profile_image == 'undefined') {
			this.profile_image = 'https://omnitickets.mconnectapps.com/api/v1.0/profile_image/user.jpg';
			// this.profile_image = 'https://omnitickets.mconnectapps.com/api/v1.0/profile_image/user.jpg';
		} else {
			this.profile_image = localStorage.getItem('profile_image');
		}
		var chat_message = this.chat_message.nativeElement.value;
		chat_message = chat_message.trim();
		if (chat_message.length > 0) {



			let api_req: any = new Object();
			let chat_req: any = new Object();
			chat_req.action = "send_chat_message";
			chat_req.chat_type = "webchat";
			chat_req.chat_id = this.chat_detail_id.nativeElement.value;
			chat_req.user_id = this.loginUser;
			chat_req.chat_message = chat_message;
			api_req.operation = "chat";
			api_req.moduleType = "chat";
			api_req.api_type = "web";
			api_req.access_token = localStorage.getItem('access_token');
			api_req.element_data = chat_req;

			this.serverService.sendServer(api_req).subscribe((response: any) => {

				if (response.result.status == 1) {

					var chat_msg = response.result.data;
					let agent_name = localStorage.getItem('user_name');
					var socket_message = '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "' + chat_msg.chat_id + '","msg_user_id" : "' + chat_msg.msg_user_id + '","msg_user_type" : "2","msg_type":"text","message" : "' + chat_msg.chat_msg + '","queue_id":"1","agent_aviator":"' + this.profile_image + '","agent_name":"' + agent_name + '"}}';

					this.websocket.send(socket_message);


					this.chat_panel_details.push(chat_msg);
					this.chatautoScroll();
					$('#chat_msg').val('');
				}

			},
				(error) => {
					console.log(error);
				});

		}

	}


	// readFile(fileEvent: any) {
	// 	const file = fileEvent.target.files[0];
	// 	if (file.type ==)

	// 	console.log('size', file.size);
	// 	console.log('type', file.type);
	//  }


	textUrl(text) {
		var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
		//var urlRegex = /(https?:\/\/[^\s]+)/g;
		var html = text.replace(urlRegex, function (url, b, c) {
			var url2 = (c == 'www.') ? 'http://' + url : url;
			return '<a class="hyperlink-text" href="' + url2 + '" target="_blank">' + url + '</a>';
		})
		console.log(html);
		return html
	}



	sendImage() {

		var chat_message = this.chat_message.nativeElement.value;

		var new_chat_msg = this.textUrl(chat_message);
		$("#createNewWidget").modal('hide');


		Swal.fire({
			title: 'Please Wait',
			allowEscapeKey: false,
			allowOutsideClick: false,
			//  background: '#19191a',
			showConfirmButton: false,
			onOpen: () => {
				Swal.showLoading();
			}
		});
		this.profile_image = localStorage.getItem('profile_image');


		if (this.profile_image == null || this.profile_image == 'null' || this.profile_image == 'undefined' || this.profile_image == '') {
			this.profile_image = 'https://omnitickets.mconnectapps.com/api/v1.0/profile_image/user.jpg';
			// this.profile_image = 'https://omnitickets.mconnectapps.com/api/v1.0/profile_image/user.jpg';
		} else {
			this.profile_image = localStorage.getItem('profile_image');
		}

		var chat_message = this.chat_message.nativeElement.value;
		chat_message = chat_message.trim();
		// if (chat_message.length > 0) {
		var chats_ids = this.chat_detail_id.nativeElement.value;
		var loginUser = this.loginUser;
		var cust_names = this.customer_name;

		var form = new FormData();
		var self = this;
		if ((<HTMLInputElement>document.getElementById('chat_media')).value != null) {
			// 	var totalfiles = (<HTMLInputElement>document.getElementById('chat_media')).files.length;
			// 	for (var index = 0; index < totalfiles; index++) {
			// 		form.append("up_files[]", (<HTMLInputElement>document.getElementById('chat_media')).files[index]);
			// 	}
			form.append("up_files", (<HTMLInputElement>document.getElementById('chat_media')).files[0]);
		}

		form.append("chat_id", chats_ids);
		form.append("chat_type", "webchat");
		form.append("user_id", loginUser);
		form.append("chat_message", new_chat_msg);
		form.append("chat_msg", new_chat_msg);
		form.append("timezone_id", "1");
		form.append("action", "send_chat_message");
		form.append("customer_name", cust_names);
		form.append("access_token", localStorage.getItem('access_token'));
		// form.append("up_files", fileInput.files[0], "/C:/Users/mdras/Desktop/ddd.png");
		// form.append("up_files", fileInput.files[0], "/C:/Users/mdras/Desktop/download.jfif");
		// form.append("up_files", fileInput.files[0], "/C:/Users/mdras/Desktop/matrix-failed.png");

		var settings = {
			"url": "https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
			// "url": "https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Authorization": "Basic TWVyY2hhbnQuVEVTVDEwMDAwMDI0NTA0OjQ1NjVhOTI4NGQ0ZjFkMjE3YzI5OTY5ZGUxNTc1YzM2"
			},
			"processData": false,
			"mimeType": "multipart/form-data",
			"contentType": false,
			"data": form
		};
		// 		setTimeout(() => {
		// Swal.close();

		// 		}, 2000);
		$.ajax(settings).done(function (response) {
			Swal.close();
			var newone = JSON.parse(response);
			console.log(newone.data);
			if (newone.status == 'true') {
				self.clearFileUploadingField();
				var chat_msg = newone.data;
				console.log(self.chat_panel_details);
				//let agent_name = localStorage.getItem('user_name');
				var str = chat_msg.agent_name;
				var agent_name = str.split(" ");
				//  var conversion_url =window.btoa(chat_msg.chat_msg);
				var conversion_url = btoa(unescape(encodeURIComponent(chat_msg.chat_msg)));

				// WEB RESPONSE
				// agent_name: "VE"
				// chat_dt: "19/10/2021"
				// chat_id: "1236"
				// chat_images: ""
				// chat_msg: "safdgd"
				// chat_msg_id: "6095"
				// chat_time: "09:10"
				// chat_type: "1"
				// chat_user: "1269"
				// customer_name: "testing34"
				// extension: ""
				// msg_status: "1"
				// msg_type: "text"
				// msg_user_id: "1284"
				// msg_user_type: "2"
				// profile_image: "https://erp.cal4care.com/erp/apps/profile_image/vai2.jpg"
				// user_name: "600"

				var socket_message = '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "' + chat_msg.chat_id + '","msg_user_id" : "' + chat_msg.msg_user_id + '","msg_user_type" : "2","msg_type":"text","message" : "' + conversion_url + '","queue_id":"1","agent_aviator":"' + self.profile_image + '","agent_name":"' + agent_name[0] + '","chat_images":"' + chat_msg.chat_images + '", "extension":"' + chat_msg.extension + '","profile_image":"'+chat_msg.profile_image+'","chat_msg" : "' + chat_msg.chat_msg + '","user_name":"'+chat_msg.user_name+'","names":"'+agent_name[0]+'"}}';

				// APP RESPONSE
				// agent_name: ""
				// assigned_user: "0"
				// chatUrl: "https://omnitickets.mconnectapps.com/webbot/?aid=NjQ=&wid=VGVzdA=="
				// chat_aviator: "0"
				// chat_dt: "19/10/2021"
				// chat_id: "1236"
				// chat_images: ""
				// chat_msg: "testongh"
				// chat_msg_id: "6163"
				// chat_status: "5"
				// chat_time: "09:50"
				// chat_type: "1"
				// chat_user: "1269"
				// city: "Singapore"
				// country: "SG"
				// created_ip: "111.223.127.170"
				// customer_email: "testing34@gmail.com"
				// customer_name: "testing34"
				// department_name: "TEST"
				// extension: ""
				// msg_status: "1"
				// msg_type: "text"
				// msg_user_id: "1284"
				// msg_user_type: "2"
				// names: "VE"
				// online_status: "0"
				// profile_image: "https://erp.cal4care.com/erp/apps/profile_image/vai2.jpg"
				// rating_value: null
				// user_name: "600"
				// widget_name: "Test"

				// var socket_message = '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "' + chat_msg.chat_id + '","msg_user_id" : "' + chat_msg.msg_user_id + '","msg_user_type" : "2","msg_type":"text","message" : "' + conversion_url + '","queue_id":"1","agent_aviator":"' + self.profile_image + '","agent_name":"' + agent_name[0] + '","chat_images":"' + chat_msg.chat_images + '", "extension":"' + chat_msg.extension + '"}}';

				self.websocket.send(socket_message);

				self.chat_panel_details.push(chat_msg);

				self.chatautoScroll();
				$('#chat_msg').val('');
			} else {
				iziToast.error({
					message: "Sorry, The message is Delivered",
					position: 'topRight'
				});
			}

		});

		// }

	}


	clearFileUploadingField() {
		var input = $("#chat_media");
		input.replaceWith(input.val('').clone(true));
	}

	onMessageSend($event) {

		if ($event.keyCode == 13) {


			// this.sendChatMessageData();
			this.sendImage();
			$event.stopPropagation();
			return false;
		}


	}

	chatPanelView(chat_id) {
		// {"action":"chat_message_panel","chat_type":"webchat","chat_id":"all","user_id":"1203","status":"2"}}

		let api_req: any = new Object();
		let chat_req: any = new Object();
		chat_req.action = "chat_message_panel";
		chat_req.chat_type = "webchat";
		chat_req.chat_id = chat_id;
		chat_req.user_id = this.loginUser;
		if ($('#voice_3cx').prop('checked') == true) {
			// $('#voice_3cx').prop('checked', true);
			// alert()
			chat_req.status = '2';
			this.is_chat_closed = true;

		} else {
			// alert('not check')
			chat_req.status = '5';
			this.is_chat_closed = false;

		}
		if (this.data_view == 'missed') {
			chat_req.status = '6';
			this.is_chat_closed = true;

		}
		api_req.operation = "chat";
		api_req.moduleType = "chat";
		api_req.api_type = "web";
		api_req.access_token = localStorage.getItem('access_token');
		api_req.element_data = chat_req;

		this.serverService.sendServer(api_req).subscribe((response: any) => {
			if (response.result.status == 1) {

				this.chat_panel_list = response.result.data.chat_list;
				if(this.chat_panel_list.length)
				this.c_status = response.result.data.chat_list[0].chat_status;

				if (chat_id == "all" || chat_id == "" || chat_id == 0) {
					this.chat_panel_detail_type = "chat_screen";
				}
				else {
					this.chat_panel_details = response.result.data.chat_detail_list;
					this.chat_panel_detail_type = "chat_detail";
					this.chatPanelDetail(chat_id, this.c_status)
				}


				// this.chatautoScroll();
				this.chat_detail_key = chat_id;
			}

		},
			(error) => {
				console.log(error);
			});


	}
	tabsection(click_type) {
		if (click_type == 'active') {
			this.data_view = '';
			$('#voice_3cx').prop('checked', false)
			$('#sect2').removeClass('tab-active');
			$('#sect3').removeClass('tab-active');
			$('#sect1').addClass('tab-active');
			this.chatPanelView('all');
		} else if (click_type == 'close') {
			this.data_view = '';
			$('#voice_3cx').prop('checked', true)
			$('#sect1').removeClass('tab-active');
			$('#sect3').removeClass('tab-active');
			$('#sect2').addClass('tab-active');
			this.chatPanelView('all');
		}
		else if (click_type == 'missed') {
			this.data_view = 'missed';
			$('#sect1').removeClass('tab-active');
			$('#sect2').removeClass('tab-active');
			$('#sect3').addClass('tab-active');
			this.chatPanelView('all');


		}
	}
	chatPanelView2(chat_id) {
		// {"action":"chat_message_panel","chat_type":"webchat","chat_id":"all","user_id":"1203","status":"2"}}

		let api_req: any = new Object();
		let chat_req: any = new Object();
		chat_req.action = "chat_message_panel";
		chat_req.chat_type = "webchat";
		chat_req.chat_id = chat_id;
		chat_req.user_id = this.loginUser;

		if (this.search_text != '' && this.search_text != null && this.search_text != undefined)
			chat_req.search_text = this.search_text;

		if ($('#voice_3cx').prop('checked') == true) {
			// $('#voice_3cx').prop('checked', true);
			// alert('1')
			chat_req.status = '2';
			this.is_chat_closed = true;

		} else {
			// alert('2')
			chat_req.status = '5';
			this.is_chat_closed = false;

		}

		if (this.data_view == 'missed') {
			chat_req.status = '6';
			this.is_chat_closed = true;

		}
		api_req.operation = "chat";
		api_req.moduleType = "chat";
		api_req.api_type = "web";
		api_req.access_token = localStorage.getItem('access_token');
		api_req.element_data = chat_req;

		this.serverService.sendServer(api_req).subscribe((response: any) => {
			if (response.result.status == 1) {

				this.chat_panel_list = response.result.data.chat_list;
				this.c_status = response.result.data.chat_list[0].chat_status;

				// if (chat_id == "all" || chat_id == "" || chat_id == 0) {
				// 	this.chat_panel_detail_type = "chat_screen";
				// }
				// else {
				// 	this.chat_panel_details = response.result.data.chat_detail_list;
				// 	this.chat_panel_detail_type = "chat_detail";
				// 	this.chatPanelDetail(chat_id, this.c_status)
				// }


				// this.chatautoScroll();
				// this.chat_detail_key = chat_id;
			}

		},
			(error) => {
				console.log(error);
			});


	}

	chatPanelList(search_text) {
		this.search_text = search_text;
		let api_req: any = new Object();
		let chat_req: any = new Object();
		chat_req.action = "chat_message_panel";
		chat_req.chat_type = "webchat";
		chat_req.chat_id = 'all';
		chat_req.user_id = this.loginUser;
		chat_req.search_text = search_text;
		if ($('#voice_3cx').prop('checked') == true) {
			// $('#voice_3cx').prop('checked', true);
			// alert()
			chat_req.status = '2';

		} else {
			// alert('not check')
			chat_req.status = '5';

		}
		if (this.data_view == 'missed') {
			chat_req.status = '6';

		}
		api_req.operation = "chat";
		api_req.moduleType = "chat";
		api_req.api_type = "web";
		api_req.access_token = localStorage.getItem('access_token');
		api_req.element_data = chat_req;


		// {"operation":"chat","moduleType":"chat","api_type":"web","access_token":"","element_data":{"action":"chat_message_panel","chat_type":"webchat","chat_id":"all","user_id":"","search_text":"","status":""}}

		this.serverService.sendServer(api_req).subscribe((response: any) => {

			if (response.result.status == 1) {
				this.chat_panel_list = response.result.data.chat_list;
			}
		},
			(error) => {
				console.log(error);
			});


	}

	chatPanelDetail(chat_id, c_status) {
		$('#chat_msg').val('');
		let api_req: any = new Object();
		let chat_req: any = new Object();
		chat_req.action = "chat_detail_list";
		chat_req.chat_type = "webchat";
		chat_req.chat_id = chat_id;
		chat_req.user_id = this.loginUser;
		api_req.operation = "chat";
		api_req.moduleType = "chat";
		api_req.api_type = "web";
		api_req.access_token = localStorage.getItem('access_token');
		api_req.element_data = chat_req;

		this.serverService.sendServer(api_req).subscribe((response: any) => {
			if (response.result.status == 1) {

				if (c_status == '2') {
					this.chat_status_detail_id = 'closed';
					this.is_chat_closed = true;
				} else {
					this.is_chat_closed = false;
				}

				this.chat_panel_detail_type = "chat_detail";
				this.chat_panel_details = response.result.data.chat_detail_list;
				this.customer_name = response.result.data.chat_detail_list[0].customer_name;
				this.widget_name = response.result.data.chat_detail_list[0].widget_name;
				var testdata = response.result.data.chat_detail_list[0].chat_msg;
				this.botlisting = testdata.split('||');

				this.chatautoScroll();
				this.chat_detail_key = chat_id;
				this.chatPanelView2('all');
			}

		},
			(error) => {
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
			confirmButtonText: 'END Chat!'
		}).then((result) => {
			if (result.value) {

				let agent_name = localStorage.getItem('user_name');
				var socket_message = '{"message_type":"chat","message_status":"existing","message_info" : {"chat_id" : "' + id + '","msg_user_id" : "' + this.loginUser + '","msg_user_type" : "3","msg_type":"text","message" : "closed","queue_id":"1","agent_aviator":"' + this.profile_image + '","agent_name":"' + agent_name + '"}}';

				this.websocket.send(socket_message);
				let access_token: any = localStorage.getItem('access_token');
				let admin_id: any = localStorage.getItem('admin_id');
				// let api_req: any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"chat_details","chat_id":"' + id + '","user_id":"' + admin_id + '","widget_name":"' + this.widget_name + '"}}';


				let api_req: any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"chat_closedby_user","chat_id":"' + id + '","user_id":"' + admin_id + '","widget_name":"' + this.widget_name + '"}}';


				this.serverService.sendServer(api_req).subscribe((response: any) => {
					if (response.status == true) {
						Swal.fire(
							'Closed!',
							'success'
						);
						this.chatPanelView("all");
						setTimeout(() => {
							this.chat_panel_detail_type = "chat_screen";
						}, 2000);
					}

				},
					(error) => {
						console.log(error);
					});
			}
		})
	}

	get_temps() {
		let access_token: any = localStorage.getItem('access_token');

		let api_req: any = '{"operation":"template", "moduleType":"template", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"listTemplateByUSer","admin_id":"' + this.adminid + '","user_id":"' + this.loginUser + '"}}';

		this.serverService.sendServer(api_req).subscribe((response: any) => {
			if (response.result.status == true) {

				this.temp_list = response.result.data;
				//   console.log(this.temp_list);
			}
		},
			(error) => {
				console.log(error);
			});
	}



	template() {
		var options = {};
		$.map(this.temp_list,
			function (o) {
				options[o.template_message] = o.template_name;
			});

		const fruit = Swal.fire({
			title: 'Select Template',
			input: 'select',
			inputOptions: options,
			inputPlaceholder: 'Select a Template',

			confirmButtonText: 'Pick out',
			showCancelButton: true,
		}).then(function (inputValue) {
			if (inputValue) {
				console.log(inputValue.value);
				console.log(fruit);
				$('#chat_msg').val(inputValue.value);
			}
		});


	}

	showdoc(link) {
		//   this.doc_link=link;
		//  $("#document_model").modal('show');
		var url = link.split('/');
		// alert(url)
		this.doc_link = "https://www.youtube.com/embed/" + url[3];
		// alert(this.doc_link)

		$("#video_play").modal('show');

	} stop() {
		var el_src = $('.myvideo').attr("src");
		$('.myvideo').attr("src", el_src);
	}

}
