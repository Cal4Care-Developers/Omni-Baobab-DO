import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import '../../assets/js/scripts.js';
declare var $:any;
declare var iziToast:any;
import Swal from 'sweetalert2'
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat-widget-settings',
  templateUrl: './chat-widget-settings.component.html',
  styleUrls: ['./chat-widget-settings.component.css']
})
export class ChatWidgetSettingsComponent implements OnInit {
  access_token;
  user_id;
  customHtml;
  chatWigets;
  admin_id;
  user_type;
  hide_admin_sett = true;
  currWidgetName;
  currWidgetId;depChecked;ageChecked;
  disable_agent_typing_notification;
  disable_browser_tab_notification;
  disable_chat_rating;
  disable_emoji_selection;
  disable_file_upload;
  disable_message_preview;
  disable_sound_notification;
  disable_visitor_typing_function;
  hide_estimated_wait_time;
  hide_widget_on_load;
  hide_widget_on_mobile;
  hide_widget_when_offline;
  ag_enabled = false;
  consentsForms;
  country_restriction;
  default_images;
  myImages;
  time_list;
  widget_appearance;
countryCodes;
codeChecked;
agents_list;
image_url;
chatSounds;
agent_list;
department_list;
wid_color = 'red';
admin_id_enc;
checks;
widget_names;
round_status;
showerror = false;
limit_count;
has_round_robin = false;
  constructor(private serverService: ServerService,private router:Router) { }

