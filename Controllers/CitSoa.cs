using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using admin.Models;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using admin.Services;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Collections;

namespace admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitSoaController : ControllerBase
    {

        private readonly ILogger<CitSoaController> _logger;
        private readonly IConfiguration _config;

        public string _idAdmin() => String.Format(User.FindFirst("Id").Value);
        public string _tokenApi() => String.Format(User.FindFirst("TokenApi").Value);

        public CitSoaController(ILogger<CitSoaController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }




        public static object GetListPreStockBalance(CitSoa citSoaAcess)
        {

            try
            {
                string token = "bearer " + citSoaAcess.citSoaToken;

                var data = new { codigoTitularRevenda = citSoaAcess.resellerOperatorId };

                dynamic balance =  UtilServices.RequestCitSoa("post",citSoaAcess.url, token, "/citsbe-recarga-service/citsbe/recarga/carga/estocagem/saldo", "", data);


                var selectItemJson = balance.SelectToken("data");
                var list = JsonConvert.DeserializeObject<List<dynamic>>(selectItemJson.ToString());

                var operatorBalance = new ArrayList();

                foreach (var operatorItem in list)
                {
                    object item = new 
                    {
                        type = (string)operatorItem.tipoTarifa.Value,
                        balance = (decimal)operatorItem.saldoDisponivel
                    };
                    operatorBalance.Add(item);
                }

                return operatorBalance;


            }
            catch (Exception)
            {
                // IUtilController util = new UtilController();

                // listPreStockBalance.Add(new PreStockBalance()
                // {
                //     returnDefault = util.SaveError(ex, "PreStockBalance - CRM", "GetListPreStockBalance Exception")
                // });

                // return listPreStockBalance;
            }

            // return listPreStockBalance;

            return null;
        }



        public static object SearchApiCitSoa(CitSoa objSoa, string typeSearch)
        {

            // var returnCit = new ReturnCitSoa();
            // var citSoaResult = new ReturnCitSoa();

            try
            {
                if (objSoa.citSoaVersion == 0)
                {
                    var citSoaResult = KeepAlive(objSoa);
                }
                if (objSoa.citSoaVersion == 1)
                {
                   // var citSoaResult = KeepAliveNOVO(objSoa);
                }


                // if (citSoaResult.message.Equals("OK"))
                // {
                //     switch (typeSearch)
                //     {
                //         case "CardBallance":
                //             returnCit = GetCardBallance(objSoa);
                //             break;
                //         case "TypeCard":
                //             returnCit = GetTypeCard(objSoa);
                //             break;
                //         case "LoadRequest":
                //             returnCit = InquiryLoadRequest(objSoa);
                //             break;
                //         case "ExtractCar":
                //             returnCit = GetExtractCar(objSoa);
                //             break;
                //         case "CardHolder":
                //             returnCit = GetCardHolder(objSoa);
                //             break;
                //         case "PreStockBalance":
                //             returnCit = GetPreStockBalance(objSoa);
                //             break;
                //         case "ConsultaRevalidaCartao":
                //             returnCit = GetConsultaRevalidaCartao(objSoa);
                //             break;
                //         default:
                //             break;
                //     }
                // }
                // else
                // {
                //     var result = new ReturnDefault
                //     {
                //         message = "Serviço não disponível no momento, por favor tente mais tarde."
                //     };

                //     UtilController.SaveLog(ref result, result.message + citSoaResult.code, "ApiCitSoa - CRM", typeSearch + " KeepAlive");

                //     returnCit.result = result;
                // }
            }
            catch (Exception)
            {
                // returnCit.result = UtilController.SaveError(ex, "ApiCitSoa - CRM", typeSearch + " Exception");
            }

            // return returnCit;

            return null;

        }


        public static object KeepAlive(CitSoa objSoa)
        {
           // var retorno = new ReturnCitSoa();

            try
            {
                var citSoaResult = Authenticate(objSoa);

                //if (citSoaResult.listData.Count > 0)
                //{
                //    objSoa.autorizationAPI = citSoaResult.listData.First().token;

                //    AutorizationApi = objSoa.autorizationAPI;

                //    retorno = GetDataApi(null, "/api/carga/cartao/keepalive", objSoa);
                //}
                //else
                //    retorno = citSoaResult;
            }
            catch (Exception)
            {
                //retorno.result = UtilController.SaveError(ex, "KeepAlive - CRM", "KeepAlive Exception");
            }

            //return retorno;

            return null;

        }


        public static object Authenticate(CitSoa objSoa)
        {
            try
            {
                var obj = new
                {
                    username = objSoa.soaUser,
                    password = objSoa.soaPassword
                };


                if (objSoa.citSoaVersion == 0)
                {
                   // GetDataApi(obj, "/api/auth/authenticate", objSoa);
                }
                if (objSoa.citSoaVersion == 1)
                {
                    string token = "bearer " + objSoa.citSoaToken;
                     dynamic authenticate =  UtilServices.RequestCitSoaAuthenticate("get",objSoa.url, "/citsbe-cartao-service/citsbe/cartao/keepalive", "",null,token);
                    if (authenticate.message == null || !authenticate.message.Equals("ERROR"))
                    {
                        return true;

                    }
                    else
                    {
                        return false;
                    }

                }

            }
            catch (Exception)
            {
                return false;
            }

            return false;
        }


        private static object GetDataApi(object obj, string caminhoApi, CitSoa objSoa)
        {
            // var ret = new ReturnCitSoa();
            return null;
            var jsonDataUpload = "";

            if (obj != null)
                jsonDataUpload = JsonConvert.SerializeObject(obj);

            var uri = string.Concat(objSoa.url, caminhoApi);

         //   return UtilServices.RequestCitSoaAuthenticate(objSoa.url, caminhoApi, "", obj);




        }



        //public object KeepAliveNOVO(CitSoa objSoa)
        //{
        //    // var retorno = new ReturnCitSoa();

        //    try
        //    {
        //        objSoa.autorizationApi = objSoa.operatorToken;

        //        var CitSoaVersao = objSoa.CitSoaVersao;

        //        switch (CitSoaVersao)
        //        {
        //            case 1:
        //                retorno = NovoGetDataApi(null, "/citsbe-cartao-service/citsbe/cartao/keepalive", objSoa);
        //                break;
        //            default:
        //                break;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        var retornoErro = new ReturnCitSoa();

        //        if (ex.Message.Contains("401"))
        //        {
        //            var result = new ReturnCitSoa();

        //            retornoErro = Authenticate(objSoa);

        //            retorno.result = UtilController.SaveError(ex, "401 - Novo Token criado - KeepAliveNOVO", "CRM - KeepAliveNOVO/Authenticate LOG");

        //            objSoa.TokenCitSoa = retornoErro.listData[0].access_token;
        //            return retorno = KeepAlive(objSoa);
        //        }
        //        else
        //        {

        //            var result = new ReturnCitSoa();

        //            retorno.result = UtilController.SaveError(ex, "ApiCitSoaNovo", "CRM - KeepAliveNOVO");
        //        }

        //    }

        //    return retorno;
        //}






    }
    
}
