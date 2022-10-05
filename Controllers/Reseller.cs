using System;
using System.Collections.Generic;
using System.Linq;

using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using admin.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using admin.Services;


namespace admin.Controllers {
  [ApiController]
  [Route ("api/[controller]")]
  public class ResellerController : ControllerBase {

    private readonly ILogger<ResellerController> _logger;
    private readonly IConfiguration _config;
    private const string _rolesReseller = "1,6";
    static HttpClient client = new HttpClient();
    public string _operator () => String.Format (User.FindFirst ("Operator").Value);
    public string _idAdmin () => String.Format (User.FindFirst ("Id").Value);

    private static Random _random = new Random();

    public ResellerController (ILogger<ResellerController> logger, IConfiguration config) {
      _logger = logger;
      _config = config;
    }

    [HttpGet ()]
    [Authorize]
    public IEnumerable<Reseller> Get () {

      using (var connection = new SqlConnection (_config.GetValue<string> ("ConnectionStrings:AdminDatabase"))) {

        var sql = @"SELECT 
                      tb_usuario.cd_usuario as id
                      ,tb_usuario.cd_usuario_pai as parentCompanyId
                      ,nu_cnpj_usuario as cnpj
                      ,nu_cpf_usuario as cpf
                      ,nm_usuario as name
                      ,nu_ddd_telefone as areaCode
                      ,nu_telefone as cellPhone
                      ,ds_email_usuario as email
                      ,1 ^ ic_usuario_inativo as isActive
                      ,nm_fantasia as corporateName
                      ,ic_autorizado_revenda as isAuthorizedResale
                      ,tb_usuario.ic_revenda_especial as isSpecial
                      ,tb_usuario_revenda_operadora.cd_operadora
                      ,nm_logradouro as publicPlace
                      ,nu_logradouro as publicPlaceNumber
                      ,ds_complemento_logradouro as publicPlaceComplement
                      ,nu_cep as publicPlacePostalCode
                      ,nm_bairro as neighborhood
                      ,nm_municipio as city
                      ,cd_uf as state
                      ,nu_qtd_equipamentos as amountOfEquipment
                      ,ic_tipo_revenda as typeReseller
                      ,ic_revenda_suspenso as isSuspendedResale
                      ,vl_limite_revenda as limitReseller
                      ,qtd_dias_acerto_revenda as numberOfDaysForPayment
                      ,tb_operadora.cd_operadora as operatorid
                      ,nm_fantasia_operadora as operatorName
                    FROM tb_usuario
                    INNER JOIN tb_usuario_revenda_operadora ON
                    tb_usuario.cd_usuario = tb_usuario_revenda_operadora.cd_usuario
                    INNER JOIN tb_usuario_endereco ON
                    tb_usuario.cd_usuario = tb_usuario_endereco.cd_usuario
                    INNER JOIN tb_operadora ON
                    tb_operadora.cd_operadora = tb_usuario_revenda_operadora.cd_operadora
                    WHERE tb_operadora.cd_operadora = @operatorId 
                    AND tb_usuario.cd_usuario_pai = @parentCompanyId
                    AND ic_inativo = 0";

        return connection.Query<Reseller> (sql, new {
          operatorId = _operator(),
          parentCompanyId = _idAdmin()

        });
      }

    }

