const emailText = (name) => {
  return `Welcome to the Pennsylvania Women Work mentoring program, ${name}. Let me know how you get along with the app.`;
};

const emailHtml = (name) => {
  return `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
        color: #333;
      "
    >
      <h2 style="color: #4a4a4a; font-size: 24px; margin-bottom: 20px">
        Welcome to the Pennsylvania Women Work mentoring program!
      </h2>
      <div style="margin-bottom: 20px">
        <img
          src="../assets/pww-logo.png"
          alt="PWW Logo"
          style="width: 100%; height: auto"
        />
      </div>
      <p style="line-height: 1.6; margin-bottom: 20px; font-size: 16px">
        A mentor from the Pennsylvania Women Work team has invited you to join
        the program. Please click the button below to activate your account and
        get started. If the button doesn't work, you can copy and paste the link
        below into your browser.
      </p>
      <a
        href="https://www.google.com"
        style="
          display: inline-block;
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
        "
      >
        Activate Account
      </a>
      <p style="margin-bottom: 20px">
        <a
          href="https://www.google.com"
          style="color: #0066cc; text-decoration: none"
          >https://www.google.com</a
        >
      </p>
      <footer
        style="
          border-top: 1px solid #ddd;
          padding-top: 20px;
          font-size: 14px;
          color: #666;
        "
      >
        <p>
          5607 Baum Boulevard, Suite 333 | Pittsburgh, PA 15206 | tel:
          412-742-4362 | fax: 412-904-4739
        </p>
      </footer>
    </div>
  `;
};

export { emailText, emailHtml };
