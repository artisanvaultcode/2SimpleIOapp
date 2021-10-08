import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    forwardRef, HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    QueryList,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable,combineLatest, of, Subject} from 'rxjs';
import {delay, filter, startWith, switchMap, map, take, takeUntil, tap} from 'rxjs/operators';
import {MatSelect} from '@angular/material/select';
import {_countGroupLabelsBeforeOption, MatOption} from '@angular/material/core';
import {A, DOWN_ARROW, END, ENTER, ESCAPE, HOME, NINE, SPACE, UP_ARROW, Z, ZERO} from '@angular/cdk/keycodes';
import {ViewportRuler} from '@angular/cdk/overlay';
import {MatSelectSearchClearDirective} from './mat-select-search.directive';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatFormField} from '@angular/material/form-field';

/** The max height of the select's overlay panel. */
const SELECT_PANEL_MAX_HEIGHT = 256;

/* tslint:disable:member-ordering component-selector */

@Component({
    selector: 'mat-select-search',
    templateUrl: './mat-select-search.component.html',
    styleUrls: ['./mat-select-search.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MatSelectSearchComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatSelectSearchComponent implements OnInit, OnDestroy, ControlValueAccessor {

    /** Label of the search placeholder */
    @Input() placeholderLabel = 'Search..';

    /** Type of the search input field */
    @Input() type = 'text';

    /** Label to be shown when no entries are found. Set to null if no message should be shown. */
    @Input() noEntriesFoundLabel = 'No entries Found';

    /**
     *  Text that is appended to the currently active item label announced by screen readers,
     *  informing the user of the current index, value and total options.
     *  eg: Bank R (Germany) 1 of 6
     */
    @Input() indexAndLengthScreenReaderText = ' of ';

    /**
     * Whether or not the search field should be cleared after the dropdown menu is closed.
     * Useful for server-side filtering. See [#3](https://github.com/bithost-gmbh/ngx-mat-select-search/issues/3)
     */
    @Input() clearSearchInput = true;

    /** Whether to show the search-in-progress indicator */
    @Input() searching = false;

    /** Disables initial focusing of the input field */
    @Input() disableInitialFocus = false;

    /** Enable clear input on escape pressed */
    @Input() enableClearOnEscapePressed = false;

    /**
     * Prevents home / end key being propagated to mat-select,
     * allowing to move the cursor within the search input instead of navigating the options
     */
    @Input() preventHomeEndKeyPropagation = false;

    /** Disables scrolling to active options when option list changes. Useful for server-side search */
    @Input() disableScrollToActiveOnOptionsChanged = false;

    /** Adds 508 screen reader support for search box */
    @Input() ariaLabel = 'dropdown search';

    /** Whether to show Select All Checkbox (for mat-select[multi=true]) */
    @Input() showToggleAllCheckbox = false;

    /** select all checkbox checked state */
    @Input() toggleAllCheckboxChecked = false;

    /** select all checkbox indeterminate state */
    @Input() toggleAllCheckboxIndeterminate = false;

    /** Display a message in a tooltip on the toggle-all checkbox */
    @Input() toggleAllCheckboxTooltipMessage = '';

    /** Define the position of the tooltip on the toggle-all checkbox. */
    @Input() toogleAllCheckboxTooltipPosition: 'left' | 'right' | 'above' | 'below' | 'before' | 'after' = 'below';

    /** Show/Hide the search clear button of the search input */
    @Input() hideClearSearchButton = false;

    /**
     * Always restore selected options on selectionChange for mode multi (e.g. for lazy loading/infinity scrolling).
     * Defaults to false, so selected options are only restored while filtering is active.
     */
    @Input() alwaysRestoreSelectedOptionsMulti = false;

    /** Output emitter to send to parent component with the toggle all boolean */
    @Output() toggleAll = new EventEmitter<boolean>();

    /** Reference to the search input field */
    @ViewChild('searchSelectInput', { read: ElementRef, static: true }) searchSelectInput: ElementRef;

    /** Reference to the search input field */
    @ViewChild('innerSelectSearch', { read: ElementRef, static: true }) innerSelectSearch: ElementRef;

    /** Reference to custom search input clear icon */
    @ContentChild(MatSelectSearchClearDirective, { static: false }) clearIcon: MatSelectSearchClearDirective;

    @HostBinding('class.mat-select-search-inside-mat-option')
    get isInsideMatOption(): boolean {
        return !!this.matOption;
    }

    /** Current search value */
    get value(): string {
        return this._formControl.value;
    }
    private _lastExternalInputValue: string;

    // eslint-disable-next-line @typescript-eslint/ban-types
    onTouched: Function = (_: any) => { };

    /** Reference to the MatSelect options */
    public set _options(_options: QueryList<MatOption>) {
        this._options$.next(_options);
    }
    public get _options(): QueryList<MatOption> {
        return this._options$.getValue();
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public _options$: BehaviorSubject<QueryList<MatOption>> = new BehaviorSubject<QueryList<MatOption>>(null);

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private optionsList$: Observable<MatOption[]> = this._options$.pipe(
        switchMap(_options => _options ?
            _options.changes.pipe(
                map(options => options.toArray()),
                startWith<MatOption[]>(_options.toArray()),
            ) : of(null)
        )
    );

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private optionsLength$: Observable<number> = this.optionsList$.pipe(
        map(options => options ? options.length : 0)
    );

    /** Previously selected values when using <mat-select [multiple]="true">*/
        // eslint-disable-next-line @typescript-eslint/member-ordering
    private previousSelectedValues: any[];

    // eslint-disable-next-line @typescript-eslint/member-ordering
    public _formControl: FormControl = new FormControl('');

    /** whether to show the no entries found message */
        // eslint-disable-next-line @typescript-eslint/member-ordering
    public _showNoEntriesFound$: Observable<boolean> = combineLatest([
        this._formControl.valueChanges,
        this.optionsLength$
    ]).pipe(
        map(([value, optionsLength]) => this.noEntriesFoundLabel && value
            && optionsLength === this.getOptionsLengthOffset())
    );

    /** Subject that emits when the component has been destroyed. */
        // eslint-disable-next-line @typescript-eslint/member-ordering
    private _onDestroy = new Subject<void>();


    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(@Inject(MatSelect) public matSelect: MatSelect,
                public changeDetectorRef: ChangeDetectorRef,
                private _viewportRuler: ViewportRuler,
                @Optional() @Inject(MatOption) public matOption: MatOption = null,
                private liveAnnouncer: LiveAnnouncer,
                @Optional() @Inject(MatFormField) public matFormField: MatFormField = null
    ) {
    }

    ngOnInit(): void  {
        // set custom panel class
        const panelClass = 'mat-select-search-panel';
        if (this.matSelect.panelClass) {
            if (Array.isArray(this.matSelect.panelClass)) {
                (<string[]>this.matSelect.panelClass).push(panelClass);
            } else if (typeof this.matSelect.panelClass === 'string') {
                this.matSelect.panelClass = [this.matSelect.panelClass, panelClass];
            } else if (typeof this.matSelect.panelClass === 'object') {
                this.matSelect.panelClass[panelClass] = true;
            }
        } else {
            this.matSelect.panelClass = panelClass;
        }

        // set custom mat-option class if the component was placed inside a mat-option
        if (this.matOption) {
            this.matOption.disabled = true;
            this.matOption._getHostElement().classList.add('contains-mat-select-search');
        } else {
            console.error('<mat-select-search> must be placed inside a <mat-option> element');
        }

        // when the select dropdown panel is opened or closed
        this.matSelect.openedChange
            .pipe(
                delay(1),
                takeUntil(this._onDestroy)
            )
            .subscribe((opened) => {
                if (opened) {
                    this.updateInputWidth();
                    // focus the search field when opening
                    if (!this.disableInitialFocus) {
                        this._focus();
                    }
                } else {
                    // clear it when closing
                    if (this.clearSearchInput) {
                        this._reset();
                    }
                }
            });



        // set the first item active after the options changed
        this.matSelect.openedChange
            .pipe(take(1))
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                if (this.matSelect._keyManager) {
                    this.matSelect._keyManager.change.pipe(takeUntil(this._onDestroy))
                        .subscribe(() => this.adjustScrollTopToFitActiveOptionIntoView());
                } else {
                    console.log('_keyManager was not initialized.');
                }

                this._options = this.matSelect.options;

                // Closure variable for tracking the most recent first option.
                // In order to avoid avoid causing the list to
                // scroll to the top when options are added to the bottom of
                // the list (eg: infinite scroll), we compare only
                // the changes to the first options to determine if we
                // should set the first item as active.
                // This prevents unnecessary scrolling to the top of the list
                // when options are appended, but allows the first item
                // in the list to be set as active by default when there
                // is no active selection
                let previousFirstOption = this._options.toArray()[this.getOptionsLengthOffset()];

                this._options.changes
                    .pipe(
                        takeUntil(this._onDestroy)
                    )
                    .subscribe(() => {
                        // avoid "expression has been changed" error
                        setTimeout(() => {
                            // Convert the QueryList to an array
                            const options = this._options.toArray();

                            // The true first item is offset by 1
                            const currentFirstOption = options[this.getOptionsLengthOffset()];

                            const keyManager = this.matSelect._keyManager;
                            if (keyManager && this.matSelect.panelOpen) {

                                // set first item active and input width

                                // Check to see if the first option in these changes is different from the previous.
                                const firstOptionIsChanged = !this.matSelect.compareWith(previousFirstOption, currentFirstOption);

                                // CASE: The first option is different now.
                                // Indiciates we should set it as active and scroll to the top.
                                if (firstOptionIsChanged
                                    || !keyManager.activeItem
                                    || !options.find(option => this.matSelect.compareWith(option, keyManager.activeItem))) {
                                    keyManager.setFirstItemActive();
                                }

                                // wait for panel width changes
                                setTimeout(() => {
                                    this.updateInputWidth();
                                });

                                if (!this.disableScrollToActiveOnOptionsChanged) {
                                    this.adjustScrollTopToFitActiveOptionIntoView();
                                }
                            }

                            // Update our reference
                            previousFirstOption = currentFirstOption;
                        });
                    });
            });

        // add or remove css class depending on whether to show the no entries found message
        // note: this is hacky
        this._showNoEntriesFound$.pipe(
            takeUntil(this._onDestroy)
        ).subscribe((showNoEntriesFound) => {
            // set no entries found class on mat option
            if (this.matOption) {
                if (showNoEntriesFound) {
                    this.matOption._getHostElement().classList.add('mat-select-search-no-entries-found');
                } else {
                    this.matOption._getHostElement().classList.remove('mat-select-search-no-entries-found');
                }
            }
        });

        // resize the input width when the viewport is resized, i.e. the trigger width could potentially be resized
        this._viewportRuler.change()
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                if (this.matSelect.panelOpen) {
                    this.updateInputWidth();
                }
            });

        this.initMultipleHandling();

        this.optionsList$.pipe(
            takeUntil(this._onDestroy)
        ).subscribe(() => {
            // update view when available options change
            this.changeDetectorRef.markForCheck();
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    _emitSelectAllBooleanToParent(state: boolean) {
        this.toggleAll.emit(state);
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    _isToggleAllCheckboxVisible(): boolean {
        return this.matSelect.multiple && this.showToggleAllCheckbox;
    }

    /**
     * Handles the key down event with MatSelect.
     * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
     *
     * @param event
     */
    _handleKeydown(event: KeyboardEvent): void {
        // Prevent propagation for all alphanumeric characters in order to avoid selection issues
        if ((event.key && event.key.length === 1) ||
            (event.keyCode >= A && event.keyCode <= Z) ||
            (event.keyCode >= ZERO && event.keyCode <= NINE) ||
            (event.keyCode === SPACE)
            || (this.preventHomeEndKeyPropagation && (event.keyCode === HOME || event.keyCode === END))
        ) {
            event.stopPropagation();
        }

        if (this.matSelect.multiple && event.key && event.keyCode === ENTER) {
            // Regain focus after multiselect, so we can further type
            setTimeout(() => this._focus());
        }

        // Special case if click Escape, if input is empty, close the dropdown, if not, empty out the search field
        if (this.enableClearOnEscapePressed === true && event.keyCode === ESCAPE && this.value) {
            this._reset(true);
            event.stopPropagation();
        }
    }

    /**
     * Handles the key up event with MatSelect.
     * Allows e.g. the announcing of the currently activeDescendant by screen readers.
     */
    _handleKeyup(event: KeyboardEvent): void {
        if (event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW) {
            const ariaActiveDescendantId = this.matSelect._getAriaActiveDescendant();
            const index = this._options.toArray().findIndex(item => item.id === ariaActiveDescendantId);
            if (index !== -1) {
                const activeDescendant = this._options.toArray()[index];
                this.liveAnnouncer.announce(
                    activeDescendant.viewValue + ' '
                    + this.getAriaIndex(index)
                    + this.indexAndLengthScreenReaderText
                    + this.getAriaLength()
                );
            }
        }
    }

    /**
     * Calculate the index of the current option, taking the offset to length into account.
     * examples:
     *    Case 1 [Search, 1, 2, 3] will have offset of 1, due to search and will read index of total.
     *    Case 2 [1, 2, 3] will have offset of 0 and will read index +1 of total.
     */
    getAriaIndex(optionIndex: number): number {
        if (this.getOptionsLengthOffset() === 0) {
            return optionIndex + 1;
        }
        return optionIndex;
    }

    /**
     * Calculate the length of the options, taking the offset to length into account.
     * examples:
     *    Case 1 [Search, 1, 2, 3] will have length of options.length -1, due to search.
     *    Case 2 [1, 2, 3] will have length of options.length.
     */
    getAriaLength(): number {
        return this._options.toArray().length - this.getOptionsLengthOffset();
    }

    writeValue(value: string): void {
        this._lastExternalInputValue = value;
        this._formControl.setValue(value);
        this.changeDetectorRef.markForCheck();
    }

    onBlur(): any {
        this.onTouched();
    }

    registerOnChange(fn: (value: string) => void): void {
        this._formControl.valueChanges.pipe(
            filter(value => value !== this._lastExternalInputValue),
            tap(() => this._lastExternalInputValue = undefined),
            takeUntil(this._onDestroy)
        ).subscribe(fn);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    /**
     * Focuses the search input field
     */
    _focus(): void {
        if (!this.searchSelectInput || !this.matSelect.panel) {
            return;
        }
        // save and restore scrollTop of panel, since it will be reset by focus()
        // note: this is hacky
        const panel = this.matSelect.panel.nativeElement;
        const scrollTop = panel.scrollTop;

        // focus
        this.searchSelectInput.nativeElement.focus();

        panel.scrollTop = scrollTop;
    }

    /**
     * Resets the current search value
     *
     * @param focus whether to focus after resetting
     */
    _reset(focus?: boolean): void {
        this._formControl.setValue('');
        if (focus) {
            this._focus();
        }
    }


    /**
     * Initializes handling <mat-select [multiple]="true">
     * Note: to improve this code, mat-select should be extended to allow disabling resetting the selection while filtering.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private initMultipleHandling() {
        if (!this.matSelect.ngControl) {
            if (this.matSelect.multiple) {
                // note: the access to matSelect.ngControl (instead of matSelect.value / matSelect.valueChanges)
                // is necessary to properly work in multi-selection mode.
                console.error('the mat-select containing mat-select-search must have a ngModel or formControl directive when multiple=true');
            }
            return;
        }
        // if <mat-select [multiple]="true">
        // store previously selected values and restore them when they are deselected
        // because the option is not available while we are currently filtering
        this.previousSelectedValues = this.matSelect.ngControl.value;

        this.matSelect.ngControl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe((values) => {
                let restoreSelectedValues = false;
                if (this.matSelect.multiple) {
                    if ((this.alwaysRestoreSelectedOptionsMulti || (this._formControl.value && this._formControl.value.length))
                        && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
                        if (!values || !Array.isArray(values)) {
                            values = [];
                        }
                        const optionValues = this.matSelect.options.map(option => option.value);
                        this.previousSelectedValues.forEach((previousValue) => {
                            if (!values.some(v => this.matSelect.compareWith(v, previousValue))
                                && !optionValues.some(v => this.matSelect.compareWith(v, previousValue))) {
                                // if a value that was selected before is deselected and not found in the options, it was deselected
                                // due to the filtering, so we restore it.
                                values.push(previousValue);
                                restoreSelectedValues = true;
                            }
                        });
                    }
                }
                this.previousSelectedValues = values;

                if (restoreSelectedValues) {
                    this.matSelect._onChange(values);
                }
            });
    }

    /**
     * Scrolls the currently active option into the view if it is not yet visible.
     */
    private adjustScrollTopToFitActiveOptionIntoView(): void {
        if (this.matSelect.panel && this.matSelect.options.length > 0) {
            const matOptionHeight = this.getMatOptionHeight();
            const activeOptionIndex = this.matSelect._keyManager.activeItemIndex || 0;
            const labelCount = _countGroupLabelsBeforeOption(activeOptionIndex, this.matSelect.options, this.matSelect.optionGroups);
            // If the component is in a MatOption, the activeItemIndex will be offset by one.
            const indexOfOptionToFitIntoView = (this.matOption ? -1 : 0) + labelCount + activeOptionIndex;
            const currentScrollTop = this.matSelect.panel.nativeElement.scrollTop;

            const searchInputHeight = this.innerSelectSearch.nativeElement.offsetHeight;
            const amountOfVisibleOptions = Math.floor((SELECT_PANEL_MAX_HEIGHT - searchInputHeight) / matOptionHeight);

            const indexOfFirstVisibleOption = Math.round((currentScrollTop + searchInputHeight) / matOptionHeight) - 1;

            if (indexOfFirstVisibleOption >= indexOfOptionToFitIntoView) {
                this.matSelect.panel.nativeElement.scrollTop = indexOfOptionToFitIntoView * matOptionHeight;
            } else if (indexOfFirstVisibleOption + amountOfVisibleOptions <= indexOfOptionToFitIntoView) {
                this.matSelect.panel.nativeElement.scrollTop = (indexOfOptionToFitIntoView + 1) * matOptionHeight
                    - (SELECT_PANEL_MAX_HEIGHT - searchInputHeight);
            }
        }
    }

    /**
     *  Set the width of the innerSelectSearch to fit even custom scrollbars
     *  And support all Operation Systems
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering,@typescript-eslint/explicit-function-return-type
    public updateInputWidth() {
        if (!this.innerSelectSearch || !this.innerSelectSearch.nativeElement) {
            return;
        }
        let element: HTMLElement = this.innerSelectSearch.nativeElement;
        let panelElement: HTMLElement;
        while (element = element.parentElement) {
            if (element.classList.contains('mat-select-panel')) {
                panelElement = element;
                break;
            }
        }
        if (panelElement) {
            this.innerSelectSearch.nativeElement.style.width = panelElement.clientWidth + 'px';
        }
    }

    private getMatOptionHeight(): number {
        if (this.matSelect.options.length > 0) {
            return this.matSelect.options.first._getHostElement().getBoundingClientRect().height;
        }

        return 0;
    }

    /**
     * Determine the offset to length that can be caused by the optional matOption used as a search input.
     */
    private getOptionsLengthOffset(): number {
        if (this.matOption) {
            return 1;
        } else {
            return 0;
        }
    }
}
