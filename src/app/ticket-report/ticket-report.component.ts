import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;


@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.css']
})
export class TicketReportComponent implements OnInit {
  res;
  getRep: FormGroup;
  usersL;
  selected_price : any;
  userData = {"licensce_key": ""};
  public isKeyAvail = false;
  public isItemAvailable = false;
  s_licence_key : any;
  items: any;
  accessToken:any;
  user_id:any;
  tic_status;
  constructor(private serverService: ServerService, private router:Router) { }

  ngOnInit() {
    this.getRep = new FormGroup({
      'tic_status' :new FormControl(null),
      'from_date' :new FormControl(null),
      'to_date' :new FormControl(null),
    });
  }



  getReports(){
    let tic_status: any= $('#tic_status').val();
    let fromDate: any= $('#from_date').val();
    let to_date: any= $('#to_date').val();
    if(fromDate == null || fromDate == ''){
      iziToast.warning({
        message: "Please Select From Date",
        position: 'topRight'
    });
    return false;
    }
    if(to_date == null || to_date == ''){
      iziToast.warning({
        message: "Please Select To Date",
        position: 'topRight'
    });
    return false;
    }
if(tic_status == null || tic_status == ''){
  iziToast.warning({
    message: "Please Select Ticket Status",
    position: 'topRight'
});
return false;
}



    let api_req:any = new Object();
    let agents_req:any = new Object();
    agents_req.action="ticket_reports";
    agents_req.user_id=localStorage.getItem('userId');
    agents_req.tic_status = this.getRep.value.tic_status;
    agents_req.fromDate = this.getRep.value.from_date;
    agents_req.toDate = this.getRep.value.to_date;
    api_req.operation="ticket";
    api_req.moduleType="ticket";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = agents_req;
    console.log(api_req);
        this.serverService.sendServer(api_req).subscribe((response:any) => {
        console.log(response);


          if(response.result.status==true){
          this.res = response;
          var arrStr = encodeURIComponent(JSON.stringify(this.res));
          // document.location.href = 'https://baobabgroup.mconnectapps.com/api/storage/contact/download.php?res='+arrStr;


          var url = 'https://baobabgroup.mconnectapps.com/api/storage/contact/ticket.php';
          var form = $('<form action="' + url + '" method="post">' +
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

