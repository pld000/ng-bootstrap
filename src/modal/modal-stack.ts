import {Injectable, TemplateRef} from '@angular/core';

import {NgbModalRef} from './modal-ref';
import {NgbModalContainer} from './modal-container';

export const BASE_Z_INDEX = 1050;

@Injectable()
export class NgbModalStack {
  private modalContainer: NgbModalContainer;

  open(content: string | TemplateRef<any>, options = {}): NgbModalRef {
    if (!this.modalContainer) {
      throw new Error(
          'Missing modal container, add <template ngbModalContainer></template> to one of your application templates.');
    }

    return this.modalContainer.open(content, options);
  }

  windowClosed() { this.modalContainer.windowClosed(); }

  registerContainer(modalContainer: NgbModalContainer) { this.modalContainer = modalContainer; }
}
