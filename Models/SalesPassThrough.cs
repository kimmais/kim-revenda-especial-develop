using System;
namespace admin.Models
{
    public class SalesPassThrough
    {
     public double amountPaid { get; set; }
     public double totalOrderAmount { get; set; }
     public Int32 typeReseller { get; set; }
     public Double commissionAmount { get; set; }
     public Double feeAmount { get; set; }
     public Double rechargeValue { get; set; }
     public Double rechargeValueAverage { get; set; }
     public String operatorName { get; set; }
     public Int32 orderCount { get; set; }
     public String dateOrder { get; set; }
     public String transferDate { get; set; }

    }
}