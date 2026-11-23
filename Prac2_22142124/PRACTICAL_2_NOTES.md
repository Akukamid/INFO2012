# Practical 2 (Week 3): CSS Styling

This practical extends the Practical 1 files supplied earlier in this chat. It does not include any changes you may have made only on your own computer. Compare the profile and other content with your local version before submitting. Demo skill values and contact information remain labelled placeholders.

## Install and open

1. Extract the ZIP.
2. Copy only its `week03` folder into the root of your existing `portfolio-partA` repository. The result should be `portfolio-partA/week03/page1.html`, with `style.css` and the other pages in that same folder.
3. Open `week03/page1.html` in Firefox. All four pages now load `style.css`.
4. Open the files in VS Code. Save edits with Ctrl+S and refresh Firefox with Ctrl+R.
5. If you are looking at your old `week02/page1.html`, it will still have its previous appearance. Open the new Week 3 file to see the CSS.

The Inter font is requested from Google Fonts as required by the task sheet. An internet connection and access to Google Fonts are required to load it. The sans-serif fallback is used if it cannot load.

## What changed in the HTML?

Every page adds `<link rel="stylesheet" href="style.css">` inside its head. The browser resolves that relative path beside the HTML file. A shared stylesheet lets one rule affect all four documents.

Each header now includes a logo so the required `header img` rule has an actual image to style. The original content images remain.

The registration form groups each label/control pair in a `div` with `class="form-row"`. Helper text has `class="hint"`. Radio buttons and checkboxes stay compact instead of inheriting the full width intended for text inputs. These changes preserve the existing fields and HTML validation.

Page 3's table has a scrollable wrapper so a wide data table can scroll inside the page on a small screen. The code example also scrolls horizontally when needed.

## Task 1: Reset and typography

A CSS rule has a selector followed by property/value declarations:

```css
body {
  color: #333333;
}
```

`body` is the selector. `color` is the property. `#333333` is the value. Braces enclose the declarations and semicolons separate them.

The first line imports Inter with weights 400, 600 and 700. Put `@import` before ordinary style rules.

The universal selector `*` resets margin and padding to zero and applies `box-sizing: border-box`. With border-box, a declared width includes padding and border. Margin remains outside the box.

The body sets Inter, a sans-serif fallback, line-height 1.6, dark grey text and a light grey background. Descendants inherit the font and many text properties unless another rule overrides them.

| Value | Meaning |
|---|---|
| `2rem` | Twice the root element's font size |
| `1.25rem` | 1.25 times the root font size |
| `700` | Bold font weight |
| `600` | Semibold font weight |
| `padding: 2rem 1rem` | 2rem top/bottom and 1rem left/right |
| `1px solid #cccccc` | Border width, style and colour |

Exercise: change the body's line-height from 1.6 to 1.0, observe readability, then restore it.

## Task 2: Page structure

`header` uses `display: flex` to arrange its immediate children in a row. `align-items: center` aligns them along the cross axis, and `gap: 2rem` adds spacing between them. Flex wrapping prevents a wide header from forcing the whole page wider.

`header img` is a descendant selector: it selects images inside headers, not the profile image in main content. The logo's CSS height is 48px and width is automatic.

Main content has a maximum width of 860px. In `margin: 2rem auto 0`, the three values mean top, left/right and bottom. Automatic horizontal margins centre a block when there is spare width. Horizontal padding keeps its content away from the edges.

The aside rule applies on Page 3 because Page 3 contains an aside. It has no matching element on Page 2. A shared stylesheet can contain rules that do not match every document.

Exercise: temporarily add `justify-content: space-between` to the header. Explain how it differs from `align-items`.

## Task 3: Navigation and interaction

The existing navigation is a `nav` containing a `ul` containing `li` elements. Its links are not immediate children of `nav`. Both `nav` and its `ul` receive Flexbox rules so the list itself lays out horizontally.

`nav a` selects only navigation links. Other hyperlinks retain the normal burgundy link colour. `:hover` applies while the pointer is over a link. `:focus-visible` supplies a visible keyboard focus outline. Do not remove focus indicators without a useful replacement.

### Why the divider selector differs from the wording in the sheet

Every anchor is the only child of its own list item. Therefore `nav a:not(:last-child)` would match none of these anchors: each anchor is already its parent's last child. The working selector is:

```css
nav li:not(:last-child) > a {
  border-right: 1px solid rgba(255, 255, 255, 0.25);
}
```

It selects anchors belonging to every navigation item except the final item. `>` means an immediate child. `:not(...)` excludes a matching case. `rgba` specifies a colour with transparency; 0.25 is 25% opacity.

Exercise: hover over each navigation link, then use Tab to move through them. Explain the difference between hover and focus.

## Task 4: Form styling

The form itself is a vertical Flexbox container with a 1.5rem gap between its sections. Each fieldset is another vertical flex container with a 0.75rem gap. Each `.form-row` uses Grid for its label/control pair.

