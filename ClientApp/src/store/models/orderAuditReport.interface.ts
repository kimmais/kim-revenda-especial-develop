export interface IOrderAuditReport {
    orderId: number;
    ordemItemId: number;
    cardNumber: string;
    rechargeValue: number;
    dateAmountPaid: string;
    dateAmountPaidHourAndMinute: string;
    orderStatus: number;
    orderOperatorId: string;
    dateOperatorAmountPaid: string;
    dateOperatorAmountPaidHourAndMinute: string;
    accountable:string;
}