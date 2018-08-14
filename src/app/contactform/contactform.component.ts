import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { MatDialog,
         MatDialogRef,
        MAT_DIALOG_DATA,
        AUTOCOMPLETE_PANEL_HEIGHT
} from '@angular/material';
import { Observable, throwError} from 'rxjs';
import { ContactlistComponent } from '../contactlist/contactlist.component';
import { IContact } from '../model/contact';
import { ContactService } from '../services/contact.service';
import { DBOperation } from '../shared/DBOperations';
import { Global } from '../shared/Global';
import { DniValidator } from './dni.validator';

@Component({
  selector: 'app-contactform',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.scss']
})

export class ContactformComponent implements OnInit {
  msg: string;
  indLoading = false;
  contactFrm: FormGroup;
  // dbops: DBOperation;
  // modalTitle: string;
  // modalBtnTitle: string;
  // listFilter: string;
  // selectedOption: string;
  contact: IContact;
  contacts: IContact[];
  array: any;
  errorMessage: any;
  duplicate: boolean;
  res: any;
  debouncer: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public _contactService: ContactService,
    public dialogRef: MatDialogRef<ContactlistComponent>
  ) { }

  async ngOnInit() {
    this.duplicate = false;
    console.log('estoy en oninit');
    this.loadContacts();
    // console.log(this.duplicate);
    // built contact form
    this.contactFrm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      surname: ['', [Validators.required]],
      company: [''],
      // dni: ['' , [Validators.required, DniValidator.isDuplicate]],
      dni: ['' , [Validators.required, this.isDuplicate.bind(this)]],
      fecha: ['']
    });

    // subscribe on value changed event of form to show validation message
    this.contactFrm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    if (this.data.dbops === DBOperation.create) {
      this.contactFrm.reset();
    } else {
      this.contactFrm.setValue(this.data.contact);
    }
    this.SetControlsState(this.data.dbops === DBOperation.delete ? false : true);
  }
  // form value change event
  onValueChanged(data?: any) {
    if (!this.contactFrm) { return; }
    const form = this.contactFrm;
    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      // setup custom validation message to form
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  // form errors model
  // tslint:disable-next-line:member-ordering
  formErrors = {
    name: '',
    surname: '',
    company: '',
    dni: '',
  };
  // custom valdiation messages
  // tslint:disable-next-line:member-ordering
  validationMessages = {
    name: {
      maxlength: 'Name cannot be more than 50 characters long.',
      required: 'Name is required.'
    },
    surname: {
     required: 'surname is required.'
    },
    // company: {
    //   required: 'surname is required.'
    // },
    dni: {
      required: 'dni is required.',
      isDuplicate: 'dni is already on database'
    },
  };
  onSubmit(formData: any) {
    const contactData = this.mapDateData(formData.value);
    switch (this.data.dbops) {
      case DBOperation.create:
        this._contactService.addContact(Global.BASE_USER_ENDPOINT + 'addContact', contactData)
        .subscribe(
          data => {
            // Success
            if (data.message) {
              // this.dialogRef.close('success');
              let idPerson;
              this._contactService.getIdByDNI(Global.BASE_USER_ENDPOINT + 'getIdByDNI', contactData.dni)
              .subscribe(contacto => {
              idPerson = contacto;
              this.dialogRef.close(idPerson);
              });
              // this.dialogRef.close(contactData.dni);
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case DBOperation.update:
        this._contactService.
        updateContact(
          Global.BASE_USER_ENDPOINT + 'updateContact',
          contactData.id,
          contactData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case DBOperation.delete:
        this._contactService.deleteContact(Global.BASE_USER_ENDPOINT + 'deleteContact', contactData.id).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
    }
  }
  SetControlsState(isEnable: boolean) {
    isEnable ? this.contactFrm.enable() : this.contactFrm.disable();
  }

  mapDateData(contact: IContact): IContact {
    return contact;
  }

  loadContacts() {
    this._contactService.getAllContact(Global.BASE_USER_ENDPOINT + 'getAllContact')
      .subscribe(contacts => {
      this.contacts =  contacts;
    });
  }
//   isDuplicate(control: AbstractControl): { [key: string]: boolean } | null {
//     // let duplicate = false;
//     // const promise =  this._contactService.findDni(Global.BASE_USER_ENDPOINT + 'findDni', control.value).toPromise().then(res => {
//     // console.log(res);
//     // this.res = res;
//     // }
//     // );
//     this._contactService.findDni(Global.BASE_USER_ENDPOINT + 'findDni', control.value).subscribe(this.res = res => {

//       // do stuff with our data here.
//       // ....
//       // asign data to our class property in the end
//       // so it will be available to our template
//       this.res = res;
//   }
//   );
//     // .toPromise();
//     // promise.then(console.log.bind(console));

//     // console.log('fuera del servicio duplicate es ' + this.duplicate + '');
//     // if (this.array !== undefined) {
//     // this.array.forEach (function(contact) {
//     //   if (contact.dni === control.value ) {
//     //     duplicate = true;
//     //   }
//     // });
//     // }
//     // if (control.value === 'G') {
//     //   duplicate = true;
//     // }
//     // if (this.duplicate) {
//     // dbops === 1 es para una nueva alta
//     if (this.res && this.data.dbops === 1) {
//         console.log('res ' + this.res  );
//         return { isDuplicate: true };
//     } else {
//       return null;
//     }

//
isDuplicate(control: AbstractControl): { [key: string]: boolean } {

// isDuplicate(control: AbstractControl): { [key: string]: boolean } {
// clearTimeout(this.debouncer);
// let prueba = null;
// const promesa = this.AnswerService(control.value);
// promesa.then(function(result) {
//   console.log(result); // true or false;
//   prueba = result;
// }, function(err) {
//   console.log(err); // error
// });

// if (prueba) {
//   return { 'isDuplicate': true };
// } else {
//   return null;
// }
let findIt = false;
if (this.contacts !== undefined) {
this.contacts.forEach(function (value) {
  console.log(value);
  if (value.dni === control.value) {
    findIt = true;
  }
});

if (findIt) {
  return { 'isDuplicate': true };
} else {
  return null;
}

}

}

// AnswerService(control: string): any {
//   // let bol = null;
//   // this._contactService.findDni(Global.BASE_USER_ENDPOINT + 'findDni', control).subscribe(res => {

//   //     bol = res;
//   //   });
//   //   return bol;
//     //  return new Promise(resolve => {
//     clearTimeout(this.debouncer);
//      return new Promise(resolve => {

//       this.debouncer = setTimeout(() => {

//         this._contactService.findDni(Global.BASE_USER_ENDPOINT + 'findDni', control).subscribe((res) => {
//           if (res === true) {
//             resolve(true);
//             console.log(res);
//           } else {
//             resolve(false);
//             console.log(res);
//           }
//         });

//       }, 1000);
//     });


// }

}
 // CUSTON VALIDATION
  // const dni = control.value;
  // let duplicate = false;
  // this.array.forEach (function(contact) {
  //   if (contact.dni === dni ) {
  //     duplicate = true;
  //   }
  //   function isDuplicate(control: AbstractControl): { [key: string]: boolean } | null {

  //     // let duplicate = false;
  //     // this.array.forEach (function(contact) {
  //     //   if (contact.dni === control.value ) {
  //     //     duplicate = true;
  //     //   }
  //     // });
  //     let duplicate = false;
  //     if (control.value === 'A') {
  //       duplicate = true;
  //     }
  //     if (control.value !== undefined && (isNaN(control.value) || duplicate)) {
  //         return { 'isDuplicate': true };
  //     }
  //     return null;
  // }