  ngOnInit() {


    this.admin_id = localStorage.getItem('admin_id');
    this.user_id = localStorage.getItem('admin_id');
    this.admin_id_enc=btoa(this.admin_id);
    // this.customHtml = 'https://'+window.location.hostname+'/webchat/?aid='+btoa(this.admin_id);
    this.customHtml = 'https://baobabgroup.mconnectapps.com/webchat/?aid='+this.admin_id_enc;

    this.listConsentFormms();
    this.get_timezone();
    this.get_sounds();
    this.get_country();
    this.getOverAllSettings();
    if (! localStorage.justOnce) {
      localStorage.setItem("justOnce", "true");
      window.location.reload();
    }
    $(".colorpickerinput").colorpicker({
      format: 'hex',
      component: '.input-group-append',
    });
  }

listChatWidget(){
  Swal.fire({
    html:
      '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
    focusConfirm: false,
    background: 'transparent',

  });
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let widget_name: any =$('#widget_name').val() ;
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"widget_list","user_id":"'+this.user_id +'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      console.log(response);
      Swal.close();
      if(response.status==true){


      // this.customHtml = 'https://'+window.location.hostname+'/webchat/?aid='+btoa(this.admin_id)+'&wid='+btoa(response.result.data[0].widget_name);
      this.customHtml = 'https://baobabgroup.mconnectapps.com/webchat/?aid='+this.admin_id_enc+'&wid='+btoa(response.result.data[0].widget_name);
       this.chatWigets =  response.result.data;
       this.currWidgetName = response.result.data[0].widget_name;
       $('#widget_edit_name').val(response.result.data[0].widget_name);
       $('#widgetColor').val(response.result.data[0].color);
       $('#behaviour').val(response.result.data[0].behaviour);

       $('#wid_show_dd').val(response.result.data[0].country_restriction);
       this.codeChecked = response.result.data[0].countries.split(",");
       this.currWidgetId = response.result.data[0].id;
       this.disable_agent_typing_notification = response.result.data[0].disable_agent_typing_notification;
       this.disable_browser_tab_notification = response.result.data[0].disable_browser_tab_notification;
       this.disable_chat_rating = response.result.data[0].disable_chat_rating;
       this.disable_emoji_selection = response.result.data[0].disable_emoji_selection;
       this.disable_file_upload = response.result.data[0].disable_file_upload;
       this.disable_message_preview = response.result.data[0].disable_message_preview;
       this.disable_sound_notification = response.result.data[0].disable_sound_notification;
       this.disable_visitor_typing_function = response.result.data[0].disable_visitor_typing_function;
       this. hide_estimated_wait_time = response.result.data[0].hide_estimated_wait_time;
       this.hide_widget_on_load = response.result.data[0].hide_widget_on_load;
       this.hide_widget_on_mobile = response.result.data[0].hide_widget_on_mobile;
       this.hide_widget_when_offline = response.result.data[0].hide_widget_when_offline;
       this.country_restriction = response.result.data[0].country_restriction;
       this.image_url = response.result.data[0].image_url;
       this.wid_color = response.result.data[0].color;


        this.widget_appearance = response.result.data[0].widget_appearance;


      $("#window-round-chat .widget-appearance-round").css("background", response.result.data[0].color +'!important');

       $('#privacy-policy-link').val(response.result.data[0].privacy_policy_link);
       $('#privacy-policy-text').val(response.result.data[0].privacy_policy_text);
       $('#opt-in-button').val(response.result.data[0].opt_in_button);
       $('#opt-out-button').val(response.result.data[0].opt_out_button);
       $('#consent-mesage').val(response.result.data[0].consent_message);
       $('#required-consents-options').val(response.result.data[0].consent_form);

       $('#main_timeZone').val(response.result.data[0].main_timeZone);
       $('#schedule_timeZone').val(response.result.data[0].schedule_timeZone);
       $('#offline_email').val(response.result.data[0].offline_email);




       $('#day1_opening_time').val(response.result.data[0].day1_opening_time);
       $('#day1_close_time').val(response.result.data[0].day1_close_time);
       $('#day2_opening_time').val(response.result.data[0].day2_opening_time);
       $('#day2_close_time').val(response.result.data[0].day2_close_time);
       $('#day3_opening_time').val(response.result.data[0].day3_opening_time);
       $('#day3_close_time').val(response.result.data[0].day3_close_time);
       $('#day4_opening_time').val(response.result.data[0].day4_opening_time);
       $('#day4_close_time').val(response.result.data[0].day4_close_time);
       $('#day5_opening_time').val(response.result.data[0].day5_opening_time);
       $('#day5_close_time').val(response.result.data[0].day5_close_time);
       $('#day6_opening_time').val(response.result.data[0].day6_opening_time);
       $('#day6_close_time').val(response.result.data[0].day6_close_time);
       $('#day7_opening_time').val(response.result.data[0].day7_opening_time);
       $('#day7_close_time').val(response.result.data[0].day7_close_time);
       $('#day1_opening_time_s').val(response.result.data[0].day1_opening_time_s);
       $('#day1_opening_time_s').val(response.result.data[0].day1_opening_time_s);
       $('#day2_opening_time_s').val(response.result.data[0].day2_opening_time_s);
       $('#day2_opening_time_s').val(response.result.data[0].day2_opening_time_s);
       $('#day3_opening_time_s').val(response.result.data[0].day3_opening_time_s);
       $('#day3_opening_time_s').val(response.result.data[0].day3_opening_time_s);
       $('#day4_opening_time_s').val(response.result.data[0].day4_opening_time_s);
       $('#day4_opening_time_s').val(response.result.data[0].day4_opening_time_s);
       $('#day5_opening_time_s').val(response.result.data[0].day5_opening_time_s);
       $('#day5_opening_time_s').val(response.result.data[0].day5_opening_time_s);
       $('#day6_opening_time_s').val(response.result.data[0].day6_opening_time_s);
       $('#day6_opening_time_s').val(response.result.data[0].day6_opening_time_s);
       $('#day7_opening_time_s').val(response.result.data[0].day7_opening_time_s);
       $('#day7_opening_time_s').val(response.result.data[0].day7_opening_time_s);





       $(":radio[name='widget_appearance_type'][value='"+response.result.data[0].widget_appearance+"']").attr('checked', 'checked');
       $(":radio[name='widget_position'][value='"+response.result.data[0].widget_position+"']").attr('checked', 'checked');
       $(":radio[name='widget_appearance_m_type'][value='"+response.result.data[0].mobile_widget+"']").attr('checked', 'checked');
       $("input:radio[name='attension_grabber_img'][value='"+response.result.data[0].image_id+"']").prop('checked', 'checked');

       $('input:radio[name=attension_grabber_img][value='+response.result.data[0].image_id+']').prop('checked', true);

       $('input:radio[name=chat_sound][value='+response.result.data[0].chat_sound+']').prop('checked', true);



      if(response.result.data[0].chat_aviator =='1' ){
        $('#chat_aviator').prop('checked', true);
      } else {
        $('#chat_aviator').prop('checked', false);
      }
      if(response.result.data[0].chat_agent_name =='1' ){
        $('#chat_agent_name').prop('checked', true);
      } else {
        $('#chat_agent_name').prop('checked', false);
      }


      if(response.result.data[0].has_department =='1' ){
        $('#has_department').prop('checked', true);
      } else {
        $('#has_department').prop('checked', false);
      }



      // var ciContact = response.result.data[0].departments.split(",");
      // for (var j = 0; j < ciContact.length; j++) {
      //     $('input[name^=departments][value=' + ciContact[j] + ']').attr('checked','checked');
      // }
      //this.depChecked = response.result.data[0].departments.split(",");

      if(response.result.data[0].departments == ""){
        this.depChecked = '0';
      } else {
       console.log(response.result.data[0].departments);
        this.depChecked = response.result.data[0].departments.split(",");
      }

      if(response.result.data[0].agents == ""){
        this.ageChecked = '0';
      } else {
        this.ageChecked = response.result.data[0].agents.split(",");
      }



        if(response.result.data[0].attention_grabber =='1' ){
          $('#attention_grabber').prop('checked', true);
          this.ag_enabled = true;
        } else {
          $('#attention_grabber').prop('checked', false);
          this.ag_enabled = false;
        }



      } else {
        iziToast.error({
          message: "Some Error Occured.",
          position: 'topRight'
      });
      }
    },
    (error)=>{
        console.log(error);
    });
  }









  addChatWidget(){

   let validate_name =this.widget_names;
    console.log(this.widget_names);

    if(validate_name == " " || validate_name == undefined || validate_name == null){
      this.showerror = true;
      return false;
    }else{
      this.showerror = false;
    }

    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('admin_id');
    let widget_name: any =$('#widget_name').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_chat_widget","user_id":"'+this.user_id +'","widget_name":"'+widget_name+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#widget_name').val('');
        $('#createNewWidget').modal('hide');
        this.get_timezone();
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }


  editChatWidget(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let widget_name: any =$('#widget_edit_name').val();
    let widget_color: any =$('#widgetColor').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_chat_widget","user_id":"'+this.user_id +'","widget_id":"'+id+'","widget_name":"'+widget_name+'","color":"'+widget_color+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });

      this.get_timezones(id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }


  getNewWidget(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let widget_name: any =$('#widget_name').val() ;
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_widget_data","user_id":"'+this.user_id +'","widget_id":"'+id+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      console.log(response);

      if(response.status==true){

      // this.customHtml = 'https://'+window.location.hostname+'/webchat/?aid='+btoa(this.admin_id)+'&wid='+btoa(response.result.data.widget_name);
      this.customHtml = 'https://baobabgroup.mconnectapps.com/webchat/?aid='+this.admin_id_enc+'&wid='+btoa(response.result.data.widget_name);
       $('#widget_edit_name').val(response.result.data.widget_name);
       $('#widgetColor').val(response.result.data.color);
       $('#behaviour').val(response.result.data.behaviour);

       $('#privacy_policy_link').val(response.result.data.privacy_policy_link);
       $('#privacy_policy_text').val(response.result.data.privacy_policy_text);
       $('#opt-in-button').val(response.result.data.opt_in_button);
       $('#opt-out-button').val(response.result.data.opt_out_button);
       $('#consent-mesage').val(response.result.data.consent_message);
       $('#main_timeZone').val(response.result.data.main_timeZone);
       this.currWidgetId = response.result.data.id;
       this.currWidgetId = response.result.data.id;
       this.disable_agent_typing_notification = response.result.data.disable_agent_typing_notification;
       this.disable_browser_tab_notification = response.result.data.disable_browser_tab_notification;
       this.disable_chat_rating = response.result.data.disable_chat_rating;
       this.disable_emoji_selection = response.result.data.disable_emoji_selection;
       this.disable_file_upload = response.result.data.disable_file_upload;
       this.disable_message_preview = response.result.data.disable_message_preview;
       this.disable_sound_notification = response.result.data.disable_sound_notification;
       this.disable_visitor_typing_function = response.result.data.disable_visitor_typing_function;
       this. hide_estimated_wait_time = response.result.data.hide_estimated_wait_time;
       this.hide_widget_on_load = response.result.data.hide_widget_on_load;
       this.hide_widget_on_mobile = response.result.data.hide_widget_on_mobile;
       this.hide_widget_when_offline = response.result.data.hide_widget_when_offline;
       $('#day1_opening_time').val(response.result.data.day1_opening_time);
       $('#day1_close_time').val(response.result.data.day1_close_time);
       $('#day2_opening_time').val(response.result.data.day2_opening_time);
       $('#day2_close_time').val(response.result.data.day2_close_time);
       $('#day3_opening_time').val(response.result.data.day3_opening_time);
       $('#day3_close_time').val(response.result.data.day3_close_time);
       $('#day4_opening_time').val(response.result.data.day4_opening_time);
       $('#day4_close_time').val(response.result.data.day4_close_time);
       $('#day5_opening_time').val(response.result.data.day5_opening_time);
       $('#day5_close_time').val(response.result.data.day5_close_time);
       $('#day6_opening_time').val(response.result.data.day6_opening_time);
       $('#day6_close_time').val(response.result.data.day6_close_time);
       $('#day7_opening_time').val(response.result.data.day7_opening_time);
       $('#day7_close_time').val(response.result.data.day7_close_time);
        $('#day1_opening_time_s').val(response.result.data.day1_opening_time_s);
        $('#day1_opening_time_s').val(response.result.data.day1_opening_time_s);
        $('#day2_opening_time_s').val(response.result.data.day2_opening_time_s);
        $('#day2_opening_time_s').val(response.result.data.day2_opening_time_s);
        $('#day3_opening_time_s').val(response.result.data.day3_opening_time_s);
        $('#day3_opening_time_s').val(response.result.data.day3_opening_time_s);
        $('#day4_opening_time_s').val(response.result.data.day4_opening_time_s);
        $('#day4_opening_time_s').val(response.result.data.day4_opening_time_s);
        $('#day5_opening_time_s').val(response.result.data.day5_opening_time_s);
        $('#day5_opening_time_s').val(response.result.data.day5_opening_time_s);
        $('#day6_opening_time_s').val(response.result.data.day6_opening_time_s);
        $('#day6_opening_time_s').val(response.result.data.day6_opening_time_s);
        $('#day7_opening_time_s').val(response.result.data.day7_opening_time_s);
        $('#day7_opening_time_s').val(response.result.data.day7_opening_time_s);
        this.image_url = response.result.data.image_url;
        this.wid_color = response.result.data.color;
        this.widget_appearance = response.result.data.widget_appearance;

      $('#schedule_timeZone').val(response.result.data.schedule_timeZone);
      $('#offline_email').val(response.result.data.offline_email);
      //  $('#office_in_time').val(response.result.data.office_in_time);
      //  $('#office_out_time').val(response.result.data.office_out_time);
      //  $('#s_office_in_time').val(response.result.data.s_office_in_time);
      //  $('#s_office_out_time').val(response.result.data.s_office_out_time);
       $('#required-consents-options').val(response.result.data.consent_form);
       $('#wid_show_dd').val(response.result.data.country_restriction);
      //  $('#country_name').val(response.result.data.countries);

       this.codeChecked = response.result.data.countries.split(",");
       this.depChecked = response.result.data.departments.split(",");
       this.ageChecked = response.result.data.agents.split(",");
       this.country_restriction = response.result.data.country_restriction;
       $("input:radio[name='widget_appearance_type'][value='"+response.result.data.widget_appearance+"']").attr('checked', 'checked');
       $("input:radio[name='widget_position'][value='"+response.result.data.widget_position+"']").attr('checked', 'checked');
       $("input:radio[name='widget_appearance_m_type'][value='"+response.result.data.mobile_widget+"']").attr('checked', 'checked');

       $("input:radio[name='attension_grabber_img'][value='"+response.result.data.image_id+"']").prop('checked', 'checked');

       $('input:radio[name=attension_grabber_img][value='+response.result.data.image_id+']').prop('checked', true);


       $('input:radio[name=chat_sound][value='+response.result.data.chat_sound+']').prop('checked', true);


       $('input:radio[name=widget_appearance_type][value='+response.result.data.widget_appearance+']').prop('checked', true);
       $('input:radio[name=widget_position][value='+response.result.data.widget_position+']').prop('checked', true);
       $('input:radio[name=widget_appearance_m_type][value='+response.result.data.widget_appearance_m_type+']').prop('checked', true);

       if(response.result.data.chat_aviator =='1' ){
        $('#chat_aviator').prop('checked', true);
      } else {
        $('#chat_aviator').prop('checked', false);
      }
      if(response.result.data.chat_agent_name =='1' ){
        $('#chat_agent_name').prop('checked', true);
      } else {
        $('#chat_agent_name').prop('checked', false);
      }
      if(response.result.data.has_department =='1' ){
        $('#has_department').prop('checked', true);
      } else {
        $('#has_department').prop('checked', false);
      }
        if(response.result.data.attention_grabber =='1' ){
          $('#attention_grabber').prop('checked', true);
          this.ag_enabled = true;
        } else {
          $('#attention_grabber').prop('checked', false);
          this.ag_enabled = false;
        }

      } else {
        iziToast.error({
          message: "Some Error Occured.",
          position: 'topRight'
      });
      }
    },
    (error)=>{
        console.log(error);
    });
  }

  chnageWdgetApp(apper){
    this.widget_appearance = apper;
  }

  editChatWidgetBehaves(id,keyword){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let widget_name: any =$('#widget_edit_name').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"widget_behaviour","user_id":"'+this.user_id +'","widget_id":"'+id+'","keyword":"'+keyword+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#widget_name').val('');
        this.get_timezones(id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }


  changeChatWidgetBehaves(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let behaviour: any =$('#behaviour').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"widget_onclick_behaviour","user_id":"'+this.user_id +'","widget_id":"'+id+'","behaviour":"'+behaviour+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        this.get_timezones(id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }



  changeattGrab(){
    if($('#attention_grabber').is(':checked') == true ){
      this.ag_enabled = true;
    } else {

      this.ag_enabled = false;
    }
  }







  advancedChatwidgetSettings(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let widget_appearance: any = $("input[name='widget_appearance_type']:checked").val();
    let widget_position: any =$("input[name='widget_position']:checked").val();
    let attention_grabber: any=false;
     attention_grabber =$('#attention_grabber').is(':checked');
    // alert(attention_grabber)
    // return false;
    let mobile_widget: any =$("input[name='widget_appearance_m_type']:checked").val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"widget_advanced_settings","user_id":"'+this.user_id+'","widget_id":"'+id+'","widget_position":"'+widget_position+'","attention_grabber":"'+attention_grabber+'","mobile_widget":"'+mobile_widget+'","widget_appearance":"'+widget_appearance+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#widgetAppearanceSettings').modal('hide');
        this.get_timezones(id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }


  widgetAppearanceSettingsx(){
    this.wid_color = $('#widgetColor').val();
    $('#widgetAppearanceSettings').modal('show');
  }



  uploadImageChat(widget_id){

    let access_token: any=localStorage.getItem('access_token');
    let user_id: any =  localStorage.getItem('admin_id');


      var formData = new FormData();

      let image_id: any = $("input[name='attension_grabber_img']:checked").val();

      formData.append('operation', 'chat_widget');
      formData.append('moduleType', 'chat_widget');
      formData.append('api_type', 'web');
      formData.append('action', 'chat_image_upload');
      formData.append('access_token', access_token);
      formData.append('chat_image', $('#chat_image')[0].files[0]);
      formData.append('user_id', user_id);
      formData.append('widget_id', widget_id);
      formData.append('image_id', image_id);

      console.log(formData);

    $.ajax({
      url:"https://baobabgroup.mconnectapps.com/api/v1.0/index_new.php",
      type : 'POST',
      data : formData,
      processData: false,  // tell jQuery not to process the data
      contentType: false,
      success:function(data){
        this.parsed_data = JSON.parse(data);
        console.log(this.parsed_data );
        if(this.parsed_data.status == 'true'){
          iziToast.success({
            message: "Data updated successfully",
            position: 'topRight'
        });
        $('#imageGallery').modal('hide');
        $("#refresh_page").click();
            } else {
          iziToast.error({
            message: "Sorry, Some Error Occured",
            position: 'topRight'
        });
        }
      }
  });
}






listConsentImages(){
  let access_token: any=localStorage.getItem('access_token');
  let user_id: any=localStorage.getItem('userId');
  let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_image_list","user_id":"'+this.user_id +'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
   this.default_images = response.result.data.default_images;
   this.myImages = response.result.data.upload_images;
   this.listChatWidget()
     } else {
       iziToast.error({
         message: "Some Error Occured.",
         position: 'topRight'
     });
     }
  },
  (error)=>{
      console.log(error);
  });
}

