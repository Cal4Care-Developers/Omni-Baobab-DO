import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';

declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-csv-contact-upload',
  templateUrl: './csv-contact-upload.component.html',
  styleUrls: ['./csv-contact-upload.component.css']
})
export class CsvContactUploadComponent implements OnInit {

  param1: string;
  created_time;
  modified_time;
  contact_id;
  parsed_data;
  dummyCsv;
  editContact: FormGroup;
  constructor(private serverService: ServerService, private router:Router,private route: ActivatedRoute) { 
        this.param1 = this.route.snapshot.queryParamMap.get('for');
  }


  ngOnInit() {
    let user_id: any =  localStorage.getItem('userId'); 
    this.param1 = atob(this.param1);
    var encData = user_id+'forpredictiveDialerContacts';
    if(this.param1 ==  encData){
      this.dummyCsv = 'https://baobabgroup.mconnectapps.com/api/excel_pre.csv';
    } else {
      this.dummyCsv = 'https://baobabgroup.mconnectapps.com/api/excel.csv';
    }
    
  }


upload(){

  let access_token: any=localStorage.getItem('access_token');
  let user_id: any =  localStorage.getItem('userId'); 
  let admin_id: any =  localStorage.getItem('admin_id'); 
    var formData = new FormData();
   

        if($('#file').val() == ''){
          iziToast.error({
            message: "Please select the CSV file to Upload",
            position: 'topRight'
        });
        return false;
        }

        var encData = user_id+'forpredictiveDialerContacts';
        if(this.param1 ==  encData){
      formData.append('operation', 'contact');
      formData.append('moduleType', 'contact');
      formData.append('api_type', 'web');
      formData.append('action', 'pre_csv_upload');
      formData.append('access_token', access_token);
      formData.append('file', $('#file')[0].files[0]);
      formData.append('user_id', user_id);
      formData.append('admin_id', admin_id);
    } else {
      
    formData.append('operation', 'contact');
    formData.append('moduleType', 'contact');
    formData.append('api_type', 'web');
    formData.append('action', 'csv_upload');
    formData.append('access_token', access_token);
    formData.append('file', $('#file')[0].files[0]);
    formData.append('user_id', user_id);
    formData.append('admin_id', admin_id);
    }
  
  $.ajax({  
    url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",  
    type : 'POST',
    data : formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false, 
    success:function(data){ 
      this.parsed_data = JSON.parse(data);
      if(this.parsed_data.result.status == true){
        iziToast.success({
          message: "Data Uploaded Successfully",
          position: 'topRight'
      });
      history.go(-1);
      } else {
        iziToast.error({
          message: "Sorry, Some Error Occured",
          position: 'topRight'
      });
      history.go(-1);
      }
    }  
});  

  }



  



}
