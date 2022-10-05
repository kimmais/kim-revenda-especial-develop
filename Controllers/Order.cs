using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using admin.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System;
using Newtonsoft.Json;
using System.Collections;
using admin.Services;


namespace admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {

        private readonly ILogger<OrderController> _logger;
        private readonly IConfiguration _config;

        public string _idAdmin() => String.Format(User.FindFirst("Id").Value);
        public string _tokenApi() => String.Format(User.FindFirst("TokenApi").Value);
        public string _email() => String.Format(User.FindFirst("Email").Value);
        public string _operator() => String.Format(User.FindFirst("Operator").Value);
        public bool _status() => bool.Parse(String.Format(User.FindFirst("Status").Value));

        public OrderController(ILogger<OrderController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;

        }


        [Authorize]
        [HttpPost()]
        public ActionResult<User> newPurchaseOrder([FromBody] CardTransport[] order)
        {
            if(!_status()){
              StatusCode(403,new { message = "Forbidden" });
            }

            UserController userController = new UserController(null, _config);

            dynamic operatorDate = userController.Operator( _operator());

            bool autorization = CitSoaController.Authenticate(operatorDate);

            if (!autorization)
            {
                return NotFound(new { message = "Operadora se encontra fora do ar" });
            }


            var listOrder = new ArrayList();
            decimal amount = 0;

            foreach (var item in order)
            {
                amount = amount + (decimal)item.value;
                var aux = new CardTransportApi
                {
                    NumeroCartao = item.cardNumber,
                    NomeCartao = item.cardNumber,
                    CodigoOperadora = item.operatorId,
                    CodigoUsuarioCartao = item.id,
                    TipoPedido = 1,
                    ValorRecarga = (decimal)item.value

                };


                listOrder.Add(aux);

            }


            var data = new
            {
                CanalVenda = 33,
                CodigoFormaPagamento = 13,
                CodigoUsuario = _idAdmin(),
                ListaItemPedido = (ArrayList)listOrder,
                ValorPedido = amount,
            };

            dynamic requestNewOrder = UtilServices.RequestApiKim("post", _idAdmin(), _tokenApi(), _config.GetValue<string>("ConnectionStrings:KimApi"), "/Revenda/NovoPedido", "", data);


            var a = order;
            if(requestNewOrder.Mensagem.Value == "Sucesso"){
                return StatusCode(201, new { message = "Sucesso" });
            }else{
                return NotFound(new { message = requestNewOrder.Mensagem.Value });
            }
            
        }


        [Authorize]
        [HttpGet("historic")]
        public ArrayList Historic([FromQuery] String page = "0")
        {

            String urlParameters = "?status=2&pagina=" + (string)page;
            dynamic requestHistoric = UtilServices.RequestApiKim("get", _idAdmin(), _tokenApi(), _config.GetValue<string>("ConnectionStrings:KimApi"), "/Revenda/ObterHistoricoPedidoPaginacao", urlParameters);

            var listOrderJson = requestHistoric.SelectToken("ListaObjeto");
            var listOrderApi = JsonConvert.DeserializeObject<List<dynamic>>(listOrderJson.ToString());

            var listOrder = new ArrayList();


            foreach (var item in listOrderApi)
            {

                var cardsJson = JsonConvert.DeserializeObject<List<dynamic>>(item.ListaItemPedido.ToString());
                var cards = new ArrayList();

                foreach (var cardItem in cardsJson)
                {
                    var cardAux = new CardTransport
                    {
                        id = cardItem.CodigoUsuarioCartao,
                        cardNumber = cardItem.NomeUsuarioCartao,
                        operatorId = cardItem.CodigoOperadora,
                        operatorName = cardItem.NomeOperadora,
                        value = cardItem.ValorRecarga
                    };
                    cards.Add(cardAux);
                }

                var aux = new Historic
                {
                    id = item.CodigoPedido,
                    date = item.DataHoraPedido,
                    statusText = item.DescricaoStatusPedido,
                    value = item.ValorPedido,
                    cards = cards
                };


                listOrder.Add(aux);


            }


            return listOrder;
        }


    }
}
