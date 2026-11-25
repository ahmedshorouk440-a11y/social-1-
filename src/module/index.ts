
import { Router } from "express";
import AuthRouter from './Authanction/Authanction.contrlloer'
import FollowRouter from './Follow/Follow.contrlloer'

const router = Router()
router.use(AuthRouter)
router.use(FollowRouter)

export default router