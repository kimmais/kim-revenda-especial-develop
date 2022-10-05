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




namespace admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;
        public readonly IConfiguration _config;

        public string _idAdmin() => String.Format(User.FindFirst("Id").Value);
        public string _tokenApi() => String.Format(User.FindFirst("TokenApi").Value);
        public bool _subsidiary() => bool.Parse(String.Format(User.FindFirst("Subsidiary").Value));
        public string _email() => String.Format(User.FindFirst("Email").Value);
        public string _operator() => String.Format(User.FindFirst("Operator").Value);

        public UserController(ILogger<UserController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }

        public static IConfiguration StaticConfig { get; private set; }

        [HttpPost("login")]
        public ActionResult<User> Authenticate([FromBody] User model)
        {

            // var sql = @"SELECT
            //             tb_usuario.cd_usuario as id
            //             ,ds_email_usuario as email
            //             ,nm_usuario as name
            //             ,ds_senha_usuario as password
            //             ,ds_token_usuario as tokenApi
            //             FROM tb_usuario
            //             where
            //             ds_email_usuario = @email and ds_senha_usuario = @password
            //             ";

            var sql = @"SELECT DISTINCT top 1
                  a.cd_usuario as id
                  ,ds_email_usuario as email
                  ,nm_fantasia as name
                  ,ds_senha_usuario as password
                  ,ds_token_usuario as tokenApi
                  ,vl_limite_revenda as balance
                  ,b.cd_operadora as operatorId
                  ,c.nm_fantasia_operadora as operatorName
                  ,a.cd_usuario_pai as subsidiary
                  ,1 ^ ic_revenda_suspenso as status
                  ,0 ^ ic_email_autenticado as isMailIdentified
                  FROM tb_usuario as a
                  Inner join tb_usuario_revenda_operadora as b ON
                  a.cd_usuario = b.cd_usuario
                  Inner join tb_operadora as c ON
                  b.cd_operadora = c.cd_operadora
                  where
                  ds_email_usuario = @email and ds_senha_usuario = @password and b.ic_inativo = 0 and c.ic_revenda_especial = 1
                  ";


            var password = CalculateMD5Hash(model.password);

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
            {
                try
                {

                    var user = connection.QuerySingle<User>(sql, new
                    {
                        email = model.email,
                        password = password
                    });

                    string expiration = _config.GetValue<string>("ResponseHeader:X-Token-Expiration-Time");
                    // Gera o Token
                    var token = TokenService.GenerateToken(user, expiration);

                    // Oculta a senha
                    user.tokenApi = "";
                    user.password = "";
                    user.token = $"Bearer {token}";

                    // Retorna os dados

                    Response.Headers.Add("X-Token-Expiration-Time", expiration);

                    return user;
                }
                catch
                {
                    return NotFound(new { message = "Usuário ou senha inválidos" });
                }

            }

        }


        [HttpPost("changePassword")]
        public ActionResult<dynamic> ChangePassword([FromBody] User model)
        {

            var password = CalculateMD5Hash(model.password);
            var passwordNew = CalculateMD5Hash(model.passwordNew);


            var sql = @"SELECT
                  tb_usuario.cd_usuario as id
                  ,ds_email_usuario as email
                  ,nm_fantasia as name
                  ,ds_senha_usuario as password
                  ,ds_token_usuario as tokenApi
                  ,vl_limite_revenda as balance
                  FROM tb_usuario
                  where
                  cd_usuario = @id and ds_senha_usuario = @password
                  ";

            var sqlObject = new
            {
                id = _idAdmin(),
                password = password

            };


            var sqlChange = @"UPDATE tb_usuario
                      SET ds_senha_usuario=@password
                      ,ic_email_autenticado = 1
                      ,dt_email_autenticado = GETDATE()
                      WHERE cd_usuario=@id";

            var sqlChangeObject = new
            {
                password = passwordNew,
                id = _idAdmin()
            };

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
            {
                try
                {

                    var checkUser = connection.QuerySingle<User>(sql, sqlObject);

                    var user = connection.Execute(sqlChange, sqlChangeObject);

                    return StatusCode(200);

                }
                catch
                {
                    return NotFound(new { message = "Usuário ou senha inválidos" });
                }

            }

        }



        [Authorize]
        [HttpGet("wallet")]
        public ActionResult<dynamic> Wallet()
        {

            if (_subsidiary())
            {

                return StatusCode(403);
            }


            var sql = @"SELECT 
        cd_operadora as operatorId
      , nu_codigo_revenda_operadora as resellerOperatorId
      , ds_servidor_conexao as url
      , ds_usuario_auth as soaUser
      , ds_senha_auth as soaPassword
      , cd_operadora_versao_api as citSoaVersion
      , ds_token_operadora as operatorToken
      , ds_token_CitSoa as citSoaToken
        from  tb_operadora

      where cd_operadora = @operatorId";

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
            {


                var data = connection.QuerySingle<CitSoa>(sql, new
                {
                    @operatorId = _operator(),
                });

                dynamic retCitSoa = CitSoaController.GetListPreStockBalance(data);

                return StatusCode(200, retCitSoa);


            }

        }



        public object Operator(string operatorId)
        {

            var sql = @"SELECT 
        cd_operadora as operatorId
      , nu_codigo_revenda_operadora as resellerOperatorId
      , ds_servidor_conexao as url
      , ds_usuario_auth as soaUser
      , ds_senha_auth as soaPassword
      , cd_operadora_versao_api as citSoaVersion
      , ds_token_operadora as operatorToken
      , ds_token_CitSoa as citSoaToken
        from  tb_operadora

      where cd_operadora = @operatorId";

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
            {


                return connection.QuerySingle<CitSoa>(sql, new
                {
                    @operatorId = operatorId,
                });



            }

        }


  [Authorize]
  [HttpGet("subsidiary")]
    public ActionResult<Subsidiary[]> Subsidiary()
    {

      var sql = @"SELECT DISTINCT
                  a.cd_usuario as id
                  ,ds_email_usuario as email
                  ,nm_fantasia as name
                  ,1 ^ ic_revenda_suspenso as status 
                  ,CONVERT(varchar,dt_revenda_suspenso, 103) as dateStatus
                  FROM tb_usuario as a
                  where
                  a.cd_usuario_pai = @id
                  ";



      using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
      {
        try
        {
          var sqlObject = new
                  {
                      id = _idAdmin()
                  };
          var user = connection.Query<Subsidiary>(sql,sqlObject);

          return StatusCode(200, user);
        }
        catch
        {
         return StatusCode(500, new { message = "Internal Server Error" });
       
        }

      }

    }


  [Authorize]
  [HttpPut("subsidiary/{id}")]
    public ActionResult<Subsidiary[]> SubsidiaryEdit(String id, [FromBody] Subsidiary body)
    {

      var sql = @"update tb_usuario set
                  ic_revenda_suspenso = @status
                  , dt_revenda_suspenso = @dateStatus
                where cd_usuario IN (@id)";



      using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
      {
        try
        {
          var sqlObject = new
                  {
                      id = id,
                      status = body.status ? 0 : 1,
                      dateStatus = body.status ? (DateTime?)DateTime.Now : null,
                  };
          var user = connection.Execute(sql,sqlObject);

          return StatusCode(200);
        }
        catch
        {
         return StatusCode(500, new { message = "Internal Server Error" });
       
        }

      }

    }



        public string CalculateMD5Hash(string input)
        {
            // Calcular o Hash
            MD5 md5 = MD5.Create();
            byte[] inputBytes = Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // Converter byte array para string hexadecimal
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }

            return sb.ToString();
        }


    }
}
