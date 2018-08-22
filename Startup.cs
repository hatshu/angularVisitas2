using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using contact_app.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace contact_app {
  public class Startup {
    public Startup (IConfiguration configuration) {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices (IServiceCollection services) {
      services.AddAuthentication (JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer (options => {
          options.TokenValidationParameters = new TokenValidationParameters {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateLifetime = true,
          ValidateIssuerSigningKey = true,

          ValidIssuer = "http://localhost:5000",
          ValidAudience = "http://localhost:5000",
          IssuerSigningKey = new SymmetricSecurityKey (Encoding.UTF8.GetBytes ("superSecretKey@345"))
          };
        });
      services.AddDbContext<ContactAppContext> (options => options.UseSqlServer (Configuration.GetConnectionString ("ContactDb")));
      services.AddMvc ();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure (IApplicationBuilder app, IHostingEnvironment env) {
      if (env.IsDevelopment ()) {
        app.UseDeveloperExceptionPage ();
      }

      app.UseAuthentication ();

      //Redirect non api calls to angular app that will handle routing of the app.
      app.Use (async (context, next) => {
        await next ();
        if (context.Response.StatusCode == 404 &&
          !Path.HasExtension (context.Request.Path.Value) &&
          !context.Request.Path.Value.StartsWith ("/api/")) {
          context.Request.Path = "/index.html";
          await next ();
        }
      });

      // configure the app to serve index.html from /wwwroot folder
      app.UseDefaultFiles ();
      app.UseStaticFiles ();

      // configure the app for usage as api
      app.UseMvcWithDefaultRoute ();

    }
  }
}
