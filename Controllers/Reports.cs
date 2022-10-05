using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using admin.Models;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;


namespace admin.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ReportsController : ControllerBase
  {

    private readonly ILogger<ReportsController> _logger;
    private readonly IConfiguration _config;
        private const string _rolesReport = "1,6";
        public string _operator() => String.Format(User.FindFirst("Operator").Value);
        public string _idAdmin() => String.Format(User.FindFirst("Id").Value);

        public ReportsController(ILogger<ReportsController> logger, IConfiguration config)
    {
      _logger = logger;
      _config = config;
    }



    [HttpGet("salesByPeriod")]
    [Authorize]
    public IEnumerable<SalesByPeriod> SalesByPeriod(Int32 userId,[FromQuery] String startDate, [FromQuery] String endDate, [FromQuery] Int32 status =3, [FromQuery] Boolean dependent = true )
    {

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
      {


        var search = $@"SELECT 
            Count(a.cd_pedido) as orderCount
            ,a.cd_usuario as userId
            ,b.nm_usuario as userName
            ,f.nm_fantasia_operadora as operatorName
            ,SUM(c.vl_comissao) as commissionAmount
            ,SUM(c.vl_taxa) as feeAmount
            ,SUM(c.vl_valor_recarga) as rechargeValue
            ,AVG(c.vl_valor_recarga) as rechargeValueAverage
            ,CONVERT(varchar, a.dt_data_pagamento, 103) as dateAmountPaid
            ,CONVERT(VARCHAR(5),a.dt_data_pagamento,108) as dateAmountPaidHourAndMinute
            FROM tb_pedido as a
            Inner join tb_usuario as b ON
            a.cd_usuario = b.cd_usuario
            Inner join tb_pedido_item as c ON
            a.cd_pedido = c.cd_pedido
            Inner join tb_usuario_cartao as d ON
            c.cd_usuario_cartao = d.cd_usuario_cartao
            Inner join tb_tipo_cartao as e ON
            d.cd_tipo_cartao = e.cd_tipo_cartao
            Inner join tb_operadora as f ON
            e.cd_operadora = f.cd_operadora
";

          var order = @"GROUP BY a.cd_usuario,a.dt_data_pagamento,b.nm_usuario,f.nm_fantasia_operadora,CONVERT(varchar, a.dt_data_pagamento, 103),CONVERT(VARCHAR(5),a.dt_data_pagamento,108)
                        order by a.dt_data_pagamento";
          var filter = " where ";

          filter = filter + @"
                              a.cd_status_pedido = @status
                              AND f.cd_operadora = @operatorId
                              AND a.dt_data_pagamento between @startDate AND @endDate
                              AND a.ic_revenda = 1 ";

          filter = dependent ? filter + " AND (a.cd_usuario = @IdUsuario OR b.cd_usuario_pai = @IdUsuario) " : filter + " AND (a.cd_usuario = @IdUsuario) ";

          var sql = search + filter + order;

        return connection.Query<SalesByPeriod> (sql,new {
          operatorId = _operator(),
          status = 2,
          startDate = startDate,
          endDate = endDate+" 23:59:59.999",
          IdUsuario = _idAdmin()
        });
      }

      }

    [HttpGet("orderListage")]
    [Authorize]
    public IEnumerable<OrderListage> OrderListage(Int32 userId,[FromQuery] String startDate, [FromQuery] String endDate, [FromQuery] Int32 status =3, [FromQuery] Int32 orderId = 0, [FromQuery] Boolean dependent = true )
    {

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
      {


        var search = $@"SELECT 
             a.cd_pedido as orderId
            ,d.nu_cartao as cardNumber
            ,f.nm_fantasia_operadora as operatorName
            ,SUM(c.vl_comissao) as commissionAmount
            ,SUM(c.vl_taxa) as feeAmount
            ,SUM(c.vl_valor_recarga) as rechargeValue
            ,AVG(c.vl_valor_recarga) as rechargeValueAverage
            ,CONVERT(varchar, a.dt_data_pagamento, 103) as dateAmountPaid
            ,CONVERT(VARCHAR(5),a.dt_data_pagamento,108) as dateAmountPaidHourAndMinute
            ,CONVERT(varchar, b.cd_usuario) + ' : ' + b.nm_usuario as accountable
            FROM tb_pedido as a
            Inner join tb_usuario as b ON
            a.cd_usuario = b.cd_usuario
            Inner join tb_pedido_item as c ON
            a.cd_pedido = c.cd_pedido
            Inner join tb_usuario_cartao as d ON
            c.cd_usuario_cartao = d.cd_usuario_cartao
            Inner join tb_tipo_cartao as e ON
            d.cd_tipo_cartao = e.cd_tipo_cartao
            Inner join tb_operadora as f ON
            e.cd_operadora = f.cd_operadora
            where a.cd_status_pedido = @status
            AND f.cd_operadora = @operatorId
            AND a.dt_data_pagamento between @startDate AND @endDate
            AND a.ic_revenda = 1
            
            ";

          var order = "GROUP BY d.nu_cartao,CONVERT(varchar, b.cd_usuario) + ' : ' + b.nm_usuario,f.nm_fantasia_operadora,CONVERT(varchar, a.dt_data_pagamento, 103),CONVERT(VARCHAR(5),a.dt_data_pagamento,108), a.cd_pedido order by CONVERT(varchar, a.dt_data_pagamento, 103), a.cd_pedido";

          var filter = " ";

          filter = orderId > 0 ? filter + " AND a.cd_pedido = @orderId " : "" ;

          filter = dependent ? filter + " AND (a.cd_usuario = @IdUsuario OR b.cd_usuario_pai = @IdUsuario) " : " AND a.cd_usuario = @IdUsuario ";

          var sql = search + filter + order;

        return connection.Query<OrderListage> (sql,new {
          operatorId = _operator(),
          status = 2,
          startDate = startDate,
          endDate = endDate+" 23:59:59.999",
          IdUsuario = _idAdmin(),
          orderId = orderId
        });
      }

      }

    [HttpGet("orderAuditReport")]
    [Authorize]
    public IEnumerable<OrderAuditReport> OrderAuditReport(Int32 userId,[FromQuery] String startDate, [FromQuery] String endDate, [FromQuery] Int32 status =3, [FromQuery] Int32 orderId = 0, [FromQuery] Boolean dependent = false )
    {

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
      {

        var search = $@"SELECT DISTINCT
                          CONVERT(varchar, a.dt_data_pagamento, 103) as dateAmountPaid
                          ,CONVERT(VARCHAR(5),a.dt_data_pagamento,108) as dateAmountPaidHourAndMinute
                          ,a.cd_pedido as orderId
                          ,c.cd_pedido_item as ordemItemId
                          ,d.nu_cartao as cardNumber
                          ,c.vl_valor_recarga as rechargeValue
                          ,c.cd_status_pedido_item as orderStatus
                          ,c.ds_pedido_operadora as orderOperatorId
                          ,CONVERT(varchar, c.dt_datahora_pedido_operadora, 103) as dateOperatorAmountPaid
                          ,CONVERT(VARCHAR(5),c.dt_datahora_pedido_operadora,108) as dateOperatorAmountPaidHourAndMinute
                          ,CONVERT(varchar, e.cd_usuario) + ' : ' + e.nm_usuario as accountable
                          FROM tb_pedido as a
                          Inner join tb_pedido_item as c ON
                          a.cd_pedido = c.cd_pedido
                          Inner join tb_usuario_cartao as d ON
                          c.cd_usuario_cartao = d.cd_usuario_cartao
                          Inner join tb_usuario as e ON
                          d.cd_usuario = e.cd_usuario 
            ";
          
          // Line 170
          // ,CONVERT(varchar, @IdUsuario) + ' : ' + CASE WHEN (select p.nm_fantasia from tb_usuario p where p.cd_usuario = @IdUsuario) IS NULL THEN e.nm_usuario END as accountable

          var order = "";
          var filter = " where ";

          filter = orderId > 0 ? filter + " AND a.cd_pedido = @orderId " : "" ;

          filter = dependent ? filter + " AND (a.cd_usuario = @IdUsuario OR e.cd_usuario_pai = @IdUsuario) " : " AND a.cd_usuario = @IdUsuario ";
          filter = filter + @" AND a.dt_data_pagamento between @startDate AND @endDate ";

          var sql = search + filter + order;

        return connection.Query<OrderAuditReport> (sql,new {
          startDate = startDate,
          endDate = endDate+" 23:59:59.999",
          IdUsuario = _idAdmin(),
          orderId = orderId
        });
      }

      }

    [HttpGet("financialStatement")]
    [Authorize]
    public IEnumerable<FinancialStatement> FinancialStatement([FromQuery] String startDate, [FromQuery] String endDate, [FromQuery] Boolean dependent = false )
    {

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
      {


          var filter = @" where a.dt_data_pagamento between @startDate AND @endDate ";
          var filterUser = dependent ? " AND (a.cd_usuario = @IdUsuario OR b.cd_usuario_pai = @IdUsuario) " : " AND (a.cd_usuario = @IdUsuario) ";

              filter = filter + filterUser;                    

        var search = $@"SELECT 
                        a.cd_usuario
                        , 'Pedido de Venda:' + cast(a.cd_pedido as varchar) as transactionType
                        , a.vl_total_pedido * -1 as rechargeValue
                        , a.dt_data_pagamento as dateAmount
                        , CONVERT(varchar, a.dt_data_pagamento, 103) as dateAmountPaid
                        , CONVERT(VARCHAR(5), a.dt_data_pagamento,108) as dateAmountPaidHourAndMinute
                        , (select  sum(aa.vl_total_pedido) from tb_pedido aa
                        where aa.cd_status_pedido = 2
                            "+
                             $@" AND (aa.cd_usuario = @IdUsuario) "
                            +$@"
                            
                            and aa.dt_data_pagamento < @startDate
                            group by aa.cd_usuario) as totalDebt
                            , (select sum(ba.vl_pre_estocagem) from tb_usuario_revenda_pre_estocagem ba  
                            where ba.dt_pre_estocagem < @startDate
                                "+
                                $@" AND (ba.cd_usuario = @IdUsuario) "
                                +$@"
                            group by ba.cd_usuario) as totalBalance
                        FROM   tb_pedido as a 
                        Inner join tb_usuario as b ON
                        a.cd_usuario = b.cd_usuario "
                          +
                           filter 
                          +
                        $@"
                        UNION
                        SELECT c.cd_usuario
                        , 'Pré Estocagem Realizada' as transactionType
                        , c.vl_pre_estocagem as rechargeValue
                        , c.dt_pre_estocagem as dateAmount
                        , CONVERT(varchar, c.dt_pre_estocagem, 103) as dateAmountPaid
                        , CONVERT(VARCHAR(5), c.dt_pre_estocagem,108) as dateAmountPaidHourAndMinute
                        , (select  sum(aa.vl_total_pedido) from tb_pedido aa
                        where aa.cd_status_pedido = 2
                              "+
                              $@" AND (aa.cd_usuario = @IdUsuario) "
                              +$@"
                            
                            and aa.dt_data_pagamento < @startDate
                            group by aa.cd_usuario) as totalDebt
                        , (select sum(ba.vl_pre_estocagem) from tb_usuario_revenda_pre_estocagem ba  
                            where ba.dt_pre_estocagem < @startDate
                                "+
                                $@" AND (ba.cd_usuario = @IdUsuario) "
                                +$@"
                            group by ba.cd_usuario) as totalBalance
                        FROM   tb_usuario_revenda_pre_estocagem as c
                        where c.cd_usuario = @IdUsuario
                        AND c.dt_pre_estocagem between @startDate AND @endDate
";


          var order = @" order by dateAmount";


       

          var sql = search + order;

        return connection.Query<FinancialStatement> (sql,new {
          startDate = startDate,
          endDate = endDate+" 23:59:59.999",
          IdUsuario = _idAdmin()
        });
      }

      }










  }
}
