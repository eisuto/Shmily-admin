import "../plugins/axios";
import {getAPI} from './config'
const _axios = axios;
const api = getAPI();

/**
 * 树形权限列表
 * @returns {*}
 */
export function tree(data) {
    return _axios.post(
        api.admin_base_service + "/admin/competence/tree",
        data
    );
}


/**
 * 权限列表
 * @returns {*}
 */
export function list(data) {
    return _axios.post(
        api.admin_base_service + "/admin/competence/list",
        data
    );
}

/**
 * 新增权限
 * @returns {*}
 */
export function addComp(data) {
    return _axios.post(
        api.admin_base_service + "/admin/competence",
        data
    );
}
/**
 * 删除权限
 * @returns {*}
 */
export function delComp(data) {
    return _axios.delete(
        api.admin_base_service + "/admin/competence/" + data
    );
}
/**
 * 修改权限
 * @returns {*}
 */
export function putComp(data) {
    return _axios.put(
        api.admin_base_service + "/admin/competence",
        data
    );
}


/**
 * 获取权限信息
 * @returns {*}
 */
export function getCompInfo() {
    return _axios.get("/competence/info");
}
