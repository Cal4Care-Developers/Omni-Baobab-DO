import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
declare var $: any;
declare var iziToast: any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-chatbot-question-feed',
  templateUrl: './chatbot-question-feed.component.html',
  styleUrls: ['./chatbot-question-feed.component.css']
})
export class ChatbotQuestionFeedComponent implements OnInit {
  addQusn: FormGroup;
  editQusn: FormGroup;
  editbot: FormGroup;
  addbot: FormGroup;
  editkeyword: FormGroup;
  addKeywordValue: FormGroup;
  admin_id;
  qusn_list;
  chatbot_status;
  a_id;
  b_id;
  recordNotFound = false;
  doc_link;
  botstatus;
  websocket;
  showans = false;
  showerrorstatus = false;
  showeditstatus = false;
  showediterror = false;
  presentEmails = false;
  presentempty = false;

  wrapUpCode = [];
  addwrapUpCode = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  list_keywords;
  list_key_id;
  edit_keyword_ids;
  updateid;
  constructor(private serverService: ServerService) { }

  add(event: MatChipInputEvent): void {
    console.log(event.input);
    const input = event.input;
    const value = event.value;
    let myItems = this.wrapUpCode.filter(item => item.name === value);

    if(myItems.length < 1){
      this.presentEmails = false;
      this.presentempty = false; 
    }
    console.log(myItems.length);
    // // Add our fruit
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

  addcreate(event: MatChipInputEvent): void {
    console.log(event.input);
    const input = event.input;
    const value = event.value;
    let myItems = this.addwrapUpCode.filter(item => item.name === value);

    if(myItems.length < 1){
      this.presentEmails = false;
      this.presentempty = false; 
    }
    console.log(myItems.length);
    // // Add our fruit
    // if (myItems.length < 1) {
      if ((value || '').trim()) {
        this.addwrapUpCode.push({ name: value.trim() });
      }
      if (input) {
        input.value = '';
      }
    // } else {
    //   this.presentEmails = true;
    // }

  }



  removecreate(code): void {
    const index = this.addwrapUpCode.indexOf(code);
    console.log(index);
    if (index >= 0) {
      this.addwrapUpCode.splice(index, 1);
    }
    if(index == 0){
      this.presentEmails = false;
      this.presentempty = true;
    }else{
      this.presentempty = false;
    }
  }

  remove(code): void {
    const index = this.wrapUpCode.indexOf(code);
    console.log(index);
    if (index >= 0) {
      this.wrapUpCode.splice(index, 1);
    }
    if(index == 0){
      this.presentEmails = false;
      this.presentempty = true;
    }else{
      this.presentempty = false;
    }
  }



  ngOnInit() {
    this.admin_id = localStorage.getItem('admin_id');
    this.addQusn = new FormGroup({
      'chat_question': new FormControl(null, Validators.required),
      'chat_answer': new FormControl(null, Validators.required),
    });
    this.editQusn = new FormGroup({
      'chat_question': new FormControl(null, Validators.required),
      'chat_answer': new FormControl(null, Validators.required)
    });
    this.editbot = new FormGroup({
      'chat_question': new FormControl(null, Validators.required),
      // 'status': new FormControl(null, Validators.required)
    });
    this.addbot = new FormGroup({
      'chat_question': new FormControl(null, Validators.required),
      'status': new FormControl(null, Validators.required)
    });
    this.editkeyword = new FormGroup({
      'edit_value': new FormControl(null),
    });

    this.addKeywordValue = new FormGroup({
      'title': new FormControl(null, Validators.required),
    });



    this.websocket = new WebSocket("wss://myscoket.mconnectapps.com:4004");


		this.websocket.onopen = function (event) {
			console.log('socket chat connected');

		}

		this.websocket.onmessage = function (event) {


			this.socketData = JSON.parse(event.data);


    }

    this.websocket.onerror = function (event) {
			console.log('error');
		}
		this.websocket.onclose = function (event) {
			console.log('close');
		}


    this.get_qusn();
    this.listkeyWords();
    this.botOfflineSettings();
  }

  //   noToggle() {
  //   event.stopPropagation();

  // }

  // statusChange() {

  //   var status_ids = this.addQusn.value.status;
  //   var present = this.qusn_list.filter(function (item) {
  //     return item.status == status_ids;
  //   });

  //   if (this.addQusn.value.status != '' && this.addQusn.value.status != 1 && this.addQusn.value.status != 2) {
  //     this.showans = true;
  //   } else {
  //     this.showans = false;
  //   }
  //   console.log(present.length);
  //   if (present.length == 1) {
  //     this.showerrorstatus = true;
  //   } else {
  //     this.showerrorstatus = false;
  //   }

  // }

  editstatusChange() {
    var status_ids = this.addbot.value.status;
    var present = this.qusn_list.filter(function (item) {
      return item.status == status_ids;
    });
    if (present.length == 1) {
      this.showediterror = true;
    } else {
      this.showediterror = false;
    }
    if (status_ids == 0) {
      this.showeditstatus = true;
    } else {
      this.showeditstatus = false;
    }
  }

  get_qusn() {

    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"get_question","admin_id":"' + this.admin_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {

      if (response.status == true) {

        // this.qusn_list = response.result.data;
        this.qusn_list = response.result.data.filter(function (e) {
          return e["status"] == 0
        });
        this.chatbot_status = response.result.data.filter(function (e) {
          // return [1, 2].includes(e.status)
          return (e["status"] == 1 || e["status"] == 2 || e["status"] == 3)
        });

      } else {
        this.recordNotFound = true;
      }
    },
      (error) => {
        console.log(error);
      });

  }




  addQusnData() {
    let api_req: any = new Object;
    api_req.operation = "insertchat_question";
    api_req.moduleType = "chat";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');

    api_req.element_data = this.addQusn.value;
    api_req.element_data.admin_id = this.admin_id;
    api_req.element_data.action = "chat_question";
    let chatAnswer = this.addQusn.value.chat_answer;

    if (chatAnswer != '' && chatAnswer != 'null' && chatAnswer != undefined) {
      chatAnswer = this.textUrl(chatAnswer);
    }
    //  alert(chatAnswer);
    api_req.element_data.chat_answer = chatAnswer;
    api_req.element_data.status = '0';
    // let api_req:any = '{"operation":"insertchat_question", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_question","admin_id":"'+this.admin_id+'","chat_question":"'+agent_req.question+'","chat_answer":"'+agent_req.answer+'"}}';
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {
        this.addQusn.reset();
        this.get_qusn();
        iziToast.success({
          message: "Question and Answer added successfully",
          position: 'topRight'
        });
        $('#add_qusnform').modal('hide');
      }
      else {
        iziToast.warning({
          message: "Question and Answer not Added. Please try again",
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



  editquestionSettings(id) {

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

    let api_req: any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"edit_chatquestion","admin_id":"' + this.admin_id + '","id": "' + id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      Swal.close();
      if (response.status == true) {
        var agent_data = response.result.data;
        // let  answer=this.textUrlRev(agent_data.answer);
        // var answer = new RegExp(this.reEscape(agent_data.answer), "mg");

        if (response.result.data.status == 0) {
          var content = this.strip_tags(agent_data.answer, ' ');
          this.editQusn.setValue({
            'chat_question': agent_data.question,
            'chat_answer': content,
          });

          this.a_id = response.result.data.id;
          this.b_id = response.result.data.status;
          $('#edit_qusnform').modal('show');
        } else {

          this.editbot.setValue({
            'chat_question': agent_data.question
          });

          this.a_id = response.result.data.id;
          this.b_id = response.result.data.status;
          $('#edit_form').modal('show');
        }
        this.get_qusn();
      } else {
        iziToast.warning({
          message: "Question count not retrive. Please try again",
          position: 'topRight'
        });

      }
    },
      (error) => {
        console.log(error);
      });
  }





  edit_qusnData(id, status_ids) {


    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',  
    });

    let api_req: any = new Object;
    

    if (status_ids == 0) {
      api_req.element_data = this.editQusn.value;
      let chatAnswer = this.editQusn.value.chat_answer;

      if (chatAnswer != '' && chatAnswer != 'null' && chatAnswer != undefined) {
        chatAnswer = this.textUrl(chatAnswer);
      }
      api_req.element_data.chat_answer = chatAnswer;
    } else {

      api_req.element_data = this.editbot.value;
      api_req.element_data.chat_answer = '';
    }


    api_req.element_data.status = status_ids;

    api_req.operation = "chat";
    api_req.moduleType = "chat";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data.admin_id = localStorage.getItem('admin_id');
    api_req.element_data.id = id;
    api_req.element_data.action = "update_chatquestion";

    // let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_chatquestion","id": "'+id+'","chat_question":"'+agent_req.question+'","chat_answer":"'+agent_req.answer+'","admin_id":"'+this.admin_id+'"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      Swal.close();
      if (response.result.data == 1) {
        if (status_ids == 0) {
        $('#edit_qusnform').modal('hide');
      }else{
          $('#edit_form').modal('hide');

        }
        this.get_qusn();
        iziToast.success({
          message: "Question and Answer updated successfully",
          position: 'topRight'
        });
      } else {

        iziToast.warning({
          message: "Sorry not updated. Please try again",
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


  deleteQuestion(id) {

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

        let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"delete_chatquestion", "id": "' + id + '","admin_id":"' + this.admin_id + '"}}';

        this.serverService.sendServer(api_req).subscribe((response: any) => {

          console.log(response);
          if (response.result.data == 1) {
            iziToast.success({
              message: "Data deleted successfully",
              position: 'topRight'
            });
            this.get_qusn();
          } else {
            iziToast.warning({
              message: "Data not deleted, Please try again!",
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



  addQuestion() {
    $('#add_qusnform').modal('show');
  }
  showdoc(link) {
    this.doc_link = link;
    $("#document_model").modal('show');
  }
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
  // reEscape(text) {
  //   return text.replace(/([.*+?^$|(){}\[\]])/mg, "\\$1");

  // }
  strip_tags(input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
  }



  // =========================== keywords function ================================

  addKeywords() {
    $('#add_keywordform').modal('show');
  }


  createKeyword() {

    // {"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"", "element_data":{"action":"add_ChatClose_keywords","admin_id":"1203","user_id":"1203","keyword":"Demods"}}

    let user_id = localStorage.getItem('userId');
    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"add_ChatClose_keywords","admin_id":"' + this.admin_id + '","user_id":"' + user_id + '","keyword":"' + this.addKeywordValue.value.title + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.result.data == 1) {
        iziToast.success({
          message: "Keyword created successfully",
          position: 'topRight'
        });
        this.listkeyWords();
        $('#add_keywordform').modal('hide');
      } else {
        iziToast.warning({
          message: "Keyword creation Failed",
          position: 'topRight'
        });
      }
    },
      (error) => {
        console.log(error);
      });

  }



  listkeyWords() {

    // {"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"", "element_data":{"action":"list_ChatClose_keywords","admin_id":"1203","user_id":"1203"}}
    let user_id = localStorage.getItem('userId');
    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"list_ChatClose_keywords","admin_id":"' + this.admin_id + '","user_id":"' + user_id + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if (response.result.status == true) {
        this.list_key_id = response.result.data[0].id;
        this.list_keywords = response.result.data[0].keyword.split(",");
      }
    },
      (error) => {
        console.log(error);
      });

  }

  editkeywords(ids) {

    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',  
    });
    // {"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"", "element_data":{"action":"edit_ChatClose_keywords","id":"1"}}
    this.updateid = ids;
    let user_id = localStorage.getItem('userId');
    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"edit_ChatClose_keywords","id":"' + ids + '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      this.presentempty = false;
      this.wrapUpCode = [];
      Swal.close();
      if (response.result.status == true) {
        // this.edit_keyword_ids = response.result.data;
        // this.editkeyword.value.edit_value =response.result.data[0].keyword;
        // $("#add_eidt_keywords").val(response.result.data[0].keyword);
        var edit_splits = response.result.data[0].keyword.split(',');
        console.log(edit_splits);
        edit_splits.forEach(element => {
          this.wrapUpCode.push({ name: element });
        });
        $('#edit_keywordform').modal('show');
      }
    },
      (error) => {
        console.log(error);
      });
  }


  deletekeywords(ids) {

    // {"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"", "element_data":{"action":"delete_ChatClose_keywords","key_id":"1"}}
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

        let user_id = localStorage.getItem('userId');
        let access_token: any = localStorage.getItem('access_token');
        let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"delete_ChatClose_keywords","key_id":"' + ids + '"}}';

        this.serverService.sendServer(api_req).subscribe((response: any) => {
          console.log(response);
          if (response.result.data == 1) {
            this.listkeyWords();
            iziToast.success({
              message: "Keyword deleted successfully",
              position: 'topRight'
            });
          } else {
            iziToast.warning({
              message: "Keyword deletion Failed",
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

  updateKeyword() {

    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',  
    });


    var new_array = [];
    this.wrapUpCode.forEach(element => {
      new_array.push(element.name);
    });
    var agent_dept = new_array.join(",");
    let user_id = localStorage.getItem('userId');
    let access_token: any = localStorage.getItem('access_token');

    // {"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"", "element_data":{"action":"update_ChatClose_keywords","id":"1","keyword":"keyword"}}


    let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"update_ChatClose_keywords","id":"' + this.updateid + '","keyword":"' + agent_dept+ '"}}';

    this.serverService.sendServer(api_req).subscribe((response: any) => {
      Swal.close();
      if (response.result.data == 1) {
        $('#edit_keywordform').modal('hide');
        this.listkeyWords();
        iziToast.success({
          message: "Keyword update successfully",
          position: 'topRight'
        });
      } else {
        iziToast.warning({
          message: "Keyword update Failed",
          position: 'topRight'
        });
      }

    },
      (error) => {
        console.log(error);
      });

  }


  // =========================== END keywords function ================================

  // =========================== ChatBOT Offline function ================================

  botOfflineSettings(){

    // {"operation":"chat","moduleType":"chat","api_type":"web","access_token":"","element_data":{"action":"overallChatSettings","admin_id":"1203"}}

    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"overallChatSettings","admin_id":"' + this.admin_id + '"}}';
  
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      var bot_offline = response.result.data[0].offline_chat;
    if(bot_offline == 0){
      this.botstatus = false
    }else if(bot_offline == 1){
      this.botstatus = true
    }
    },
    (error) => {
      console.log(error);
    });

  }

  changeBotOfflineStatus(status){

    // {"operation":"chat","moduleType":"chat","api_type":"web","access_token":"","element_data":{"action":"overallChatSettingsUpdate","round_robin":"0","offline_chat":"1","admin_id":"1203"}}
    var off_status = status? 1:0;
    console.log(status);
    console.log(off_status);

    let access_token: any = localStorage.getItem('access_token');
    let api_req: any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"' + access_token + '", "element_data":{"action":"overallChatSettingsUpdate","admin_id":"' + this.admin_id + '","offline_chat":"' + off_status + '","round_robin":""}}';
  
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      console.log(response);
      if(response.status == true){
        var encode_id =btoa(this.admin_id)
        var socket_message = '{"message_type":"offline","message_status":"offline_toggle","message_info" : {"msg_user_type" : "offline_toggle","admin_id":"'+encode_id+'"}}';

        this.websocket.send(socket_message);
      iziToast.success({
        message: "Updated the Chatbot Status",
        position: 'topRight'
      });

      
    }else{
      iziToast.warning({
        message: "Failed to Updated the ChatBot status",
        position: 'topRight'
      });
    }

    },
    (error) => {
      console.log(error);
    });
  }


}



