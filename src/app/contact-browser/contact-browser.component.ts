import { Component, ViewChild, OnInit, Inject, AfterViewInit, OnChanges } from '@angular/core';
import { IContact } from './../model/contact';
import { IEnlaceVisitContact } from './../model/enlaceVisitContact';
import { MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ContactService } from '../services/contact.service';
import { EnlaceService } from '../services/enlace.service';
import { DBOperation } from '../shared/DBOperations';
import { Global } from '../shared/Global';
import { INombre } from './../model/nombre';
import { Observable, throwError} from 'rxjs';

@Component({
  selector: 'app-contact-browser',
  templateUrl: './contact-browser.component.html',
  styleUrls: ['./contact-browser.component.scss']
})
export class ContactBrowserComponent implements OnInit, AfterViewInit, OnChanges {

  contacts: IContact[];
  contact: IContact;
  loadingState: boolean;
  isDataAvailable: boolean;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;
  contacs; any;
  array: any;
  array2: any;
  visitasAux: any;
  nombresFinal: any;
  contactsFinal: any;
  enlacesFinal: any;
  dataSource: any;
  dataSource2: any;
  public visita: number;
  public contacto: number;
  public motivo: string;
  // set columns that will need to show in listing table
  displayedColumns = ['name', 'surname', 'company', 'dni', 'fecha', 'action'];
  displayedColumns2 = ['contactId', 'visitId'];
  displayedColumns3 = ['nameplussurname'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private _contactService: ContactService,
    private _enlaceService: EnlaceService,
    public dialogAux: MatDialogRef<ContactBrowserComponent>,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingState = true;
    this.isDataAvailable = false;
    console.log('app = ngOnInit');
    this.motivo = this.data.visitaActiva.motivo;
    this.contactsFinal = this.loadListContacts();
    console.log('LOAD CONTACTOS');
    this.enlacesFinal = this.loadEnlaces();
    console.log('LOADENLACES');
    this.nombresFinal = this.findNames();
    this.loadingState = false;
   }
  // FIN DE ONINIT
  ngAfterViewInit() {
  }
  ngOnChanges() {
  }

  public findNames(): any {
    this.nombresFinal = new MatTableDataSource<INombre>();
    // this.loadEnlaces();
    this.visitasAux = this.dataSource2;
    const nombres: INombre[] = [];
    if (this.visitasAux !== undefined)  {
    this.visitasAux.forEach((enlaceElement) => {
      // this._contactService.getAllContact(Global.BASE_USER_ENDPOINT + 'getAllContact')
      // .subscribe(contacts => {
      // this.dataSource = new MatTableDataSource<IContact>();
      // this.array = contacts;
      // });
      this.array.forEach(function(personaElement) {
        if (enlaceElement.contactId === personaElement.id) {
          let nombre = '';
          const aux: any = [];
          nombre = personaElement.name +  ' ' + personaElement.surname;
          aux.name = nombre;
          nombres.push(aux);

         } else {
          // console.log(enlaceElement);
          // console.log(personaElement);
         }
      });
    });
    this.nombresFinal = nombres;
    this.isDataAvailable = true;
    console.log(this.nombresFinal);
    return this.nombresFinal;
   } else {
    console.log ('Estoy sin datos de nombresFinal');
   }
  }

  public loadEnlaces(): IEnlaceVisitContact {
    this._enlaceService.getAllEnlaceVisitContact(Global.BASE_USER_ENDPOINTEnlace + 'getAllEnlaceVisitContact')
    .subscribe(enlace => {
      this.dataSource2 = new MatTableDataSource<IEnlaceVisitContact>();
      this.array2 = enlace;
      this.dataSource2 = this.array2;
      this.dataSource2 = this.dataSource2.filter(x => x.visitId === this.data.visitaActiva.id);
     });
     // this.dataSource2 = this.loadEnlaces();
     console.log(Response);
     console.log('dataSource2');
     console.log(this.dataSource2);
     return this.dataSource2;
  }

  public loadListContacts(): IContact[] {
    let _contactos: Array<IContact> = [];
    this._contactService.getAllContact(Global.BASE_USER_ENDPOINT + 'getAllContact')
    .subscribe(contacts => {
    this.dataSource = new MatTableDataSource<IContact>();
    this.array = contacts;
    _contactos = contacts;
    });
    console.log('_contactos');
    console.log(_contactos);
    return _contactos;
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource = this.array;
    this.dataSource = this.dataSource.filter(x => x.dni.toLowerCase() === filterValue);
  }

  public openConfirmationDialog(element: any): void {
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
                this.contactsFinal = this.loadListContacts();
                this.loadEnlaces();
                this.nombresFinal = this.findNames();
                console.log('add nueva persona a la visita');
                console.log(this.contactsFinal);
                console.log(this.dataSource2);
                console.log(this.nombresFinal);
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

  addContact2Visit (element: any) {
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
}
