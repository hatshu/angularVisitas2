import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VisitformComponent } from '../visitform/visitform.component';
import { VisitService } from '../services/visit.service';
import { IVisit } from '../model/visit';
import { DBOperation } from '../shared/DBOperations';
import { Global } from '../shared/Global';

@Component({
  selector: 'app-visitlist',
  templateUrl: './visitlist.component.html',
  styleUrls: ['./visitlist.component.css']
})
export class VisitlistComponent implements OnInit {
// constructor() { }
//   ngOnInit() {
//   }
// }
  visits: IVisit[];
  visit: IVisit;
  loadingStateVisit: boolean;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;

  // set columns that will need to show in listing table
  displayedColumns = ['Motivo', 'Duracion', 'ResponsableCatec', 'Fecha', 'Hora', 'Action'];
  // setting up datasource for material table
  dataSource = new MatTableDataSource<IVisit>();

  constructor(public snackBar: MatSnackBar, private _visitService: VisitService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadingStateVisit = true;
    this.loadVisits();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(VisitformComponent, {
      width: '600px',
      data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, visit: this.visit }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'success') {
        this.loadingStateVisit = true;
        this.loadVisits();
        switch (this.dbops) {
          case DBOperation.create:
            this.showMessage('Data successfully added.');
            break;
          case DBOperation.update:
            this.showMessage('Data successfully updated.');
            break;
          case DBOperation.delete:
            this.showMessage('Data successfully deleted.');
            break;
        }
      } else if (result === 'error') {
        this.showMessage('There is some issue in saving records, please contact to system administrator!');
      } else {
       // this.showMessage('Please try again, something went wrong');
      }
    });
  }

  loadVisits(): void {
    this._visitService.getAllVisit(Global.BASE_USER_ENDPOINTVisit + 'getAllVisit')
      .subscribe(visits => {
        this.loadingStateVisit = false;
        this.dataSource.data = visits;
      });
  }
  addVisit() {
    this.dbops = DBOperation.create;
    this.modalTitle = 'Add New Visit';
    this.modalBtnTitle = 'Add';
    this.openDialog();
  }
  editVisit(Id: number) {
    this.dbops = DBOperation.update;
    this.modalTitle = 'Edit Visit';
    this.modalBtnTitle = 'Update';
    this.visit = this.dataSource.data.filter(x => x.Id === Id)[0];
    this.openDialog();
  }
  deleteVisit(Id: number) {
    this.dbops = DBOperation.delete;
    this.modalTitle = 'Confirm to Delete ?';
    this.modalBtnTitle = 'Delete';
    this.visit = this.dataSource.data.filter(x => x.Id === Id)[0];
    this.openDialog();
  }
  showMessage(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000
    });
  }
}

