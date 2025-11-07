const fs = require('fs');
const path = require('path');

const transporter = require('../utils/sendEmail');

const readHTMLFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
};

const sendEmail = async (email, subject, templateName, replacements = {}) => {
    try {
        const templatePath = path.join(__dirname, '../resources/email_templates', `${templateName}.html`);
        let htmlContent = await readHTMLFile(templatePath);

        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(regex, replacements[key]);
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM, 
            to: email,
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        throw error;
    }
};


const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const subject = 'Password Reset Request';
        const templateName = 'password-reset';
        const replacements = {
            resetLink: `${process.env.FRONTEND_URL}reset-password?token=${resetToken}`,
            currentYear: new Date().getFullYear(),
            companyName: process.env.EMAIL_FROM_NAME
        };
        await sendEmail(email, subject, templateName, replacements);
    } catch (error) {
        console.error(`Error sending password reset email to ${email}:`, error);
        throw error;
    }
};

const sendVerificationEmail = async (email, firstName, token) => {
    try {
        const subject = 'Verify Your Email Address';
        const templateName = 'verify-email';
        const replacements = {
            firstName,
            verificationLink : `${process.env.APP_URL}/verify-email?token=${token}`,
            currentYear: new Date().getFullYear(),
            companyName: process.env.EMAIL_FROM_NAME || 'Our Company',
        };
        await sendEmail(email, subject, templateName, replacements);
    } catch (error) {
        console.error(`Error sending verification email to ${email}:`, error);
        throw error;
    }
};



module.exports = {
   sendPasswordResetEmail,
    sendVerificationEmail,
};