import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }   
    });

    await transporter.sendMail({
        from: `creatorconnect ${process.env.EMAIL_USER}`,
        to: to,
        subject: subject,
        text: text
    });
};

// sendEmail("malavgovind002@gmail.com", "Test Email", "This is a test email from CreatorConnect backend.");