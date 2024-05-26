import nodemailer from 'nodemailer';

async function sendEmail(userId,serderName,senderId, subject, body) {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.SERVICE_PROVIDER,
        port: process.env.SERVICE_PROVIDER_PORT,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    })
      let info = await transporter.sendMail({
        from: `<${serderName} <${senderId}>`, 
        to: userId,
        subject: subject, 
        text: body 
      });
  
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
  
  export default sendEmail;