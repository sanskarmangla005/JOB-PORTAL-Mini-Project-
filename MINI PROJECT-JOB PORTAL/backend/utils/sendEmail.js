const nodemailer = require('nodemailer');

const sendDecisionEmail = async (options) => {
    try {
        // Create a transporter using your Gmail credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const { to, name, jobTitle, companyName, status } = options;

        let subject = '';
        let htmlBody = '';

        if (status === 'accepted') {
            subject = `Application Accepted: ${jobTitle} at ${companyName}`;
            htmlBody = `
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-w-600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <h2 style="color: #10B981; font-size: 24px; text-align: center;">Congratulations, ${name}! 🎉</h2>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            We are thrilled to inform you that your job application for the role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <strong>Accepted!</strong>
                        </p>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            Our recruiting team was very impressed by your profile. We will be reaching out shortly with the next steps regarding your onboarding or final interview round.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                        <p style="color: #6B7280; font-size: 14px; text-align: center;">
                            Thank you for using JobPortal. We wish you the best in your career!
                        </p>
                    </div>
                </div>
            `;
        } else if (status === 'rejected') {
            subject = `Application Status Update: ${jobTitle} at ${companyName}`;
            htmlBody = `
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-w-600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <h2 style="color: #4B5563; font-size: 24px; text-align: center;">Update on your application, ${name}</h2>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            Thank you for taking the time to apply for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
                        </p>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            While we appreciate your interest and the time you invested in the application, we regret to inform you that we have decided to move forward with other candidates who more closely fit our needs at this time.
                        </p>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                            Please do not be discouraged. We encourage you to keep applying to new roles on JobPortal.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                        <p style="color: #6B7280; font-size: 14px; text-align: center;">
                            Thank you for using JobPortal. We wish you the best in your future endeavors!
                        </p>
                    </div>
                </div>
            `;
        }

        const mailOptions = {
            from: `"JobPortal AI Support" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlBody
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Automated status email sent: %s', info.messageId);

    } catch (error) {
        console.error('Error sending automated email:', error);
    }
};

module.exports = sendDecisionEmail;
