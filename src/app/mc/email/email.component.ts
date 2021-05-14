import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { ServerService } from '../../services/server.service';
declare var $:any;

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
	loginUser;
	mailDetail;
	viewMailPanel;
  constructor(private serverService: ServerService) { 


  }

  ngOnInit() {
  	this.loginUser = localStorage.getItem('userId');
  	this.viewMailPanel = "mail_list";
  	//this.mailPanelDetail(46);
  }



   mailPanelDetail(chat_id){
   			return false
    		let api_req:any = new Object();
			let chat_req:any = new Object();
			chat_req.action="mail_detail_list";
			chat_req.chat_id=chat_id;
			chat_req.user_id=this.loginUser;
			api_req.operation="email";
			api_req.moduleType="email";
			api_req.api_type="web";
			api_req.access_token=localStorage.getItem('access_token');
			api_req.element_data = chat_req;
			
            this.serverService.sendServer(api_req).subscribe((response:any) => {
            	console.log(response);
            	var mail_message = response.result.data.mail_detail_list;
	            if(response.result.status==1){

	            
	            this.viewMailPanel = "mail_details";
	            console.log(response.result.data.mail_detail_list.length);

	            for(var i=0; mail_message.length > i; i++){

	            mail_message[i].chat_msg = atob(mail_message[i].chat_msg);

	            


	            }

	            this.mailDetail = mail_message;
	           			
	           		//	this.chat_panel_detail_type = "chat_detail";
	           		//	this.chat_panel_details = response.result.data.chat_detail_list;
	           		//	this.chatautoScroll(); 
	           		//	this.chat_detail_key = chat_id;
	            }
                
            }, 
            (error)=>{
                console.log(error);
            });


  }

}
