import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsletterRouter from "./newsletter";
import surveyRouter from "./survey";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsletterRouter);
router.use(surveyRouter);
router.use(storageRouter);

export default router;
