using System;
namespace admin.Models
{
    public class SalesByPeriod
    {
     public Int32 orderCount { get; set; }
     public Int32 userId { get; set; }
     public String userName { get; set; }
     public Double commissionAmount { get; set; }
     public double amountPaid { get; set; }
     public Double feeAmount { get; set; }
     public Double rechargeValue { get; set; }
     public Double rechargeValueAverage { get; set; }
     public String operatorName { get; set; } 
     public String dateAmountPaid { get; set; }
     public String dateAmountPaidHourAndMinute { get; set; }

    }
}
