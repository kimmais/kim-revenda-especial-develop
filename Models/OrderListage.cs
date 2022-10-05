using System;
namespace admin.Models
{
    public class OrderListage
    {
     public Int32 orderId { get; set; }
     public String accountable { get; set; }
     public String operatorName { get; set; }
     public String cardNumber { get; set; } 
     public Double commissionAmount { get; set; }
     public Double feeAmount { get; set; }
     public Double rechargeValue { get; set; }
     public Double rechargeValueAverage { get; set; }
     public String dateAmountPaid { get; set; }
     public String dateAmountPaidHourAndMinute { get; set; }

    }
}
