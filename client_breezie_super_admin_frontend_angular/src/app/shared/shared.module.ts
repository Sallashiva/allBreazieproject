import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { FormControlDirective, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
// import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgOtpInputModule } from 'ng-otp-input';
import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { Ng2OrderModule } from 'ng2-order-pipe';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { Ng2TelInputModule } from 'ng2-tel-input';
// import { NgxTTitanColorPickerModule } from 'ngx-ttitan-color-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';
import { LoaderComponent } from './loader/loader.component';
import {ScrollingModule} from '@angular/cdk/scrolling';


@NgModule({
  declarations: [LoaderComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatDividerModule,
    MatBadgeModule,
    CKEditorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgOtpInputModule,
    HttpClientModule,
    MatStepperModule,
    MatTabsModule,
    // CKEditorModule,
    // NgxDropzoneModule,
    MatRadioModule,
    MatPaginatorModule,
    MatProgressBarModule,
    // Ng2OrderModule,
    // NgxPaginationModule,
    // Ng2SearchPipeModule,
    // Ng2TelInputModule,
    // NgxTTitanColorPickerModule,
    ScrollingModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    HttpClientModule,
    ToastrModule,
    ToastrModule.forRoot({
      timeOut: 8000,
      preventDuplicates: true,
    }),
  ],
  exports: [
    HttpClientModule,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatDividerModule,
    MatBadgeModule,
    CKEditorModule,
    // NgxGalleryModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgOtpInputModule,
    HttpClientModule,
    MatStepperModule,
    MatTabsModule,
    // CKEditorModule,
    // NgxDropzoneModule,
    MatRadioModule,
    MatPaginatorModule,
    MatProgressBarModule,
    // Ng2OrderModule,
    // NgxPaginationModule,
    // Ng2SearchPipeModule,
    // Ng2TelInputModule,
    // NgxTTitanColorPickerModule,
    ScrollingModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ToastrModule
  ],
})
export class SharedModule { }
