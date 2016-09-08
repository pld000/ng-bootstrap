import {Component} from '@angular/core';
import {BASE_Z_INDEX} from './modal-stack';

@Component({
  selector: 'ngb-modal-backdrop',
  template: '',
  host: {'class': 'modal-backdrop fade in', '[style.z-index]': 'zIndex'}
})
export class NgbModalBackdrop {
  zIndex: number;

  setLayer(layer: number) { this.zIndex = BASE_Z_INDEX + 2 * layer - 1; }
}
