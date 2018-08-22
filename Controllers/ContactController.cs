using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using contact_app.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace contact_app.Controllers
{
    // set route attribute to make request as 'api/contact'
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly ContactAppContext _context;

        // initiate database context
        public ContactController(ContactAppContext context)
        {
            _context = context;
        }

        [HttpGet,Authorize]
        [Route("getAllContact")]
        public IEnumerable<Contact> GetAll()
        {
            // fetch all contact records
            return _context.Contact.ToList();
        }


        [HttpGet("{id}")]
        [Route("getIdByDNI")]
        public long getIdByDNI(string id)
        {
          // filter contact records by contact id
          var item = _context.Contact.FirstOrDefault(t => t.dni == id);
          return (long)item.id;
        }

        [HttpGet("{id}")]
        [Route("findDni")]
        public bool findDni(string id)
        {
          // filter if dni is on database
          var item = _context.Contact.FirstOrDefault(t => t.dni == id);
          if (item != null && item.dni != null) {
           return true;
          }
          return false;
        }

        [HttpGet("{id}")]
        [Route("getContact")]
        public IActionResult GetById(long id)
        {
            // filter contact records by contact id
            var item = _context.Contact.FirstOrDefault(t => t.id == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
        [HttpPost]
        [Route("addContact")]
        public IActionResult Create([FromBody] Contact item)
        {
            // set bad request if contact data is not provided in body
            if (item == null)
            {
                return BadRequest();
            }
            _context.Contact.Add(new Contact
            {
                name = item.name,
                surname = item.surname,
                company = item.company,
                fecha = DateTime.Now,
                dni = item.dni
            });
            _context.SaveChanges();

            return Ok( new { message= "Contact is added successfully."});
        }

        [HttpPut("{id}")]
        [Route("updateContact")]
        public IActionResult Update(long id, [FromBody] Contact item)
        {
            // set bad request if contact data is not provided in body
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var contact = _context.Contact.FirstOrDefault(t => t.id == id);
            if (contact == null)
            {
                return NotFound();
            }
            contact.name = item.name;
            contact.surname = item.surname;
            contact.company = item.company;
            //contact.fecha = item.fecha;
            contact.dni = item.dni;
            _context.Contact.Update(contact);
            _context.SaveChanges();
            return Ok( new { message= "Contact is updated successfully."});
        }


        [HttpDelete("{id}")]
        [Route("deleteContact")]
        public IActionResult Delete(long id)
        {
            var contact = _context.Contact.FirstOrDefault(t => t.id == id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contact.Remove(contact);
            _context.SaveChanges();
            return Ok( new { message= "Contact is deleted successfully."});
        }
    }
}
