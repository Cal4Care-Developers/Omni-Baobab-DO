import { BrowserModule,Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule }  from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { McComponent } from './mc/mc.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPwdComponent } from './auth/forgot-pwd/forgot-pwd.component';
import { LogoutComponent } from './auth/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { AgentsComponent } from './agents/agents.component';
import { AgentsformComponent } from './agents/agentsform.component';
// import { QueueComponent } from './queue/queue.component';
// import { QueueformComponent } from './queue/queueform.component';
import { CallComponent } from './call/call.component';
import { CallHistoryComponent } from './call/call-history/call-history.component';
import { ChatComponent } from './mc/chat/chat.component';
import { EmailComponent } from './mc/email/email.component';
import { DialpadComponent } from './mc/dialpad/dialpad.component';
// import { DashboradComponent } from './dashborad/dashborad.component';
// import { SettingMenuComponent } from './setting-menu/setting-menu.component';
import { ServerService } from './services/server.service';
import { PbcSettingsComponent } from './pbc-settings/pbc-settings.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { SmsComponent } from './mc/sms/sms.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
// import { EditContactsComponent } from './edit-contacts/edit-contacts.component';
// import { TabsComponent } from './tabs/tabs.component';
import { ActivityComponent } from './activity/activity.component';
import { CsvContactUploadComponent } from './csv-contact-upload/csv-contact-upload.component';
import { ContactReportComponent } from './contact-report/contact-report.component';
// import { ComposeSmsComponent } from './compose-sms/compose-sms.component';
import { TicketingSystemComponent } from './ticketing-system/ticketing-system.component';
import { TicketViewComponent } from './ticket-view/ticket-view.component';
import { TicketComposeComponent } from './ticket-compose/ticket-compose.component';
import { DepartmentComponent } from './department/department.component';
import { TicketReportComponent } from './ticket-report/ticket-report.component';
import { TicketingSystemNewComponent } from './ticketing-system-new/ticketing-system-new.component';
import { TicketForwardComponent } from './ticket-forward/ticket-forward.component';
import { ChatbootAiComponent } from './chatboot-ai/chatboot-ai.component';
import { ChatbotQuestionFeedComponent } from './chatbot-question-feed/chatbot-question-feed.component';
import { TicketViewThreadComponent } from './ticket-view-thread/ticket-view-thread.component';
import { TicketCreateNewComponent } from './ticket-create-new/ticket-create-new.component';
import { WhatsappChatComponent } from './whatsapp-chat/whatsapp-chat.component';
import { AuxCodeComponent } from './aux-code/aux-code.component';
import { AppSettingsComponent } from './app-settings/app-settings.component';
// import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
// import { WallboardComponent } from './wallboard/wallboard.component';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';
import { AuxCodesComponent } from './aux-codes/aux-codes.component';
// import { AuxCodeReportComponent } from './aux-code-report/aux-code-report.component';
// import { CampaignComponent } from './campaign/campaign.component';
// import { CampaignContactsComponent } from './campaign-contacts/campaign-contacts.component';
// import { CampaignContactsAddComponent } from './campaign-contacts-add/campaign-contacts-add.component';
// import { CampaignContactsEditComponent } from './campaign-contacts-edit/campaign-contacts-edit.component';
import { AgentPermissionComponent } from './agent-permission/agent-permission.component';
// import { CallReportComponent } from './call-report/call-report.component';
// import { QueueManagementComponent } from './queue-management/queue-management.component';
// import { LeadManagementComponent } from './lead-management/lead-management.component';
// import { LogReportComponent } from './log-report/log-report.component';
import { CustomWallboardComponent } from './custom-wallboard/custom-wallboard.component';
// import { SmsGroupsComponent } from './sms-groups/sms-groups.component';
import { UnassignedTicketsComponent } from './unassigned-tickets/unassigned-tickets.component';
// import { CustomWallboardTwoComponent } from './custom-wallboard-two/custom-wallboard-two.component';
// import { SmsCsvUploadComponent } from './sms-csv-upload/sms-csv-upload.component';
// import { IpcReportComponent } from './ipc-report/ipc-report.component';
// import { SpReportComponent } from './sp-report/sp-report.component';
// import { AvayaReportComponent } from './avaya-report/avaya-report.component';
// import { CustomWallboardThreeComponent } from './custom-wallboard-three/custom-wallboard-three.component';
// import { MarketPlaceComponent } from './market-place/market-place.component';
// import { CustomWallboardFourComponent } from './custom-wallboard-four/custom-wallboard-four.component';
// import { SmsTemplatesComponent } from './sms-templates/sms-templates.component';
// import { MarketplaceWallboardComponent } from './marketplace-wallboard/marketplace-wallboard.component';
// import { MarketplaceCustomReportComponent } from './marketplace-custom-report/marketplace-custom-report.component';
// import { DemoPageComponent } from './demo-page/demo-page.component';
// import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { DocumentDownloadComponent } from './document-download/document-download.component';
import { FbChatComponent } from './fb-chat/fb-chat.component';
import { AgentSettingaComponent } from './agent-settinga/agent-settinga.component';
import { SafePipe } from './safe.pipe';
import { ChatRatingsComponent } from './chat-ratings/chat-ratings.component';
// import { SurveyReportComponent } from './survey-report/survey-report.component';
// import { SurveySummaryReportComponent } from './survey-summary-report/survey-summary-report.component';
import { ChatWidgetSettingsComponent } from './chat-widget-settings/chat-widget-settings.component';
// import { FaxComponent } from './fax/fax.component';
// import { NewOutboundFaxComponent } from './new-outbound-fax/new-outbound-fax.component';
import { GaugeChartModule } from 'angular-gauge-chart'
import { GoogleChartsModule } from 'angular-google-charts';
import { UserIdleModule } from 'angular-user-idle';
// import { TestComponent } from './test/test.component';
// import { ReportComponent } from './report/report.component';
// import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';
import { InternalChatComponent } from './mc/internal-chat/internal-chat.component';
import { ComposeWpComponent } from './compose-wp/compose-wp.component';
// import { InvalidCampaignContactComponent } from './invalid-campaign-contact/invalid-campaign-contact.component';
// import { DndComponent } from './dnd/dnd.component';
// import { FaxAdministrationComponent } from './fax-administration/fax-administration.component';
import { FooterComponent } from './footer/footer.component';
// import { CardlifeComponent } from './cardlife/cardlife.component';
// import { PredictiveDialerContactComponent } from './predictive-dialer-contact/predictive-dialer-contact.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from '../environments/environment';
// import { CallQueueComponent } from './call-queue/call-queue.component';
// import { CallQueueListComponent } from './call-queue-list/call-queue-list.component';
// import { CallQueueManagementComponent } from './call-queue-management/call-queue-management.component';
// import { BufferMarketingComponent } from './buffer-marketing/buffer-marketing.component';
// import { LineChatComponent } from './line-chat/line-chat.component';
// import { TeleChatComponent } from './tele-chat/tele-chat.component';
// import { SmsReportComponent } from './sms-report/sms-report.component';
// import { SmsTariffComponent } from './sms-tariff/sms-tariff.component';
// import { PaymentResultsComponent } from './payment-results/payment-results.component';
// import { CheckOutComponent } from './check-out/check-out.component';
// import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
// import { AdminPlansComponent } from './admin-plans/admin-plans.component';
// import { WpPayComponent } from './wp-pay/wp-pay.component';
import {DatePipe} from '@angular/common';
import { WhatsappUnoffComponent } from './whatsapp-unoff/whatsapp-unoff.component';
import { WpintsettingsComponent } from './wpintsettings/wpintsettings.component';
import { WpInstComposeComponent } from './wp-inst-compose/wp-inst-compose.component';
// import { BroadcastReportComponent } from './broadcast-report/broadcast-report.component';

// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
// import { AdminRequestsComponent } from './admin-requests/admin-requests.component';
// import { NkhReportsComponent } from './nkh-reports/nkh-reports.component';
// import { OutboundWallboardComponent } from './outbound-wallboard/outbound-wallboard.component';
// import { QLoginLogoutComponent } from './q-login-logout/q-login-logout.component';
// import { VideosBlogComponent } from './videos-blog/videos-blog.component';
// import { WebinarSettingsComponent } from './webinar-settings/webinar-settings.component';
// import { WebinarComponent } from './webinar/webinar.component';
import { MessageTemplatesComponent } from './message-templates/message-templates.component';
// import { CallTariffComponent } from './call-tariff/call-tariff.component';
import { EmailGroupsComponent } from './email-groups/email-groups.component';
import { BulkEmailComponent } from './bulk-email/bulk-email.component';
// import { CallTariffsReportComponent } from './call-tariffs-report/call-tariffs-report.component';
// import { BillingGroupComponent } from './billing-group/billing-group.component';
// import { CustomWallboardFiveComponent } from './custom-wallboard-five/custom-wallboard-five.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CdTimerComponent } from 'angular-cd-timer';
// import { AgentGroupsComponent } from './agent-groups/agent-groups.component';
// import { CampaignContactPopupComponent } from './campaign-contact-popup/campaign-contact-popup.component';
import { BulkMailListComponent } from './bulk-mail-list/bulk-mail-list.component';
// import { CustomWallboardSixComponent } from './custom-wallboard-six/custom-wallboard-six.component';
// import { NetwrixReportComponent } from './netwrix-report/netwrix-report.component';



