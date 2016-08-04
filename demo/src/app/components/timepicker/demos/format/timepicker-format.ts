import {Component} from '@angular/core';
import {NGB_TIMEPICKER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';

/**
 * Interface for the structure of the native model of NgbTimepicker
 */
interface TimeStructure {
  hour: number;
  minute: number;
  second: number;
}

/**
 * Left-pads single-digit number with 0, to format 6 as '06', for example
 */
function pad(number): string {
  return number < 10 ? `0${number}` : number;
}

/**
 * Tests if two TimeStructure are both falsy, or equal
 */
function equal(t1: TimeStructure, t2: TimeStructure): boolean {
  if (!t1) {
    return !t2;
  }
  return (!t1 && !t2) || (t1 && t2 && t1.hour === t2.hour && t1.minute === t2.minute && t1.second === t2.second);
}

/**
 * Class allowing to transform a TimeStructure to a string, and vice-versa.
 */
class StringTimeFormat {
  private currentValue: TimeStructure;

  toStructure(timeAsString: string): TimeStructure {
    if (!timeAsString) {
      this.currentValue = null;
    } else {
      const parts = timeAsString.split(':');
      const newValue = {
        hour: +parts[0],
        minute: +parts[1],
        second: +parts[2],
      };

      if (!equal(this.currentValue, newValue)) {
        this.currentValue = newValue;
      }
    }
    return this.currentValue;
  }

  fromStructure(t: TimeStructure): string { return t && `${pad(t.hour)}:${pad(t.minute)}:${pad(t.second)}`; }
}

@Component({
  selector: 'ngbd-timepicker-format',
  templateUrl: './timepicker-format.html',
  directives: [NGB_TIMEPICKER_DIRECTIVES]
})
export class NgbdTimepickerFormat {
  time = '00:00:00';
  timeFormat = new StringTimeFormat();

  resetToMidnight() { this.time = '00:00:00'; }
}
