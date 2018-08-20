import { Component, ViewChild, OnInit, Inject, AfterViewInit, OnChanges } from '@angular/core';
import { IContact } from './../model/contact';
import { INombre } from './../model/nombre';
import { IEnlaceVisitContact } from './../model/enlaceVisitContact';
import { MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ContactService } from '../services/contact.service';
import { EnlaceService } from '../services/enlace.service';
import { DBOperation } from '../shared/DBOperations';
import { Global } from '../shared/Global';
import { ContactformComponent } from '../contactform/contactform.component';

@Component({
  selector: 'app-contact-browser',
  templateUrl: './contact-browser.component.html',
  styleUrls: ['./contact-browser.component.scss']
})
export class ContactBrowserComponent implements OnInit, AfterViewInit, OnChanges {

  contacts: IContact[];
  contact: IContact;
  loadingState: boolean;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;
  array: any;
  array2: any;
  nombresFinal: any;
  dataSource: any;
  dataSource2: any;
  visita: number;
  contactoDNI: number;
  auxID: any;
  contactId: any;
  motivo: string;
  visitId: any;
  // set columns that will need to show in listing table
  displayedColumns = ['name', 'surname', 'company', 'dni', 'fecha', 'action'];
  displayedColumns2 = ['contactId', 'visitId'];
  displayedColumns3 = ['nameplussurname'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private _contactService: ContactService,
    private _enlaceService: EnlaceService,
    public dialogAux: MatDialogRef<ContactBrowserComponent>,
    public dialogNewUser: MatDialogRef<ContactformComponent>,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingState = true;
    this.motivo = this.data.visitaActiva.motivo;
    this.visitId = this.data.visitaActiva.id;
    this.loadListContacts();
    this.loadEnlaces();
    this.findNames();
    this.loadingState = false;
   }
  // FIN DE ONINIT
  ngAfterViewInit() {
  }
  ngOnChanges() {
  }

  public findNames() {
    this.nombresFinal = new MatTableDataSource<INombre>();
    this.visita = this.data.visitaActiva.id;
    this._enlaceService.getAllPersonsName(Global.BASE_USER_ENDPOINTEnlace + 'getAllId' , this.visita)
    .subscribe (enlace => {
      this.nombresFinal = enlace;
    });
  }

  public loadEnlaces() {
    this._enlaceService.getAllEnlaceVisitContact(Global.BASE_USER_ENDPOINTEnlace + 'getAllEnlaceVisitContact')
    .subscribe(enlace => {
      this.dataSource2 = new MatTableDataSource<IEnlaceVisitContact>();
      this.array2 = enlace;
      this.dataSource2 = this.array2;
      this.dataSource2 = this.dataSource2.filter(x => x.visitId === this.data.visitaActiva.id);
     });
  }

  public loadListContacts() {
    this._contactService.getAllContact(Global.BASE_USER_ENDPOINT + 'getAllContact')
    .subscribe(contacts => {
    this.dataSource = new MatTableDataSource<IContact>();
    this.contactId = contacts;
    });
  }

  // public findIdByDNI(dni: number): number {
  //   let idPerson;
  //   this._contactService.getIdByDNI(Global.BASE_USER_ENDPOINT + 'getIdByDNI', dni)
  //   .subscribe(contacto => {
  //   idPerson = contacto;
  //   });
    //   this._contactService.getAllContact(Global.BASE_USER_ENDPOINT + 'getAllContact')
    //   .subscribe(contacts => {
    //   this.contactId = contacts;
    //   this.contactId.forEach(function(contact) {
    //     if (contact.dni === dni) {
    //       idPerson = contact.id ;
    //       this.auxID = idPerson;
    //     }
    //   });
    // });
    // TODO: NO ESTA ACTUALIZADA LA LISTA DE CONTACTOS CON EL ULTIMO QUE SE METE :()

  //   return idPerson;
  // }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource = this.contactId;
    this.dataSource = this.dataSource.filter(x => x.dni.toLowerCase() === filterValue);
  }

  public openConfirmationDialog(element: any): void {
    const persona = element.name + ' ' + element.surname;
    this.visita = this.data.visitaActiva.id;
    const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
    });
    dialogRef2.componentInstance.confirmMessage = '¿Deseña añadir a ' + persona + ' a la visita ?' ;

    dialogRef2.afterClosed().subscribe(result => {
      if (result) {
        const enlaceData: IEnlaceVisitContact = <IEnlaceVisitContact> {
          contactId: element.id,
          visitId: this.data.visitaActiva.id
          };
          // TODO: comprobar que esta persona no está ya en la lista
          this._enlaceService.addEnlaceVisitContact(Global.BASE_USER_ENDPOINTEnlace + 'addEnlaceVisitContact', enlaceData).subscribe(
            data => {
                // Success
                if (data.message) {
                dialogRef2.close('success');
                // TODO: cambiar a ingles
                this.showMessage('Se ha añadido a la visita.');
                this.loadListContacts();
                this.loadEnlaces();
                this.findNames();
                } else {
                  dialogRef2.close('error');
                }
              },
              error => {
                dialogRef2.close('error');
                // TODO: cambiar a ingles
                this.showMessage('El usuario ya existe en la visita');
              }
            );
      }
    });
  }

 openDialog(): void {
    const dialogRef = this.dialog.open(ContactformComponent, {
      width: '600px',
      data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, contact: this.contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== 'error') {
        this.loadListContacts();
       const enlaceData: IEnlaceVisitContact = <IEnlaceVisitContact> {
          contactId: result,
          visitId: this.data.visitaActiva.id
          };
          if (enlaceData.contactId !== undefined) {
          this._enlaceService.addEnlaceVisitContact(Global.BASE_USER_ENDPOINTEnlace + 'addEnlaceVisitContact', enlaceData).subscribe(
            data => {
                // Success
                if (data.message) {
                  // TODO: success
                // dialogRef.close('success');
                this.loadListContacts();
                this.loadEnlaces();
                this.findNames();
                this.showMessage('Data successfully added.');
                }
            });
          }
      } else if (result === 'error') {
        this.showMessage('There is some issue in saving records, please contact to system administrator!');
      }
    });
  }

  addContact() {
    this.dbops = DBOperation.create;
    this.modalTitle = 'Add New Contact';
    this.modalBtnTitle = 'Add';
    this.openDialog();
  }
  showMessage(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 6000
    });
  }
  mapDateData(enlace: IEnlaceVisitContact): IEnlaceVisitContact {
    // visit.fecha = new Date(visit.fecha).toISOString();
    return enlace;
  }

  // addContact2Visit (element: any) {
  //   const enlaceData: IEnlaceVisitContact = <IEnlaceVisitContact> {
  //   contactId: element,
  //   visitId: this.data.visitaActiva.id
  //   };

  //   this.contacto = element;
  //   this.visita = this.data.visitaActiva.id;
  //   this._enlaceService.addEnlaceVisitContact(Global.BASE_USER_ENDPOINTEnlace + 'addEnlaceVisitContact', enlaceData).subscribe(
  //     data => {
  //         // Success
  //         if (data.message) {
  //           // TODO: success
  //         this.dialogAux.close('success');
  //         } else {
  //           // TODO: error
  //           this.dialogAux.close('error');

  //         }
  //       },
  //       error => {
  //         // TODO: error
  //         this.dialogAux.close('error');
  //       }
  //     );
  // }
}
