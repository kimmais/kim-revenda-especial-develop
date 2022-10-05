using System;
namespace admin.Models
{
    public class OrderAuditReport
    {
     public Int32 orderId { get; set; } 
     public String accountable { get; set; }
     public Int32 ordemItemId { get; set; }
     public String cardNumber { get; set; } 
     public Double rechargeValue { get; set; }
     public String dateAmountPaid { get; set; }
     public String dateAmountPaidHourAndMinute { get; set; }
     public Int32 orderStatus { get; set; }
     public String orderOperatorId { get; set; }
     public String dateOperatorAmountPaid { get; set; }
     public String dateOperatorAmountPaidHourAndMinute { get; set; }

     

    }
}
