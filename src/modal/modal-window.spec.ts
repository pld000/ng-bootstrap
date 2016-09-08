import {TestBed, ComponentFixture, inject} from '@angular/core/testing';

import {NgbModalWindow} from './modal-window';
import {ModalDismissReasons} from './modal-dismiss-reasons';
import {NgbModalStack} from './modal-stack';
import createSpyObj = jasmine.createSpyObj;

describe('ngb-modal-dialog', () => {

  let fixture: ComponentFixture<NgbModalWindow>;
  let mockModalStack: NgbModalStack;

  beforeEach(() => {
    mockModalStack = createSpyObj('NgbModalStack', ['windowClosed']);
    TestBed.configureTestingModule(
        {declarations: [NgbModalWindow], providers: [{provide: NgbModalStack, useValue: mockModalStack}]});
    fixture = TestBed.createComponent(NgbModalWindow);
  });

  describe('basic rendering functionality', () => {

    it('should render default modal window', () => {
      fixture.detectChanges();

      const modalEl: Element = fixture.nativeElement;
      const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');

      expect(modalEl).toHaveCssClass('modal');
      expect(dialogEl).toHaveCssClass('modal-dialog');
    });

    it('should render default modal window with a specified size', () => {
      fixture.componentInstance.size = 'sm';
      fixture.detectChanges();

      const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');
      expect(dialogEl).toHaveCssClass('modal-dialog');
      expect(dialogEl).toHaveCssClass('modal-sm');
    });

    it('aria attributes', () => {
      fixture.detectChanges();
      const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');

      expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');
      expect(dialogEl.getAttribute('role')).toBe('document');
    });

    it('should have a z-index and a top-margin depending on layer', () => {
      fixture.componentInstance.setLayer(3);
      fixture.detectChanges();

      expect(fixture.nativeElement.style.zIndex).toBe('1056');
      expect(fixture.nativeElement.style.marginTop).toBe('3rem');
    });
  });

  describe('dismiss', () => {

    it('should dismiss on backdrop click by default', (done) => {
      fixture.detectChanges();

      fixture.componentInstance.dismissEvent.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.BACKDROP_CLICK);
        done();
      });

      fixture.nativeElement.querySelector('.modal-dialog').click();
    });

    it('should ignore backdrop clicks when there is no backdrop', (done) => {
      fixture.componentInstance.backdrop = false;
      fixture.detectChanges();

      fixture.componentInstance.dismissEvent.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.BACKDROP_CLICK);
        done(new Error('Should not trigger dismiss event'));
      });

      fixture.nativeElement.querySelector('.modal-dialog').click();
      setTimeout(done, 200);
    });

    it('should ignore backdrop clicks when backdrop is "static"', (done) => {
      fixture.componentInstance.backdrop = 'static';
      fixture.detectChanges();

      fixture.componentInstance.dismissEvent.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.BACKDROP_CLICK);
        done(new Error('Should not trigger dismiss event'));
      });

      fixture.nativeElement.querySelector('.modal-dialog').click();
      setTimeout(done, 200);
    });

    it('should dismiss on esc press by default', (done) => {
      fixture.detectChanges();

      fixture.componentInstance.dismissEvent.subscribe(($event) => {
        expect($event).toBe(ModalDismissReasons.ESC);
        done();
      });

      fixture.debugElement.triggerEventHandler('keyup.esc', {});
    });
  });

  describe('destroy', () => {
    it('should tell the modal stack when destroyed', () => {
      fixture.componentInstance.ngOnDestroy();
      expect(mockModalStack.windowClosed).toHaveBeenCalled();
    });
  });
});
