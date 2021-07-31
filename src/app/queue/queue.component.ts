import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
declare var $:any;
@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  pageLimit = 20;
  paginationData:any ={"info":"hide"};
  offset_count = 0;
  doc_link;
  constructor(private serverService: ServerService) { }

  ngOnInit() {
  // this.queueList({});
  }

  // listDataInfo(list_data){

  //   list_data.search_text = list_data.search_text == undefined ? "" : list_data.search_text;
  //   list_data.order_by_name = list_data.order_by_name == undefined ? "queue.queue_id" : list_data.order_by_name;
  //   list_data.order_by_type = list_data.order_by_type == undefined ? "desc" : list_data.order_by_type;
  //   list_data.limit = list_data.limit == undefined ? this.pageLimit : list_data.limit;
  //   list_data.offset = list_data.offset == undefined ? 0 : list_data.offset;
  //   return list_data;
  // }


  //   queueList(data){
  //     var list_data= this.listDataInfo(data);
	// 		let api_req:any = new Object();
	// 		let queue_req:any = new Object();
	// 		queue_req.action="list_queue";
	// 		queue_req.admin_id=localStorage.getItem('admin_id');
  //     queue_req.search_text=list_data.search_text;
  //     queue_req.order_by_name=list_data.order_by_name;
  //     queue_req.order_by_type=list_data.order_by_type;
  //     queue_req.limit=list_data.limit;
  //     queue_req.offset=list_data.offset;
	// 		api_req.operation="queue";
	// 		api_req.moduleType="queue";
	// 		api_req.api_type="web";
	// 		api_req.access_token=localStorage.getItem('access_token');
	// 		api_req.element_data = queue_req;
  //           this.serverService.sendServer(api_req).subscribe((response:any) => {
	//             if(response.result.status==1){
	           
	//             	this.queue_list=response.result.data.list_data;
  //               this.offset_count = list_data.offset;
  //               this.paginationData = this.serverService.pagination({'offset':response.result.data.list_info.offset, 'total':response.result.data.list_info.total, 'page_limit' :this.pageLimit });
  //               this.recordNotFound = this.queue_list.length == 0 ? true : false;
	//             }
                

  //           }, 
  //           (error)=>{
  //               console.log(error);
  //           });

  // }
 
  // addQueue(){

  // 	$('#add_queue_form').modal('show');
  // }
    
  //   assignQueue(id){
  //           $('#assign_queue_key').val(id);
  //           $('#assign_queue_button').click();
  //   }

  //   showdoc(link){   
  //     this.doc_link=link;
  //    $("#document_model").modal('show');   
  //   }

}
