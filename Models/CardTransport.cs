using System;
namespace admin.Models
{
    public class CardTransport
    {
        public Int32 id { get; set; }
        public String operatorId { get; set; }
        public String cardNumber { get; set; }

        public Boolean ?eligible { get; set; }
        public String ?operatorName { get; set; }
        public Decimal ?value { get; set; }


    }
}

