/**
  一些公共的action可以写在这里，比如用户登录、Logout、权限查询等
  其他的action可以按模块不同，创建不同的js文件
**/

import Fetchapi from "../util/fetch-api";
import { message } from "antd";

export const onLogin = (params = {}) => async () => {
  try {
    return await Fetchapi.post(
      "v1/login?username=" +
        params.username +
        "&password=" +
        params.password +
        "&clientId=4"
    );
  } catch (err) {
    message.error("network error, please try again");
  }
};

export const onLogout = (params = {}) => async dispatch => {
  try {
    await dispatch({
      type: "APP.onLogout",
      payload: null
    });
    sessionStorage.removeItem("userinfo");
    return "success";
  } catch (err) {
    message.error("network error, please try again");
  }
};

/**
 * 设置用户信息
 * @params: userinfo
 * **/
export const setUserInfo = (params = {}) => async dispatch => {
  try {
    await dispatch({
      type: "APP.setUserInfo",
      payload: params
    });
    return "success";
  } catch (err) {
    message.error("network error, please try again");
  }
};
