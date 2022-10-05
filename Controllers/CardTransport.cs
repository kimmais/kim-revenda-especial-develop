using System.Runtime.CompilerServices;
using System.Security.AccessControl;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using admin.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System;
using admin.Services;

namespace admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardTransportController : ControllerBase
    {

        private readonly ILogger<CardTransportController> _logger;
        private readonly IConfiguration _config;

        public string _idAdmin() => String.Format(User.FindFirst("Id").Value);
        public string _tokenApi() => String.Format(User.FindFirst("TokenApi").Value);
        public string _operator() => String.Format(User.FindFirst("Operator").Value);
        public bool _status() => bool.Parse(String.Format(User.FindFirst("Status").Value));
        public CardTransportController(ILogger<CardTransportController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;

        }


        [Authorize]
        [HttpGet("add")]
        public ActionResult<CardTransportCheck> CardTransportAdd( [FromQuery] String cardNumber, [FromQuery] Int32 operatorId)
        {

            if(!_status()){
              StatusCode(403,new { message = "Forbidden" });
            }

            CardTransportCheck requestCheck =  CardTransportCheck(cardNumber,operatorId);

            // CardTransportCheck requestCheck2 =  CardTransportCheckCitSoa(cardNumber,operatorId);

            if ( requestCheck.isCpf)
            {

            var data = new
            {
                CodigoUsuario = _idAdmin(),
                CodigoOperadora = _operator(),
                NumeroCartao = cardNumber,
                NomeCartao = cardNumber,
            };

                try
                {
                dynamic requestNewCard = UtilServices.RequestApiKim("post", _idAdmin(), _tokenApi(), _config.GetValue<string>("ConnectionStrings:KimApi"), "/Revenda/NovoCartao", "", data);

                var cardTransportRegistered = new CardTransport();
                cardTransportRegistered.eligible = Convert.ToBoolean(requestNewCard.ListaObjeto[0].HasCartaoElegivel.Value);
                cardTransportRegistered.id = Convert.ToInt32(requestNewCard.ListaObjeto[0].CodigoUsuarioCartao.Value);
                cardTransportRegistered.cardNumber = cardNumber;
                cardTransportRegistered.operatorId = _operator();

                return  Ok(cardTransportRegistered);
                }
                catch (System.Exception)
                {

                var cardTransportRegistered = new CardTransport();
                cardTransportRegistered.eligible = true;
                cardTransportRegistered.id = requestCheck.id;
                cardTransportRegistered.cardNumber = cardNumber;
                cardTransportRegistered.operatorId = _operator();
                    
                  return  Ok(cardTransportRegistered);
                }






                
            }
            else
            {
                if(requestCheck.isCpf){
                var cardTransportRegistered = new CardTransport();
                cardTransportRegistered.eligible = requestCheck.eligible;
                cardTransportRegistered.id = requestCheck.id;
                cardTransportRegistered.cardNumber = cardNumber;
                cardTransportRegistered.operatorId = _operator();
                return Ok(cardTransportRegistered);
                }else{
                    return NotFound(new { message = "O cartão de transporte não esta vinculado a um  usuario." });
                }

            }
        }

        public CardTransportCheck CardTransportCheck( [FromQuery] String cardNumber, [FromQuery] Int32 operatorId )
        {

            String urlCheckParameters = "?nuCartao=" + cardNumber + "&codOperadora=" + operatorId;
            dynamic requestCheck = UtilServices.RequestApiKim("get", _idAdmin(), _tokenApi(), _config.GetValue<string>("ConnectionStrings:KimApi"), "/Revenda/ConsultaCartao", urlCheckParameters);

           

            try
            {
                CardTransportCheck status = new CardTransportCheck {
                valid = requestCheck.Mensagem.Value != "Sucesso" ? false : true,
                isCpf = requestCheck.Status.Value == 3 ? false : true,
                eligible = ( requestCheck.Mensagem.Value == "Sucesso" && requestCheck.Status.Value != 3 ) ? Convert.ToBoolean(requestCheck.ListaObjeto[0].HasCartaoElegivel.Value) : false,
                id = ( requestCheck.Mensagem.Value == "Sucesso" && requestCheck.Status.Value != 3 ) ? Convert.ToInt32(requestCheck.ListaObjeto[0].CodigoUsuarioCartao.Value) : 0
            };
            return status;
            }
            catch (System.Exception)
            {
                
                CardTransportCheck status = new CardTransportCheck {
                valid = requestCheck.Mensagem.Value != "Sucesso" ? false : true,
                isCpf = requestCheck.Status.Value == 3 ? false : true,
                eligible = ( requestCheck.Mensagem.Value == "Sucesso" && requestCheck.Status.Value != 3 ) ? false : false,
                id = ( requestCheck.Mensagem.Value == "Sucesso" && requestCheck.Status.Value != 3 ) ? 0 : 0
            };
            return status;
            }


            
        }



        [Authorize]
        [HttpGet("check")]
        public CardTransportCheck CardTransportCheckCitSoa( [FromQuery] String cardNumber, [FromQuery] Int32 operatorId )
        {

            String urlCheckParameters = "?nuCartao=" + cardNumber + "&codOperadora=" + operatorId;
            dynamic requestCheck = UtilServices.RequestApiKim("get", _idAdmin(), _tokenApi(), _config.GetValue<string>("ConnectionStrings:KimApi"), "/UsuarioCartao/ConsultaCartaoCitSoa", urlCheckParameters);
            var statusValid = (requestCheck.Status.Value == 3 || requestCheck.Status.Value == 5)?true:false;

            CardTransportCheck status = new CardTransportCheck {
                valid = statusValid ? true : false,
                isCpf = statusValid && requestCheck.Status.Value == 5 ? true : false,
                eligible = false,
                id = 0
            };

            return status;
        }

        [Authorize]
        [HttpPost("connect")]
        public ActionResult<CardTransportConnect>  CardTransportConnect([FromBody] CardTransportConnect form)
        {

            var data = new
            {
                CodigoOperadora = _operator(),
                NumeroCartao = form.cardNumber,
                CPF = form.cpf,
                NomeDependente = form.name,
                Telefone = form.phone,
                Email = form.email
            };


                dynamic requestNewCard = UtilServices.RequestApiKim("post", _idAdmin(), _tokenApi(), _config.GetValue<string>("ConnectionStrings:KimApi"), "/UsuarioCartao/AssociarCartaoCitSoa", "", data);

if(requestNewCard.Mensagem.Value != "Sucesso"){
    return NotFound(new { message = requestNewCard.Mensagem.Value });
}


                return Ok(null);
        }



    }
}