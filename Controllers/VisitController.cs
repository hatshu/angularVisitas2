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
            IEnumerable<Visit> visitas;
            visitas = _context.Visit.ToList();
            return visitas;
        }

        [HttpGet("{id}")]
        [Route("getAllVisitPerson")]
        public List<Visit> getAllVisitPerson(long id)
        {
            // fetch all Visit records
            IEnumerable<Visit> visitas;
            IEnumerable<EnlaceVisitContact> enlaces;
            List<Visit> list = new List<Visit>();
            visitas = _context.Visit.ToList();
            enlaces = _context.EnlaceVisitContact.ToList();
            foreach (var itemEnlace in enlaces)
            {
              if (id == itemEnlace.contactId)
              {
                foreach (var itemVisita in visitas)
                {
                  if (itemVisita.id == itemEnlace.visitId)
                  {
                    list.Add(itemVisita);
                  }
                }
              }
            }
            return list;
        }

        [HttpGet("{id}")]
        [Route("getVisit")]
        public IActionResult GetById(long id)
        {
            // filter Visit records by Visit id
            var item = _context.Visit.FirstOrDefault(t => t.id == id);
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
                motivo = item.motivo,
                duracion = item.duracion,
                responsableCatec = item.responsableCatec,
                //TODO: sacar la fecha y hora de ese momento
                fecha = DateTime.Now,

            });
            _context.SaveChanges();

            return Ok( new { message= "Visit is added successfully."});
        }

        [HttpPut("{id}")]
        [Route("updateVisit")]
        public IActionResult Update(long id, [FromBody] Visit item)
        {
            // set bad request if visit data is not provided in body
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var visit = _context.Visit.FirstOrDefault(t => t.id == id);
            if (visit == null)
            {
                return NotFound();
            }

            visit.motivo = item.motivo;
            visit.duracion = item.duracion;
            visit.responsableCatec = item.responsableCatec;
            // visit.fecha = item.fecha;
            _context.Visit.Update(visit);
            _context.SaveChanges();
            return Ok( new { message= "Visit is updated successfully."});
        }


        [HttpDelete("{id}")]
        [Route("deleteVisit")]
        public IActionResult Delete(long id)
        {
            var visit = _context.Visit.FirstOrDefault(t => t.id == id);
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
