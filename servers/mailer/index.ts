import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import handlebars from "handlebars";
import fs from "fs";
import { mailSenderConfig } from "@servers/config";
import { ImailgunAuth, UserObj } from "./types";

const baseUrl = "http://localhost:3000/";

const emailTemplate = (fileName: string) =>
  fs.readFileSync(`${process.cwd()}/servers/template/${fileName}.hbs`, "utf8");

const mailgunAuth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string,
  },
} as ImailgunAuth;

async function wrappedSendMail(options: any) {
  return new Promise((res, rej) => {
    // @ts-ignore
    let transport = nodemailer.createTransport(mg(mailgunAuth));
    transport.sendMail(options, function (error, response) {
      if (error) return rej(error);

      return res(response);
    });
  });
}

// subject, template name-fileName,  userObj
export const sendEmail = async (
  subject: string,
  fileName: string,
  userObject: UserObj
) => {
  const { from, replyTo } = mailSenderConfig;
  const { link, email } = userObject;
  const template = handlebars.compile(emailTemplate(fileName));
  const sendApplicationResp = template({
    replyTo,
    name: email,
    link: `${baseUrl}${link}`,
  });
  const regMailOptions = {
    from,
    to: email,
    subject,
    html: sendApplicationResp,
  };

  try {
    const response = await wrappedSendMail(regMailOptions);
    return {
      status: true,
      to: email,
      message: "Successfully sent email",
      data: response,
    };
  } catch (e) {
    return {
      status: false,
      error: e,
    };
  }
};
