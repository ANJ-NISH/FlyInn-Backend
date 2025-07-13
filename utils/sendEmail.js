const nodemailer = require('nodemailer');

const sendEmail = async (to, infoObj) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: 'Booking Confirmation',
    html: `<h3>Dear ${infoObj.name},</h3><p>Your hotel booking has been confirmed. <br/>
    ${infoObj.hotelinfo[0].name} has been booked from ${infoObj.fstartDate} to ${infoObj.fendDate}. <br/>
    Thank you for your payment!</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
