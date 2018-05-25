import { NgModule } from '@angular/core';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatTableModule } from '@angular/material';
import { MatPaginatorModule, MatFormFieldModule, MatRadioModule, MatSelectModule, MatInputModule } from '@angular/material';
import { MatDatepickerModule, MatNativeDateModule, MatOptionModule, MatDialogModule } from '@angular/material';
import {  MatProgressSpinnerModule, MatSnackBarModule, MatCardModule } from '@angular/material';


@NgModule({
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatOptionModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatCardModule
    ],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatOptionModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatCardModule
    ],
})
export class AppMaterialModule { }
