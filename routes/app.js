import express from "express"
const router = express.Router();
import { isLoggedIn } from "../middleware.js"
import * as app from "../controllers/app.js"

router.get('/', app.renderApp)

router.post('/:choice', isLoggedIn, app.processChoice)

export default router;