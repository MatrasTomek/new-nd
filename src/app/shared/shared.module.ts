import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarModule } from './nav-bar/nav-bar.module';




@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    NavBarModule
  ],
  exports: [NavBarModule]
})
export class SharedModule { }
