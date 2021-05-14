import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
@Component({
  selector: 'app-chatbot-question-feed',
  templateUrl: './chatbot-question-feed.component.html',
  styleUrls: ['./chatbot-question-feed.component.css']
})
export class ChatbotQuestionFeedComponent implements OnInit {
  addQusn: FormGroup;
  editQusn:FormGroup;
  admin_id;
  qusn_list;
  a_id;
  recordNotFound= false;
  doc_link;
  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.admin_id = localStorage.getItem('admin_id');
    this.addQusn = new FormGroup({
      'chat_question' : new FormControl(null,Validators.required),
      'chat_answer' : new FormControl(null,Validators.required)
     });
     this.editQusn = new FormGroup({
      'chat_question' : new FormControl(null,Validators.required),
      'chat_answer' : new FormControl(null,Validators.required)
    });
    
     this.get_qusn();
  }

//   noToggle() {
//   event.stopPropagation();
  
// }


get_qusn(){

  let access_token: any=localStorage.getItem('access_token');
  let api_req:any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_question"}}';

                this.serverService.sendServer(api_req).subscribe((response:any) => {
                
                    if(response.status == true){
                
                      this.qusn_list=response.result.data;
                      
                    }else {
                      this.recordNotFound = true;
                    }
                }, 
                (error)=>{
                    console.log(error);
                });

}



addQusnData(){
let api_req:any = new Object;
api_req.operation="insertchat_question";
api_req.moduleType="chat";
api_req.api_type="web";
api_req.access_token=localStorage.getItem('access_token');
api_req.element_data = this.addQusn.value;
api_req.element_data.admin_id=this.admin_id;
api_req.element_data.action="chat_question";
    // let api_req:any = '{"operation":"insertchat_question", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_question","admin_id":"'+this.admin_id+'","chat_question":"'+agent_req.question+'","chat_answer":"'+agent_req.answer+'"}}';
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
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


  editquestionSettings(id){
    let access_token: any=localStorage.getItem('access_token');
    
    let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_chatquestion","admin_id":"'+this.admin_id+'","id": "'+id+'"}}';
  
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status == true){
        var agent_data = response.result.data;
        this.editQusn.setValue({
           'chat_question' : agent_data.question,
           'chat_answer' : agent_data.answer,
       });
        this.a_id = response.result.data.id;
  
  
       
  
      //  this.userchecked = agent_data.department_users.split(",");
      //  console.log(this.userchecked)
       $('#edit_qusnform').modal('show');
       this.get_qusn();
      }   else{
              
        iziToast.warning({
            message: "Question count not retrive. Please try again",
            position: 'topRight'
        });
    
  }
    }, 
    (error)=>{
        console.log(error);
    });
  }
  




  edit_qusnData(id){
   
    let api_req:any = new Object;
    api_req.operation="chat";
    api_req.moduleType="chat";
    api_req.api_type="web";
    api_req.access_token=localStorage.getItem('access_token');
    api_req.element_data = this.editQusn.value;
    api_req.element_data.admin_id=this.admin_id;
    api_req.element_data.id=id;
    api_req.element_data.action="update_chatquestion";
    // let api_req:any = '{"operation":"chat", "moduleType": "chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_chatquestion","id": "'+id+'","chat_question":"'+agent_req.question+'","chat_answer":"'+agent_req.answer+'","admin_id":"'+this.admin_id+'"}}';
  
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.data == 1) {
                $('#edit_qusnform').modal('hide');
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
  
  
  deleteQuestion(id){
    
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
      
        let api_req:any = '{"operation":"chat", "moduleType":"chat", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_chatquestion", "id": "'+id+'","admin_id":"'+this.admin_id+'"}}';
      
        this.serverService.sendServer(api_req).subscribe((response:any) => {
  
          console.log(response);
          if(response.result.data==1){
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
        (error)=>{
            console.log(error);
        });
      
    } 
  })
}
  


  addQuestion(){
    $('#add_qusnform').modal('show');
  }
  showdoc(link){   
    this.doc_link=link;
   $("#document_model").modal('show');   
  }

}
