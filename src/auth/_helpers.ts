import { User as Auth0UserModel } from '@auth0/auth0-spa-js';
import { getData, setData } from '@/utils';
import { type AuthModel } from './_models';
import { toast } from 'sonner';

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

const setAuth = (auth: AuthModel | Auth0UserModel) => {
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
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();

      if (auth?.access_token) {
        config.headers.Authorization = `Bearer ${auth.access_token}`;
      }

      return config;
    },
    async (err: any) => await Promise.reject(err)
  );
  axios.interceptors.response.use(
    (response: any) => {
      const { method, url } = response.config;
      const endpoint = url?.split('/').filter(Boolean).pop();
      const requestName = `[${method?.toUpperCase()}] ${endpoint}`;
      if (response.status >= 200 && response.status < 300) {
        toast.success(`✅ The ${requestName} request was completed successfully!`);
      }
      return response;
    },
    (error: any) => {
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          toast.error('⛔️ The session has expired, log in again');
          removeAuth();
        } else if (status >= 400 && status < 500) {
          toast.error(`🚨 Client error: ${error.response.data.message}`);
        } else if (status >= 500) {
          toast.error('🔥 Server error. Try again later.');
        }
      } else {
        toast.error('❌ Network error');
      }

      return Promise.reject(error);
    }
  );
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };
