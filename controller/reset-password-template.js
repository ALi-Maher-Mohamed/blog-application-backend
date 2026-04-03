function getResetPasswordEmailHTML(link, userName = "there") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Password</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f8; padding: 40px 0;">
    <tr>
      <td align="center">

        <table width="560" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#ffffff; border-radius:16px; overflow:hidden;
                 box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width:560px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #7b1a1a 100%);
                        padding: 48px 40px 40px; text-align:center;">
              <div style="display:inline-block; background:rgba(255,255,255,0.1);
                          border-radius:50%; width:64px; height:64px; line-height:64px;
                          font-size:28px; margin-bottom:20px;">
                🔐
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:26px;
                          font-weight:700; letter-spacing:-0.5px;">
                Reset Your Password
              </h1>
              <p style="margin:10px 0 0; color:rgba(255,255,255,0.65); font-size:14px;">
                We received a request to reset your password
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 48px 32px;">
              <p style="margin:0 0 8px; color:#64748b; font-size:14px; font-weight:600;
                          text-transform:uppercase; letter-spacing:1px;">
                Hello, ${userName} 👋
              </p>
              <p style="margin:0 0 24px; color:#1e293b; font-size:16px; line-height:1.7;">
                We received a request to reset the password for your account.
                Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${link}"
                      style="display:inline-block; background: linear-gradient(135deg, #7b1a1a, #a83232);
                              color:#ffffff; text-decoration:none; font-size:16px;
                              font-weight:700; padding:16px 48px; border-radius:50px;
                              letter-spacing:0.3px; box-shadow: 0 4px 15px rgba(168,50,50,0.4);">
                      🔑 &nbsp; Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none; border-top:1px solid #e2e8f0; margin: 0 0 24px;" />

              <!-- Fallback -->
              <p style="margin:0 0 6px; color:#94a3b8; font-size:13px;">
                Button not working? Copy and paste this link into your browser:
              </p>
              <p style="margin:0; word-break:break-all;">
                <a href="${link}"
                  style="color:#7b1a1a; font-size:13px; text-decoration:underline;">
                  ${link}
                </a>
              </p>
            </td>
          </tr>

          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#fff7ed; border-left:4px solid #f97316;
                              border-radius:8px; padding:16px;">
                    <p style="margin:0; color:#92400e; font-size:13px; line-height:1.6;">
                      ⚠️ &nbsp;<strong>This link expires in 1 hour.</strong>
                      If you didn't request a password reset, please ignore this email —
                      your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:24px 48px;
                        border-top:1px solid #e2e8f0; border-radius:0 0 16px 16px;">
              <p style="margin:0; color:#94a3b8; font-size:12px;
                          text-align:center; line-height:1.7;">
                This email was sent by <strong style="color:#64748b;">YourApp</strong>.
                &nbsp;•&nbsp;
                <a href="#" style="color:#94a3b8; text-decoration:none;">Unsubscribe</a>
                &nbsp;•&nbsp;
                <a href="#" style="color:#94a3b8; text-decoration:none;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
function getVerificationEmailHTML(link, userName = "there") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f8; padding: 40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="560" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#ffffff; border-radius:16px; overflow:hidden;
                 box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width:560px; width:100%;">

          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                        padding: 48px 40px 40px; text-align:center;">
              <!-- Logo / Icon -->
              <div style="display:inline-block; background:rgba(255,255,255,0.1);
                          border-radius:50%; width:64px; height:64px; line-height:64px;
                          font-size:28px; margin-bottom:20px;">
                ✉️
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:26px;
                          font-weight:700; letter-spacing:-0.5px;">
                Verify Your Email Address
              </h1>
              <p style="margin:10px 0 0; color:rgba(255,255,255,0.65); font-size:14px;">
                One quick step to get you started
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 48px 32px;">
              <p style="margin:0 0 8px; color:#64748b; font-size:14px; font-weight:600;
                          text-transform:uppercase; letter-spacing:1px;">
                Hello, ${userName} 👋
              </p>
              <p style="margin:0 0 24px; color:#1e293b; font-size:16px; line-height:1.7;">
                Thanks for signing up! Please confirm your email address so we can
                activate your account and keep it secure.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${link}"
                      style="display:inline-block; background: linear-gradient(135deg, #0f3460, #533483);
                              color:#ffffff; text-decoration:none; font-size:16px;
                              font-weight:700; padding:16px 48px; border-radius:50px;
                              letter-spacing:0.3px; box-shadow: 0 4px 15px rgba(83,52,131,0.4);">
                      ✓ &nbsp; Verify My Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none; border-top:1px solid #e2e8f0; margin: 0 0 24px;" />

              <!-- Fallback link -->
              <p style="margin:0 0 6px; color:#94a3b8; font-size:13px;">
                Button not working? Copy and paste this link into your browser:
              </p>
              <p style="margin:0; word-break:break-all;">
                <a href="${link}"
                  style="color:#0f3460; font-size:13px; text-decoration:underline;">
                  ${link}
                </a>
              </p>
            </td>
          </tr>

          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#fff7ed; border-left:4px solid #f97316;
                        border-radius:8px; padding:16px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0; color:#92400e; font-size:13px; line-height:1.6;">
                      ⚠️ &nbsp;<strong>This link expires in 24 hours.</strong>
                      If you didn't create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:24px 48px;
                        border-top:1px solid #e2e8f0; border-radius:0 0 16px 16px;">
              <p style="margin:0; color:#94a3b8; font-size:12px;
                          text-align:center; line-height:1.7;">
                This email was sent by <strong style="color:#64748b;">YourApp</strong>.
                &nbsp;•&nbsp;
                <a href="#" style="color:#94a3b8; text-decoration:none;">Unsubscribe</a>
                &nbsp;•&nbsp;
                <a href="#" style="color:#94a3b8; text-decoration:none;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

module.exports = { getResetPasswordEmailHTML, getVerificationEmailHTML };
