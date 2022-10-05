/* eslint-disable no-undef */
/* eslint-disable no-global-assign */

const ENV: string = process.env.NODE_ENV === 'production' ? 'prod' : 'hom'

 const environment: string = process.env.PUBLIC_URL+'/api/'
//  const environment: string = 'https://admshopping.kimmais.com.br/api/'




export default {
  environment
}
