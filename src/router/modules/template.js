const renderRouterView = {render: h => h("router-view")};

//

export default [
    {
        path: "/system",
        name: "System",
        // redirect: {name: "Form"},
        meta: {
            title: "系统管理",
            icon: "settings",
            isGroup: true
        },
        component: () => import("@/components/layout/Layout"),
        children: [
            {
                path: "user",
                name: "User",
                meta: {
                    title: "用户管理",
                    icon: "person",
                    roles: ["root"],
                },
                component: () => import("@/views/system/User")
            },
            {
                path: "role",
                name: "Role",
                meta: {title: "角色管理", icon: "people", roles: ["root"]},
                component: () => import("@/views/system/Role")
            },
            {
                path: "comp",
                name: "Comp",
                meta: {title: "权限管理", icon: "lock", roles: ["root"]},
                component: () => import("@/views/system/Comp")
            },
            {
                path: "dict",
                name: "Dict",
                meta: {title: "字典管理", icon: "menu_book", roles: ["root"]},
                component: () => import("@/views/system/Dict")
            },
        ]
    },
    {
        path: "/article",
        name: "Article",
        meta: {
            title: "文章管理",
            icon: "settings",
            isGroup: true
        },
        component: () => import("@/components/layout/Layout"),
        children: [
            {
                path: "article",
                name: "Article",
                meta: {title: "推文管理", icon: "receipt", roles: ["root"]},
                component: () => import("@/views/article/Article")
            }
        ]
    },
    // {
    //     path: "/nested",
    //     name: "Nested",
    //     redirect: {name: "Menu1"},
    //     meta: {
    //         title: "Nested",
    //         icon: "xbox-controller-menu",
    //         roles: ["admin"],
    //         isGroup: true
    //     },
    //     component: () =>
    //         import(/* webpackChunkName: "Layout" */ "@/components/layout/Layout"),
    //     children: [
    //         {
    //             path: "menu1",
    //             name: "Menu1",
    //             meta: {title: "Menu1"},
    //             component: () =>
    //                 import(/* webpackChunkName: "Menu1" */ "@/views/nested/Menu1")
    //         },
    //
    //         {
    //             path: "menu2",
    //             name: "Menu2",
    //             redirect: {name: "Menu2_1"},
    //             meta: {title: "Menu2", icon: "menu", isGroup: true},
    //             component: renderRouterView,
    //             children: [
    //                 {
    //                     path: "menu2_1",
    //                     name: "Menu2_1",
    //                     meta: {title: "Menu2-1"},
    //                     component: () =>
    //                         import(
    //                             /* webpackChunkName: "Menu2_1" */ "@/views/nested/menu2/Menu2_1"
    //                             )
    //                 },
    //                 {
    //                     path: "menu2_2",
    //                     name: "Menu2_2",
    //                     redirect: {name: "Menu2_2_1"},
    //                     meta: {
    //                         title: "Menu2-2",
    //                         icon: "menu",
    //                         roles: ["root"],
    //                         isGroup: true
    //                     },
    //                     component: renderRouterView,
    //                     children: [
    //                         {
    //                             path: "menu2_2_1",
    //                             name: "Menu2_2_1",
    //                             meta: {title: "Menu2-2-1"},
    //                             component: () =>
    //                                 import(
    //                                     /* webpackChunkName: "Menu2_2_1" */ "@/views/nested/menu2/menu2-2/Menu2_2_1"
    //                                     )
    //                         },
    //                         {
    //                             path: "menu2_2_2",
    //                             name: "Menu2_2_2",
    //                             meta: {title: "Menu2-2-2"},
    //                             component: () =>
    //                                 import(
    //                                     /* webpackChunkName: "Menu2_2_2" */ "@/views/nested/menu2/menu2-2/Menu2_2_2"
    //                                     )
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     path: "menu2_3",
    //                     name: "Menu2_3",
    //                     meta: {title: "Menu2-3"},
    //                     component: () =>
    //                         import(
    //                             /* webpackChunkName: "Menu2_3" */ "@/views/nested/menu2/Menu2_3"
    //                             )
    //                 }
    //             ]
    //         },
    //         {
    //             path: "menu3",
    //             name: "Menu3",
    //             meta: {title: "Menu3"},
    //             component: () =>
    //                 import(/* webpackChunkName: "Menu3" */ "@/views/nested/Menu3")
    //         }
    //     ]
    // }
];
