import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {

  constructor( public autService: AuthService) { }

  ngOnInit() {
  }

onSubmit(data: any) {

  console.log(data);

  this.autService.login( data.email, data.password);
  
}
}
