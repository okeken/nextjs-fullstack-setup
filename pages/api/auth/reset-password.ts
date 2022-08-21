import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import connectDB, { closeDB } from "@servers/config/database";
import userDb from "@servers/models/user";
import Token from "@servers/models/token";
import { hash, compare } from "bcryptjs";
import { IResetPassword } from "Types";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { userId, token, password, passwordConfirm } =
    req.body as IResetPassword;

  if (password !== passwordConfirm) {
    return res.status(423).json({
      status: false,
      message: "password and password confirm must match",
    });
  }
  if (!token) {
    return res.status(423).json({
      status: false,
      message: "token is required",
    });
  }

  try {
    const userToken = await Token.findOne({ userId });

    const isTokenValid = await compare(token as string, userToken.token);
    if (!isTokenValid) {
      await closeDB();
      return res.status(423).json({
        status: false,
        message: "expired or invalid token",
      });
    }

    const user = await userDb.findOne({ _id: userId });

    if (!user) {
      await closeDB();
      return res.status(423).send({ status: false, error: "user not found" });
    }

    const hashPassword = await hash(
      password,
      Number(process.env.BCRYPT_SALT as string)
    );

    Promise.all([
      userDb.updateOne(
        { _id: userId },
        { $set: { password: hashPassword } },
        { new: true }
      ),
      userToken.deleteOne(),
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
