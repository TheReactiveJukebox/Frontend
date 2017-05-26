import { Component, OnInit } from '@angular/core';
import { AppState } from '../../services/app.service';

@Component({
    /**
     * The selector is what angular internally uses
     * for `document.querySelectorAll(selector)` in our index.html
     * where, in this case, selector is the string 'player'.
     */
    selector: 'home',  // <player></player>
    /**
     * Our list of styles in our component. We may add more to compose many styles together.
     */
    styleUrls: [ './player.component.css' ],
    /**
     * Every Angular template is first compiled by the browser before Angular runs it's compiler.
     */
    templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {
    /**
     * Set our default values
     */
    public localState = { value: '' };
    /**
     * TypeScript public modifiers
     */
    constructor(
        public appState: AppState
    ) {}

    public ngOnInit() {
        console.log('hello `Home` component');
        /**
         * this.title.getData().subscribe(data => this.data = data);
         */
    }

    public submitState(value: string) {
        console.log('submitState', value);
        this.appState.set('value', value);
        this.localState.value = '';
    }
}
