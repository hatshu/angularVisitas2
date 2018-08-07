using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using contact_app.Models;
using Microsoft.AspNetCore.Mvc;

namespace contact_app.Controllers
{
   [Route("api/[controller]")]
    public class EnlaceVisitContactController : Controller
    {
        private readonly ContactAppContext _context;

        // initiate database context
        public EnlaceVisitContactController(ContactAppContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("getAllEnlaceVisitContact")]
        public IEnumerable<EnlaceVisitContact> GetAll()
        {
            // fetch all Visit records
        return _context.EnlaceVisitContact.ToList();
        }

        [HttpGet("{id}")]
        [Route("getAllId")]
        public IEnumerable<string> GetAllId(long id)
        {
            var result = new List<string>();
            // fetch all names for a visit that we want
            foreach (var itemEnlace in _context.EnlaceVisitContact.ToList())
            {
              if (id == itemEnlace.visitId) {
                foreach (var itemPerson in _context.Contact.ToList())
                {
                  if (itemEnlace.contactId == itemPerson.id)
                  {
                    result.Add(itemPerson.name+" "+itemPerson.surname);
                  }
                }
              }
            }
           return result;
        }

        [HttpGet("{id}")]
        [Route("getEnlaceVisitContact")]
        public IActionResult GetById(long id)
        {
            // filter Visit records by Visit id
            var item = _context.EnlaceVisitContact.FirstOrDefault(t => t.id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
        [HttpPost]
        [Route("addEnlaceVisitContact")]
        public IActionResult Create([FromBody] EnlaceVisitContact item)
        {
            // set bad request if Visit data is not provided in body
            if (item == null)
            {
                return BadRequest();
            }

            _context.EnlaceVisitContact.Add(new EnlaceVisitContact
            {
                visitId = item.visitId,
                contactId = item.contactId,

            });
            _context.SaveChanges();

            return Ok( new { message= "Contacto is added successfully to the visit."});
        }

        [HttpPut("{id}")]
        [Route("updateEnlaceVisitContact")]
        public IActionResult Update(long id, [FromBody] EnlaceVisitContact item)
        {
            // set bad request if visit data is not provided in body
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var enlaceVisitContact = _context.EnlaceVisitContact.FirstOrDefault(t => t.id == id);
            if (enlaceVisitContact == null)
            {
                return NotFound();
            }

            enlaceVisitContact.visitId = item.visitId;
            enlaceVisitContact.contactId = item.contactId;
            _context.EnlaceVisitContact.Update(enlaceVisitContact);
            _context.SaveChanges();
            return Ok( new { message= "Visit is updated successfully."});
        }


        [HttpDelete("{id}")]
        [Route("deleteEnlaceVisitContact")]
        public IActionResult Delete(long id)
        {
            var enlaceVisitContact = _context.EnlaceVisitContact.FirstOrDefault(t => t.id == id);
            if (enlaceVisitContact == null)
            {
                return NotFound();
            }

            _context.EnlaceVisitContact.Remove(enlaceVisitContact);
            _context.SaveChanges();
            return Ok( new { message= "Visit is deleted successfully."});
        }
    }
}
