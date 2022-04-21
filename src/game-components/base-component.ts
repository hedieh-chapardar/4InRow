export interface BaseComponent {
    /**
     * Draws the game component
     */
    draw(): JQuery<HTMLElement>;
}