import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services are provided in root, so no need to provide them here
// Guards and interceptors are functional and used in routing/main.ts

@NgModule({
  imports: [
    CommonModule
  ]
})
export class CoreModule { }