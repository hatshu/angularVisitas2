import { Component, ViewChild, OnInit } from '@angular/core';
import { IContact } from './../model/contact';
import { MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ContactformComponent } from '../contactform/contactform.component';
import { ContactService } from '../services/contact.service';
import { EnlaceService } from '../services/enlace.service';
import { DBOperation } from '../shared/DBOperations';
import { Global } from '../shared/Global';

@Component({
  selector: 'app-contact-browser',
  templateUrl: './contact-browser.component.html',
  styleUrls: ['./contact-browser.component.scss']
})
export class ContactBrowserComponent implements OnInit {

  contacts: IContact[];
  contact: IContact;
  loadingState: boolean;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;
  length: number;
  public array: any;
  public dataSource: any;


  // set columns that will need to show in listing table
  displayedColumns = ['name', 'surname', 'company', 'dni', 'fecha'];
  // setting up datasource for material table
  // dataSource = new MatTableDataSource<IContact>();


  // @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public snackBar: MatSnackBar,
    private _contactService: ContactService,
    private _enlaceService: EnlaceService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.loadingState = true;
    this._contactService.getAllContact(Global.BASE_USER_ENDPOINT + 'getAllContact')
    .subscribe(contacts => {
      // this.dataSource = new MatTableDataSource<IContact>(contacts);
      this.dataSource = new MatTableDataSource<IContact>();
      this.array = contacts;
      this.loadingState = false;
  });
  }

  loadContactsBrowser() {

  }

  private iterator() {
  }

  public handlePage(e: any) {
  }

  // public getGender(gender: number): string {
  //   return Global.genders.filter(ele => ele.id === gender).map(ele => ele.name)[0];
  // }

  public applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.array.filterPredicate = function(data, filter: string): boolean {
    //   return data.name.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter);
    // };
    this.dataSource = this.array;
    this.dataSource = this.dataSource.filter(x => x.dni.toLowerCase() === filterValue);
  }
}