    [HttpPut ("{id}")]
    [Authorize]
    public ActionResult<Reseller> Put (String id, [FromBody] Reseller body) {
      var fisic = body.cnpj is null;

      // var fisic = body.cpf.Length > 0 ? true : false;
      
      var sql = "";
      object sqlExecute;

if(body.sendEmail ?? false){

     sql = @"update tb_usuario set
                  ic_autorizado_revenda = @isAuthorizedResale
                  ,ic_usuario_autenticado = @isAuthorized
                  ,ic_usuario_inativo=@isActive
                  ,ic_tipo_revenda=@typeReseller
                  ,ic_revenda_suspenso = @isSuspendedResale
                  ,vl_limite_revenda=@limitReseller
                  ,qtd_dias_acerto_revenda=@numberOfDaysForPayment
                  ,nu_qtd_equipamentos=@amountOfEquipment
                  ,ds_email_usuario=@email
                  ,nm_usuario=@name
                  ,nm_fantasia=@corporateName
                  ,nu_ddd_telefone=@areaCode
                  ,nu_telefone=@cellPhone

                where cd_usuario IN (@id)";


       sqlExecute = new {
            isAuthorizedResale = Convert.ToBoolean (body.isAuthorizedResale) ? 1 : 0,
            isAuthorized = Convert.ToBoolean (body.isAuthorizedResale) ? 1 : 0,
            id = id,
            isActive = Convert.ToBoolean (body.isActive) ? 0 : 1,
            typeReseller = body.typeReseller,
            isSuspendedResale = body.isSuspendedResale,
            limitReseller = body.limitReseller,
            numberOfDaysForPayment = body.numberOfDaysForPayment,
            amountOfEquipment = body.amountOfEquipment,
            corporateName = fisic ? null : body.corporateName,
            email = body.email,
            name = body.name,
            areaCode = body.areaCode,
            cellPhone = body.cellPhone

};

}else{

       sql = @"update tb_usuario set
                  ic_autorizado_revenda = @isAuthorizedResale
                  ,ic_usuario_autenticado = @isAuthorized
                  ,ic_usuario_inativo=@isActive
                  ,ic_tipo_revenda=@typeReseller
                  ,ic_revenda_suspenso=@isSuspendedResale
                  ,vl_limite_revenda=@limitReseller
                  ,qtd_dias_acerto_revenda=@numberOfDaysForPayment
                  ,nu_qtd_equipamentos=@amountOfEquipment

                  ,ds_email_usuario=@email
                  ,nu_cpf_usuario=@cpf
                  ,nu_cnpj_usuario=@cnpj
                  ,nm_usuario=@name
                  ,nm_fantasia=@corporateName
                  ,nu_ddd_telefone=@areaCode
                  ,nu_telefone=@cellPhone

                where cd_usuario IN (@id)";

       sqlExecute = new {
            isAuthorizedResale = Convert.ToBoolean (body.isAuthorizedResale) ? 1 : 0,
            isAuthorized = Convert.ToBoolean (body.isAuthorizedResale) ? 1 : 0,
            id = id,
            isActive = Convert.ToBoolean (body.isActive) ? 0 : 1,
            typeReseller = body.typeReseller,
            isSuspendedResale = body.isSuspendedResale,
            limitReseller = body.limitReseller,
            numberOfDaysForPayment = body.numberOfDaysForPayment,
            amountOfEquipment = body.amountOfEquipment,
            corporateName = fisic ? null : body.corporateName,
            email = body.email,
            cpf = body.cpf,
            cnpj = body.cnpj,
            name = body.name,
            areaCode = body.areaCode,
            cellPhone = body.cellPhone

        };

}

        var sqlUserAdress = @"
          update  tb_usuario_endereco  set
            nm_logradouro = @publicPlace,
            nu_logradouro = @publicPlaceNumber,
            ds_complemento_logradouro = @publicPlaceComplement,
            nm_bairro = @neighborhood,
            nm_municipio = @city,
            cd_uf = @state,
            nu_cep = @publicPlacePostalCode
            
            where cd_usuario IN (@id)
            ";

          var sqlUserAdressExecute = new {
              id = id,               
              publicPlace = body.publicPlace,
              publicPlaceNumber = body.publicPlaceNumber,
              publicPlaceComplement = body.publicPlaceComplement,
              neighborhood = body.neighborhood,
              city = body.city,
              state = Convert.ToInt32( body.state),
              publicPlacePostalCode = body.publicPlacePostalCode
            };

      var sqlConsultLimitReseller = @"SELECT 
                                       vl_limite_revenda as limitReseller
                                       FROM tb_usuario
                                       where cd_usuario IN (@id)";

      using (var connection = new SqlConnection (_config.GetValue<string> ("ConnectionStrings:AdminDatabase"))) {

       var sqlLimitReseller =   connection.QuerySingleOrDefault(sqlConsultLimitReseller, new {
            id = id
          });

      var logLimitReseller = "{antigo:"+sqlLimitReseller.limitReseller+", novo:"+body.limitReseller+"}";

        connection.Execute (sql, sqlExecute);
        connection.Execute (sqlUserAdress, sqlUserAdressExecute);
        var newPassword = RandomString(8);
        var baseUrl = _config.GetValue<string> ("ConnectionStrings:KimApi");
        var emailTamplate = body.isAuthorizedResale? "/EmailRevendaEspecial/EnviarEmailCadastroAprovado":"/EmailRevenda/EnviarEmailCadastroRecusado";
        var emailTamplateParameters = body.isAuthorizedResale? "?codUsuario="+id+"&codOperadora="+_operator()+"&senha="+newPassword: "?codUsuario="+id+"&codOperadora="+_operator();
        
        if(body.sendEmail ?? false){


      var sqlPassword = @"update tb_usuario set
                          ds_senha_usuario = @password,
                          ds_token_usuario = @token
                          where cd_usuario IN (@id) and cd_usuario_pai IN (@parentCompanyId)";


        connection.Execute (sqlPassword, new {
            password = UtilServices.CalculateMD5Hash(newPassword),
            token = Guid.NewGuid().ToString(),
            id = id,
            parentCompanyId = _idAdmin()
        });

          
        HttpResponseMessage response = client.GetAsync(baseUrl+emailTamplate+emailTamplateParameters).Result;
        }
      }

      return null;

    }


