// 引入路由定义
import asyncRoutesMap from "../../router/modules";

import {comps} from "../../api/role"


export default {
    async GENERATE_ROUTES({commit}, roles) {
        commit("SET_ROUTES", generateRoutes(roles));
    }
};

const generateRoutes = roles => {
    console.log("截取默认菜单,获取当前角色的角色权限值");
    console.log(asyncRoutesMap);
    let newMap = asyncRoutesMap;
    let comps = JSON.parse(sessionStorage.getItem("userComps"));
    let userRole = JSON.parse(sessionStorage.getItem("userInfo")).role;
    let compNames = [];
    for (let comp of comps) {
        compNames.push(comp.name);
    }
    console.log("这是角色的权限列表");
    console.log(comps);
    for (let item of newMap) {
        if (item.children) {
            let children = item.children;
            for (let child of children) {
                if ( compNames.indexOf(child.meta.title) !== -1) {
                    child.meta.roles = [userRole];
                    console.log(child.meta.title)
                }
            }
        }
    }
    console.log("这是最终的菜单")
    console.log(newMap)

    if (roles.includes("root")) {
        return newMap;
    }

    return filterRoutes(newMap, roles);
};

const checkChildren = (temp, roles, checkedRoutes) => {
    // 若路由含有子路由，递归验证子路由
    if (temp.children) {
        temp.children = filterRoutes(temp.children, roles);

        // 为小组的第一个添加重定向，解决在路由表中添加重定向，而重定向的页面不在角色路由筛选后的路由表中，导致面包屑绑定报错问题
        // temp.redirect = {name: temp.children[0].name};
    }
    checkedRoutes.push(temp);
};

const filterRoutes = (routes, roles) => {
    const checkedRoutes = [];
    routes.forEach(item => {
        const temp = {...item};
        // 查看路由是否含有roles属性，没有的验证子路由
        if (temp.meta && temp.meta.roles) {
            // 路由角色对比，用户roles中的一个角色在路由的roles中即可
            // 该路由通过角色验证验证子路由，没有通过不会验证子路由
            if (roles.some(role => temp.meta.roles.includes(role))) {
                checkChildren(temp, roles, checkedRoutes);
            }
        } else {
            checkChildren(temp, roles, checkedRoutes);
        }
    });
    return checkedRoutes;
};
