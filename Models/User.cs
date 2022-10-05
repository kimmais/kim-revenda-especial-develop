using System;
namespace admin.Models
{
    public class User
    {
       
        public Int32 id { get; set; }

        public String email { get; set; }

        public String name { get; set; } = "";

        public String roleName { get; set; }

        public String roleId { get; set; }

        public String operatorId { get; set; }

        public String operatorName { get; set; }

        public String password { get; set; }

        public String token { get; set; }

        public String tokenApi { get; set; }

        public Double balance { get; set; }
        public Boolean subsidiary { get; set; }
        public Boolean status { get; set; }
        public Boolean isMailIdentified { get; set; }
        public String ?passwordNew { get; set; }

    }
}
