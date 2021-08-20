import Layout from "../components/layout/Layout";

export default [
    {
        path: "/login",
        name: "Login",
        hideInMenu: true,
        component: () => import(/* webpackChunkName: "Login" */ "@/views/Login")
    },
    {
        path: "/404",
        name: "NotFound",
        hideInMenu: true,
        component: () =>
            import(/* webpackChunkName: "NotFound" */ "@/views/NotFound")
    },
    {
        path: "/",
        redirect: "/dashboard",
        component: Layout,
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                meta: {title: "首页", icon: "dashboard"},
                component: () =>
                    import("@/views/Dashboard")
            }
        ]
    },
];

export const NotFound = {
    path: "*",
    redirect: "/404",
    hideInMenu: true
};
