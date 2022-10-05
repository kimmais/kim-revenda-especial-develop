using System;
namespace admin.Models
{
    public class SalesByReseller
    {
     public Int32 id { get; set; }
     public Int32 status { get; set; }
     public double amountPaid { get; set; }
     public double totalOrderAmount { get; set; }
     public Int32 userId { get; set; }
     public String userName { get; set; }
     public Int32 typeReseller { get; set; }
     public Double limitReseller { get; set; }
     public Int32 numberOfDaysForPayment { get; set; }
     public Double commissionAmount { get; set; }
     public Double feeAmount { get; set; }
     public Double rechargeValue { get; set; }
     public String cardNumber { get; set; }
     public String cardTypeName { get; set; }
     public String operatorName { get; set; }
     public String dateAmountPaid { get; set; }
     public String dateAmountPaidHourAndMinute { get; set; }
    }
}
