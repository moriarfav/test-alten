import { AxiosInstance } from 'axios';
import { TokenManager } from '../../shared/utils/token-manager';
import { Logger } from '../../shared/utils/logger';
import { AppErrorHandler } from '../../shared/utils/app-error-handler';

/**
 * Configura los interceptores para una instancia de Axios.
 * @param axiosInstance
 */
export const configureInterceptors = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        if (!TokenManager.isTokenValid()) {
          const newToken = await TokenManager.refreshToken();
          TokenManager.saveToken(newToken);
        }

        const authHeaders = TokenManager.getAuthHeaders();
        config.headers = {
          ...config.headers,
          ...authHeaders,
        };

        Logger.info('Request sent to API', {
          url: config.url,
          method: config.method,
        });

        return config;
      } catch (error) {
        Logger.error('Error in request interceptor', error);
        return Promise.reject(error);
      }
    },
    (error) => {
      Logger.warn('Request token error', error);
      return Promise.reject(error);
    }
  );

  // Interceptor para respuestas
  axiosInstance.interceptors.response.use(
    (response) => {
      Logger.info('Response received from API', {
        url: response.config.url,
        status: response.status,
      });
      return response;
    },
    (error) => {
      // Manejar errores de respuesta
      AppErrorHandler.handleHttpError(error);
      Logger.error('Response error', error);
      return Promise.reject(error);
    }
  );
};
