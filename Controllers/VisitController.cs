using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using contact_app.Models;
using Microsoft.AspNetCore.Mvc;

namespace contact_app.Controllers
{
    // set route attribute to make request as 'api/visit'
    [Route("api/[controller]")]
    public class VisitController : Controller
    {
        private readonly ContactAppContext _context;

        // initiate database context
        public VisitController(ContactAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("getAllVisit")]
        public IEnumerable<Visit> GetAll()
        {
            // fetch all Visit records
            IEnumerable<Visit> listilla;
            listilla = _context.Visit.ToList();
            return listilla;
        }

        [HttpGet("{Id}")]
        [Route("getVisit")]
        public IActionResult GetById(long Id)
        {
            // filter Visit records by Visit id
            var item = _context.Visit.FirstOrDefault(t => t.Id == Id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
        [HttpPost]
        [Route("addVisit")]
        public IActionResult Create([FromBody] Visit item)
        {
            // set bad request if Visit data is not provided in body
            if (item == null)
            {
                return BadRequest();
            }
            _context.Visit.Add(new Visit
            {
                Motivo = item.Motivo,
                Duracion = item.Duracion,
                ResponsableCatec = item.ResponsableCatec,
                Fecha = item.Fecha,
                Hora = item.Hora

            });
            _context.SaveChanges();

            return Ok( new { message= "Visit is added successfully."});
        }

        [HttpPut("{Id}")]
        [Route("updateVisit")]
        public IActionResult Update(long Id, [FromBody] Visit item)
        {
            // set bad request if visit data is not provided in body
            if (item == null || Id == 0)
            {
                return BadRequest();
            }

            var visit = _context.Visit.FirstOrDefault(t => t.Id == Id);
            if (visit == null)
            {
                return NotFound();
            }

            visit.Motivo = item.Motivo;
            visit.Duracion = item.Duracion;
            visit.ResponsableCatec = item.ResponsableCatec;
            visit.Fecha = item.Fecha;
            visit.Hora = item.Hora;

            _context.Visit.Update(visit);
            _context.SaveChanges();
            return Ok( new { message= "Visit is updated successfully."});
        }


        [HttpDelete("{Id}")]
        [Route("deleteVisit")]
        public IActionResult Delete(long Id)
        {
            var visit = _context.Visit.FirstOrDefault(t => t.Id == Id);
            if (visit == null)
            {
                return NotFound();
            }

            _context.Visit.Remove(visit);
            _context.SaveChanges();
            return Ok( new { message= "Visit is deleted successfully."});
        }
    }
}
