using System;
namespace admin.Models
{
    public class Reseller
    {
        public String cnpj { get; set; }
        public String cpf { get; set; }
        public String name { get; set; }
        public String areaCode { get; set; }
        public String cellPhone { get; set; } 
        public String email { get; set; }
        public Boolean isAuthorizedResale { get; set; }
        public String corporateName { get; set; }
        public String publicPlace { get; set; }
        public String publicPlaceNumber { get; set; }
        public String publicPlaceComplement { get; set; }
        public String publicPlacePostalCode { get; set; }
        public String neighborhood { get; set; }
        public String city { get; set; }
        public String state { get; set; }
        public Int32 typeReseller { get; set; }
        public Double limitReseller { get; set; }
        public Int32 numberOfDaysForPayment { get; set; }
        public Int32 operatorId { get; set; }
        public String operatorName { get; set; }
        public Int16 amountOfEquipment { get; set; }
        public Int32? parentCompanyId { get; set; }
        public Boolean ?isSpecial { get; set; }
        public Boolean ?sendEmail { get; set; }
        public CardTypeOperator[] ?cardTypeOperator { get; set; }
        // public ResellerEquipment[] ?equipment { get; set; }
        public Int32 ?id { get; set; }
        public Boolean isActive { get; set; }
        public Boolean isSuspendedResale { get; set; }

    }
}
