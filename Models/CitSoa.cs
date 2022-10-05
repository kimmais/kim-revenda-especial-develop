using System.Text;
using System;
namespace admin.Models
{
    public class CitSoa
    {
        public String operatorId { get; set; }
        public Int32  resellerOperatorId { get; set; }
        public String url { get; set; }
        public String soaUser { get; set; }
        public String soaPassword { get; set; }
        public Int32  citSoaVersion { get; set; }
        public String citSoaToken { get; set; }
        
        public String operatorToken { get; set; }
        public String ?autorizationApi { get; set; }

    }
}


