import axios from "axios";
const CancelToken = axios.CancelToken;
const cancelTokenKeys = Object.create(null);

function isEmpty(value) {
  return value === undefined || value === null;
}

export function cancelPrevAxiosApi(axiosInstance) {
  axiosInstance.interceptors.request.use(
    config => {
      if (!isEmpty(config.cancelTokenKey) && isEmpty(config.cancelToken)) {
        let key = config.cancelTokenKey;

        let oldSource = cancelTokenKeys[key];
        oldSource && oldSource.cancel();

        let newSource = CancelToken.source();
        cancelTokenKeys[key] = newSource;

        config.cancelToken = newSource.token;
      }
      return config;
    }
  );

  axiosInstance.interceptors.response.use(
    res => {
      if (!isEmpty(res.config.cancelTokenKey) && isEmpty(res.config.cancelToken)) {
        let key = res.config.cancelTokenKey;
        cancelTokenKeys[key] = null;
        delete cancelTokenKeys[key];
      }
      return res;
    }
  );
}
