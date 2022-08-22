import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import connectDB, { closeDB } from "@servers/config/database";
import userDb from "@servers/models/user";
import { hash } from "bcryptjs";
import { sendEmail } from "@servers/mailer";
import { UserObj } from "@servers/mailer/types";

const router = createRouter<NextApiRequest, NextApiResponse>();

// create a user
router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { email, password } = req.body;

  let userInfo = {
    ...req.body,
  };

  if (!email) {
    return res.status(423).json({
      status: false,
      message: "email field is required",
    });
  }

  try {
    const userRegistering = await userDb.findOne({ email });
    if (userRegistering) {
      await closeDB();
      return res
        .status(423)
        .send({ status: false, error: "This user already exists" });
    }

    const data = {
      ...userInfo,
      password: await hash(password, Number(process.env.BCRYPT_SALT as string)),
      email: email.toLowerCase(),
      authWith: "email",
    };

    const userData: any = new userDb(data);
    const { _doc } = await userData.save();
    await closeDB();

    const emailObj = { email, link: "", name: "" } as UserObj;
    const emailSent = await sendEmail(
      "Welcome to nextjs-fullstack-stp",
      "welcome",
      emailObj
    );
    if (emailSent.status) {
      await closeDB();
      return res.status(201).json({
        message: "Check your email for further instructions",
        status: true,
        data: _doc,
      });
    }
    return res.status(201).json({ message: "User created", ..._doc });
  } catch (e) {
    console.log("Error", e);
    return res.status(423).json({
      error: e,
    });
  }
});

interface IQuery {
  type?: string | string[] | undefined;
  page?: number | string;
}
router.get(async (req, res) => {
  const { type }: IQuery = req.query;

  try {
    const users = await userDb.find({
      ...(!!type && { type }),
    });

    return res.status(200).json({
      status: true,
      data: users,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      error: "server error",
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