```css
.form-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 0.75rem;
  align-items: center;
}
```

The label column receives one share of the available width and the control column receives two. The gap is accounted for separately. `minmax(0, ...)` allows tracks to shrink rather than enforcing a large content-based minimum width.

The sheet asks for both Flexbox and Grid inside the form. They are applied at different levels: form and fieldsets manage vertical groups; row wrappers align labels and controls. One element cannot simultaneously use `display: flex` and `display: grid`; the winning declaration would replace the other.

The `.hint` class spans all columns using `grid-column: 1 / -1`, where -1 means the final grid line. This puts helper text below the entire label/control pair instead of shifting later items into the wrong column.

Submit and reset buttons are grid items in `.form-actions`. They occupy column 2 on a wide layout. Input, select and textarea typography inherits from the body. Radios and checkboxes override full-width sizing so their labels remain usable.

### Validation feedback

Text-like inputs have placeholders, including a single space when a visible example is unnecessary. The visible labels remain the primary way to identify fields.

```css
input[placeholder]:not(:placeholder-shown):invalid {
  border-color: #dc3545;
}
```

This selects an input with a placeholder that is not currently displaying the placeholder and fails its HTML validity constraints. A matching valid field gets a green border instead. Empty required text fields therefore begin with the neutral border.

This is a CSS approximation of 'once typing has started', not a record of user interaction. Clearing a field restores its placeholder and neutral style; autofilled or prefilled values can receive feedback immediately. It does not apply the same behaviour to dates, selects, radios or checkboxes. CSS changes visual feedback; the HTML `required`, `pattern`, type and length attributes still control native validation.

Exercise: enter a malformed email and then a valid one. Test a nine-digit phone number and then ten digits. Check both the border and the browser's submission feedback using fictional data.

The inherited form action is the external httpbin.org test endpoint. Only submit fictional details and a made-up password; a test submission does not create an account. No form data was submitted by the assistant.

## Task 5: Responsive layout

The final media query uses `@media (max-width: 600px)`. It includes exactly 600px and applies to narrower viewport widths too.

Inside it, the header and navigation become columns. The header's cross-axis alignment changes to the start. Main content has 1rem horizontal padding. The form rows collapse to one column and buttons move to column 1 and fill the available width. Form/fieldset padding is also reduced so controls fit comfortably at 320px.

The stylesheet places supporting readability rules before the final media query so they do not accidentally override the small-screen layout afterwards.

Manual checks:

1. Open each page at a wide viewport.
2. Open Firefox's responsive design view with Ctrl+Shift+M.
3. Check Pages 2, 3 and 4 at 320px.
4. Compare 600px and 601px: header/navigation and form rows should change at the boundary.
5. Verify the document does not scroll sideways because of the header or form. The code example and table may scroll inside their own containers.
6. Tab through links and form controls and verify focus is visible.

## Changes beyond the five main tasks

The reset also removes default list indentation and spacing. Supporting rules restore readable lists, glossary entries, quotations, details panels and tables. The original semantic content remains the foundation. These are small supporting styles, not a replacement layout framework. The optional custom-properties exercise has not been added, so the required colour values remain easy to find directly in the CSS.

## Validation and Git

Run `style.css` through the W3C CSS validator: https://jigsaw.w3.org/css-validator/. HTML also changed, so check the complete page sources with https://validator.w3.org/. Static checks are recorded in `VERIFICATION.md` and do not replace browser testing or these validators.

Work in your existing repository. After copying only `week03` to its root and reviewing the files:

```bash
git status
git add week03
git diff --cached --stat
git commit -m "Add Week 3 CSS styling and responsive pages"
git push
```

These commands assume the root of the existing `portfolio-partA` repository is the current directory. If `git status` or push reports an error, read that output before continuing.

The sheet asks for commits after each exercise. To learn incrementally, keep the completed CSS as a reference, then add the Task 1 to Task 5 sections to your own working stylesheet as you genuinely work through them, testing and committing each actual change. Do not create a fictional history after the fact. Supporting rules can be added with the task they help or in a final cleanup commit.

If you have not resolved the earlier rejected push, finish that synchronisation before trying to push this practical. No remote Git repository has been modified by the assistant.

## Notes to write in your own words

- A selector chooses elements; declarations style them.
- Inheritance passes some properties from ancestors to descendants.
- The box model consists of content, padding, border and margin.
- Flexbox lays out items along a main axis; Grid defines tracks in rows and columns.
- A class can be reused on many elements; an ID should be unique within its document.
- Pseudo-classes select states such as hover, focus or validity.
- A media query conditionally applies CSS based on viewport characteristics.
- Client-side validation improves feedback but does not replace server-side validation.

Update your AI acknowledgement to reflect the CSS and notes assistance you actually used, following the subject outline and Ultra guidance.
