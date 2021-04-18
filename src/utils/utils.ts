import * as _ from 'lodash';

export const obj_diff = (object: any, base: any) => {
  function changes(object: any, base: { [x: string]: any; }) {
    return _.transform(object, function (result: { [x: string]: any; }, value: any, key: string | number) {
      if (!_.isEqual(value, base[key])) {
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

/**
* isNull checks that passed value is empty, undefined or null
* @param {any} value
* @returns {boolean}
*/
export const isNull = (value: string | any[] | null | undefined) => {
  return value === '' ||
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0);
}

/**
 * This functions find and returns fist key for a given value in the given object. 
 * @param {Object} object  Values.
 * @param {any} value  Value to find. 
 */
export function getKeyByValue(object: { [x: string]: any; }, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}