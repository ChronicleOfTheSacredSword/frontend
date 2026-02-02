import { createRouter, createWebHistory } from "vue-router"
import LoginPage from "../pages/LoginPage.vue"
import HeroPage from "../pages/HeroPage.vue"
import NotFound from "../pages/NotFound.vue"

const routes = [
	{
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "Login",
        component: LoginPage,
    },
    {
        path: "/hero",
        name: "Hero",
        component: HeroPage,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
