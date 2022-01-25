import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServerService } from '../services/server.service';
declare var iziToast;
declare var $;
@Component({
  selector: 'app-customized-report',
  templateUrl: './customized-report.component.html',
  styleUrls: ['./customized-report.component.css']
})
export class CustomizedReportComponent implements OnInit {
  getdate: FormGroup;
  access_token;
  customize: any;
  off_time: any;
  total_answer: any;
  total_missed_call: any;
  completed_calls: any;
  qulity_service: any;
  sla_per: any;
  avg_waiting_time: any;
  call_rate: any;
  avg_takl_time: any;
  avg_out_talk_time: any;
  show_table = false;
  total_tickets: any;
  first_responce_time: any;
  email_ticket_average: any;
  incoming_tickets: any;
  not_found = false;
  hide_hrs: boolean;
  tot_out_office_time_wp: any;
  total_wp_msg: any;
  first_responce_wp: any;
  avg_wp_first_ans: any;
  tot_office_wp: any;
  res_data: any;

  titles :any;
  arrStr: string;
  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    
    this.getdate = new FormGroup({
      'from_date' : new FormControl(null),
      'to_date' : new FormControl(null),
    })
    this.not_found = true;
  }
  getReports(arrStr){
    var url = 'https://baobabgroup.mconnectapps.com/api/storage/contact/customized_report.php';
    var form = $('<form target="_blank" action="' + url + '" method="post">' +
      '<input type="text" name="res" value="' + arrStr + '" />' +
      '</form>');
    $('body').append(form);
    form.submit();
  }
  getcustomReports(){
    this.access_token = localStorage.getItem('access_token');
    let api_req : any = '{"operation": "report", "moduleType": "report","api_type": "web","access_token": "'+this.access_token+'","element_data": {"action": "custom_report","dt_time": "'+this.getdate.value.from_date+'","to_dt":"'+this.getdate.value.to_date+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
		  if(response.result.data.status!=false){
        this.show_table = true;
        this.res_data = response.result.data;
        console.log(this.res_data);
        this.customize = response.result.data.on_time_inbound;
        this.off_time = response.result.data.off_time_inbound;
        this.total_answer = response.result.data.total_ans_call;
        this.total_missed_call = response.result.data.total_missed_call;
        this.completed_calls = response.result.data.completed_calls;
        this.qulity_service = response.result.data.qulity_service;
        this.sla_per = response.result.data.sla_per;
        this.avg_waiting_time = response.result.data.avg_waiting_time;
        this.call_rate = response.result.data.call_rate;
        this.avg_takl_time = response.result.data.avg_takl_time;
        this.avg_out_talk_time = response.result.data.avg_out_talk_time;
        this.total_tickets = response.result.data.total_tickets;
        this.tot_out_office_time_wp = response.result.data.out_off_time;
        this.total_wp_msg = response.result.data.one_day_total_whatsapp;
        
        if(response.result.data.first_responce_wp == '' || response.result.data.first_responce_wp == null || response.result.data.first_responce_wp == undefined){
          this.hide_hrs = false;
        }else{
          this.hide_hrs = true;
          this.first_responce_wp = response.result.data.first_responce_wp;
        }
        this.avg_wp_first_ans = response.result.data.avg_wp_first_ans;
        this.tot_office_wp = response.result.data.office_time_whatsapp_msg;
        if(response.result.data.first_responce_time == '' || response.result.data.first_responce_time == null || response.result.data.first_responce_time == undefined){
          this.hide_hrs = false;
        }else{
          this.hide_hrs = true;
        this.first_responce_time = response.result.data.first_responce_time;
        }
        this.email_ticket_average = response.result.data.email_ticket_average;
        this.incoming_tickets = response.result.data.incoming_tickets;

        this.arrStr = encodeURIComponent(JSON.stringify(this.res_data));
       
				// document.location.href = 'https://uatassaabloyccapi.mconnectapps.com/api/storage/contact/download.php?res='+arrStr;

//           console.log(this.titles);
//           console.log(this.res_data);

//         this.titles = [{
//           title: 'Interactions received during opening hours'
//         },
//         {
//           title:'Interactions received outside opening hours'
//         },
//         {
//           title:'Handled inbound interactions'
//         },
//         {
//           title:'Issued calls'
//         },
//         {
//           title:'Completed calls'
//         },
//         {
//           title:'Tel Quality of Service (QS)'
//         },
//         {
//           title:'Tel Service Level'
//         },
//         {
//           title:'1rst response time'
//         },
//         {
//           title:'Average waiting time before response'
//         },
//         {
//           title:'Average time for 1st answer'
//         },
//         {
//           title:'% Argumentative calls Rate'
//         },
//         {
//           title:'Average Talk Time Inbound'
//         },
//         {
//           title:'Average Talk Time Outbound'
//         },
      
//       ]
//       let arr3 = this.res_data.map((item, i) => Object.assign({}, item, this.titles[i]));
// console.log(arr3)
				
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
