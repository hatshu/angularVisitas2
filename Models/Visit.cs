using System;

namespace contact_app.Models
{
    public class Visit
    {
    public long? Id { get; set; }
    public string Motivo { get; set; }
    public string Duracion { get; set; }
    public string ResponsableCatec { get; set; }
    public DateTime? Fecha { get; set; }
    public DateTime? Hora { get; set; }
  }
}
