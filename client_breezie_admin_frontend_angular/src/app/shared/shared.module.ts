import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgOtpInputModule } from 'ng-otp-input';
import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';



import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgxTTitanColorPickerModule } from 'ngx-ttitan-color-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgOtpInputModule,
    MatCheckboxModule,
    MatSortModule,
    NgxGalleryModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatBadgeModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatDividerModule,
    MatTableModule,
    MatDialogModule,
    HttpClientModule,
    MatStepperModule,
    MatTabsModule,
    CKEditorModule,
    Ng2TelInputModule,
    NgxDropzoneModule,
    NgxTTitanColorPickerModule,
    MatRadioModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    Ng2OrderModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ],

  exports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgOtpInputModule,
    MatCheckboxModule,
    MatSortModule,
    NgxGalleryModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatBadgeModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatDividerModule,
    MatTableModule,
    MatDialogModule,
    HttpClientModule,
    MatStepperModule,
    MatTabsModule,
    MatProgressBarModule,
    CKEditorModule,
    Ng2TelInputModule,
    NgxDropzoneModule,
    NgxTTitanColorPickerModule,
    MatRadioModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    Ng2OrderModule,
    NgxPaginationModule,
    Ng2SearchPipeModule
  ]
})
export class SharedModule { }
