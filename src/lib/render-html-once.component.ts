import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'render-html-once',
  template: ''
})
export class RenderHtmlOnceComponent implements OnInit {
    private static alreadyRendered: Record<string, Element> = {};
    private static enabled: boolean = true;

    @Input() public id: string;
    @Input() public htmlContent: string;

    public constructor(private hostElement: ElementRef<Element>) {}

    public ngOnInit(): void {
        if (!RenderHtmlOnceComponent.enabled) {
            return;
        }
        const cacheHit = RenderHtmlOnceComponent.alreadyRendered[this.id];
        if (cacheHit) {
            while (cacheHit.childNodes.length) {
                this.hostElement.nativeElement.appendChild(cacheHit.firstChild);
            }
        } else {
            this.hostElement.nativeElement.innerHTML = this.htmlContent;
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
}
