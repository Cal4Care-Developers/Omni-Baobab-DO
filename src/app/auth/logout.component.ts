import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'logout',
  template:''
})
export class LogoutComponent implements OnInit {

  has_hard_id;
  websocket;
  admin_id;
     constructor(private router:Router,private serverService: ServerService) { }

     ngOnInit() {
      this.admin_id = localStorage.getItem('admin_id');
      this.has_hard_id = localStorage.getItem('hardware_id');

      //  let api_reqs:any = '{"type": "logoutClick"}';
      //  this.serverService.show.next(api_reqs);

        this.byeDude();

     }
    //  sendOnload(){
    
    //  }

     byeDude(){
      let access_token: any=localStorage.getItem('access_token');
      let user_id: any=localStorage.getItem('userId');

      let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"user_log_out","user_id":"'+user_id +'"}}';
    
      this.serverService.sendServer(api_req).subscribe((response:any) => {
        if(response.result.data==1){
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_type");
          localStorage.clear();
          this.router.navigate(['/login']);
         } else {
          
         }
      }, 
      (error)=>{
          console.log(error);
      });
    }



}
