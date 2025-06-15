
import { Router } from "express"
import authRouter from "../modules/auth/auth.route"
import { UserRouter } from "../modules/user/user.route"
import { PostRouter } from "../modules/post/post.route"



const router= Router()

// router.use('/users', UserRoutes)
// router.use('/students', StudentRoutes)



const moduleRoutes = [
    {
        path: '/auth',
        route:authRouter
    },
    {
        path: '/user',
        route:UserRouter
    },
    {
        path: '/post',
        route:PostRouter
    },

]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router