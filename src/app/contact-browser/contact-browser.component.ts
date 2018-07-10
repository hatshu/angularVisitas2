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
  public pageSize = 10;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  public dataSource: any;

  // set columns that will need to show in listing table
  displayedColumns = ['name', 'email', 'gender', 'birth', 'techno', 'message'];
  // setting up datasource for material table
  // dataSource = new MatTableDataSource<IContact>();


  @ViewChild(MatPaginator) paginator: MatPaginator;

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
      this.dataSource = contacts;
      this.dataSource.paginator = this.paginator;
      this.array = contacts;
      this.loadingState = false;
      this.totalSize = this.array.length;
      this.iterator();
  });
    // this.loadContactsBrowser();
  }

  loadContactsBrowser() {}

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.array.filterPredicate = function(data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.symbol.toLowerCase().includes(filter);
    };
    this.dataSource = part;
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  public getGender(gender: number): string {
    return Global.genders.filter(ele => ele.id === gender).map(ele => ele.name)[0];
  }

  public applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.array.filter = filterValue;
  }
}
