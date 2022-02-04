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

  ngOnInit(): void {
  }

}
