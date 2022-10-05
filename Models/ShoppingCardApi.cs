using System.Text;
using System;
using System.Collections;
namespace admin.Models
{
    public class ShoppingCardApi
    {
        public Int32 CanalVenda { get; set; }
        public Int32  CodigoFormaPagamento { get; set; }
        public String CodigoUsuario { get; set; }
        
        public ArrayList ListaItemPedido { get; set; }
        public Double ValorPedido { get; set; }

    }
}


