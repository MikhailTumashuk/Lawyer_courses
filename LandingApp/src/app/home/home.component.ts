import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{
  form!: FormGroup;
  // constructor(){
  //   this.form = new FormGroup();
  // }


  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(input.value)) {
      input.value = input.value.replace(emojiRegex, '');
    }
  }

  ngOnInit(){
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      address: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  onEmojiSelect() {
    return false;
  }

  prohibit_special_char(event: any){
    var k;  
    k = event.charCode;
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  onSubmit(){
    if(this.form.valid){
      console.log('Form submitted:', this.form);
      const formData = {...this.form.value}
    }

  }

  to_courses(){
    document.getElementById("courses_header")?.scrollIntoView({behavior:"smooth"});
  }

  

}
