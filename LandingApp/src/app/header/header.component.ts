import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  to_top(){
    document.getElementById("img_container")?.scrollIntoView({behavior:"smooth"});
  }

  to_about(){
    document.getElementById("infographics_header")?.scrollIntoView({behavior:"smooth"});
  }

  to_reviews(){
    document.getElementById("reviews_header")?.scrollIntoView({behavior:"smooth"});
  }

  to_chat_bot(){
    document.getElementById("register_header")?.scrollIntoView({behavior:"smooth"});
  }

  openCreateAccountOverlay(){
    let element = document.getElementsByClassName("create_account");
    // let window = element.;

  }

}
