/*
 * serverthread.cpp: JSONAPI plugin for the Video Disk Recorder
 *
 * See the README file for copyright information and how to reach the author.
 *
 */

#include "serverthread.h"

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

cServerThread::cServerThread ()
{
  active = false;

  listenIp = "0.0.0.0";
  listenPort = 8001;

  isyslog("create server");
  server = new cxxtools::http::Server(loop, listenIp, listenPort);

  Start ();
}

cServerThread::~cServerThread ()
{
  if (active)
  {
    active = false;
    Cancel (3);
  }
  delete server;
}

void
cServerThread::Action(void)
{
  active = true;

  HelloService service;                                                                                                 
                                                                                                                        
  server->addService("/hello", service);                                                                                
  loop.run(); 

  dsyslog("JSONAPI: server thread ended (pid=%d)", getpid());
}