listConsentImagess(widget_id){
  let access_token: any=localStorage.getItem('access_token');
  let user_id: any=localStorage.getItem('userId');
  let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_image_list","user_id":"'+this.user_id +'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
   this.default_images = response.result.data.default_images;
   this.myImages = response.result.data.upload_images;
   this.getNewWidget(widget_id)
     } else {
       iziToast.error({
         message: "Some Error Occured.",
         position: 'topRight'
     });
     }
  },
  (error)=>{
      console.log(error);
  });
}



listConsentFormms(){
  let access_token: any=localStorage.getItem('access_token');
  let user_id: any=localStorage.getItem('userId');
  let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"consent_form_option_list","user_id":"'+this.user_id +'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.status==true){
   this.consentsForms = response.result.data;
     } else {
       iziToast.error({
         message: "Some Error Occured.",
         position: 'topRight'
     });
     }
  },
  (error)=>{
      console.log(error);
  });
}




addConsentForn(widget_id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let option_name: any =$('#option_name').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_consent_form_option","user_id":"'+this.user_id +'","display_option_value":"'+option_name+'","widget_id":"'+widget_id+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#createconsentform').modal('hide');
      this.listChatWidget();
      this.listConsentFormms();
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }


  editaddConsentForn(){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let display_options: any =$('#display_options').val();
    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent',
    });
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"edit_consent_form_option","user_id":"'+this.user_id +'","id":"'+display_options+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      Swal.close();
      if(response.result.status==true){
       $('#editconsentformss').modal('show');

        $('#edit_option_name').val(response.result.data.display_option_value);

        this.listConsentFormms();
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
         });
       }
    },
    (error)=>{
        console.log(error);
    });
  }




  updateConsentForn(widget_id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let display_options: any =$('#display_options').val();
    let option_name: any =$('#edit_option_name').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_consent_form_option","user_id":"'+this.user_id +'","display_option_value":"'+option_name+'","id":"'+display_options+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#editconsentformss').modal('hide');
      this.listConsentFormms();
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }



