import { apiBaseUrl, baseUrl } from "../config";
import axios from "axios";

export default class ApiService {
  static http(method, url, bodyObj = {}) {
    const headers = {
      "Content-Type": "application/json;charset=utf-8"
    };
    const token = sessionStorage.getItem("token");
    if (token) {
      headers.Authorization = "Bearer " + token;
    }
    return axios({
      url: `${apiBaseUrl}/${url}`,
      method: method,
      headers: headers,
      withCredentials: true,
      data: JSON.stringify(bodyObj)
    });
  }

  static get(url, bodyObj = {}) {
    return this.http("get", url, bodyObj);
  }

  static post(url, bodyObj = {}) {
    return this.http("post", url, bodyObj);
  }

  static put(url, bodyObj = {}) {
    return this.http("put", url, bodyObj);
  }

  static delete(url, bodyObj = {}) {
    return this.http("delete", url, bodyObj);
  }
}
