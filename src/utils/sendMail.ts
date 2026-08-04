import transporter from "./mail";

export const sendEmail = async (
    to: string,
    subject: string,
    text: string
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
};