import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsletterRouter from "./newsletter";
import surveyRouter from "./survey";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsletterRouter);
router.use(surveyRouter);

export default router;
