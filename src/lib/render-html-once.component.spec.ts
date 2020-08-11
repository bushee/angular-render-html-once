import {RenderHtmlOnceComponent} from './render-html-once.component';

describe('RenderHtmlOnceComponent', () => {
    let hostElement: Element;
    let component: RenderHtmlOnceComponent;

    beforeEach(() => {
        RenderHtmlOnceComponent.clearCache();
        hostElement = document.createElement('div');
        component = new RenderHtmlOnceComponent({nativeElement: hostElement});
        component.id = 'component-id'
    });

    describe('ngOnInit()', () => {
        it('should render passed html if it has not been rendered yet', () => {
            // given
            component.htmlContent =
                '<div>hello world!</div>'
                + '<span>another element</span>'
                + 'some plain text here';
            const expectedDivElement = document.createElement('div');
            expectedDivElement.innerText = 'hello world!';
            const expectedSpanElement = document.createElement('span');
            expectedSpanElement.innerText = 'another element';
            const expectedTextNode = document.createTextNode('some plain text here');

            // when
            component.ngOnInit();

            // then
            expect(hostElement.childNodes.length).toBe(3);
            expect(hostElement.childNodes[0]).toEqual(expectedDivElement);
            expect(hostElement.childNodes[1]).toEqual(expectedSpanElement);
            expect(hostElement.childNodes[2]).toEqual(expectedTextNode);
        });

        it('should use previously rendered html if component is recreated', () => {
            // given
            component.htmlContent = '<div>original div element</div>';
            component.ngOnInit();
            const originalDivElement = hostElement.childNodes[0];

            // and
            const newHostElement = document.createElement('div');
            const newComponent = new RenderHtmlOnceComponent({nativeElement: newHostElement});
            newComponent.id = component.id;

            // when
            newComponent.ngOnInit();

            // then
            expect(hostElement.childNodes.length).toBe(0);
            expect(newHostElement.childNodes.length).toBe(1);
            expect(newHostElement.childNodes[0]).toBe(originalDivElement);
        });

        it('should use server-side rendered html if available', () => {
            // given
            const originalDivElement = document.createElement('div');
            originalDivElement.textContent = 'original div element';
            const serverSideRenderedComponent = document.createElement('render-html-once');
            serverSideRenderedComponent.appendChild(originalDivElement);
            serverSideRenderedComponent.id = component.id;
            document.body.appendChild(serverSideRenderedComponent);
            RenderHtmlOnceComponent.registerServerSideRenderedComponents();

            // and
            component.htmlContent = '<span><b>totally modified content</b></span>';

            // when
            component.ngOnInit();

            // then
            expect(hostElement.childNodes.length).toBe(1);
            expect(hostElement.childNodes[0]).toBe(originalDivElement);
        });
    });
});
