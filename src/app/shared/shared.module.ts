import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarModule } from './nav-bar/nav-bar.module';
import { FooterModule } from './footer/footer.module';

@NgModule({
	declarations: [],
	imports: [CommonModule, NavBarModule, FooterModule],
	exports: [NavBarModule, FooterModule],
})
export class SharedModule {}
