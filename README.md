# angular-render-html-once

This library helps to keep HTML string rendered once, even if they originally were rendered server-side.

Whenever rendering would occur, and HTML string has already been rendered, resulting DOM elements will be re-used.

This is quite important when integrating angular app with external code maintained by some other library.

### Usage

#### bootstrap _(optional)_
Call no-argument static method `RenderHtmlOnceComponent.registerServerSideRenderedComponents()` wherever applicable (eg. in your application module's constructor) to have it scan for any server-side rendered components that could be already used.

**Important:** this needs to be done before any angular rendering occurs, since first thing angular does is clearing any existing content of root DOM element.

#### Component
- use `<angular-render-html-once>` component wherever you would normally use `[innerHtml]` directive
- inputs:
    - `id` **required** - plain old HTML `id` attribute; required to match components whenever they could be destroyed and created again (or created from scratch browser-side and match them with their server-side rendered counterparts)
    - `htmlContent` **required** - HTML content string you wish to have embedded within component
    
### Requirements
- angular ^8.0.0
