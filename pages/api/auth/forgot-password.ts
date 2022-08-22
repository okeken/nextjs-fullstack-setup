import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import connectDB, { closeDB } from "@servers/config/database";
import userDb from "@servers/models/user";
import Token from "@servers/models/token";
import crypto from "crypto";
import { hash } from "bcryptjs";
import { sendEmail } from "@servers/mailer";
import { UserObj } from "@servers/mailer/types";

const router = createRouter<NextApiRequest, NextApiResponse>();

//
router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { email } = req.query;

  if (!email) {
    return res.status(423).json({
      status: false,
      message: "email field is required",
    });
  }

  try {
    const user = await userDb.findOne({ email });

    if (!user) {
      await closeDB();
      return res.status(423).send({ status: false, error: "user not found" });
    }

    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashPassword = await hash(
      resetToken,
      Number(process.env.BCRYPT_SALT as string)
    );

    await new Token({
      userId: user._id,
      token: hashPassword,
      createdAt: Date.now(),
    }).save();

    const link = `password-reset?token=${resetToken}&userId=${user._id}`;
    const emailObj = { email, link, name: "" } as UserObj;
    const emailSent = await sendEmail(
      "Password Reset Request",
      "forgot-password",
      emailObj
    );
    if (emailSent.status) {
      await closeDB();
      return res.status(201).json({
        message: "Check your email for further instructions",
        status: true,
      });
    }

    await closeDB();
    throw res.status(421).json({
      message: "unable to send password reset email, try again",
      status: false,
      error: emailSent,
    });
  } catch (e) {
    console.log("Error", e);
    return res.status(501).json({
      error: e,
    });
  }
});

export default router.handler({
  // @ts-ignore
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
