# Practical 3 (Week 4): JavaScript and the DOM

## Start here

Extract the ZIP and copy `week04` into the root of your existing `portfolio-partA` repository. Open `week04/ex4.html` in Firefox to test the form. Open `week04/js/form.js` in VS Code beside this guide. It works directly from a local file; there is no npm installation or build command.

The practical sheet calls the pages `ex1.html` through `ex4.html`, whereas the earlier sheets used `page1.html` through `page4.html`. This package follows the new naming and updates the navigation links. Open `ex1.html` if you want to start at the welcome page.

The files build on the Practical 2 package supplied in this chat. They do not include edits made only on your own computer; compare and carry across your personal content changes.

## An inconsistency in the supplied tasks

Practical 3 assumes subject checkboxes, credit points, degree, year, skills, confirm-password and Notes already exist. The earlier HTML specification did not request them. This package adds these prerequisites in Week 4 while keeping the earlier fields. No earlier practical files are overwritten.

There are five example subjects, each with `data-cost="1192"` and `data-cp="10"`. These numbers are demonstration data, not official university fees or enrolment advice. Replace them with starter-repository values if your teacher provides different values or required selectors. The package implements the supplied PDF requirements, but hidden classroom tests may expect identifiers from starter files not supplied here.

## 1. Selecting the DOM

The browser turns HTML into a document tree. JavaScript can select its elements and change their properties.

| Method | Result | Example in this practical |
|---|---|---|
| `getElementById('notes')` | One element with that ID, or null | Select the Notes textarea. |
| `querySelector('#registration-form')` | First match, or null | Select the form. |
| `querySelectorAll('input[name="subjects"]')` | A NodeList of matching elements | Select all subject checkboxes. |

IDs are unique within one document. A group can share a name, which makes it easy to select related controls. The script is linked just before the closing body tag, after those controls exist. There are no inline script blocks or event-handler attributes.

`const` prevents reassignment of a variable binding. It does not stop a referenced element's properties from changing. For example, `password.type = 'text'` is allowed even though `password` was declared with const.

## 2. Task 1: enrolment fee calculator

Every subject checkbox has a `change` listener. That listener runs `updateFees()`, which calls `getSubjectTotals()`.

The calculator starts its counters at zero, loops through every checkbox, checks `.checked`, and sums only selected items. Recalculating from the selections avoids accumulating the same fee repeatedly.

HTML data attributes are exposed through `.dataset`: `data-cost` becomes `.dataset.cost`. Dataset values are strings. `Number(subject.dataset.cost)` converts the value to a number before addition. Without conversion, `'1192' + '1192'` produces `'11921192'`.

`formatAUD()` calls `toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })`. It formats numeric values with Australian dollar currency conventions. Formatting is for display; arithmetic still uses numbers.

The three required outputs use IDs `subject-count`, `credit-points` and `enrolment-fee`. Updating `.textContent` changes their displayed text.

Try: select one, two and all five subjects, then untick one. Expected totals for the supplied examples are $1,192, $2,384 and $5,960, with 10, 20 and 50 credit points respectively.

## 3. Task 2: show/hide password

The checkbox listens for `change`. A ternary expression chooses a type:

```js
const type = showPassword.checked ? 'text' : 'password';
```

If checked, both password controls show their text; otherwise both mask it. This includes the optional enhancement for the confirmation field.

Masking is a display feature. The password value remains readable from the input through browser tools. No encryption or password hashing happens here.

Try: enter a made-up password, show it, hide it, then clear the form. It should return to masked mode.

## 4. Task 3: password confirmation

`checkPasswordMatch()` compares the two `.value` strings. A mismatch sets the exact custom message `Passwords do not match`. A match calls `setCustomValidity('')` to clear that custom error. Other constraints, including required and minlength, still apply.

Both fields listen for `input`, so editing the original password after confirmation rechecks the match. The submit handler also rechecks it before validating the entire form.

A custom error remains until it is cleared; simply editing an input does not automatically clear a message you set yourself.

Try: enter matching passwords, change only the original, and submit. The mismatch must be caught. Then fix it and submit again.

## 5. Task 4: Notes counter

The textarea listens for `input`, which covers normal typing and paste edits. Its value length updates the counter as `12 / 50`.

The counter is grey (`#666666`) below 50 and red (`#dc3545`) at 50 or above. There is deliberately no maxlength on this new Notes field: the task asks for feedback at the suggested limit and describes HTML enforcement as an exploration to revert before submission. The old optional bio retains its own separate 500-character limit.

JavaScript string length counts UTF-16 code units. Some emoji can count as more than one, so this simple exercise is not a full human-perceived character counter.

Try 49, 50 and 75 ordinary letters. The counter should show the corresponding lengths, with red text for the last two cases.

## 6. Task 5: validation and local summary

