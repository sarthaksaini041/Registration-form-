# 🛡️ Premium Cyber Security Workshop Registration

A high-fidelity, professional registration platform for the **Cyber Security Fundamentals Workshop**. This project features a high-tech "Cyber" dark-mode aesthetic with glassmorphism, unified action buttons, and a robust Google Sheets backend for seamless data management and payment verification.

## 🚀 Live Demo
[Setup GitHub Pages to see Your Link Here]

## ✨ Features
- **Premium Cyber Aesthetic**: Deep-sea dark mode, glassmorphic surfaces, and technical SVG icons.
- **Compact & Efficient**: Optimized layout hierarchy to keep all essential information accessible.
- **Unified Button System**: Consistent interactivity and design across all primary actions (Payment, Submit, Social).
- **Inter Typography**: Sharp, professional legibility using optimized Inter font settings.
- **Automated Backend**: Logs all registrations and payment proofs directly to Google Sheets and Google Drive.
- **Mobile Responsive**: Perfectly optimized for all screen sizes with a "compact-first" approach.

---

## 🛠️ Setup Instructions

### 1. Backend Setup (Google Apps Script)
1. Create a new **Google Sheet**.
2. Format columns as: `Timestamp | Name | Email | Phone | University | Year | Course | Transaction ID | Image URL`.
3. Go to `Extensions` > `Apps Script`.
4. Copy the content of `google_apps_script.js` from this project and paste it into the script editor.
5. Click **Deploy** > **New Deployment**.
6. Select **Web App**.
7. Set **Execute as** to `Me` and **Who has access** to `Anyone`.
8. Copy the **Web App URL** provided after deployment.

### 2. Frontend Configuration (Secure Setup)
1. In the project root, duplicate `config.example.js` and rename it to **`config.js`**.
2. Open `config.js` and fill in your private details:
   - `GOOGLE_SCRIPT_URL`: Paste your Web App URL here.
   - `UPI_ID`, `CONTACT_NAME`, `CONTACT_PHONE`, etc.
3. This `config.js` file is already listed in `.gitignore` and will never be pushed to GitHub.

### 3. Deploy to GitHub Pages
1. Push this code to a new GitHub Repository.
2. Go to **Settings** > **Pages**.
3. Select the `main` branch and the `/(root)` folder.
4. Click **Save**. 

> [!IMPORTANT]
> Since `config.js` is not on GitHub, the live site on GitHub Pages will only show placeholders unless you use advanced methods like GitHub Actions. For most workshop organisers, keeping it local or using a public-safe URL is common.

---

## 📂 Project Structure
- `index.html`: Core landing page and technical form structure.
- `style.css`: Premium dark-mode styling with glassmorphism.
- `script.js`: Form handling, UPI copy logic, and API integration.
- `google_apps_script.js`: Backend logic for Google Drive/Sheets.
- `portal_logo.svg`: Portal branding logo.
- `payment_qr.png`: UPI Payment QR code.
- `hero_illustration.png`: Banner illustration for the workshop.

---

## 📝 License
MIT License - Feel free to use and modify!

Created with ❤️ by **Code Catalysts**.
