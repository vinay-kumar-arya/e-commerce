import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UsersComponent } from './users/users.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { EditAdminModuleComponent } from './edit-admin-modal/edit-admin-modal.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { DeleteUserModalComponent } from './delete-modal/delete-modal.component';
import { ProductModalComponent } from './product-modal/product-modal.component';

import { TokenInterceptor } from '../core/interceptors/token.interceptor';
import { CategoryComponent } from './category/category.component';
import { CategoryModelComponent } from './category-model/category-model.component';
import { CategoryFilterPipe } from '../core/services/category-filter.pipe';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { OrderModelComponent } from './order-model/order-model.component';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsComponent } from './charts/charts.component';
import { HighchartsChartModule } from 'highcharts-angular';

import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    ProductsComponent,
    OrdersComponent,
    ResetPasswordComponent,
    UsersComponent,
    AdminProfileComponent,
    EditAdminModuleComponent,
    UserModalComponent,
    DeleteUserModalComponent,
    ProductModalComponent,
    CategoryComponent,
    CategoryModelComponent,
    CategoryFilterPipe,
    GenericTableComponent,
    OrderModelComponent,
    DashboardComponent,
    ChartsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
    }),
    MatCardModule,
    MatButtonModule,
    HighchartsChartModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    DatePipe,
    provideClientHydration(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
