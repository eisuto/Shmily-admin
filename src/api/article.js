import "../plugins/axios";
import {getAPI} from './config'
const _axios = axios;
const api = getAPI();

/**
 * 文章列表
 * @returns {*}
 */
export function list(data) {
    return _axios.post(
        api.admin_base_service + "/admin/article/list",
        data
    );
}

/**
 * 新增文章
 * @returns {*}
 */
export function addArticle(data) {
    return _axios.post(
        api.admin_base_service + "/admin/article",
        data
    );
}
/**
 * 删除文章
 * @returns {*}
 */
export function delArticle(data) {
    return _axios.delete(
        api.admin_base_service + "/admin/article/" + data
    );
}
/**
 * 修改文章
 * @returns {*}
 */
export function putArticle(data) {
    return _axios.put(
        api.admin_base_service + "/admin/article",
        data
    );
}


/**
 * 获取文章信息
 * @returns {*}
 */
export function getArticleInfo() {
    return _axios.get("/article/info");
}
