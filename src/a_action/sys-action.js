/**
 * 系统模块action
 * **/
import Fetchapi from "../util/fetch-api"; // 自己写的工具函数，封装了请求数据的通用接口
import { message } from "antd";

/**
 * 获取所有菜单
 * **/
export const getMenus = (params = {}) => async dispatch => {
  try {
    const res = await Fetchapi.get("v1/permission/menu", params);
    if (res.status === 200) {
      await dispatch({
        type: "SYS.getMenus",
        payload: res.data
      });
    }
    return res;
  } catch (err) {
    message.error("network error, please try again");
  }
};

/**
 * 根据菜单ID查询其下的权限数据
 * **/
export const getPowerDataByMenuId = (params = {}) => async dispatch => {
  try {
    return await Fetchapi.get(
      "v1/menu/permissions?menuId=" + params.menuId,
      params
    );
  } catch (err) {
    message.error("network error, please try again");
  }
};

export const getRoles = (params = {}) => async () => {
  try {
    return await Fetchapi.get(
      "v1/role?embedded=rolePermissions,rolePermissions.permission",
      params
    );
  } catch (err) {
    message.error("network error, please try again");
  }
};

export const getRoleById = (params = {}) => async () => {
  try {
    return await Fetchapi.get(
      "v1/role/" +
        params.id +
        "?embedded=rolePermissions,rolePermissions.permission",
      params
    );
  } catch (err) {
    message.error("network error, please try again");
  }
};

export const getEntities = function(entity) {
  return params => async () => {
    console.log(params);
    try {
      let queryString;
      const filter = params.filter;
      delete params.filter;
      queryString = Object.keys(params)
        .map(key => key + "=" + params[key])
        .join("&");
      if (filter) {
        queryString += "&";
        queryString += Object.keys(filter)
          .map(key => key + "=" + filter[key])
          .join("&");
      }
      return await Fetchapi.get(`v1/${entity}?${queryString}`);
    } catch (err) {
      message.error("Network error, please try again");
    }
  };
};

export const addEntity = function(entity) {
  return (params = {}) => async () => {
    try {
      return await Fetchapi.post("v1/" + entity, params);
    } catch (err) {
      message.error("network error, please try again");
    }
  };
};

export const updateEntity = function(entity) {
  return (params = {}) => async () => {
    try {
      return await Fetchapi.put("v1/" + entity + "/" + params.id, params);
    } catch (err) {
      message.error("network error, please try again");
    }
  };
};

export const getOneEntity = function(entity) {
  return params => async () => {
    try {
      return await Fetchapi.get(
        `v1/${entity}/${params.id}?embedded=${params.embedded}`
      );
    } catch (err) {
      message.error("network error, please try again");
    }
  };
};

export const deleteEntity = function(entity) {
  return (params = {}) => async () => {
    try {
      return await Fetchapi.delete("v1/" + entity + "/" + params.id, params);
    } catch (err) {
      message.error("network error, please try again");
    }
  };
};

export const createQueryString = params => {
  return Object.keys(params)
    .map(key => key + "=" + params[key])
    .join("&");
};

export const callAPI = (method, url, params = {}) => async () => {
  try {
    return await Fetchapi.http(method, url, params);
  } catch (err) {
    message.error("network error, please try again");
  }
};
