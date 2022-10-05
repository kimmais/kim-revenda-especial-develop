using System.Text;
using System;
namespace admin.Models
{
    public class CardTransportApi
    {
        public String NumeroCartao { get; set; }

        public String NomeCartao { get; set; }
        public Int32  CodigoUsuarioCartao { get; set; }
        public String CodigoOperadora { get; set; }
        public Int32 TipoPedido { get; set; }
        public Decimal ValorRecarga { get; set; }



    }
}


