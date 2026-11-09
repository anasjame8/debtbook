# Debt Book on GitHub Pages + Firebase

Free setup. The page is hosted on GitHub; customers and entries are saved in a free Firebase database, so every employee's phone shows the same book. Everyone logs in with an email and password you create for them.

Files in this folder: `index.html` (the app), `cloud.js` (login + database link), `firebase-config.js` (you edit this), `firestore.rules` (database security), `.nojekyll`.

## Part 1. Firebase (database + logins) — about 10 minutes
1. Go to console.firebase.google.com, sign in with a Google account, click **Create a project**. Name it (e.g. shop-debts). Turn Google Analytics off. Create.
2. Left menu **Build → Firestore Database → Create database**. Pick the location closest to you (Europe or Middle East). Choose **Production mode**. Enable.
3. In Firestore open the **Rules** tab. Delete what is there, paste everything from `firestore.rules`, click **Publish**.
4. Left menu **Build → Authentication → Get started**. Under **Sign-in method** enable **Email/Password** (only the first switch) and Save.
5. In Authentication open **Settings → User actions** and **untick "Enable create (sign-up)"**, then Save. This stops strangers from creating their own accounts. Do not skip this.
6. In Authentication open the **Users** tab, click **Add user**, and create one account per person: an email and a password. The email can be made up (for example `sara@myshop.com`); it does not need to exist. Give each employee their own email and password.
7. Click the gear icon (top left) → **Project settings**. Under **Your apps** click the web icon **</>**, give it a name, Register. Copy the `firebaseConfig` values it shows.
8. Open `firebase-config.js` and replace each `PASTE_...` value with the matching value from step 7. Save.

## Part 2. GitHub (the web address) — about 5 minutes
1. At github.com create a free account, then **New repository**. Name it (e.g. `debtbook`). Choose **Public** (free GitHub Pages needs this; no customer data is stored in GitHub, only the app).
2. Click **uploading an existing file** and upload **all files in this folder** (including `.nojekyll` and your edited `firebase-config.js`). Commit.
3. Open **Settings → Pages**. Under Source choose **Deploy from a branch**, branch **main**, folder **/ (root)**, Save.
4. After a minute your address appears: `https://YOUR-USERNAME.github.io/debtbook/`.
5. Back in Firebase: **Authentication → Settings → Authorized domains → Add domain** and add `YOUR-USERNAME.github.io`.

## Part 3. On the phones
Open the address in Chrome, log in with the employee's email and password, then ⋮ → **Add to Home screen**. The login is remembered on that phone.

Inside the app: Menu → Staff, create a **Cashier** account for each employee (and an **Admin** for yourself). Cashiers cannot go over a customer's credit limit; only an Admin can.

## Notes
- Data is in Firebase, not in GitHub. Use Menu → Download backup now and then; the app shows the backup as text to copy and keep.
- If someone leaves, delete their account in Firebase → Authentication → Users and change the others' passwords as needed.
- Free plans have daily limits that a single shop is very unlikely to reach. Check Firebase's current pricing page.
- The Firebase `apiKey` inside `firebase-config.js` is public by design. Your data is protected by the rules in step 3 and by the logins, so keep sign-up disabled (step 5).
- If the page says **Setup needed**, `firebase-config.js` still contains `PASTE_...`. If it says **No connection**, the phone is offline.
