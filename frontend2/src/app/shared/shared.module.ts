import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AwesomePipe } from './awesome.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AwesomePipe],
  exports: [AwesomePipe, CommonModule, FormsModule]
})
export class SharedModule { }
