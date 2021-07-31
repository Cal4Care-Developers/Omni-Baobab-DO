import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
@Component({
  selector: 'app-queueform',
  templateUrl: './queueform.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueformComponent implements OnInit {
  addQueue: FormGroup;
  queue_assign_users: any;
  queue_assign_user_data: any;



  constructor(private serverService: ServerService, private router:Router, private _formBuilder:FormBuilder) {



   }

  ngOnInit() {
   this.addQueue = new FormGroup({
    'queue_name' : new FormControl(null,Validators.required),
    'queue_number' : new FormControl(null,Validators.required),
    'queue_status' : new FormControl(null)
   });



  }


  addQueueData(){

    let api_req:any = new Object();
    let add_queue_req:any = new Object();
    add_queue_req.created_by=localStorage.getItem('userId');
    add_queue_req.admin_id=localStorage.getItem('admin_id');
    add_queue_req.queue_name=this.addQueue.value.queue_name;
    add_queue_req.queue_number=this.addQueue.value.queue_number;
    add_queue_req.queue_status=this.addQueue.value.queue_status;
    add_queue_req.action='add_queue';
    api_req.operation="queue";
    api_req.moduleType="queue";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = add_queue_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
        
        if (response.result.status == 1) {
                $('#add_queue_form').modal('hide');
                this.addQueue.reset();
                iziToast.success({
                    message: "Queue - "+response.result.data.queue_name+" added successfully",
                    position: 'topRight'
                });
            }
        else{
            
                iziToast.warning({
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
    
    assignQueueForm(id){  
       // this.assignQueue.reset();        
        let api_req:any = new Object();
        let queue_assign_req:any = new Object();
        queue_assign_req.queue_id=id.value;
        queue_assign_req.action='queue_user_assign_list';
        queue_assign_req.admin_id = localStorage.getItem('admin_id');
        api_req.operation="queue";
        api_req.moduleType="queue";
        api_req.api_type="web";
        api_req.access_token=localStorage.getItem('access_token');
        api_req.element_data = queue_assign_req;
        
         $('#assign_queue_form').modal('show');

        this.serverService.sendServer(api_req).subscribe((response: any) => {
            


            if (response.result.status == 1) {


                  this.queue_assign_users = response.result.data.queue_assign_users;
       
                  this.queue_assign_user_data = response.result.data.queue_assign_users;

                }
            else{

                    iziToast.warning({
                        message: "Queue user data could not retrive. Please try again",
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
    
    
    assignQueueData(){
        
        
    }



}
