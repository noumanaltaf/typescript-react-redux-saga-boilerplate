
  export function checkStatus(response: Response): Response;

  export function objectToUrlParam(data: object): string;
  
  export function fetchGet<R = any, U = any>(methodName: string, urlParam?: U, respType?: 'Inline' | 'None'): Promise<R>;
  
  export function fetchFile<R = any, U = any>(methodName: string, urlParam?: U): Promise<R>;
  
  export function fetchPost<B = any, R = any, U = any>(methodName: string, bodyObject?: B, urlParam?: U, respType?: 'Inline' | 'None'): Promise<R>;
  
  export function fetchPut<B = any, U = any, R = any>(methodName: string, bodyObject?: B, respType?: 'Inline' | 'None', urlParam?: U): Promise<R>;
  
  export function fetchDelete<R = any>(methodName: string, bodyObject?: any, respType?: string): Promise<R>;
  