using System;
namespace admin.Models
{
    public class FinancialStatement
    {
     public String transactionType { get; set; }
     public Double rechargeValue { get; set; }
     public String dateAmountPaid { get; set; }
     public String dateAmountPaidHourAndMinute { get; set; }
     public Double totalDebt { get; set; }
     public Double totalBalance { get; set; }

    }
}
