using System;
namespace admin.Models
{
    public class CardTransportConnect
    {
        public String operatorId { get; set; }
        public String cardNumber { get; set; }
        public String cardName { get; set; }
        public String cpf { get; set; }

        public String email { get; set; }
        public String name { get; set; }
        public String phone { get; set; } 
        public Boolean connectCpf { get; set; } = true;

    }
}
