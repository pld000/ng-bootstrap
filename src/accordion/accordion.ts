import {
  Component,
  Input,
  QueryList,
  ContentChildren,
  Directive,
  TemplateRef,
  ContentChild,
  Output,
  EventEmitter,
  AfterContentChecked
} from '@angular/core';
import {isString} from '../util/util';
import {NgbAccordionConfig} from './accordion-config';

let nextId = 0;

/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
@Directive({selector: 'template[ngbPanelTitle]'})
export class NgbPanelTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * This directive must be used to wrap accordion panel content.
 */
@Directive({selector: 'template[ngbPanelContent]'})
export class NgbPanelContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * This directive must be used to wrap accordion panel header.
 */
@Directive({selector: 'template[ngbPanelHeader]'})
export class NgbPanelHeader {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * The context available to the NgbPanelHeader directive
 */
export class NgbPanelHeaderContext {
  /**
   * @internal
   */
  panel: NgbPanel;

  constructor(private _accordion: NgbAccordion, panel: NgbPanel) { this.panel = panel; }

  /**
   * Toggles this panel. Doesn't do anything if the panel is disabled.
   */
  toggle() { this._accordion.toggle(this.panel.id); }

  /**
   * Tells if this panel is open
   */
  isOpen() { return this._accordion.isOpen(this.panel.id); }
}

/**
 * The NgbPanel directive represents an in individual panel with the title and collapsible
 * content
 */
@Directive({selector: 'ngb-panel'})
export class NgbPanel {
  /**
   *  A flag determining whether the panel is disabled or not.
   *  When disabled, the panel cannot be toggled.
   */
  @Input() disabled = false;

  /**
   *  An optional id for the panel. The id should be unique.
   *  If not provided, it will be auto-generated.
   */
  @Input() id = `ngb-panel-${nextId++}`;

  /**
   *  The title for the panel.
   */
  @Input() title: string;

  /**
   *  Panel type (CSS class). Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type: string;

  @ContentChild(NgbPanelContent) contentTpl: NgbPanelContent;
  @ContentChild(NgbPanelTitle) titleTpl: NgbPanelTitle;
  @ContentChild(NgbPanelHeader) headerTpl: NgbPanelHeader;
}

/**
 * The payload of the change event fired right before toggling an accordion panel
 */
export interface NgbPanelChangeEvent {
  /**
   * Id of the accordion panel that is toggled
   */
  panelId: string;

  /**
   * Whether the panel will be opened (true) or closed (false)
   */
  nextState: boolean;

  /**
   * Function that will prevent panel toggling if called
   */
  preventDefault: () => void;
}

/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only panel can be opened at a time.
 */
@Component({
  selector: 'ngb-accordion',
  exportAs: 'ngbAccordion',
  template: `
  <div class="card">
    <template ngFor let-panel [ngForOf]="panels">
      <div [class]="'card-header ' + (panel.type ? 'card-'+panel.type: type ? 'card-'+type : '')" [class.active]="isOpen(panel.id)">
        <template *ngIf="panel.headerTpl" [ngTemplateOutlet]="panel.headerTpl?.templateRef" [ngOutletContext]="getHeaderContext(panel)">
        </template>
        <a *ngIf="!panel.headerTpl" tabindex="0" href (click)="!!toggle(panel.id)" [class.text-muted]="panel.disabled">
          {{panel.title}}<template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></template>
        </a>
      </div>
      <div class="card-block" *ngIf="isOpen(panel.id)">
        <template [ngTemplateOutlet]="panel.contentTpl.templateRef"></template>
      </div>
    </template>
  </div>
`
})
export class NgbAccordion implements AfterContentChecked {
  @ContentChildren(NgbPanel) panels: QueryList<NgbPanel>;

  /**
   * An array or comma separated strings of panel identifiers that should be opened
   */
  @Input() activeIds: string | string[] = [];

  /**
   *  Whether the other panels should be closed when a panel is opened
   */
  @Input('closeOthers') closeOtherPanels: boolean;

  /**
   *  Type of accordion's panels. Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type: string;

  /**
   * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
   */
  @Output() change = new EventEmitter<NgbPanelChangeEvent>();

  /**
   * A map that stores each panel state
   */
  private _states: Map<string, boolean> = new Map<string, boolean>();

  /**
   * A map that stores references to all panel header contexts (and thus panels)
   */
  private _panelHeaderContexts: Map<string, NgbPanelHeaderContext> = new Map<string, NgbPanelHeaderContext>();

  constructor(config: NgbAccordionConfig) {
    this.type = config.type;
    this.closeOtherPanels = config.closeOthers;
  }

  /**
   * Programmatically toggle a panel with a given id.
   */
  toggle(panelId: string) {
    const panelHeaderContext = this._panelHeaderContexts.get(panelId);

    if (panelHeaderContext && !panelHeaderContext.panel.disabled) {
      const nextState = !this._states.get(panelId);
      let defaultPrevented = false;

      this.change.emit({panelId: panelId, nextState: nextState, preventDefault: () => { defaultPrevented = true; }});

      if (!defaultPrevented) {
        this._states.set(panelId, nextState);

        if (this.closeOtherPanels) {
          this._closeOthers(panelId);
        }
        this._updateActiveIds();
      }
    }
  }

  ngAfterContentChecked() {
    // active id updates
    if (isString(this.activeIds)) {
      this.activeIds = (this.activeIds as string).split(/\s*,\s*/);
    }
    this._updateStates();

    // closeOthers updates
    if (this.activeIds.length > 1 && this.closeOtherPanels) {
      this._closeOthers(this.activeIds[0]);
      this._updateActiveIds();
    }
  }

  /**
   * @internal
   */
  isOpen(panelId: string): boolean { return this._states.get(panelId); }

  /**
   * @internal
   */
  getHeaderContext(panel) { return this._panelHeaderContexts.get(panel.id); }

  private _closeOthers(panelId: string) {
    this._states.forEach((state, id) => {
      if (id !== panelId) {
        this._states.set(id, false);
      }
    });
  }

  private _updateActiveIds() {
    this.activeIds =
        this.panels.toArray().filter(panel => this.isOpen(panel.id) && !panel.disabled).map(panel => panel.id);
  }

  private _updateStates() {
    this._states.clear();
    this._panelHeaderContexts.clear();
    this.panels.toArray().forEach((panel) => {
      if (panel.headerTpl && panel.title) {
        throw 'If a panel has a header template it may not have a title, and vice-versa';
      }
      if (panel.headerTpl && panel.titleTpl) {
        throw 'If a panel has a header template it may not have a title template, and vice-versa';
      }
      this._states.set(panel.id, this.activeIds.indexOf(panel.id) > -1 && !panel.disabled);
      this._panelHeaderContexts.set(panel.id, new NgbPanelHeaderContext(this, panel));
    });
  }
}

export const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader];
