/* eslint-disable no-param-reassign */
export const groupBy = key => array => {
    if (!array) {
      return []
    }
    return array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key]
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
      return objectsByKeyValue
    }, {})
  }
  
  export default null