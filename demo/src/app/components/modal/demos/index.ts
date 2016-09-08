import {NgbdModalBasic} from './basic/modal-basic';
import {NgbdModalStacked} from './stacked/modal-stacked';

export const DEMO_DIRECTIVES = [NgbdModalBasic, NgbdModalStacked];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/modal-basic'),
    markup: require('!!prismjs?lang=markup!./basic/modal-basic.html')
  },
  stacked: {
    code: require('!!prismjs?lang=typescript!./stacked/modal-stacked'),
    markup: require('!!prismjs?lang=markup!./stacked/modal-stacked.html')
  }
};
