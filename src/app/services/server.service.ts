import {Injectable} from '@angular/core';
import { Component, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { Router } from '@angular/router';
declare var iziToast:any;
@Injectable({
    providedIn: 'root'
    })
export class ServerService {
    show:Subject<any> = new Subject();
    qLogin:Subject<any> = new Subject();
    profile:Subject<any> = new Subject();
    showChat:Subject<any> = new Subject();
    showvedioDialer:Subject<any> = new Subject();
    // attendCall:Subject<any> = new Subject();
    currentMessage = new BehaviorSubject(null);
    changeDetectionEmitter: EventEmitter<any> = new EventEmitter<any>();
    constructor(private http:HttpClient,private afMessaging: AngularFireMessaging,public router:Router){
        this.afMessaging.messaging.subscribe(
            (_messaging) => {
            _messaging.onMessage = _messaging.onMessage.bind(_messaging);
            _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            }
            )   
         
    }
    admin_id;
    
    sendServer(postData:any[]) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
          })
        };
        
  
     this.admin_id= localStorage.getItem('admin_id');
    //   if(this.admin_id == "64")
    //         return this.http.post("https://baobabgroup.mconnectapps.com/api/v1.0/index.php", postData,httpOptions);
    //   else
            return this.http.post("https://baobabgroup.mconnectapps.com/api/v1.0/index.php", postData,httpOptions);
        // return this.http.post("https://" + window.location.hostname + "/api/v1.0/index.php", postData,httpOptions);
      

    } 
    sendServer2(postData:any[]) {    
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
          })
        };  
        return this.http.post("https://baobabgroup.mconnectapps.com/api/v1.0/index.php", postData,httpOptions);
       } 


    requestPermission() {
        this.afMessaging.requestToken.subscribe(
        (token) => {
        console.log(token);
        let access_token: any=localStorage.getItem('access_token');
        let user_id: any=localStorage.getItem('userId');
        localStorage.setItem('N_token', token); 
        let api_req:any = '{"operation":"agents", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"notification_code","user_id":"'+user_id+'","notification_code":"'+token+'"}}';
        this.sendServer(api_req).subscribe((response:any) => { 
           
        });
        // this.sendServer2(api_req).subscribe((response:any) => { 
           
        // });
        },
        (err) => {
        console.error('Unable to get permission to notify.', err);
        }
        );
        }
    receiveMessage() {
        this.afMessaging.messages.subscribe(
        (payload: any) => {
        let audioPlayer = <HTMLVideoElement> document.getElementById('beepaud');
        audioPlayer.play();
        var notification_for = payload.data["gcm.notification.notification_for"];
        var unique_id = payload.data["gcm.notification.unique_id"];
        var wp_id=payload.data["gcm.notification.wp_id"];

        let Edata: any = '{"pagefor":"'+notification_for+'","id":"'+unique_id+'","wp_id":"'+wp_id+'"}';
        this.changeDetectionEmitter.emit(Edata);
        unique_id = btoa(unique_id);
        // wp_id = btoa(wp_id); // Base64 encode the String
// var decodedString = atob(encodedString);

if(notification_for !="chat" && notification_for !="Call") {
    iziToast.show({
        theme: 'dark',
        title: 'Hi',
        image: payload.notification.icon,
        imageWidth: 100,
        message: payload.notification.title,
        position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
        progressBarColor: 'rgb(0, 255, 184)',
        buttons: [
            ['<button onclick="openUrl()";>Open '+notification_for+'</button>', function (instance, toast) {
                // if(notification_for =='Call') {
               
                // let api_reqs:any = '{"type": "attendCall"}';
                //  this.serverService.show.next(api_reqs);
                // }
                if(notification_for =='whatsapp_unoff') {
                        var url = 'https://'+ window.location.hostname +'/#/wp-unoff?c='+unique_id+'&wp_id='+wp_id;
                 }
                else if(notification_for =='whatsapp') {
                        var url = 'https://'+ window.location.hostname +'/#/wp-chat?c='+unique_id;
                } else if(notification_for =='chat') {
                    var url = 'https://'+ window.location.hostname +'/#/chat?c='+unique_id;
                }else if(notification_for =='int_chat') {
                    var url = 'https://'+ window.location.hostname +'/#/internal-chat?c='+unique_id;
                }else if(notification_for =='fb') {
                    var url = 'https://'+ window.location.hostname +'/#/fb-chat?c='+unique_id;
                }else if(notification_for =='sms') {
                    var url = 'https://'+ window.location.hostname +'/#/sms?c='+unique_id;
                }else if(notification_for =='line') {
                    var url = 'https://'+ window.location.hostname +'/#/line-chat?l='+unique_id;
                }else if(notification_for =='telegram') {
                    var url = 'https://'+ window.location.hostname +'/#/tele-chat?c='+unique_id;
                }
               
                window.location.replace(url);
            }, true], // true to focus
            ['<button>Close</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp',
                    onClosing: function(instance, toast, closedBy){
                        console.info('closedBy: ' + closedBy); // The return will be: 'closedBy: buttonName'
                    }
                }, toast, 'buttonName');
            }]
        ],
        onOpening: function(instance, toast){
            console.info('callback abriu!');
        },
        onClosing: function(instance, toast, closedBy){
            console.info('closedBy: ' + closedBy); // tells if it was closed by 'drag' or 'button'
        }
    });
}
        
        this.currentMessage.next(payload);
        })
        }








    pagination(list_info){
        var start,eu,next,back,limit,total_count,offset,last_val,last_final_val,current,pagination,btn_length;
        limit = list_info.page_limit;
        total_count = list_info.total;
        offset = list_info.offset;
        start = 0 + offset;
        eu = start-0;
        if(total_count<start+1 && total_count>1){

            eu = start-limit;
            start = eu;
        }
        current = eu + limit;
        back = eu - limit;
        next = eu + limit;
        last_val = Math.ceil(total_count/limit);
        last_final_val = (last_val-1)*limit;
        pagination = {"info":"hide"};
        if(total_count > limit){
            pagination.info = "show";
            pagination.start = 0;

            if(back >= 0){
                pagination.back = back;
                pagination.backtab = "show";
            }
            else{
                pagination.backtab = "hide";
            }
        
            btn_length = 1;
            pagination.data = []
            for(var offset_count = 0;offset_count < total_count;offset_count=offset_count+limit){

                if((offset_count<=eu+(2*limit)) && (offset_count>=eu-(2*limit))){

                    if(offset_count != eu){
                        pagination.data.push({"btn_length":btn_length,"offset_count":offset_count,"load":true});
                    }
                    else{
                        pagination.data.push({"btn_length":btn_length,"offset_count":offset_count,"load":false});
                    }
                
                }
                 btn_length=btn_length+1;

            }
            if(current < total_count){
                pagination.next = next;
                pagination.nexttab = "show";
            }
            else{
                pagination.nexttab = "hide";
            }
            pagination.end = last_final_val;

        }

        return pagination;
    }





}