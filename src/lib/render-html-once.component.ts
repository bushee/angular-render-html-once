import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'render-html-once',
  template: ''
})
export class RenderHtmlOnceComponent implements OnInit {
    private static alreadyRendered: Record<string, Element> = {};
    private static enabled: boolean = true;
    private enabled: boolean = true;

    @Input() public id: string;
    @Input() public htmlContent: string;
    @Input() public set cacheable(enabled: boolean) {
        this.enabled = enabled;
        if (!enabled) {
            delete RenderHtmlOnceComponent.alreadyRendered[this.id];
        }
    }

    public constructor(private hostElement: ElementRef<Element>) {}

    public ngOnInit(): void {
        if (!RenderHtmlOnceComponent.enabled || !this.enabled) {
            this.renderFromString();
            return;
        }
        const cacheHit = RenderHtmlOnceComponent.alreadyRendered[this.id];
        if (cacheHit) {
            this.renderFromCacheHit(cacheHit);
        } else {
            this.renderFromString();
        }
        RenderHtmlOnceComponent.alreadyRendered[this.id] = this.hostElement.nativeElement;
    }

    public static registerServerSideRenderedComponents(): void {
        if (!RenderHtmlOnceComponent.enabled) {
            return;
        }
        if (window && window.document && window.document.getElementsByTagName) {
            const elements = window.document.getElementsByTagName('render-html-once');
            for (let i = 0; i < elements.length; ++i) {
                const element = elements[i];
                RenderHtmlOnceComponent.alreadyRendered[element.id] = element;
            }
        }
    }

    public static clearCache(): void {
        RenderHtmlOnceComponent.alreadyRendered = {};
    }

    public static enable(): void {
        RenderHtmlOnceComponent.enabled = true;
    }

    public static disable(): void {
        RenderHtmlOnceComponent.enabled = false;
    }

    private renderFromString(): void {
        this.hostElement.nativeElement.innerHTML = this.htmlContent;
    }

    private renderFromCacheHit(cacheHit: Element): void {
        while (cacheHit.childNodes.length) {
            this.hostElement.nativeElement.appendChild(cacheHit.firstChild);
        }
    }
}
