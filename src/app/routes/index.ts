
import { Router } from "express"
import authRouter from "../modules/auth/auth.route"
import { UserRouter } from "../modules/user/user.route"
import { IdeaRouter } from "../modules/idea/idea.route"



const router= Router()


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
        path: '/idea',
        route:IdeaRouter
    },
   

]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router