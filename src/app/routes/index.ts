
import { Router } from "express"
import authRouter from "../modules/auth/auth.route"



const router= Router()

// router.use('/users', UserRoutes)
// router.use('/students', StudentRoutes)



const moduleRoutes = [
    {
        path: '/auth',
        route:authRouter
    }

]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router