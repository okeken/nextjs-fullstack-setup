import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import { createRouter } from "next-connect";
import connectDB, { closeDB } from "@servers/config/database";
import userDb from "@servers/models/user";
import { hash } from "bcryptjs";
import { sendEmail } from "@servers/mailer";
import { IResetPassword } from "Types";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, password, passwordConfirm } = req.body as IResetPassword;
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({
      status: false,
      error: "unauthorized",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(423).json({
      status: false,
      message: "password and password confirm must match",
    });
  }

  await connectDB();
  try {
    const user = await userDb.findOne({ _id: userId });

    if (!user) {
      await closeDB();
      return res.status(423).send({ status: false, error: "user not found" });
    }

    const hashPassword = await hash(
      password,
      Number(process.env.BCRYPT_SALT as string)
    );

    const upadateRecords = async ()=>{
        return   userDb.updateOne(
        { _id: userId },
        { $set: { password: hashPassword } },
        { new: true }
      ),
    }

    Promise.all([
      userDb.updateOne(
        { _id: userId },
        { $set: { password: hashPassword } },
        { new: true }
      ),
      sendEmail("Password Changed Successfully", "password-change-report", {
        email: user.email,
        link: "",
        name: "",
      }),
      closeDB(),
    ]);

    return res
      .status(201)
      .json({ message: "password changed successfully", status: true });
  } catch (e) {
    console.log("Error", e);
    return res.status(423).json({
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
