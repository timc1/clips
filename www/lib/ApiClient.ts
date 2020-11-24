import { NetworkError, OfflineError } from "lib/errors";
import { RequestMethod } from "lib/types";
const querystring = require("query-string");

function ApiClient() {
  this.fetch = async (url: string, method: RequestMethod, data: Object) => {
    // Construct url/body
    let endpoint = url;
    let body: string = undefined;

    if (method === "GET") {
      endpoint = data ? `${url}?${querystring.stringify(data)}` : url;
    } else {
      body = data ? JSON.stringify(data) : undefined;
    }

    // Construct headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "cache-control": "no-cache",
    };

    let response;
    try {
      response = await fetch(endpoint, {
        method,
        body,
        headers,
        redirect: "follow",
        credentials: "include",
        cache: "no-cache",
      });
    } catch {
      if (typeof window !== "undefined") {
        if (window.navigator.onLine) {
          throw new NetworkError();
        } else {
          throw new OfflineError();
        }
      }
    }

    const success = response.status >= 200 && response.status < 300;

    if (success) {
      const data = await response.json();
      return data;
    }

    const error = await response.json();

    // Shape is from parseError in /server/utils/helpers
    return {
      ok: false,
      message: error.message,
      stack: error.stack,
      code: error.code,
      ...error,
    };
  };

  this.get = (path: string, data?: Object) => {
    return this.fetch(path, "GET", data);
  };

  this.post = (path: string, data?: Object) => {
    return this.fetch(path, "POST", data);
  };

  this.put = (path: string, data?: Object) => {
    return this.fetch(path, "PUT", data);
  };

  this.delete = (path: string, data?: Object) => {
    return this.fetch(path, "DELETE", data);
  };
}

export default ApiClient;
export const client = new ApiClient();
