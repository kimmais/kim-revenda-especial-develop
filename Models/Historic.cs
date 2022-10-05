using System;
using System.Collections;

namespace admin.Models
{
    public class Historic
    {
       
        public Int32 id { get; set; }

        public String date { get; set; }

        public String statusText { get; set; }

        public Decimal value { get; set; }

        public ArrayList cards { get; set; }


    }
}
