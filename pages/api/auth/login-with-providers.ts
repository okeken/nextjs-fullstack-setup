import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import loginWithProviders from "@servers/services/login-with-providers";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
    
    try{
        const service = await loginWithProviders(req.body)
        return res.status(201).json(service);
    }
    catch(e){
        return res.status(501).json({
            error:e,
            status:false
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
