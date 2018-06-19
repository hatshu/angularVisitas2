using System;

namespace contact_app.Models
{
    public class Visit
    {
    public long? id { get; set; }
    public string motivo { get; set; }
    public string duracion { get; set; }
    public string responsableCatec { get; set; }
    public DateTime? fecha { get; set; }
  }
}
