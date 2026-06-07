# Quickstart: Copy Timer Link

This guide outlines how to build, run, and test the Copy Timer Link feature.

## Development Setup

1. **Install Dependencies**:
   Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. **Run the Development Server**:
   Start the local dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Testing the Feature Manually

1. Open the local development URL.
2. In the "Builder" view, configure a valid timer by inputting minutes or choosing a timestamp.
3. Locate the **Shareable URL** field at the bottom right.
4. Verify that the previous "Copy" text button is replaced by a modern clipboard icon.
5. Click the copy icon button.
6. Verify:
   - The icon changes from a copy icon to a green checkmark icon.
   - The tooltip transitions from "Copy link to clipboard" to "Copied!".
   - A Snackbar notification appears stating "URL copied to clipboard".
   - After 1.5 seconds, the icon reverts back to the copy icon.
   - The URL is successfully saved in your system clipboard (test by pasting it).

## Running Automated Tests

1. Run unit and integration tests using Vitest:
   ```bash
   npm run test
   ```

2. Run test coverage:
   ```bash
   npm run test:cov
   ```
