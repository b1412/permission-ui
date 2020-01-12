import { apiBaseUrl, baseUrl } from "../config";
import reqwest from "reqwest"; // 封装了ajax请求的库
import axios from "axios"; // 封装了fetch请求的库

export default class ApiService {
  static token =
    "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJjYW5ub24iLCJzdWIiOiJsZW9uLnpob3VAaW50ZWxsaXdhcmUuY28ubnpAQDQiLCJpYXQiOjE1NzgwMTE0MTQsImV4cCI6MTU3ODg3NTQxNH0.wcMJHHgaSxwKRpjPv0O39qMkSZHKxbudLbwq03HU8-vdLd22gFaZgeLqBDwUhX2h5WA5YjvILIPU1Lppo-JCZQ";

  // ajax请求
  static newPost(url, bodyObj = {}) {
    return reqwest({
      url: `${baseUrl}/${url}`, // URL
      method: "post", // 请求方式
      contentType: "application/json;charset=utf-8", // 消息主体数据类型 JSON
      crossOrigin: true, // 开启CORS跨域
      withCredentials: true, // 请求头中是否带cookie，有利于后端开发保持他们需要的session
      data: JSON.stringify(bodyObj), // 参数，弄成json字符串
      type: "json" // 参数类型JSON
    });
  }

  // fetch请求
  static newFetch(url, bodyObj = {}) {
    return axios({
      url: `${baseUrl}/${url}`,
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      withCredentials: true,
      data: JSON.stringify(bodyObj)
    });
  }

  // fetch请求
  static apiFetch(url, bodyObj = {}) {
    return axios({
      url: `${apiBaseUrl}/${url}`,
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      withCredentials: true,
      data: JSON.stringify(bodyObj)
    });
  }

  static http(method, url, bodyObj = {}) {
    return axios({
      url: `${apiBaseUrl}/${url}`,
      method: method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + this.token
      },
      withCredentials: true,
      data: JSON.stringify(bodyObj)
    });
  }

  static get(url, bodyObj = {}) {
    return axios({
      url: `${apiBaseUrl}/${url}`,
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + this.token
      },
      withCredentials: true,
      data: JSON.stringify(bodyObj)
    });
  }

  static post(url, bodyObj = {}) {
    return axios({
      url: `${apiBaseUrl}/${url}`,
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + this.token
      },
      withCredentials: true,
      data: JSON.stringify(bodyObj)
    });
  }

  static put(url, bodyObj = {}) {
    return axios({
      url: `${apiBaseUrl}/${url}`,
      method: "put",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + this.token
      },
      withCredentials: true,
      data: JSON.stringify(bodyObj)
    });
  }

  static delete(url, bodyObj = {}) {
    return axios({
      url: `${apiBaseUrl}/${url}`,
      method: "delete",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + this.token
      },
      withCredentials: true,
      data: JSON.stringify(bodyObj)
    });
  }
}
