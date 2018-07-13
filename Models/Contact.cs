using System;

namespace contact_app.Models
{
    public class Contact
    {
        public long? id { get; set; }
        public string message { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public string company { get; set; }
        public DateTime? fecha { get; set; }
        public string dni { get; set; }
    }
}