    [HttpPut ("{id}/password")]
    [Authorize]
    public ActionResult<Reseller> RessellerPassword (String id) {

    using (var connection = new SqlConnection (_config.GetValue<string> ("ConnectionStrings:AdminDatabase"))) {
      
      var newPassword = RandomString(8);
      var sqlPassword = @"update tb_usuario set
                          ds_senha_usuario = @password,
                          ds_token_usuario = @token
                          where cd_usuario IN (@id) and cd_usuario_pai IN (@parentCompanyId)";

        connection.Execute (sqlPassword, new {
            password = UtilServices.CalculateMD5Hash(newPassword),
            token = Guid.NewGuid().ToString(),
            id = id,
            parentCompanyId = _idAdmin()
        });

 
        var baseUrl = _config.GetValue<string> ("ConnectionStrings:KimApi");
        var emailTamplate = "/EmailRevendaEspecial/EnviarEmailCadastroAprovado";
        var emailTamplateParameters = "?codUsuario="+id+"&codOperadora="+_operator()+"&senha="+newPassword;
       

        HttpResponseMessage response = client.GetAsync(baseUrl+emailTamplate+emailTamplateParameters).Result;

}
      return null;
    }

    [HttpPost]
    [Authorize]
    public ActionResult<Reseller> RessellerAdd ([FromBody] Reseller body) {
      var fisic = body.cnpj is null;
      var isSpecial = body.isSpecial is true;

      var newPassword = RandomString(8);
      var password = UtilServices.CalculateMD5Hash(newPassword);
      var token = Guid.NewGuid().ToString();
      
      var sql = "";
      object sqlExecute;

      var sqlCheckUserDuplicate = fisic ? @"
                                SELECT TOP 1 cd_usuario FROM tb_usuario
                                where 
                                    ( (ic_revenda = 1 or ic_revenda_especial = 1) and (
                                        nu_cpf_usuario = @identificationNumber or 
                                        ds_email_usuario = @email
                                ))" : @"
                                SELECT TOP 1 cd_usuario FROM tb_usuario
                                where 
                                    ( (ic_revenda = 1 or ic_revenda_especial = 1) and (
                                        nu_cnpj_usuario = @identificationNumber or 
                                        ds_email_usuario = @email
                                ))";


if(body.sendEmail ?? false){

     sql = @"
              DECLARE @ID int;
              INSERT INTO tb_usuario (
                  ic_autorizado_revenda
                  ,ic_usuario_autenticado
                  ,ic_usuario_inativo
                  ,ic_tipo_revenda
                  ,ic_revenda_suspenso
                  ,ic_revenda_especial
                  ,cd_usuario_pai
                  ,vl_limite_revenda
                  ,qtd_dias_acerto_revenda
                  ,nu_qtd_equipamentos
                  ,ds_email_usuario
                  ,nm_usuario
                  ,nm_fantasia
                  ,nu_ddd_telefone
                  ,nu_telefone
                  ,ds_senha_usuario
                  ,ds_token_usuario
                  ,dt_cadastro_usuario
                  ,nu_cnpj_usuario
                  ,nu_cpf_usuario                  
                  )
                  VALUES 
                  (
                  @isAuthorizedResale
                  ,@isAuthorized
                  ,@isInative
                  ,@typeReseller
                  ,@isSuspendedResale
                  ,@isSpecial
                  ,@parentCompanyId
                  ,@limitReseller
                  ,@numberOfDaysForPayment
                  ,@amountOfEquipment
                  ,@email
                  ,@name
                  ,@corporateName
                  ,@areaCode
                  ,@cellPhone
                  ,@password
                  ,@token
                  ,GETDATE()
                  ,@cnpj
                  ,@cpf
);
                  SET @ID = SCOPE_IDENTITY();
                  SELECT @ID
";

       sqlExecute = new {
            isAuthorizedResale = 1,
            isAuthorized = 1,
            isInative = 0,
            typeReseller = isSpecial ? 3 : body.typeReseller,
            isSuspendedResale = body.isSuspendedResale,
            isSpecial = isSpecial ? 1 : 0,
            parentCompanyId = _idAdmin(),
            limitReseller = body.limitReseller,
            numberOfDaysForPayment = body.numberOfDaysForPayment,
            amountOfEquipment = body.amountOfEquipment,
            corporateName = fisic ? null : body.corporateName,
            email = body.email,
            name = body.name,
            areaCode = body.areaCode,
            cellPhone = body.cellPhone,
            password = UtilServices.CalculateMD5Hash(newPassword),
            token = Guid.NewGuid().ToString(),
            cnpj = body.cnpj,
            cpf = body.cpf,
};

}else{
       sql = @"
              DECLARE @ID int;
              INSERT INTO tb_usuario (
                  ic_autorizado_revenda
                  ,ic_usuario_autenticado
                  ,ic_usuario_inativo
                  ,ic_tipo_revenda
                  ,ic_revenda_suspenso
                  ,ic_revenda_especial
                  ,vl_limite_revenda
                  ,qtd_dias_acerto_revenda
                  ,nu_qtd_equipamentos
                  ,ds_email_usuario
                  ,nm_usuario
                  ,nm_fantasia
                  ,nu_ddd_telefone
                  ,nu_telefone
                  ,ds_senha_usuario
                  ,ds_token_usuario
                  ,dt_cadastro_usuario
                  ,nu_cnpj_usuario
                  ,nu_cpf_usuario              
                  )
                  VALUES 
                  (
                  @isAuthorizedResale
                  ,@isAuthorized
                  ,@isActive
                  ,@typeReseller
                  ,@isSuspendedResale
                  ,@isSpecial
                  ,@limitReseller
                  ,@numberOfDaysForPayment
                  ,@amountOfEquipment
                  ,@email
                  ,@name
                  ,@corporateName
                  ,@areaCode
                  ,@cellPhone
                  ,@password
                  ,@token
                  ,GETDATE()
                  ,@cnpj
                  ,@cpf
);
                  SET @ID = SCOPE_IDENTITY();
                  SELECT @ID
";

       sqlExecute = new {
            isAuthorizedResale = 1,
            isAuthorized = 1,
            isInative = 0,
            typeReseller = isSpecial ? 3 : body.typeReseller,
            isSuspendedResale = body.isSuspendedResale,
            isSpecial = isSpecial ? 1 : 0,
            limitReseller = body.limitReseller,
            numberOfDaysForPayment = body.numberOfDaysForPayment,
            amountOfEquipment = body.amountOfEquipment,
            corporateName = fisic ? null : body.corporateName,
            email = body.email,
            name = body.name,
            areaCode = body.areaCode,
            cellPhone = body.cellPhone,
            password = UtilServices.CalculateMD5Hash(newPassword),
            token = Guid.NewGuid().ToString(),
            cnpj = body.cnpj,
            cpf = body.cpf,
};
  
}

        var sqlUserAdress = @"
            INSERT INTO  tb_usuario_endereco (
              cd_usuario
              ,ds_tipo_logradouro
              ,nm_logradouro
              ,nu_logradouro
              ,ds_complemento_logradouro
              ,nm_bairro
              ,nm_municipio
              ,cd_uf
              ,nu_cep
            )
            VALUES (
            @id
            ,''
            ,@publicPlace
            ,@publicPlaceNumber
            ,@publicPlaceComplement
            ,@neighborhood
            ,@city
            ,@state
            ,@publicPlacePostalCode
            )
            ";
                                  
      var sqlParamCommis = @"
                              if exists (select cd_usuario_revenda_comissao,
                              cd_usuario,
                              cd_tipo_cartao
                                from tb_usuario_revenda_comissao where cd_usuario = @id and cd_tipo_cartao = @cardTypeId)
                              begin
                              UPDATE tb_usuario_revenda_comissao
                                  SET vl_comissao=@commisValue,ic_tipo_range=@typeValue
                                where cd_usuario = @id and cd_tipo_cartao = @cardTypeId
                              end
                              else
                              begin
                                  INSERT INTO tb_usuario_revenda_comissao
                                  (cd_usuario,cd_tipo_cartao,vl_comissao,ic_tipo_range)
                                  VALUES (@id,@cardTypeId,@commisValue,@typeValue)
                              end";


      using (var connection = new SqlConnection (_config.GetValue<string> ("ConnectionStrings:AdminDatabase"))) {

          var userExist = connection.ExecuteScalar<bool>(sqlCheckUserDuplicate, new
          {
              identificationNumber = fisic ? body.cpf : body.cnpj,
              email = body.email
          });

          if (userExist)
          {
              return StatusCode(409, new { message = "Usuario ja existe" });
              //  return NotFound(new { message = "Usuario ja existe" });
          }


        int userId = connection.QuerySingle<int>(sql, sqlExecute);

        var sqlUserReseller = @"
                    INSERT INTO tb_usuario_revenda_operadora
                      (
                        cd_usuario
                      ,cd_operadora
                      ,ic_inativo
                      )
                      VALUES
                      (
                         @id
                        ,@operatorId
                        ,0
                      );
        ";

          var sqlUserResellerExecute = new {      
              id = userId,         
              operatorId = _operator()
            };

          var sqlUserAdressExecute = new {      
              id = userId,         
              publicPlace = body.publicPlace,
              publicPlaceNumber = body.publicPlaceNumber,
              publicPlaceComplement = body.publicPlaceComplement,
              neighborhood = body.neighborhood,
              city = body.city,
              state = Convert.ToInt32( body.state),
              publicPlacePostalCode = body.publicPlacePostalCode
            };


        connection.Execute (sqlUserAdress, sqlUserAdressExecute);

        connection.Execute (sqlUserReseller, sqlUserResellerExecute);

      for (int i = 0; i < body.cardTypeOperator.Count (); i++) {

          connection.Execute (sqlParamCommis, new {
              id =  userId,
              cardTypeId = body.cardTypeOperator[i].id,
              commisValue = isSpecial ? 0 : body.cardTypeOperator[i].commisValue,
              typeValue = body.cardTypeOperator[i].typeValue
          });


        }

       
        var baseUrl = _config.GetValue<string> ("ConnectionStrings:KimApi");
        var emailTamplate = body.isAuthorizedResale? "/EmailRevendaEspecial/EnviarEmailCadastroAprovado":"/EmailRevenda/EnviarEmailCadastroRecusado";
        var emailTamplateParameters = body.isAuthorizedResale? "?codUsuario="+userId+"&codOperadora="+_operator()+"&senha="+newPassword: "?codUsuario="+userId+"&codOperadora="+_operator();
        
        if(body.sendEmail ?? false){
           HttpResponseMessage response = client.GetAsync(baseUrl+emailTamplate+emailTamplateParameters).Result;
        }
      }

      return null;

    }


