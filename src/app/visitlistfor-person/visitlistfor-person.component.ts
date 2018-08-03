import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';
import { MatDialog, MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { VisitService } from '../services/visit.service';
import { IVisit } from '../model/visit';
import { IContact } from '../model/contact';
import { IEnlaceVisitContact } from '../model/enlaceVisitContact';
import { DBOperation } from '../shared/DBOperations';
import { Global } from '../shared/Global';

@Component({
  selector: 'app-visitlistfor-person',
  templateUrl: './visitlistfor-person.component.html',
  styleUrls: ['./visitlistfor-person.component.scss']
})
export class VisitlistforPersonComponent implements OnInit {

  visits: IVisit[];
  contacts: IContact[];
  enlaceVisitContacts: IEnlaceVisitContact[];
  enlaceVisitContact: IEnlaceVisitContact;
  loadingState: boolean;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort) sort: MatSort;
  dataSource: any;
  contactoId: number;
  nameAndSurname: string;



  // set columns that will need to show in listing table
  displayedColumns = ['motivo', 'duracion', 'responsableCatec', 'fecha', 'hora'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private _visitService: VisitService) { }

  ngOnInit() {
    this.loadingState = true;
    this.contactoId = this.data.contactoActivo.id;
    this.nameAndSurname = this.data.contactoActivo.name + ' ' + this.data.contactoActivo.surname;
    this.loadVisits();
  }
  loadVisits() {
    this._visitService.getAllVisitPerson(Global.BASE_USER_ENDPOINTVisit + 'getAllVisitPerson', this.contactoId )
      .subscribe(visits => {
        // this.dataSource = new MatTableDataSource<IVisit>(visits);
        this.dataSource = new MatTableDataSource<IVisit>();
        this.dataSource =  visits.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.loadingState = false;

    });
  }
  showMessage(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000
    });
  }
}
