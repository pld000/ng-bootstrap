export declare class Positioning {
    private getAllStyles;
    private getStyle;
    private isStaticPositioned;
    private offsetParent;
    position(element: HTMLElement, round?: boolean): ClientRect;
    offset(element: HTMLElement, round?: boolean): ClientRect;
    positionElements(hostElement: HTMLElement, targetElement: HTMLElement, placement: string, appendToBody?: boolean): ClientRect;
    getAvailablePlacements(hostElement: HTMLElement, targetElement: HTMLElement): string[];
    /**
     * check if secondary placement for left and right are available i.e. left-top, left-bottom, right-top, right-bottom
     * primaryplacement: left|right
     * availablePlacementArr: array in which available placements to be set
     */
    private setSecondaryPlacementForLeftRight;
    /**
     * check if secondary placement for top and bottom are available i.e. top-left, top-right, bottom-left, bottom-right
     * primaryplacement: top|bottom
     * availablePlacementArr: array in which available placements to be set
     */
    private setSecondaryPlacementForTopBottom;
}
export declare function positionElements(hostElement: HTMLElement, targetElement: HTMLElement, placement: string | Placement | PlacementArray, appendToBody?: boolean): Placement;
export declare type Placement = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
export declare type PlacementArray = Placement | Array<Placement>;
