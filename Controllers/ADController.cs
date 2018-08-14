using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Threading.Tasks;
using contact_app.Models;
using Microsoft.AspNetCore.Mvc;

namespace contact_app.Controllers {
  [Route ("api/[controller]")]
  public class ADController : Controller {
    private readonly ContactAppContext _context;

    // initiate database context
    public ADController (ContactAppContext context) {
      _context = context;
    }

    [HttpGet]
    [Route ("getAllUsers")]
    public IEnumerable<string> GetAllUsers () {
      // fetch all contact records
      var myDomainUsers = new List<string> ();
      using (var ctx = new PrincipalContext (ContextType.Domain, "catec.local")) {
        var userPrinciple = new UserPrincipal (ctx);
        using (var search = new PrincipalSearcher (userPrinciple)) {
          foreach (var domainUser in search.FindAll ()) {
            if (domainUser.DisplayName != null) {
              myDomainUsers.Add (domainUser.DisplayName);
            }
          }
        }
      }
            return myDomainUsers;

    }


  }
}
