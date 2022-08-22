import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import connectDB, { closeDB } from "@servers/config/database";
import Token from "@servers/models/token";
import { compare } from "bcryptjs";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  const { token, userId } = req.query;
  if (!token) {
    return res.status(423).json({
      status: false,
      message: "token is required to proceed",
    });
  }

  try {
    const userToken = await Token.findOne({ userId });
    const isTokenValid = await compare(token as string, userToken.token);
    if (isTokenValid) {
      await closeDB();
      return res.status(200).send({ status: true, message: "token is valid" });
    }

    await closeDB();
    return res
      .status(401)
      .json({ error: "invalid or expired token", status: false });
  } catch (e) {
    console.log(e, "error>>>");
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
