import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando: boolean;
  subscription: Subscription;

  constructor( public autService: AuthService,
    private store: Store<AppState>) { }

  ngOnInit() {

   this.subscription = this.store.select('ui')
      .subscribe( ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }

onSubmit(data: any) {

  console.log(data);

  this.autService.login( data.email, data.password);
  
}
}
