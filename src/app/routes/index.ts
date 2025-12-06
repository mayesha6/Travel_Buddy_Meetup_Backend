import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.routes"
import { TravelPlanRoutes } from "../modules/travelPlan/travelPlan.routes"
import { ReviewRoutes } from "../modules/reviews/reviews.routes"
import { PaymentRoutes } from "../modules/payment/payment.routes"
import { SubscriptionRoutes } from "../modules/subscriptions/subscriptions.routes"


export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/travel-plan",
        route: TravelPlanRoutes
    },
    {
        path: "/review",
        route: ReviewRoutes
    },
    {
        path: "/payment",
        route: PaymentRoutes
    },
    {
        path: "/subscription",
        route: SubscriptionRoutes
    },
    

]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
