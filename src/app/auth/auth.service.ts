import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import * as firebase from 'firebase';

import { map } from 'rxjs/operators';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';
import { AppState } from '../app.reducer';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuario: User;
  private userSubscription: Subscription = new Subscription();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>) { }

    initAuthListener() {

      this.afAuth.authState.subscribe( (fbUser: firebase.User) => {

        if ( fbUser ) {

         this.userSubscription = this.afDB.doc(`${ fbUser.uid }/usuario`).valueChanges()
                  .subscribe( (usuarioObj: any) => {

                   const newUser = new User( usuarioObj );
                   console.log(newUser);
                   this.store.dispatch( new SetUserAction( newUser) );


                  });

        } else {

          this.usuario = null;
          this.userSubscription.unsubscribe();

        }

      });

  }

  crearUsuario( nombre: string, email: string, password: string) {

    this.store.dispatch( new ActivarLoadingAction()  );

    this.afAuth.auth
    .createUserWithEmailAndPassword(email, password)
    .then( resp => {
      // console.log(resp);

      const user: User = {

        uid: resp.user.uid,
        nombre: nombre,
        email: resp.user.email

      };

      this.afDB.doc(`${ user.uid }/usuario`)
      .set( user )
      .then ( () => {

        this.store.dispatch( new DesactivarLoadingAction()  );
        this.router.navigate(['/']);
      });

    })

    .catch( error => {
      console.error(error);
      this.store.dispatch( new DesactivarLoadingAction()  );
      Swal.fire('Error en el login', error.message, 'error');
    });

  }

  login(email: string, password: string) {

    this.afAuth.auth
    .signInWithEmailAndPassword(email, password)
    .then( resp => {
      // console.log(resp);

      this.router.navigate(['/']);
      this.store.dispatch( new DesactivarLoadingAction() );

    })
    .catch( error => {
      console.error(error);
      this.store.dispatch( new DesactivarLoadingAction() );
      Swal.fire('Error en el login', error.message, 'error');
    });
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth() {

    return this.afAuth.authState
    .pipe(
      map( fbUser => {

        if ( fbUser == null ) {
          this.router.navigate(['/login']);
        }
        return fbUser != null;

      })
    );

  }

}
