/*
 * serverthread.cpp: JSONAPI plugin for the Video Disk Recorder
 *
 * See the README file for copyright information and how to reach the author.
 *
 */

#include "serverthread.h"

struct RecordingRec
{
  std::string Name;
  std::string FileName;
  bool IsNew;
  bool IsEdited;
  bool IsPesRecording;
};

struct RecordingsRec
{
  std::vector < struct RecordingRec > recording;
};

void operator<<= (cxxtools::SerializationInfo& si, const RecordingRec& p)
{
  si.addMember("Name") <<= p.Name;
  si.addMember("FileName") <<= p.FileName;
  si.addMember("IsNew") <<= p.IsNew;
  si.addMember("IsEdited") <<= p.IsEdited;
  si.addMember("IsPesRecording") <<= p.IsPesRecording;
}

void operator<<= (cxxtools::SerializationInfo& si, const RecordingsRec& p)
{
  si.addMember("recording") <<= p.recording;
}

// RecordingsResponder
//
class RecordingsResponder : public cxxtools::http::Responder
{
  public:
    explicit RecordingsResponder(cxxtools::http::Service& service)
      : cxxtools::http::Responder(service)
      { }

    virtual void reply(std::ostream&, cxxtools::http::Request& request, cxxtools::http::Reply& reply);
};


void RecordingsResponder::reply(std::ostream& out, cxxtools::http::Request& request, cxxtools::http::Reply& reply)
{
  RecordingRec recordingRec;
  std::vector < struct RecordingRec > recordingsRec;

  reply.addHeader("Content-Type", "application/json");
  cxxtools::JsonSerializer serializer(out);
  for (cRecording* recording = Recordings.First(); recording; recording = Recordings.Next(recording)) {
    recordingRec.Name = recording->Name();
    recordingRec.FileName = recording->FileName();
    recordingRec.IsNew = recording->IsNew();
    recordingRec.IsEdited = recording->IsEdited();
    recordingRec.IsPesRecording = recording->IsPesRecording();
    recordingsRec.push_back(recordingRec);
  }
  serializer.serialize(recordingsRec, "recordings");
  serializer.finish();
}


// RecordingService
//
typedef cxxtools::http::CachedService<RecordingsResponder> RecordingsService;

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

  RecordingsService service;                                                                                                 
  server->addService("/recordings", service);                                                                                
  loop.run(); 

  dsyslog("JSONAPI: server thread ended (pid=%d)", getpid());
}
