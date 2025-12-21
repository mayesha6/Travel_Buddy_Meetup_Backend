export const invoiceTemplate = `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
  <h2>Thank you for your payment!</h2>

  <p>Hi <%= userName %>,</p>

  <p>Your payment was successfully completed.</p>

  <p><strong>Transaction ID:</strong> <%= transactionId %></p>
  <p><strong>Total Amount:</strong> BDT <%= totalAmount %></p>
  <p><strong>Payment Date:</strong> <%= paymentDate %></p>
  <p><strong>Service:</strong> <%= tourTitle %></p>

  <p>Your PDF invoice is attached.</p>

  <br />
  <p>Regards,<br /><strong>Travel Buddy & Meetup</strong></p>
</body>
</html>`;

export const forgotPasswordTemplate = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
  <h2>Password Reset Request</h2>

  <p>Hi <%= name %>,</p>

  <p>You requested to reset your password.</p>

  <p>
    Click the button below to reset your password.
    This link will expire in <strong>10 minutes</strong>.
  </p>

  <a href="<%= resetUILink %>"
     style="display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;">
    Reset Password
  </a>

  <p style="margin-top:20px;font-size:12px;color:#555;">
    If you did not request this, please ignore this email.
  </p>

  <br />
  <p>Regards,<br /><strong>Travel Buddy & Meetup</strong></p>
</body>
</html>
`;

export const templates: Record<string, string> = {
  invoice: invoiceTemplate,
  forgetPassword: forgotPasswordTemplate,
};
