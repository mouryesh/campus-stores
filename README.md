# Campus Stores

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

## My submission: would I keep this product?

**Yes.** Its record model is right: one approved request, one slip per physical unit. What breaks is the return step. Closing a slip takes one click on a list row, and the slip has no place to say who has the unit now. My change fixes that return step, plus two small guards it depends on. I added no new screens. The code changes are in `app.js` and `styles.css`.

**Try it in two minutes:**
1. Open the app, go to **Loan register**, and issue PR-04, SP-02 and AD-12 on RQ-214 to Kabir, due Fri 8 pm.
2. Choose **Move to return time**. Check in `PR-04` and `SP-02` by tag. On L-404, choose **Update holder** and record Leela Das, Sat 9 am.
3. Choose **Move to next morning**. Type `AD-15` (refused), then `AD-12`, and confirm.

### A moment it handles well: issuing Kabir's kit (Fri 3:45 pm)

I issued RQ-214 to Kabir, then tried to add the Sony camera (CA-03) to the same request. The slip refused it with *"This equipment type is outside the approved request."* The projector in the workshop, PR-06, was never offered. Three units went out as three slips (L-402 PR-04, L-403 SP-02, L-404 AD-12). At 7:30 pm that paid off: closing the projector and speaker slips left exactly one slip open, the adapter.

### A moment I'd change: the morning return (Sat 9 am)

At 7:30 pm Kabir said Leela had the adapter. The only place to record that was the Desk book, so the slip still said *"L-404 · AD-12 · RQ-214 · Kabir Sen · Due Fri 8 pm"*. At 9 am, coming in cold, the Loan register showed two open rows, `L-404 · AD-12` and `L-401 · MI-09`, with no item names. Nothing marked the adapter as 13 hours late, and nothing said Leela had it.

Every row had a one-click **Record return** with no question about which unit was on the counter. AD-12 (Belkin AVC002) and AD-15 (Anker A8312) are the same type in the same bin, C4, and the slip never shows the model.

The cost of a misclick is real. In testing, choosing **Record return** on Tara's row (L-401) by mistake marked her microphone *On shelf* while she still had it, and it could then be issued to someone else.

**Why this moment:** the brief's job is to *"leave the next shift enough information to finish the job."* This is exactly where the product fails that job. The evening worker knew where the adapter was, but the record didn't.

### My change: close the loan from the unit in hand, and let the slip say who has it

The per-row **Record return** button is gone. A return now starts from the tag on the unit:

- In the Loan register, type the tag from the unit and choose **Find slip**.
- The app shows the matching open slip with the unit's model, the borrower, who has it now, the due time and the home bin. Focus moves to **Confirm return**.
- A tag with no open slip, such as AD-15, a workshop unit such as PR-06, or an unknown tag is refused with a reason.

The slip carries the handover:

- When part of a kit has come back, the slips still open on that kit get an **Update holder** button. It records *Now with* and *Expected back*, and refuses a time that has already passed.
- Each row shows the item type, who has it now, and a badge: **Out**, **Late · expected Sat 9 am** or **Overdue**.

Two small guards make the badge trustworthy:

- **A slip can't be due later than its request.** The issue form used to accept *Sat noon* for a Fri 8 pm request, which would hide lateness. It now says *"This request must be back by Fri 8 pm."*
- **Saved data is checked on load.** Due times and holders from browser storage are validated, and every value shown on the new card is escaped.

### The same job with the change

- **Fri 3:45 pm:** issue PR-04, SP-02 and AD-12 to Kabir, due Fri 8 pm. *Sat noon* is now refused.
- **Fri 7:30 pm:**
  - Type `PR-04` and choose **Find slip**. The card reads *"PR-04 · HDMI projector · BenQ MH550 … Put it back in bin A2."* Choose **Confirm return**, then do the same for `SP-02`.
  - L-404 now shows **Update holder**. Record *Leela Das, Sat 9 am*. The row reads *"Now with Leela Das, expected Sat 9 am"*.
- **Sat 9 am:**
  - The register shows *"L-404 · AD-12 · USB-C → HDMI adapter … Now with Leela Das, expected Sat 9 am"* with the badge **Late · expected Sat 9 am**. Tara's microphone shows **Out**, due at 10 am.
  - Leela hands over an adapter. If it reads `AD-15`, the app refuses it: *"AD-15 (Anker A8312) is not on any open slip."*
  - `AD-12` shows *"AD-12 · USB-C → HDMI adapter · Belkin AVC002 … Now with Leela Das"*. **Confirm return** closes L-404, with the message *"AD-12 returned to stock in bin C4."*
  - Tara's slip is never touched.

**Trade-off:** a return is now type-then-confirm instead of one click, and it depends on units having readable tag labels.

### What I'd keep

One slip per physical unit, the approved-type and quantity checks, hiding units that are in repair or already on loan, and the Desk book for messages from clubs.

### What I'd watch at a real counter

For each return brought in by someone other than the borrower, I'd watch whether the staffer can close the right slip from the Loan register alone: tag read off the unit, no Desk book, no asking a colleague. If that happens in fewer than 4 of 5 such returns over two weeks, the change didn't help.

### Noticed, not changed

- Anyone on the people list can collect for any request. Isha's authorisation of Kabir exists only in the Desk book.
- A three-item kit still takes three separate slips.
- Two browser tabs open on the same shift overwrite each other's saved data.

I considered and left out a request-level kit status view and an automatic "who has the rest?" prompt. They are new features, not fixes.

The walkthrough above was checked by playing the shift end to end.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).


## Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.
