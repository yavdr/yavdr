/*
 * jsonapi.c: A plugin for the Video Disk Recorder
 *
 * See the README file for copyright information and how to reach the author.
 *
 * $Id$
 */

#include <cxxtools/http/server.h>
#include <cxxtools/http/request.h>
#include <cxxtools/http/reply.h>
#include <cxxtools/http/responder.h>
#include <cxxtools/eventloop.h>
#include <cxxtools/arg.h>

#include <vdr/plugin.h>

static const char *VERSION        = "0.0.1";
static const char *DESCRIPTION    = "Enter description for 'jsonapi' plugin";
static const char *MAINMENUENTRY  = "Jsonapi";

// HelloResponder
//
class HelloResponder : public cxxtools::http::Responder
{
  public:
    explicit HelloResponder(cxxtools::http::Service& service)
      : cxxtools::http::Responder(service)
      { }

    virtual void reply(std::ostream&, cxxtools::http::Request& request, cxxtools::http::Reply& reply);
};

void HelloResponder::reply(std::ostream& out, cxxtools::http::Request& request, cxxtools::http::Reply& reply)
{
  isyslog("send hello");

  reply.addHeader("Content-Type", "text/html");
  out << "<html>\n"
         " <head>\n"
         "  <title>Hello World-application</title>\n"
         " </head>\n"
         " <body bgcolor=\"#FFFFFF\">\n"
         "  <h1>Hello World</h1>\n"
         " </body>\n"
         "</html>\n";

}

// HelloService
//
typedef cxxtools::http::CachedService<HelloResponder> HelloService;

class cPluginJsonapi : public cPlugin {
private:
  // Add any member variables or functions you may need here.
  std::string listenIp;
  unsigned short int listenPort;
  cxxtools::EventLoop loop;
  cxxtools::http::Server *server;
public:
  cPluginJsonapi(void);
  virtual ~cPluginJsonapi();
  virtual const char *Version(void) { return VERSION; }
  virtual const char *Description(void) { return DESCRIPTION; }
  virtual const char *CommandLineHelp(void);
  virtual bool ProcessArgs(int argc, char *argv[]);
  virtual bool Initialize(void);
  virtual bool Start(void);
  virtual void Stop(void);
  virtual void Housekeeping(void);
  virtual void MainThreadHook(void);
  virtual cString Active(void);
  virtual time_t WakeupTime(void);
  virtual const char *MainMenuEntry(void) { return MAINMENUENTRY; }
  virtual cOsdObject *MainMenuAction(void);
  virtual cMenuSetupPage *SetupMenu(void);
  virtual bool SetupParse(const char *Name, const char *Value);
  virtual bool Service(const char *Id, void *Data = NULL);
  virtual const char **SVDRPHelpPages(void);
  virtual cString SVDRPCommand(const char *Command, const char *Option, int &ReplyCode);
  };

cPluginJsonapi::cPluginJsonapi(void)
{
  listenIp = "0.0.0.0";
  listenPort = 8001;

  isyslog("create server");
  server = new cxxtools::http::Server(loop, listenIp, listenPort);
}

cPluginJsonapi::~cPluginJsonapi()
{
  // Clean up after yourself!
  delete server;
}

const char *cPluginJsonapi::CommandLineHelp(void)
{
  // Return a string that describes all known command line options.
  return NULL;
}

bool cPluginJsonapi::ProcessArgs(int argc, char *argv[])
{
  // Implement command line argument processing here if applicable.
  return true;
}

bool cPluginJsonapi::Initialize(void)
{
  // Initialize any background activities the plugin shall perform.
  return true;
}

bool cPluginJsonapi::Start(void)
{
  HelloService service;

  server->addService("/hello", service);
  loop.run();

  return true;
}

void cPluginJsonapi::Stop(void)
{
  // Stop any background activities the plugin is performing.
}

void cPluginJsonapi::Housekeeping(void)
{
  // Perform any cleanup or other regular tasks.
}

void cPluginJsonapi::MainThreadHook(void)
{
  // Perform actions in the context of the main program thread.
  // WARNING: Use with great care - see PLUGINS.html!
}

cString cPluginJsonapi::Active(void)
{
  // Return a message string if shutdown should be postponed
  return NULL;
}

time_t cPluginJsonapi::WakeupTime(void)
{
  // Return custom wakeup time for shutdown script
  return 0;
}

cOsdObject *cPluginJsonapi::MainMenuAction(void)
{
  // Perform the action when selected from the main VDR menu.
  return NULL;
}

cMenuSetupPage *cPluginJsonapi::SetupMenu(void)
{
  // Return a setup menu in case the plugin supports one.
  return NULL;
}

bool cPluginJsonapi::SetupParse(const char *Name, const char *Value)
{
  // Parse your own setup parameters and store their values.
  return false;
}

bool cPluginJsonapi::Service(const char *Id, void *Data)
{
  // Handle custom service requests from other plugins
  return false;
}

const char **cPluginJsonapi::SVDRPHelpPages(void)
{
  // Return help text for SVDRP commands this plugin implements
  return NULL;
}

cString cPluginJsonapi::SVDRPCommand(const char *Command, const char *Option, int &ReplyCode)
{
  // Process SVDRP commands this plugin implements
  return NULL;
}

VDRPLUGINCREATOR(cPluginJsonapi); // Don't touch this!
