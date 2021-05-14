import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { ServerService } from '../services/server.service';
import Swal from 'sweetalert2'
declare var $:any;
declare var iziToast:any;

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  queue_list;
  recordNotFound = false;
  uadmin_id;
  cart_items;
  total_price: any = '0';
  mainGST: any = '15';
  totalmainGST: any = '0';
  constructor(public router:Router,private _ngZone: NgZone,private serverService: ServerService) { }

  ngOnInit(): void {
    
    this.uadmin_id = localStorage.getItem('admin_id');
    this.showCartValue();
  }



showCartValue(){

    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"billing", "moduleType": "billing", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"view_cart","admin_id":"'+this.uadmin_id+'"}}';
  
        this.serverService.sendServer(api_req).subscribe((response: any) => {
        if (response.result.status == true) {
               this.cart_items = response.result.data;
            } else {
                iziToast.warning({
                    message: "Demo not updated. Please try again",
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




increaseCount(){
  var sums = 0;
  $('tr').each(function () {
    $(this).find('.cartsTotal').each(function () {
      var combat = $(this).text();
      sums += parseFloat(combat);
    });  
  });
var gst = this.mainGST; 
this.total_price = sums;
var  total = (sums * gst)/ 100;
this.mainGST = total;

this.totalmainGST = sums + total;
 
}




}
