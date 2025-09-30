import nodemailer from "nodemailer";

class NodeMailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });
  }

  async send({ to, subject, text }) {
    console.log(text)
    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to,
      subject,
      html:`
        <div>
          <h1> Welcome To Whatsapp Registeration </h1>
          <p> Your Otp is <b>${text?.otp}</b> </p>
          <hr />
          Regards
          WhatsApp Team
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: ", info.response);
      return info;
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }
  }
}

export default NodeMailer;
