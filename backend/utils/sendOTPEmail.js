require("dotenv").config();
const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otpCode) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // English HTML Email Template for "Amar Khata"
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        
        <!-- Header / Logo Area -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #007bff;">
          <h1 style="color: #007bff; margin: 0; font-size: 28px;">Amar Khata</h1>
        </div>
        
        <!-- Body Area -->
        <div style="padding: 30px 20px; text-align: center;">
          <h2 style="color: #333333; font-size: 20px;">Your OTP Verification Code</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.5;">
            Hello, <br>
            Please use the following OTP code to verify your account on <strong>Amar Khata</strong>.
          </p>
          
          <!-- OTP Box -->
          <div style="margin: 30px auto; padding: 15px; background-color: #f4f7f6; border-radius: 8px; display: inline-block; border: 1px dashed #007bff;">
            <span style="font-size: 32px; font-weight: bold; color: #333333; letter-spacing: 5px;">${otpCode}</span>
          </div>
          
          <p style="color: #999999; font-size: 14px; line-height: 1.5;">
            Please do not share this code with anyone. For your security, this OTP will expire in 10 minutes.
          </p>
        </div>
        
        <!-- Footer Area -->
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Amar Khata. All rights reserved.
          </p>
        </div>
        
      </div>
    `;

    // Email Options
    const mailOptions = {
      from: `"Amar Khata" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Amar Khata - Your OTP Verification Code",
      html: htmlTemplate,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};

module.exports = sendOTPEmail;
