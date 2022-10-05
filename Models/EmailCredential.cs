using System;
namespace admin.Models
{
    public class EmailCredential
    {
        public String email { get; set; }
        public String userName { get; set; }
        public String password { get; set; }
        public String host { get; set; }
        public Int32 port { get; set; }
    }
}
