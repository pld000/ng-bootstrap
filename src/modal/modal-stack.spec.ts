import {NgbModalStack} from './modal-stack';
import createSpyObj = jasmine.createSpyObj;
import {NgbModalContainer} from './modal-container';

describe('modal stack', () => {

  it('should throw if a container element was not registered', () => {
    const modalStack = new NgbModalStack();
    expect(() => { modalStack.open('foo'); }).toThrowError();
  });

  it('should tell the container when a window is closed', () => {
    const modalStack = new NgbModalStack();
    const mockContainer: NgbModalContainer = createSpyObj('NgbModalContainer', ['windowClosed']);
    modalStack.registerContainer(mockContainer);

    modalStack.windowClosed();
    expect(mockContainer.windowClosed).toHaveBeenCalled();
  });
});
