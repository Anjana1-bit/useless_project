const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;
let paymentWindow;
let canClose = false;
let altF4Triggered = false;

function paymentPage(altF4Attempt) {
  const notice = altF4Attempt
    ? '<p class="notice">(Alt + F4 — keep trying. Next time it may work.)</p>'
    : '';

  // Dummy QR code image — purely decorative, not a real payment QR.
  const qrSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330">
      <rect width="330" height="330" fill="white"/>

      <!-- Finder patterns -->
      <rect x="15" y="15" width="90" height="90" fill="#26384c"/>
      <rect x="30" y="30" width="60" height="60" fill="white"/>
      <rect x="45" y="45" width="30" height="30" fill="#26384c"/>

      <rect x="225" y="15" width="90" height="90" fill="#26384c"/>
      <rect x="240" y="30" width="60" height="60" fill="white"/>
      <rect x="255" y="45" width="30" height="30" fill="#26384c"/>

      <rect x="15" y="225" width="90" height="90" fill="#26384c"/>
      <rect x="30" y="240" width="60" height="60" fill="white"/>
      <rect x="45" y="255" width="30" height="30" fill="#26384c"/>

      <!-- Dummy QR data -->
      <g fill="#26384c">
        <rect x="120" y="15" width="15" height="15"/>
        <rect x="150" y="15" width="15" height="15"/>
        <rect x="180" y="15" width="15" height="15"/>
        <rect x="120" y="45" width="15" height="15"/>
        <rect x="150" y="60" width="15" height="15"/>
        <rect x="180" y="45" width="15" height="15"/>
        <rect x="210" y="60" width="15" height="15"/>

        <rect x="120" y="90" width="15" height="15"/>
        <rect x="150" y="90" width="15" height="15"/>
        <rect x="180" y="105" width="15" height="15"/>
        <rect x="210" y="105" width="15" height="15"/>

        <rect x="15" y="120" width="15" height="15"/>
        <rect x="45" y="120" width="15" height="15"/>
        <rect x="75" y="120" width="15" height="15"/>
        <rect x="105" y="120" width="15" height="15"/>
        <rect x="135" y="120" width="15" height="15"/>
        <rect x="165" y="135" width="15" height="15"/>
        <rect x="195" y="120" width="15" height="15"/>
        <rect x="225" y="135" width="15" height="15"/>
        <rect x="255" y="120" width="15" height="15"/>
        <rect x="300" y="120" width="15" height="15"/>

        <rect x="15" y="150" width="15" height="15"/>
        <rect x="60" y="150" width="15" height="15"/>
        <rect x="90" y="165" width="15" height="15"/>
        <rect x="120" y="150" width="15" height="15"/>
        <rect x="150" y="165" width="15" height="15"/>
        <rect x="180" y="150" width="15" height="15"/>
        <rect x="210" y="165" width="15" height="15"/>
        <rect x="240" y="150" width="15" height="15"/>
        <rect x="285" y="165" width="15" height="15"/>
        <rect x="315" y="150" width="15" height="15"/>

        <rect x="30" y="180" width="15" height="15"/>
        <rect x="75" y="180" width="15" height="15"/>
        <rect x="105" y="195" width="15" height="15"/>
        <rect x="135" y="180" width="15" height="15"/>
        <rect x="165" y="195" width="15" height="15"/>
        <rect x="195" y="180" width="15" height="15"/>
        <rect x="225" y="195" width="15" height="15"/>
        <rect x="255" y="180" width="15" height="15"/>
        <rect x="285" y="195" width="15" height="15"/>

        <rect x="120" y="225" width="15" height="15"/>
        <rect x="150" y="240" width="15" height="15"/>
        <rect x="180" y="225" width="15" height="15"/>
        <rect x="210" y="240" width="15" height="15"/>
        <rect x="240" y="225" width="15" height="15"/>
        <rect x="270" y="240" width="15" height="15"/>
        <rect x="300" y="225" width="15" height="15"/>

        <rect x="120" y="270" width="15" height="15"/>
        <rect x="150" y="285" width="15" height="15"/>
        <rect x="180" y="270" width="15" height="15"/>
        <rect x="210" y="285" width="15" height="15"/>
        <rect x="240" y="270" width="15" height="15"/>
        <rect x="270" y="300" width="15" height="15"/>
        <rect x="300" y="285" width="15" height="15"/>
      </g>
    </svg>
  `;

  const qrImage =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(qrSvg);

  return `data:text/html;charset=utf-8,${encodeURIComponent(`
    <!doctype html>
    <html>
      <head>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #f7faff;
            color: #26384c;
            font-family: Inter, system-ui, -apple-system, sans-serif;
          }

          main {
            width: 100%;
            padding: 34px 38px;
            text-align: center;
          }

          .mark {
            display: grid;
            place-items: center;
            width: 44px;
            height: 44px;
            margin: 0 auto 14px;
            border-radius: 13px;
            background: #fff2d6;
            color: #cb941b;
            font-size: 20px;
          }

          h1 {
            margin: 0;
            font-size: 21px;
            letter-spacing: -0.5px;
          }

          p {
            margin: 9px auto 0;
            color: #788ca1;
            font-size: 13px;
            line-height: 1.5;
            max-width: 275px;
          }

          .qr-image {
            display: block;
            width: 210px;
            height: 210px;
            margin: 25px auto 17px;
            padding: 10px;
            background: white;
            border: 1px solid #dfe8f0;
            box-shadow: 0 8px 22px rgba(43, 78, 115, 0.09);
          }

          .amount {
            margin: 0;
            color: #347de8;
            font-size: 27px;
            font-weight: 750;
            letter-spacing: -1px;
          }

          .fake {
            margin-top: 5px;
            font-size: 10px;
            letter-spacing: 0.9px;
            font-weight: 700;
            color: #9aabba;
          }

          .notice {
            margin-top: 19px;
            padding: 9px 12px;
            border-radius: 9px;
            background: #fff4df;
            color: #a97919;
            font-size: 11px;
          }
        </style>
      </head>

      <body>
        <main>
          <div class="mark">⌁</div>

          <h1>Payment required to close.</h1>

          <p>
            Please complete the payment below to close this application.
          </p>

          <img
            class="qr-image"
            src="${qrImage}"
            alt="Payment QR code"
          />

          <p class="amount">$50.00</p>

          <p class="fake">
           YOU'RE BEING ATTACKED.ACT PROMPTLY
          </p>

          ${notice}
        </main>
      </body>
    </html>
  `)}`;
}

function showPaymentWindow(altF4Attempt = false) {
  if (paymentWindow && !paymentWindow.isDestroyed()) {
    paymentWindow.loadURL(paymentPage(altF4Attempt));
    paymentWindow.focus();
    return;
  }

  paymentWindow = new BrowserWindow({
    width: 390,
    height: altF4Attempt ? 455 : 420,
    resizable: false,
    minimizable: false,
    maximizable: false,
    parent: mainWindow,
    modal: true,
    title: 'Payment required',
    backgroundColor: '#f7faff',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  paymentWindow.on('closed', () => {
    paymentWindow = undefined;
  });

  paymentWindow.loadURL(paymentPage(altF4Attempt));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 760,
    minHeight: 540,
    backgroundColor: '#f8fbfe',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devUrl =
    process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

  mainWindow.on('close', (event) => {
    if (!canClose) {
      event.preventDefault();
      showPaymentWindow(altF4Triggered);
      altF4Triggered = false;
    }
  });

  mainWindow.webContents.on('before-input-event', (_event, input) => {
    if (
      input.type === 'keyDown' &&
      input.key === 'F4' &&
      input.alt
    ) {
      altF4Triggered = true;
    }
  });

  mainWindow.loadURL(devUrl);
}

app.whenReady().then(() => {
  globalShortcut.register(
    'CommandOrControl+Shift+Alt+G',
    () => {
      canClose = true;

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.close();
      }
    }
  );

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});