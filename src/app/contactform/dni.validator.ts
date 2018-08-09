import { FormControl,  AbstractControl } from '@angular/forms';
import { ContactlistComponent } from '../contactlist/contactlist.component';
import { IContact } from '../model/contact';
import { ContactService } from '../services/contact.service';
import { DBOperation } from '../shared/DBOperations';
import { Global } from '../shared/Global';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

export class DniValidator  {

  // constructor (public _contactService: ContactService) { }

  static isDuplicate (control: AbstractControl) {
    if (control.value === 'A') {
      return ({isDuplicate: true});
    } else {
      return (null);
    }
  }
}
