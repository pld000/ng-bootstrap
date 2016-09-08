import {Component} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-stacked',
  templateUrl: './modal-stacked.html'
})
export class NgbdModalStacked {
  constructor(private modalService: NgbModal) {}

  open(content, size) {
    this.modalService.open(content, {size}).result.catch(() => {});
  }
}
