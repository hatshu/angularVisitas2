import { AuthenticationService } from './services/authentication.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginComponent } from './login/login.component';
import { ContactformComponent } from './contactform/contactform.component';
import { VisitformComponent } from './visitform/visitform.component';
import { ContactService } from './services/contact.service';
import { VisitService } from './services/visit.service';

import { IContact } from './model/contact';
import { IVisit } from './model/visit';

import { DBOperation } from './shared/DBOperations';
import { Global } from './shared/Global';
import { Observable } from 'rxjs';
import { User } from './model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Visits Application';
//   contacts: IContact[];
//   contact: IContact;
//   loadingState: boolean;
//   dbops: DBOperation;
//   modalTitle: string;
//   modalBtnTitle: string;
loggedInUser: User;


  constructor(public snackBar: MatSnackBar,
    private _contactService: ContactService,
    private dialog: MatDialog,
    private _autenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
  this.loadUsers();
  this._autenticationService.currentUser$.subscribe((user: User) => {
  this.loggedInUser = user;
  });
  }

  loadUsers() {
    // if (localStorage.getItem('currentUser')) {
    //   this.userActivo =  JSON.parse(localStorage.getItem('currentUser')).username;
    //   console.log(localStorage.getItem('currentUser'));

  }

//   openDialog(): void {
//     const dialogRef = this.dialog.open(ContactformComponent, {
//       width: '500px',
//       data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, contact: this.contact }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//       if (result === 'success') {
//         this.loadingState = true;
//         this.loadContacts();
//         switch (this.dbops) {
//           case DBOperation.create:
//             this.showMessage('Data successfully added.');
//             break;
//           case DBOperation.update:
//             this.showMessage('Data successfully updated.');
//             break;
//           case DBOperation.delete:
//             this.showMessage('Data successfully deleted.');
//             break;
//         }
//       } else if (result === 'error') {
//         this.showMessage('There is some issue in saving records, please contact to system administrator!');
//       } else {
//        // this.showMessage('Please try again, something went wrong');
//       }
//     });
//   }

//   showMessage(msg: string) {
//     this.snackBar.open(msg, '', {
//       duration: 3000
//     });
//   }
 }
