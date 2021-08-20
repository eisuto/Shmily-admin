import "../plugins/axios";
import {getAPI} from './config'
const _axios = axios;
const api = getAPI();


/**
 * 指定角色的权限
 * @returns {*}
 */
export function comps(data) {
    return _axios.post(
        api.admin_base_service + "/admin/role/comps",
        data
    );
}

/**
 * 保存角色权限
 * @returns {*}
 */
export function saveComps(data) {
    return _axios.post(
        api.admin_base_service + "/admin/role/saveComps",
        data
    );
}

/**
 * 角色列表
 * @returns {*}
 */
export function list(data) {
    return _axios.post(
        api.admin_base_service + "/admin/role/list",
        data
    );
}

/**
 * 新增角色
 * @returns {*}
 */
export function addRole(data) {
    return _axios.post(
        api.admin_base_service + "/admin/role",
        data
    );
}
/**
 * 删除角色
 * @returns {*}
 */
export function delRole(data) {
    return _axios.delete(
        api.admin_base_service + "/admin/role/" + data
    );
}
/**
 * 修改角色
 * @returns {*}
 */
export function putRole(data) {
    return _axios.put(
        api.admin_base_service + "/admin/role",
        data
    );
}


/**
 * 获取角色信息
 * @returns {*}
 */
export function getRoleInfo() {
    return _axios.get("/role/info");
}