The form has `novalidate`, allowing the submit event to reach the script without the browser's automatic submission validation intercepting it first. This does not remove the validity rules: the script calls `checkValidity()` and `reportValidity()` itself.

The handler does the following:

1. Calls `event.preventDefault()` to cancel the form's default navigation.
2. Removes a previous summary, if present.
3. Rechecks the password match.
4. Calls `checkValidity()`. If invalid, it calls `reportValidity()` and returns early.
5. Collects the full name, email, visible degree option, selected year, selected skills and a password mask.
6. Uses `createElement()`, `textContent` and `appendChild()` to build a section with a definition list.
7. Inserts the panel below the form, includes subject totals as an optional enhancement, and focuses the panel.

### Why preventDefault is at the beginning

The PDF's sample returns early for invalid input before cancelling default submission. With novalidate, that return alone does not stop the form posting. This implementation cancels the default action first so both invalid and valid submissions stay local. No fetch request is needed for this practical.

### Why textContent matters

User entries are inserted as text rather than parsed HTML. If someone enters `<img src=x>` as a name, the summary displays those characters instead of creating an image element. Avoid using innerHTML to insert user-controlled strings.

### Password masking

`'*'.repeat(password.value.length)` produces one asterisk per JavaScript string-length unit. The actual password is never copied into the summary, an attribute, local storage or a log. It remains in the original input, where browser tools can still read it; summary masking does not remove or secure that original value.

### Repeated submissions and stale data

A second valid submission replaces the previous panel. Input or selection changes remove an old preview so it cannot be mistaken for current data. An invalid attempt also removes an earlier valid preview.

The summary is a review panel, not confirmation that an account was created or that you enrolled in a university subject.

## 7. Reset and unavailable JavaScript

The form reset event occurs before native controls finish resetting. `queueMicrotask()` schedules the derived display updates afterwards. The code clears the custom mismatch error, hides passwords, zeros subject totals and resets the Notes counter.

The submit button starts disabled in HTML and the script enables it after initialisation. If the script is unavailable, the inherited external test action cannot be triggered by the disabled submit control through the normal UI. A noscript notice explains this. With the supplied script running, submissions are intercepted locally. Always use fictional information for this coursework demo.

A real account service would need server-side validation, secure authentication and appropriate data handling. The client-side behaviours in this exercise can be changed or bypassed by the user.

## 8. Manual test checklist

- Open each of ex1.html through ex4.html and follow every navigation link.
- Tick and untick subjects. Totals should update immediately.
- Tick all five: count 5, points 50, fee $5,960.00.
- Test both password visibility states.
- Mismatch passwords, then correct them. Edit the original and recheck.
- Type and paste into Notes; check 49, 50 and more than 50 characters.
- Submit an empty form. It must stay on the page with a validation message and no summary.
- Fill every required field, including degree, year, original role and terms, with fictional details. Submit and check the panel.
- Confirm its password entry is only asterisks. Inspect the summary separately from the original inputs.
- Submit again and confirm there is just one panel. Edit a field and confirm the preview disappears.
- Reset and confirm selections, totals, counter, visibility and custom errors return to their initial states.
- Open Firefox DevTools Console (F12) and check for errors. Check at 320px as well as a wide viewport.

The included verification describes automated checks and their limits. Browser UI testing and W3C HTML/CSS validation remain required before submission.

## 9. Git commands and study workflow

From the existing `portfolio-partA` repository root, after copying in week04 and reviewing the files:

```bash
git status
git add week04
git diff --cached --stat
git commit -m "Add Week 4 JavaScript form interactions"
git push
```

As you learn each task, make genuine edits, test them and commit those actual changes. The task sheet asks for commits after each task. Do not manufacture a past development history. Resolve any outstanding Git sync errors before pushing. The assistant has not changed or submitted your remote repository.

Update your AI acknowledgement to cover the generated implementation and notes you actually used. Review the code and make sure you can explain it in your own words, following the outline and Ultra instructions.

## Short notes to copy into your notebook

| Concept | Meaning |
|---|---|
| DOM | Browser representation of document elements. |
| Event listener | Function registered to respond to a particular event. |
| change | Useful for a checkbox's changed selection. |
| input | Useful for immediate typing and paste feedback. |
| dataset | Access to custom HTML data attributes as strings. |
| Number() | Converts a value before numeric arithmetic. |
| setCustomValidity() | Adds or clears a custom constraint error. |
| checkValidity() | Checks the form's constraints and returns a Boolean. |
| reportValidity() | Checks constraints and asks the browser to display validation feedback. |
| preventDefault() | Cancels an event's default action, such as form navigation. |
| textContent | Inserts text without parsing it as HTML. |
| Early return | Stops the current handler before later processing. |

Source: supplied `Practical03_JavaScript_DOM.pdf`. The file naming, initial form prerequisites and invalid-submit cancellation adaptations are explained above.
