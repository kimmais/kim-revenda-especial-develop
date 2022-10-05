using System;
namespace admin.Models
{
    public class Subsidiary
    {
       
        public Int32 id { get; set; }

        public String email { get; set; }

        public String name { get; set; } = "";

        public String dateStatus { get; set; } = "";

        public Boolean status { get; set; }

    }
}
