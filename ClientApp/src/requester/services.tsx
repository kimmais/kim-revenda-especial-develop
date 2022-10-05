const services: any = {
  postLogin: {
    method: 'post',
    endpoint: 'user/login',
    source: 'kim'  
  },
  getReseller: {
    method: 'get',
    endpoint: 'reseller',
    source: 'kim'  
  },
  postReseller: {
    method: 'post',
    endpoint: 'reseller',
    source: 'kim'  
  },
  putReseller: {
    method: 'put',
    endpoint: 'reseller/{{id}}',
    source: 'kim'  
  },
  getResellerCardTypeOperatorAndValues: {
    method: 'get',
    endpoint: 'reseller/{{id}}/cardTypeOperatorAndValues',
    source: 'kim'  
  },
  getCardTypeOperatorAndParameters: {
    method: 'get',
    endpoint: 'reseller/cardTypeOperatorAndParameters',
    source: 'kim'  
  },
  getResellerEquipment: {
    method: 'get',
    endpoint: 'reseller/{{id}}/equipment',
    source: 'kim'  
  },
  getResellerBill: {
    method: 'get',
    endpoint: 'reseller/{{id}}/bill',
    source: 'kim'  
  },
  getReportsSalesByReseller: {
    method: 'get',
    endpoint: 'reports/salesByReseller/{{id}}?startDate={{startDate}}&endDate={{endDate}}',
    source: 'kim'  
  },
  getReportsSalesByPeriod: {
    method: 'get',
    endpoint: 'reports/salesByPeriod?startDate={{startDate}}&endDate={{endDate}}&dependent={{dependent}}',
    source: 'kim'  
  },
  getReportsSalesByDebtBalances: {
    method: 'get',
    endpoint: 'reports/salesByDebtBalances?endDate={{endDate}}',
    source: 'kim'  
  },
  getCardTransportCheck: {
    method: 'get',
    endpoint: 'cardTransport/check?operatorId={{operatorId}}&cardNumber={{cardNumber}}',
    source: 'kim'  
  },
  getCardTransportAdd: {
    method: 'get',
    endpoint: 'cardTransport/add?operatorId={{operatorId}}&cardNumber={{cardNumber}}',
    source: 'kim'  
  },
  postCardTransportConnect: {
    method: 'post',
    endpoint: 'cardTransport/connect',
    source: 'kim'  
  },
  postNewPurchaseOrder: {
    method: 'post',
    endpoint: 'order',
    source: 'kim'  
  },
  getOrderHistoric:{
    method: 'get',
    endpoint: 'order/historic?page={{number}}',
    source: 'kim'  
  },
  getUserWallet:{
    method: 'get',
    endpoint: 'user/wallet',
    source: 'kim'  
  },
  getOrderListage:{
    method: 'get',
    endpoint: 'reports/orderListage?startDate={{startDate}}&endDate={{endDate}}&orderId={{orderId}}&dependent={{dependent}}',
    source: 'kim'  
  },
  getOrderAuditReport:{
    method: 'get',
    endpoint: 'reports/orderAuditReport?startDate={{startDate}}&endDate={{endDate}}&orderId={{orderId}}&dependent={{dependent}}',
    source: 'kim'  
  },
  postChangePassword:{
    method: 'post',
    endpoint: 'user/changePassword',
    source: 'kim'  
  },
  getUserSubsidiary:{
    method: 'get',
    endpoint: 'user/subsidiary',
    source: 'kim'  
  },
  putUserSubsidiary: {
    method: 'put',
    endpoint: 'user/subsidiary/{{id}}',
    source: 'kim'  
  },
  getFinancialStatement:{
    method: 'get',
    endpoint: 'reports/financialStatement?startDate={{startDate}}&endDate={{endDate}}&dependent={{dependent}}',
    source: 'kim'  
  },
  getState: {
    method: 'get',
    endpoint: 'state/list',
    source: 'kim'
  },
  putPassword: {
    method: 'put',
    endpoint: 'reseller/{{id}}/password',
    source: 'kim'  
  },
}

export default services