// const config = new AuthServiceConfig([
//     {
//       id: FacebookLoginProvider.PROVIDER_ID,
//       provider: new FacebookLoginProvider('228820218341303')
//     }
//   ]);
  
//   export function provideConfig() {
//     return config;
//   }
const appRoutes: Routes = [
    {
        path :'', component:McComponent
    },
    // {
    //     path :'test', component:TestComponent
    // },
    {
    //     path :'dashboard', component:DashboradComponent
    // },{
        path :'login', component:LoginComponent
    },{
        path :'forgot-pwd', component:ForgotPwdComponent
    },{
        path :'profile', component:ProfileComponent
    },{
        path :'agents', component:AgentsComponent
    },{
        path :'call', component:CallComponent
    },{
        path :'call-history', component:CallHistoryComponent
    },{
        path :'mc', component:McComponent
    },
    // {
    //     path :'queue', component:QueueManagementComponent
    // },
    {
        path :'pbc-settings', component:PbcSettingsComponent
    },
    {
        path :'admin-settings', component:AdminSettingsComponent
    },
    {
        path :'logout', component:LogoutComponent
    },
    {
        path :'sms', component:SmsComponent
    },
   
    {
        path :'contacts', component:ContactsComponent
    },
    // {
    //     path :'edit-contacts', component:EditContactsComponent
    // },
    {
        path :'add-contacts', component:AddContactsComponent
    },
    // {
    //     path :'tabs', component:TabsComponent
    // },
    {
        path :'activity', component:ActivityComponent
    },
    {
        path :'csv-contact-upload', component:CsvContactUploadComponent
    },
    {
        path :'contact-report', component:ContactReportComponent
    },
    // {
    //     path :'compose-sms', component:ComposeSmsComponent
    // },
    {
        path :'ticketing-system', component:TicketingSystemComponent
    },
    {
        path :'ticket-view', component:TicketViewComponent
    },
    {
        path :'ticket-compose', component:TicketComposeComponent
    },
    {
        path :'ticket-report', component:TicketReportComponent
    },
    {
        path :'department', component:DepartmentComponent
    },
    {
        path :'chat', component:ChatComponent
    },
    {
        path :'ticketing-system-new', component:TicketingSystemNewComponent
    },
    {
        path :'ticket-forward', component:TicketForwardComponent
    },
    {
        path :'chatbot', component:ChatbootAiComponent
    },
    {
        path :'chatbot-question-feed', component:ChatbotQuestionFeedComponent
    },
    {
        path :'ticket-view-thread', component:TicketViewThreadComponent
    },
    {
        path :'ticket-create-new', component:TicketCreateNewComponent
    },
    {
        path :'wp-chat', component:WhatsappChatComponent
    },
    {
        path :'aux-code', component:AuxCodeComponent
    },
    {
        path :'app-settings', component:AppSettingsComponent
    },
    // {
    //     path :'questionnaire', component:QuestionnaireComponent
    // },
    // {
    //     path :'wallboard', component:WallboardComponent
    // },
    {
        path :'global-settings', component:GlobalSettingsComponent
    },
    {
        path :'aux', component:AuxCodesComponent
    },
    // {
    //     path :'aux-report', component:AuxCodeReportComponent
    // },
    // {
    //     path :'campaign', component:CampaignComponent
    // },
    // {
    //     path :'campaign-contact', component:CampaignContactsComponent
    // },
    // {
    //     path :'campaign-contact-add', component:CampaignContactsAddComponent
    // },
    // {
    //     path :'campaign-contact-edit', component:CampaignContactsEditComponent
    // },
    {
        path :'agent-permission', component:AgentPermissionComponent
    },
    // {
    //     path :'call-report', component:CallReportComponent
    // },
    // {
    //     path :'leads', component:LeadManagementComponent
    // },
    // {
    //     path :'log-report', component:LogReportComponent
    // },
    {
        path :'custom-wall', component:CustomWallboardComponent
    },
    // {
    //     path :'sms-groups', component:SmsGroupsComponent
    // },
    // {
    //     path :'assign-tickets', component:UnassignedTicketsComponent
    // },
    // {
    //     path :'custom-wall-2', component:CustomWallboardTwoComponent
    // },
    // {
    //     path :'sms-csv-upload', component:SmsCsvUploadComponent
    // },
    // {
    //     path :'ipc-report', component:IpcReportComponent
    // },
    // {
    //     path :'sp-report', component:SpReportComponent
    // },
    // {
    //     path :'avaya-report', component:AvayaReportComponent
    // },
    // {
    //     path :'custom-wall-3', component:CustomWallboardThreeComponent
    // },
    // {
    //     path :'marketplace', component:MarketPlaceComponent
    // },
    // {
    //     path :'sms-templates', component:SmsTemplatesComponent
    // },
    // {
    //     path :'custom-wall-4', component:CustomWallboardFourComponent
    // },
    // {
    //     path :'marketplace-wall', component:MarketplaceWallboardComponent
    // },
    // {
    //     path :'marketplace-report', component:MarketplaceCustomReportComponent
    // },
    // {
    //     path :'demo-page', component:DemoPageComponent
    // },
    // {
    //     path :'upload-document', component:UploadDocumentsComponent
    // },
    {
        path :'download-document', component:DocumentDownloadComponent
    },
    {
        path :'fb-chat', component:FbChatComponent
    },
    {
        path :'agent-settings', component:AgentSettingaComponent
    },
    {
        path :'chat-ratings', component:ChatRatingsComponent
    },
    // {
    //     path :'survey-report', component:SurveyReportComponent
    // },
    // {
    //     path :'survey-summary-report', component:SurveySummaryReportComponent
    // },
    {
        path :'chat-widget-settings', component:ChatWidgetSettingsComponent
    },
    // {
    //     path :'fax', component:FaxComponent
    // },
    // {
    //     path :'outbound-fax', component:NewOutboundFaxComponent
    // },
    {
        path :'internal-chat', component:InternalChatComponent
    },
    {
        path :'compose-wp', component:ComposeWpComponent
    },
    // {
    //     path :'invalid-campaign-contact', component:InvalidCampaignContactComponent
    // },
    // {
    //     path :'predictive-wrapups', component:DndComponent
    // },
    // {
    //     path :'fax-admin', component:FaxAdministrationComponent
    // },
    // {
    //     path :'cordlife-contact', component:CardlifeComponent
    // },
    // {
    //     path :'predictive-dialer-calls', component:PredictiveDialerContactComponent,
    // },
    // {
    //     path :'call-q', component:CallQueueListComponent,
    // },
    // {
    //     path :'call-q-m', component:CallQueueManagementComponent
    // },
    // {
    //     path :'social-publish', component:BufferMarketingComponent
    // },{
    //     path :'line-chat', component:LineChatComponent
    // },{
    //     path :'tele-chat', component:TeleChatComponent
    // },
    // {
    //     path :'sms-report', component:SmsReportComponent
    // },{
    //     path :'report-admin', component:ReportComponent
    // },
    // {
    //     path :'broad-report', component:BroadcastReportComponent
    // },
    // {
    //     path :'sms-tariff', component:SmsTariffComponent
    // },
    // {
    //     path :'payment-results', component:PaymentResultsComponent
    // },
    // {
    //     path :'check-out', component:CheckOutComponent
    // },
    // {
    //     path :'add-to-cart', component:AddToCartComponent
    // },
    // {
    //     path :'omni-plans', component:AdminPlansComponent
    // }, 
    // {
    //     path :'wp-pay', component:WpPayComponent
    // },
    {
        path :'wp-unoff', component:WhatsappUnoffComponent
    },{
        path :'wp-settings', component:WpintsettingsComponent
    },{
        path :'wp-comp-unoff', component:WpInstComposeComponent
    },
    // {
    //     path :'admin-requests', component:AdminRequestsComponent
    // },{
    //     path :'nkh-reports', component:NkhReportsComponent
    // },{
    //     path :'outbound-wallboard', component:OutboundWallboardComponent
    // },{
    //     path :'vid-blog', component:VideosBlogComponent
    // },
    // {
    //     path :'webinar', component:WebinarComponent
    // },
    // {
    //     path :'webinar-settings', component:WebinarSettingsComponent
    // },
    {
        path :'message-temp', component:MessageTemplatesComponent
    // },{
    //     path :'call-tariff', component:CallTariffComponent
    },{
        path :'email-groups', component:EmailGroupsComponent
    },
    // {
    //     path :'call-tarriff-reports', component:CallTariffsReportComponent
    // },
    {
        path :'email-bulk', component:BulkEmailComponent
    },
    // {
    //     path :'billing-group', component:BillingGroupComponent
    // },
    // {
    //     path :'custom-wall-5', component:CustomWallboardFiveComponent
    // },
    // {
    //     path :'agent-group', component:AgentGroupsComponent
    // },
    // {
    //     path :'campaign-contact-details', component:CampaignContactPopupComponent
    // },
    {
        path :'bulk-mail-list', component:BulkMailListComponent
    }
    // {
    //     path :'cust_six__wall', component:CustomWallboardSixComponent
    // },{
    //     path :'netwrix-report', component:NetwrixReportComponent
    // }
];

    
@NgModule({
  declarations: [
    AppComponent,
    McComponent,
    MenuComponent,
    HomeComponent,
    AuthComponent,
    LoginComponent,
    ForgotPwdComponent,
    ProfileComponent,
    AgentsComponent,
    AgentsformComponent,
    // QueueComponent,
    CallComponent,
    CallHistoryComponent,
    ChatComponent,
    EmailComponent,
    DialpadComponent,
    // DashboradComponent,
    // SettingMenuComponent,
    LogoutComponent,
    // QueueformComponent,
    PbcSettingsComponent,
    AdminSettingsComponent,
    SmsComponent,
    ContactsComponent,
    AddContactsComponent,
    // EditContactsComponent,
    ActivityComponent,
    // TabsComponent,
    CsvContactUploadComponent,
    ContactReportComponent,
    // ComposeSmsComponent,
    TicketingSystemComponent,
    TicketViewComponent,
    TicketComposeComponent,
    DepartmentComponent,
    TicketReportComponent,
    TicketingSystemNewComponent,
    TicketForwardComponent,
    ChatbootAiComponent,
    ChatbotQuestionFeedComponent,
    TicketViewThreadComponent,
    TicketCreateNewComponent,
    WhatsappChatComponent,
    AuxCodeComponent,
    AppSettingsComponent,
    // QuestionnaireComponent,
    // WallboardComponent,
    GlobalSettingsComponent,
    AuxCodesComponent,
    // AuxCodeReportComponent,
    // CampaignComponent,
    // CampaignContactsComponent,
    // CampaignContactsAddComponent,
    // CampaignContactsEditComponent,
    AgentPermissionComponent,
    // CallReportComponent,
    // QueueManagementComponent,
    // LeadManagementComponent,
    // LogReportComponent,
    CustomWallboardComponent,
    // SmsGroupsComponent,
    UnassignedTicketsComponent,
    // CustomWallboardTwoComponent,
    // SmsCsvUploadComponent,
    // IpcReportComponent,
    // SpReportComponent,
    // AvayaReportComponent,
    // CustomWallboardThreeComponent,
    // MarketPlaceComponent,
    // SmsTemplatesComponent,
    // CustomWallboardFourComponent,
    // MarketplaceWallboardComponent,
    // MarketplaceCustomReportComponent,
    // DemoPageComponent,
    // UploadDocumentsComponent,
    DocumentDownloadComponent,
    FbChatComponent,
    AgentSettingaComponent,
    SafePipe,
    ChatRatingsComponent,
    // SurveyReportComponent,
    // SurveySummaryReportComponent,
    ChatWidgetSettingsComponent,
    // FaxComponent,
    // NewOutboundFaxComponent,
    // TestComponent,
    // ReportComponent,
    InternalChatComponent,
    ComposeWpComponent,
    // InvalidCampaignContactComponent,
    // DndComponent,
    // FaxAdministrationComponent,
    FooterComponent,
    // CardlifeComponent,
    // PredictiveDialerContactComponent,
    // CallQueueComponent,
    // CallQueueListComponent,
    // CallQueueManagementComponent,
    // BufferMarketingComponent,
    // LineChatComponent,
    // TeleChatComponent,
    // SmsReportComponent,
    // SmsTariffComponent,
    // PaymentResultsComponent,
    // CheckOutComponent,
    // AddToCartComponent,
    // AdminPlansComponent,
    // WpPayComponent,
    WhatsappUnoffComponent,
    WpintsettingsComponent,
    WpInstComposeComponent,
    // BroadcastReportComponent,
    // AdminRequestsComponent,
    // NkhReportsComponent,
    // OutboundWallboardComponent,
    // QLoginLogoutComponent,
    // VideosBlogComponent,
    // WebinarSettingsComponent,
    // WebinarComponent,
    MessageTemplatesComponent,
    // CallTariffComponent,
    EmailGroupsComponent,
    BulkEmailComponent,
    // CallTariffsReportComponent,
    // BillingGroupComponent,
    // CustomWallboardFiveComponent,
    // AgentGroupsComponent,
    // CampaignContactPopupComponent,
    BulkMailListComponent,
    // CustomWallboardSixComponent,
    // NetwrixReportComponent
    
  
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,GoogleChartsModule,FormsModule,
    HttpClientModule,EditorModule,  GaugeChartModule,
    // SocialLoginModule,
    UserIdleModule.forRoot({idle: 10, timeout: 10, ping: 10}),
    RouterModule.forRoot(appRoutes,{ useHash: true }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    // RichTextEditorAllModule,
    InfiniteScrollModule
  ],
  providers: [DatePipe,
//     {
//     provide: AuthServiceConfig,
//     useFactory: provideConfig
//   },
  Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