deleteConsentForn(widget_id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
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
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_consent_form_option","user_id":"'+this.user_id +'","id":"'+widget_id+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#editconsentformss').modal('hide');
       this.listConsentFormms();
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }
});
  }



  copyClipboard(element){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    iziToast.success({
      message: "Script Copied",
      position: 'topRight'
  });
  }






  editcountryRestriction(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let wid_show_dd: any =$('#wid_show_dd').val();
    let country_name: any =$('#country_name').val().join();

    let has_restriction: any =$('#country-restriction').is(':checked');
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"country_restriction","user_id":"'+this.user_id +'","widget_id":"'+id+'","has_restriction":"'+has_restriction+'","option_value":"'+wid_show_dd+'","countries":"'+country_name+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#availabilityRestriction').modal('hide');
        $('#wid_show_dd').val('');
        $('#country_name').val('');
        this.get_timezones(id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }






  update_consent_form_data(widget_id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let requiredConsentsOptions: any =$('#required-consents-options').val();
    let consent_message: any =$('#consent-mesage').val();
    let privacy_policy_link: any =$('#privacy-policy-link').val();
    let privacy_policy_text: any =$('#privacy-policy-text').val();
    let opt_in_button: any =$('#opt-in-button').val();
    let opt_out_button: any =$('#opt-out-button').val();

    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_consent_form_data","user_id":"'+this.user_id +'","id":"'+requiredConsentsOptions+'","consent_message":"'+consent_message+'","privacy_policy_link":"'+privacy_policy_link+'","privacy_policy_text":"'+privacy_policy_text+'","opt_in_button":"'+opt_in_button+'","opt_out_button":"'+opt_out_button+'","widget_id":"'+widget_id+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.data==1){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#widgetConsentForm').modal('hide');
        $('#wid_show_dd').val('');
        $('#country_name').val('');
        this.get_timezones(widget_id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }





  updateChatSett(widget_id){

    let access_token: any=localStorage.getItem('access_token');
    let chat_aviator = $('#chat_aviator').is(':checked');
    // let office_in_time = $('#office_in_time').val();
    // let office_out_time = $('#office_out_time').val();
    // let s_office_in_time = $('#s_office_in_time').val();
    // let s_office_out_time = $('#s_office_out_time').val();
    let chat_agent_name = $('#chat_agent_name').is(':checked');
    let has_department = $('#has_department').is(':checked');
    let offline_email = $('#offline_email').val();
    let schedule_timeZone = $('#schedule_timeZone').val();
    let main_timeZone = $('#main_timeZone').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType": "chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"chat_timezone","main_timeZone":"'+main_timeZone+'","schedule_timeZone":"'+schedule_timeZone+'","chat_aviator":'+chat_aviator+',"chat_agent_name":"'+chat_agent_name+'","offline_email":"'+offline_email+'","has_department":'+has_department+',"user_id":"'+this.user_id+'","widget_id":"'+widget_id+'"}}';

          this.serverService.sendServer(api_req).subscribe((response: any) => {
          if (response.result.data == 1) {
                  $('#add_deptform').modal('hide');
                  iziToast.success({
                      message: "Chat settings Updated successfully",
                      position: 'topRight'
                  });
                  this.get_timezones(widget_id);
              }

          else{

                  iziToast.error({
                      message: " Please try again",
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


     get_timezone(){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"getTimezone", "moduleType":"agents", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_timezone"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status=="true"){
        this.time_list = response.timezone_options;
        this.listConsentImages();
        this.getAgentsList();
        console.log(this.time_list);
      } else {

      }
    },
    (error)=>{
        console.log(error);
    });
  }




  get_timezones(widget_id){
    this.getAgentsList();
    this.listConsentImagess(widget_id)
  }




  get_country(){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"list_country_code"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        this.countryCodes = response.result.data;
      } else {

      }
    },
    (error)=>{
        console.log(error);
    });
  }



  deletewidget(id){
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
        let admin_id: any=localStorage.getItem('admin_id');
  let api_req:any = '{"operation":"chat_widget", "moduleType": "chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"delete_widget_data","widget_id":"'+id+'","admin_id":"'+admin_id+'"}}';

  this.serverService.sendServer(api_req).subscribe((response:any) => {
    if(response.result.data==1){
      Swal.fire(
        'Deleted!',
        'success'
      );
      this.get_timezone();
    }

  },
  (error)=>{
      console.log(error);
  });
      }
    })
  }





  get_sounds(){
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"get_chat_sound"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.status==true){
        this.chatSounds = response.result.data;
      }
    },
    (error)=>{
        console.log(error);
    });
  }


  getAgentsList(){
    let admin_id: any=localStorage.getItem('admin_id');
    let access_token: any=localStorage.getItem('access_token');
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'","element_data":{"action":"dept_agent_list","admin_id":"'+admin_id+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        this.agent_list = response.result.data.agent_list;
        this.department_list = response.result.data.department_list;
      } else {

      }
    },
    (error)=>{
        console.log(error);
    });
  }








  update_chat_sound(widget_id){
    let access_token: any=localStorage.getItem('access_token');

    let chat_sound: any = $("input[name='chat_sound']:checked").val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_chat_sound","widget_id":"'+widget_id+'","user_id":"'+this.user_id+'","sound_id":"'+chat_sound+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        iziToast.success({
          message: "Updated successfully",
          position: 'topRight'
      });
        this.get_timezones(widget_id);
      } else {

      }
    },
    (error)=>{
        console.log(error);
    });
  }






  update_wigdet_usrs(widget_id){
    let access_token: any=localStorage.getItem('access_token');
    var i = 0;
    var j = 0;
    var departments = [];
    $('.departments:checked').each(function () {
      departments[i++] = $(this).val();
    });

    var agents = [];
    $('.agent_list:checked').each(function () {
      agents[j++] = $(this).val();
    });
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"user_restriction","widget_id":"'+widget_id+'","user_id":"'+this.user_id+'","departments":"'+departments+'","agents":"'+agents+'"}}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        iziToast.success({
          message: "Updated successfully",
          position: 'topRight'
      });
     // $(".agent_list").attr('checked', false);
     // $(".agent_list:checkbox").attr("checked",false);
     this.depChecked = 0;
     this.ageChecked = 0;
      $('#userDepartmentManagement').modal('hide');
        this.get_timezones(widget_id);
      } else {

      }
    },
    (error)=>{
        console.log(error);
    });
  }



  changeChatLogsTime(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
    let widget_activity_time: any =$('#widget_activity_time').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"update_activity_time","user_id":"'+this.user_id +'","widget_id":"'+id+'","widget_activity_time":"'+widget_activity_time+'"}}';

    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
      this.get_timezones(id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       }
    },
    (error)=>{
        console.log(error);
    });
  }


  addalltimeZome1(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
      let day1_opening_time = $('#day1_opening_time').val();
      let day1_close_time = $('#day1_close_time').val();
      let day2_opening_time = $('#day2_opening_time').val();
      let day2_close_time = $('#day2_close_time').val();
      let day3_opening_time = $('#day3_opening_time').val();
      let day3_close_time = $('#day3_close_time').val();
      let day4_opening_time = $('#day4_opening_time').val();
      let day4_close_time = $('#day4_close_time').val();
      let day5_opening_time = $('#day5_opening_time').val();
      let day5_close_time = $('#day5_close_time').val();
      let day6_opening_time = $('#day6_opening_time').val();
      let day6_close_time = $('#day6_close_time').val();
      let day7_opening_time = $('#day7_opening_time').val();
      let day7_close_time = $('#day7_close_time').val();

    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_chat_scheduler_main","user_id":"'+this.user_id +'","widget_id":"'+id+'", "day1_opening_time":"'+day1_opening_time+'","day1_close_time":"'+day1_close_time+'", "day2_opening_time":"'+day2_opening_time+'", "day2_close_time":"'+day2_close_time+'", "day3_opening_time":"'+day3_opening_time+'", "day3_close_time":"'+day3_close_time+'", "day4_opening_time":"'+day4_opening_time+'", "day4_close_time":"'+day4_close_time+'","day5_opening_time":"'+day5_opening_time+'", "day5_close_time":"'+day5_close_time+'", "day6_opening_time":"'+day6_opening_time+'", "day6_close_time":"'+day6_close_time+'", "day7_opening_time":"'+day7_opening_time+'", "day7_close_time":"'+day7_close_time+'" }}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#advancedScedule').modal('hide');
      this.get_timezones(id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       $('#advancedScedule').modal('hide');
       }
    },
    (error)=>{
        console.log(error);
    });

  }



  addalltimeZome2(id){
    let access_token: any=localStorage.getItem('access_token');
    let user_id: any=localStorage.getItem('userId');
      let day1_opening_time_s = $('#day1_opening_time_s').val();
      let day1_close_time_s = $('#day1_close_time_s').val();
      let day2_opening_time_s = $('#day2_opening_time_s').val();
      let day2_close_time_s = $('#day2_close_time_s').val();
      let day3_opening_time_s = $('#day3_opening_time_s').val();
      let day3_close_time_s = $('#day3_close_time_s').val();
      let day4_opening_time_s = $('#day4_opening_time_s').val();
      let day4_close_time_s = $('#day4_close_time_s').val();
      let day5_opening_time_s = $('#day5_opening_time_s').val();
      let day5_close_time_s = $('#day5_close_time_s').val();
      let day6_opening_time_s = $('#day6_opening_time_s').val();
      let day6_close_time_s = $('#day6_close_time_s').val();
      let day7_opening_time_s = $('#day7_opening_time_s').val();
      let day7_close_time_s = $('#day7_close_time_s').val();
    let api_req:any = '{"operation":"chat_widget", "moduleType":"chat_widget", "api_type": "web", "access_token":"'+access_token+'", "element_data":{"action":"add_chat_scheduler_main","user_id":"'+this.user_id +'","widget_id":"'+id+'", "day1_opening_time_s":"'+day1_opening_time_s+'","day1_close_time_s":"'+day1_close_time_s+'", "day2_opening_time_s":"'+day2_opening_time_s+'", "day2_close_time_s":"'+day2_close_time_s+'", "day3_opening_time_s":"'+day3_opening_time_s+'", "day3_close_time_s":"'+day3_close_time_s+'", "day4_opening_time_s":"'+day4_opening_time_s+'", "day4_close_time_s":"'+day4_close_time_s+'","day5_opening_time_s":"'+day5_opening_time_s+'", "day5_close_time_s":"'+day5_close_time_s+'", "day6_opening_time_s":"'+day6_opening_time_s+'", "day6_close_time_s":"'+day6_close_time_s+'", "day7_opening_time_s":"'+day7_opening_time_s+'", "day7_close_time_s":"'+day7_close_time_s+'" }}';
    this.serverService.sendServer(api_req).subscribe((response:any) => {
      if(response.result.status==true){
        iziToast.success({
          message: "Data Added Successfully",
          position: 'topRight'
        });
        $('#advancedwidgetScedule').modal('hide');
        this.get_timezones(id);
       } else {
         iziToast.error({
           message: "Some Error Occured.",
           position: 'topRight'
       });
       $('#advancedwidgetScedule').modal('hide');
       }
    },
    (error)=>{
        console.log(error);
    });

  }

  getOverAllSettings(){
    // {"operation":"chat","moduleType":"chat","api_type":"web","access_token":"","element_data":{"action":"overallChatSettings","admin_id":"1203"}}
    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "overallChatSettings";
    chat_req.admin_id = this.admin_id;
    api_req.operation = "chat";
    api_req.moduleType = "chat";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    this.serverService.sendServer(api_req).subscribe((response: any) => {
      if (response.status == true) {
        // admin_id: "1203"
        // created_at: "2021-08-17 10:52:55"
        // id: "1"
        // round_robin: "0"
        // updated_at: "2021-08-17 10:52:55"
        if(response.result.data[0].round_robin == 0){
          this.checks = false;
          this.has_round_robin = false;
        }else{
          this.checks = true;
          this.has_round_robin = true;
        }

        this.limit_count = response.result.data[0].chat_limit;

      }
      },
      (error) => {
        console.log(error);
      });

  }


  changeChatRobinStatus(checkedstatus){

    // {"operation":"chat","moduleType":"chat","api_type":"web","access_token":"","element_data":{"action":"overallChatSettingsUpdate","round_robin":"0","admin_id":"1203"}}
    var rob = '0';
    var limit='0';
    var text="Would you Need to Assign incoming Chat to all agents in the department?";
      if($('#round_rob_set').prop('checked')){ rob = '1';limit=this.limit_count; text="Do you want to change, and be assigned a round-robin system for incoming email to Department agents?"; }

    Swal.fire({
      title: 'Are you sure?',
      text: text ,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.value) {
        let api_req: any = new Object();
        let chat_req: any = new Object();
        chat_req.action = "overallChatSettingsUpdate";
        chat_req.admin_id = this.admin_id;
        chat_req.round_robin = checkedstatus;
        chat_req.chat_limit = limit;
        api_req.operation = "chat";
        api_req.moduleType = "chat";
        api_req.api_type = "web";
        api_req.access_token = localStorage.getItem('access_token');
        api_req.element_data = chat_req;
        Swal.fire({
          html:
            '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          focusConfirm: false,
          background: 'transparent',

        });
        this.serverService.sendServer(api_req).subscribe((response: any) => {
          Swal.close();
          if (response.status == true) {
            if(response.result.data[0].round_robin == 0){
              this.checks = false;
              this.has_round_robin = false;
            }else{
              this.checks = true;
              this.has_round_robin = true;
            }
            this.round_status = checkedstatus;
            this.limit_count = response.result.data[0].chat_limit;
            iziToast.success({
              message: "Changed Incomming Chat strategy successfully",
              position: 'topRight'
            });

          } else {
          if(this.checks)
            this.checks=false;
           else
           this.checks=true;
            iziToast.error({
              message: "Update Failed",
              position: 'topRight'
            });
          }


        },
          (error) => {
            console.log(error);
          });

      }
  else{
   if(this.checks)
    this.checks=false;
   else
   this.checks=true;
  }
    });

  }

  robin_update(){

    // {"operation":"chat","moduleType":"chat","api_type":"web","access_token":"","element_data":{"action":"overallChatSettingsUpdate","round_robin":"0","admin_id":"1203"}}
    if(this.has_round_robin){

    let api_req: any = new Object();
    let chat_req: any = new Object();
    chat_req.action = "overallChatSettingsUpdate";
    chat_req.admin_id = this.admin_id;
    chat_req.round_robin = 1;
    chat_req.chat_limit = this.limit_count;
    api_req.operation = "chat";
    api_req.moduleType = "chat";
    api_req.api_type = "web";
    api_req.access_token = localStorage.getItem('access_token');
    api_req.element_data = chat_req;
    Swal.fire({
      html:
        '<div style="display: flex;justify-content: center;"><div class="pong-loader"></div></div>',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      focusConfirm: false,
      background: 'transparent'
    });
    this.serverService.sendServer(api_req).subscribe((response: any) => {
     Swal.close();
      if(response.status == true){


        if(response.result.data[0].round_robin == 0){
          this.checks = false;
          this.has_round_robin = false;
        }else{
          this.checks = true;
          this.has_round_robin = true;
        }

        this.limit_count = response.result.data[0].chat_limit;

        iziToast.success({
          message: "Update Successfully",
          position: 'topRight'
        });
      }else{
        iziToast.error({
          message: "Updated Failed",
          position: 'topRight'
        });
      }
    },
    (error) => {
      console.log(error);
    });``
  }
}

}
