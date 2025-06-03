
import { Router } from "express"



const router= Router()

// router.use('/users', UserRoutes)
// router.use('/students', StudentRoutes)



const moduleRoutes = [
    

]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router