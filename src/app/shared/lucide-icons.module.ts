import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      Facebook,
      Twitter,
      Linkedin,
      Mail,
    })
  ],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}