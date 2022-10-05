using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using admin.Models;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;


namespace admin.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class StateController : ControllerBase
  {

    private readonly ILogger<StateController> _logger;
    private readonly IConfiguration _config;

        public StateController(ILogger<StateController> logger, IConfiguration config)
    {
      _logger = logger;
      _config = config;
    }

    [HttpGet("list")]
    public IEnumerable<State> Get()
    {

            using (var connection = new SqlConnection(_config.GetValue<string>("ConnectionStrings:AdminDatabase")))
      {
        const string sql = @"SELECT
                            sg_uf as name,
                            cd_uf as id
                            FROM tb_uf as State";
        return connection.Query<State>(sql);

      }

    }

  
  }
}
