import { getData, I18N_CONFIG_KEY, LOCAL_STORAGE_CURRENCY_KEY, setData } from '@/utils';
import { type AuthModel } from './_models';
import { toast } from 'sonner';
import { CurrencySystem } from '@/providers';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
  import.meta.env.VITE_APP_VERSION
}`;

const getAuth = (): AuthModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;

    if (auth) {
      return auth;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: AuthModel) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

export function setupAxios(axios: any) {
  const languageCode = getData(I18N_CONFIG_KEY) || 'en';
  const currencyCode = (getData(LOCAL_STORAGE_CURRENCY_KEY) as CurrencySystem)?.code || 'USD';

  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['Accept-Language'] = languageCode;
  axios.defaults.headers.common['Accept-Currency'] = currencyCode;
  axios.defaults.headers.Accept = 'application/json';

  axios.interceptors.request.use(
    (config: {
      headers: { [key: string]: any; Authorization?: string; 'Accept-Currency'?: string };
    }) => {
      const auth = getAuth();
      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      config.headers['Accept-Language'] = languageCode;
      config.headers['Accept-Currency'] = currencyCode;
      return config;
    },
    async (err: any) => await Promise.reject(err)
  );

  axios.interceptors.response.use(
    (response: any) => {
      const { method } = response.config;
      if (['post', 'put'].includes(method?.toLowerCase()) && response.data?.message) {
        const toastType = response.status >= 200 && response.status < 300 ? 'success' : 'info';
        toast[toastType](response.data.message);
      }

      return response;
    },
    (error: any) => {
      if (error.response) {
        const { status, data } = error.response;

        if (['post', 'put'].includes(error.config?.method?.toLowerCase()) && data?.message) {
          const toastType = status >= 500 ? 'error' : 'warning';
          toast[toastType](data.message);
        } else if (status === 401) {
          toast.error('The session has expired, log in again');
          removeAuth();
        } else if (status >= 400 && status < 500) {
          toast.error(`Client error: ${error.response.data.message}`);
        } else if (status >= 500) {
          toast.error('Server error. Try again later.');
        }
      } else {
        toast.error('Network error');
      }
      return Promise.reject(error);
    }
  );
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };
