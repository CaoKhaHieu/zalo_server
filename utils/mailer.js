import nodemailer from 'nodemailer';

 const adminEmail = 'caokhahieu9@gmail.com'
//  const adminPassword = 'Congtubot128'
 const adminPassword = 'CaoKhaHieu128'
 const mailHost = 'smtp.gmail.com'
 const mailPort = 587

 export const mailer = (to, subject, htmlContent) => {
   const transporter = nodemailer.createTransport({
     host: mailHost,
     port: mailPort,
     secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
     auth: {
       user: adminEmail,
       pass: adminPassword
     }
   })
   const options = {
     from: adminEmail, 
     to: to, 
     subject: subject, 
     html: htmlContent 
   }
   return transporter.sendMail(options)
 }
