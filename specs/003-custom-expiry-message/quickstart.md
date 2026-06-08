# Quickstart Guide: Custom Expiry Message

This guide helps you test and run the Custom Expiry Message feature once implemented.

## Running the Development Server

1. Install dependencies (if not done already):
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser (usually `http://localhost:5173`).

## Configuring a Custom Expiry Message

1. On the home page builder, fill in the timer duration or target end time.
2. Scroll to the **Appearance** section card.
3. Locate the **Expiration Message** input field (below the Title field).
4. Enter a custom message, for example: `Take a coffee break!`
5. Notice that the generated Share Link updates in real-time to include the `expiry_message=Take+a+coffee+break%21` parameter.

## Testing the Custom Expiry Message

### Option A: Manual Testing
1. In the home page builder, set the timer duration to `0.1` minutes (6 seconds) or enter a custom expiry message and click **Start**.
2. Wait for the countdown to reach `00:00`.
3. Verify that the center display shows:
   - Your configured **Title** (at the top, if set).
   - Your custom expiry message `Take a coffee break!` below it, instead of the standard "Time is up!".

### Option B: URL Navigation
1. Directly navigate to a URL with `expiry_message` configured and a short timeout. E.g.:
   ```text
   http://localhost:5173/#/timer?minutes=0.05&expiry_message=Coffee+Time%21
   ```
2. Wait 3 seconds and verify that the layout displays `Coffee Time!` on expiration.

## Automated Verification

Run unit and component tests:
```bash
npm run test
```
This will verify query param parsing, UI updates, and completed screen rendering logic.
