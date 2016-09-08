import {TestBed} from '@angular/core/testing';

import {NgbModalBackdrop} from './modal-backdrop';

describe('ngb-modal-backdrop', () => {

  beforeEach(() => { TestBed.configureTestingModule({declarations: [NgbModalBackdrop]}); });

  it('should render backdrop with required CSS classes', () => {
    const fixture = TestBed.createComponent(NgbModalBackdrop);

    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveCssClass('modal-backdrop');
  });

  it('should have a z-index depending on layer', () => {
    const fixture = TestBed.createComponent(NgbModalBackdrop);
    fixture.componentInstance.setLayer(3);
    fixture.detectChanges();
    expect(fixture.nativeElement.style.zIndex).toBe('1055');
  });
});
