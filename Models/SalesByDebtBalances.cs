using System;
namespace admin.Models
{
    public class SalesByDebtBalances
    {
     public Int32 userId { get; set; }
     public String userName { get; set; } 
     public String transferDate { get; set; }
     public Double limitReseller { get; set; }
     public Double totalOrderAmount { get; set; }
     public Double balanceDue { get; set; }
     public String operatorName { get; set; }

    }
}