    [HttpGet ("{userId}/cardTypeOperatorAndValues")]
    [Authorize]
    public IEnumerable<CardTypeOperator> GetCardTypeOperatorAndValues (Int32 userId) {

      var sqlCommis = @" SELECT 
                          tb_tipo_cartao.cd_tipo_cartao as id,
                          tb_tipo_cartao.cd_operadora as operatorId,
                          tb_operadora.nm_fantasia_operadora as operatorName,
                          ds_tipo_cartao as shortName,
                          ds_detalhe_operacao as fullName,
                          vl_comissao as commisValue,
                          ic_tipo_range as typeValue,
                          tb_usuario_revenda_comissao.cd_usuario
                          FROM tb_usuario_revenda_comissao
                          INNER JOIN tb_tipo_cartao ON
                          tb_tipo_cartao.cd_tipo_cartao = tb_usuario_revenda_comissao.cd_tipo_cartao
                          INNER JOIN tb_operadora ON
                          tb_operadora.cd_operadora = tb_tipo_cartao.cd_operadora
                          
                          where tb_usuario_revenda_comissao.cd_usuario = @userId
                        ";


      using (var connection = new SqlConnection (_config.GetValue<string> ("ConnectionStrings:AdminDatabase"))) {
        return connection.Query<CardTypeOperator> (sqlCommis, new {
          userId = userId
        });
      }

    }

