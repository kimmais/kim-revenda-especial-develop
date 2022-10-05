using System;
namespace admin.Models
{
    public class CardTypeOperator
    {

        public Int32 id { get; set; }
        public Int32 operatorId { get; set; }
        public String operatorName { get; set; }
        public String shortName { get; set; }
        public String fullName { get; set; }
        public Double commisValue { get; set; }
        public String typeValue { get; set; }

    }
}
