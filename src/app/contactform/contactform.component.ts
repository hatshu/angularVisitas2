import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { MatDialog,
         MatDialogRef,
        MAT_DIALOG_DATA,
        AUTOCOMPLETE_PANEL_HEIGHT
} from '@angular/material';

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
  array: any;
  errorMessage: any;
  duplicate: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public _contactService: ContactService,
    public dialogRef: MatDialogRef<ContactlistComponent>
  ) { }

  ngOnInit() {
    this.duplicate = false;
    console.log('estoy en oninit');
    console.log(this.duplicate);
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
  isDuplicate(control: AbstractControl): { [key: string]: boolean } | null {
    // let duplicate = false;
    const promise =  this._contactService.findDni(Global.BASE_USER_ENDPOINT + 'findDni', control.value).toPromise();
    // console.log('fuera del servicio duplicate es ' + this.duplicate + '');
    // if (this.array !== undefined) {
    // this.array.forEach (function(contact) {
    //   if (contact.dni === control.value ) {
    //     duplicate = true;
    //   }
    // });
    // }
    // if (control.value === 'G') {
    //   duplicate = true;
    // }
    console.log('promise: ' + promise);
    if (this.duplicate) {
        return { isDuplicate: true };
    }
    return null;
}



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
