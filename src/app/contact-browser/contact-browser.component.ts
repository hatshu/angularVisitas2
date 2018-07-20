import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { IContact } from './../model/contact';
import { IEnlaceVisitContact } from './../model/enlaceVisitContact';
import { MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { ContactformComponent } from '../contactform/contactform.component';
import { VisitformComponent } from '../visitform/visitform.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ContactService } from '../services/contact.service';
import { EnlaceService } from '../services/enlace.service';
import { DBOperation } from '../shared/DBOperations';
import { Global } from '../shared/Global';
import { IVisit } from './../model/visit';

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
  public array2: any;
  public dataSource: any;
  public dataSource2: any;
  public visita: number;
  public contacto: number;
  public motivo: string;
  public visitaActivaId: number;
  // set columns that will need to show in listing table
  displayedColumns = ['name', 'surname', 'company', 'dni', 'fecha', 'action'];
  displayedColumns2 = ['contactId', 'visitId'];

  // setting up datasource for material table
  // dataSource = new MatTableDataSource<IContact>();


  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // TODO: meter la visita activa aqui (REALIZADO)
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private _contactService: ContactService,
    private _enlaceService: EnlaceService,
    private dialogAux: MatDialogRef<ContactBrowserComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadingState = true;
    this.motivo = this.data.visitaActiva.motivo;
    this.loadEnlaces();
    this.loadContacts();
    this.loadingState = false;

  }
  loadContacts() {
    this._contactService.getAllContact(Global.BASE_USER_ENDPOINT + 'getAllContact')
    .subscribe(contacts => {
    this.dataSource = new MatTableDataSource<IContact>();
    this.array = contacts;
    });
  }

  loadEnlaces() {
    this._enlaceService.getAllEnlaceVisitContact(Global.BASE_USER_ENDPOINTEnlace + 'getAllEnlaceVisitContact')
    .subscribe(enlace => {
      this.dataSource2 = new MatTableDataSource<IEnlaceVisitContact>();
      this.array2 = enlace;
      this.filterEnlaces(this.array2);
  });

  }
  filterEnlaces(array2: any) {
    this.dataSource2 = array2;
    this.dataSource2 = this.dataSource2.filter(x => x.visitId === this.data.visitaActiva.id);
    this.loadingState = false;
  }

  public handlePage(e: any) {
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource = this.array;
    this.dataSource = this.dataSource.filter(x => x.dni.toLowerCase() === filterValue);
  }

  addContact2Visit (element: any) {
    // const enlaceData: IEnlaceVisitContact = {
    //   id: 0,
    //   contactId: element,
    //   visitId: this.data.visitaActiva.id
    // };
    const enlaceData: IEnlaceVisitContact = <IEnlaceVisitContact> {
    contactId: element,
    visitId: this.data.visitaActiva.id
    };

    this.contacto = element;
    this.visita = this.data.visitaActiva.id;
    this._enlaceService.addEnlaceVisitContact(Global.BASE_USER_ENDPOINTEnlace + 'addEnlaceVisitContact', enlaceData).subscribe(
      data => {
          // Success
          if (data.message) {
            // TODO: success
          this.dialogAux.close('success');
          } else {
            // TODO: error
            this.dialogAux.close('error');

          }
        },
        error => {
          // TODO: error
          this.dialogAux.close('error');
        }
      );
  }

  openConfirmationDialog(element: any): void {
    const persona = element.name + ' ' + element.surname;
    this.visita = this.data.visitaActiva.id;
    const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      // data: {contaco: 'this.contact', visita: 'this.data'}
    });
    dialogRef2.componentInstance.confirmMessage = '¿Deseña añadir a ' + persona + ' a la visita ?' ;

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {
        const enlaceData: IEnlaceVisitContact = <IEnlaceVisitContact> {
          contactId: element.id,
          visitId: this.data.visitaActiva.id
          };

          // this.contacto = element.id;
          // this.visita = this.data.visitaActiva.id;
          this._enlaceService.addEnlaceVisitContact(Global.BASE_USER_ENDPOINTEnlace + 'addEnlaceVisitContact', enlaceData).subscribe(
            data => {
                // Success
                if (data.message) {
                  // TODO: success
                dialogRef2.close('success');
                this.loadContacts();
                this.loadEnlaces();
                } else {
                  // TODO: error
                  dialogRef2.close('error');

                }
              },
              error => {
                // TODO: error
                dialogRef2.close('error');
              }
            );
      }
    });
  }

  mapDateData(enlace: IEnlaceVisitContact): IEnlaceVisitContact {
    // visit.fecha = new Date(visit.fecha).toISOString();
    return enlace;
  }
}