    [HttpGet ("cardTypeOperatorAndParameters")]
    [Authorize]
    public IEnumerable<CardTypeOperator> GetCardTypeOperatorAndParameters (Int32 userId) {


      var sqlParam = @"SELECT 
                          cd_parametro_revenda_comissao,
                          tb_tipo_cartao.cd_tipo_cartao as id,
                          tb_tipo_cartao.cd_operadora as operatorId,
                          tb_operadora.nm_fantasia_operadora as operatorName,
                          ds_tipo_cartao as shortName,
                          ds_detalhe_operacao as fullName,
                          vl_comissao as commisValue,
                          ic_tipo_range as typeValue,
                          tb_tipo_cartao.cd_operadora
                          FROM tb_parametro_revenda_comissao
                          LEFT JOIN tb_tipo_cartao ON
                          tb_tipo_cartao.cd_tipo_cartao = tb_parametro_revenda_comissao.cd_tipo_cartao
                          LEFT JOIN tb_operadora ON
                          tb_operadora.cd_operadora = tb_tipo_cartao.cd_operadora
                          where tb_tipo_cartao.cd_operadora = @operatorId
                        ";

      using (var connection = new SqlConnection (_config.GetValue<string> ("ConnectionStrings:AdminDatabase"))) {
        return connection.Query<CardTypeOperator> (sqlParam, new {
          operatorId = _operator ()
        });
      }

    }

 
    public static string RandomString(int length)
        {
            var random = RandomStringWord(length/2) + RandomStringNumber(length/2);
            return random;
        }


    public static string RandomStringNumber(int length)
        {
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[_random.Next(s.Length)]).ToArray());
        }

    public static string RandomStringWord(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[_random.Next(s.Length)]).ToArray());
        }


  }

}