export const contactUsTemplate = (mail: string) => {
    return `
       <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Confirmation</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px auto; max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <tr>
              <td align="center" style="padding: 20px 0; background-color: #007bff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                  <h1 style="color: #ffffff; margin: 0;">AI Solution</h1>
              </td>
          </tr>
          <tr>
              <td style="padding: 20px;">
                  <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                      Dear ${mail},
                  </p>
                  <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                      Thank you for reaching out to AI Solution. We have received your message and are excited to connect with you!
                  </p>
                  <p style="font-size: 16px; color: #333333; margin-bottom: 30px;">
                      One of our team members will get back to you shortly to address your inquiries and provide the necessary support.
                  </p>
                  <p style="font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 30px;">
                      We appreciate your interest and look forward to assisting you.
                  </p>
                  <p style="font-size: 16px; color: #333333;">
                      Best regards,<br>
                      The AI Solution Team
                  </p>
              </td>
          </tr>
          <tr>
              <td align="center" style="padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                  <p style="font-size: 12px; color: #666666; margin: 0;">
                      If you have any questions, feel free to <a href="mailto:spendwise.co@gmail.com" style="color: #007bff; text-decoration: none;">contact us</a>.
                  </p>
                  <p style="font-size: 12px; color: #666666; margin: 5px 0 0 0;">
                      &copy; 2024 AI Solution. All rights reserved.
                  </p>
              </td>
          </tr>
      </table>
  
  </body>
  </html>
    `;
};