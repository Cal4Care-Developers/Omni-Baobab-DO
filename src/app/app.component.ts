import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'omni-channel';
    public file_path: string = "";
    templateAuthView = false;
    constructor(private router:Router) { }
    
    onActivate(event) {
        this.file_path=this.router.url;
        console.log(this.router.url);
        if (localStorage.getItem('access_token')) {
            this.templateAuthView=false;
            } else if(this.router.url == '/forgot-pwd'){
                this.router.navigate(['/forgot-pwd']);
            }
        else{
            this.templateAuthView=true;
            this.router.navigate(['/login']);
        }
    }
}
