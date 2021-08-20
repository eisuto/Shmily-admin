import "../plugins/axios";
import {getAPI} from './config'
const _axios = axios;
const api = getAPI();

/**
 * 字典列表
 * @returns {*}
 */
export function listDict(data) {
    return _axios.post(
        api.admin_base_service + "/admin/dict/list",
        data
    );
}

/**
 * 新增字典
 * @returns {*}
 */
export function addDict(data) {
    return _axios.post(
        api.admin_base_service + "/admin/dict",
        data
    );
}
/**
 * 删除字典
 * @returns {*}
 */
export function delDict(data) {
    return _axios.delete(
        api.admin_base_service + "/admin/dict/" + data
    );
}
/**
 * 修改字典
 * @returns {*}
 */
export function putDict(data) {
    return _axios.put(
        api.admin_base_service + "/admin/dict",
        data
    );
}


/**
 * 获取字典信息
 * @returns {*}
 */
export function getDictInfo() {
    return _axios.get("/dict/info");
}


