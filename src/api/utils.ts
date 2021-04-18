/* eslint-disable no-use-before-define */
import { apiEndpoint } from '../config';

const HTTP_OK = 200;
const HTTP_NO_CONTENT = 204;

export const objectToUrlParam = (data: { [x: string]: string | number | boolean; }) => Object.keys(data).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');

export const checkStatus = (response: { status: number; statusText: any; }) => {

    if (response.status === HTTP_OK || response.status === HTTP_NO_CONTENT) {
        return response;
    } else {
        const errorMsg = response.statusText;
        const error = new Error(errorMsg);
        throw error;
    }
};

export const fetchGet = async (methodName: any, urlParam: any, respType = 'Inline') => {
    const responseType = `responseMetadataFormat=${respType}`;
    const endPoint = urlParam ? `${methodName}?${responseType}&${objectToUrlParam(urlParam)}` : `${methodName}?${responseType}`;
    const url = new URL(endPoint.replace(/^\/+/, ''), apiEndpoint).href;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(checkStatus)
        .then((res: any) => {
            if (res && res.headers.get('content-type') && res.headers.get('content-type').indexOf('application/json') !== -1) {
                return res.json();
            }

            return null;
        });
};

export const fetchFile = async (methodName: any, urlParam: any) => {
    const endPoint = urlParam ? `${methodName}?&${objectToUrlParam(urlParam)}` : `${methodName}`;
    const url = new URL(endPoint.replace(/^\/+/, ''), apiEndpoint).href;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    }).then(checkStatus)
        .then((res: any) => {
            if (res) {
                return res.blob();
            }

            return null;
        });
};

export const fetchPost = async (methodName: any, bodyObject: any, urlParam: any, respType = 'Inline') => {
    const resType = `responseMetadataFormat=${respType}`;
    const endPoint = urlParam ? `${methodName}?${resType}&${objectToUrlParam(urlParam)}` : `${methodName}?${resType}`;
    const url = new URL(endPoint.replace(/^\/+/, ''), apiEndpoint).href;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(bodyObject)
    }).then(checkStatus)
        .then((res: any) => {
            if (res && res.headers.get('content-type') && res.headers.get('content-type').indexOf('application/json') !== -1) {
                return res.json();
            }

            return null;
        });
};

export const fetchPut = async (methodName: any, bodyObject: BodyInit | null | undefined, respType = 'None', urlParam: any) => {
    const responseType = `responseMetadataFormat=${respType}`;
    const endPoint = urlParam ? `${methodName}?${responseType}&${objectToUrlParam(urlParam)}` : `${methodName}?${responseType}`;
    const url = new URL(endPoint.replace(/^\/+/, ''), apiEndpoint).href;

    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: typeof (bodyObject) === 'string' ? bodyObject : JSON.stringify(bodyObject)
    }).then(checkStatus)
        .then((res: any) => {
            if (res && res.headers.get('content-type') && res.headers.get('content-type').indexOf('application/json') !== -1) {
                return res.json();
            }

            return null;
        });
};

export const fetchDelete = async (methodName: any, bodyObject: BodyInit | null | undefined, respType = 'None') => {
    const endPoint = `${methodName}?responseMetadataFormat=${respType}`;
    const url = new URL(endPoint.replace(/^\/+/, ''), apiEndpoint).href;
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: typeof (bodyObject) === 'string' ? bodyObject : JSON.stringify(bodyObject)
    }).then(checkStatus)
        .then((res: any) => {
            if (res && res.headers.get('content-type') && res.headers.get('content-type').indexOf('application/json') !== -1) {
                return res.json();
            }

            return 'Success';
        });
};
