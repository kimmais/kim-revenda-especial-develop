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
    public class CuponController : ControllerBase
    {

        private readonly ILogger<CuponController> _logger;
        private readonly IConfiguration _config;

        public CuponController(ILogger<CuponController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }

        

    }
}
