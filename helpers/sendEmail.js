import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_FROM };
  return transporter.sendMail(email);
};

export default sendEmail;
