/*
 * serverthread.cpp: JSONAPI plugin for the Video Disk Recorder
 *
 * See the README file for copyright information and how to reach the author.
 *
 */

#include "serverthread.h"

// Channel related
//

struct SerChannel
{
  std::string Name;
  int Number;
  int Transponder;
  std::string Stream;
  bool IsAtsc;
  bool IsCable;
  bool IsTerr;
  bool IsSat;
};

struct SerChannels
{
  std::vector < struct SerChannel > channel;
};

void operator<<= (cxxtools::SerializationInfo& si, const SerChannel& c)
{
  si.addMember("name") <<= c.Name;
  si.addMember("number") <<= c.Number;
  si.addMember("transponder") <<= c.Transponder;
  si.addMember("stream") <<= c.Stream;
  si.addMember("is_atsc") <<= c.IsAtsc;
  si.addMember("is_cable") <<= c.IsCable;
  si.addMember("is_terr") <<= c.IsTerr;
  si.addMember("is_sat") <<= c.IsSat;
}

void operator<<=(cxxtools::SerializationInfo& si, const SerChannels& c)
{
  si.addMember("rows") <<= c.channel;
}

// Recording related
//

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
  si.addMember("name") <<= p.Name;
  si.addMember("file_name") <<= p.FileName;
  si.addMember("is_new") <<= p.IsNew;
  si.addMember("is_edited") <<= p.IsEdited;
  si.addMember("is_pes_recording") <<= p.IsPesRecording;
}

void operator<<= (cxxtools::SerializationInfo& si, const RecordingsRec& p)
{
  si.addMember("rows") <<= p.recording;
}

// ChannelsResponder
//
class ChannelsResponder : public cxxtools::http::Responder
{
  public:
    explicit ChannelsResponder(cxxtools::http::Service& service)
      : cxxtools::http::Responder(service)
      { }
    virtual void reply(std::ostream&, cxxtools::http::Request& request, cxxtools::http::Reply& reply);
};

void ChannelsResponder::reply(std::ostream& out, cxxtools::http::Request& request, cxxtools::http::Reply& reply)
{
  SerChannel serChannel;
  std::vector < struct SerChannel > serChannels;

  reply.setContentType("application/json; charset=utf-8");
  cxxtools::JsonSerializer serializer(out);

  std::string suffix = (std::string) ".ts";  

  for(cChannel *channel = Channels.First(); channel; channel = Channels.Next(channel))
  {
    if(!channel->GroupSep()) {
      serChannel.Name = channel->Name();
      serChannel.Number = channel->Number();
      serChannel.Transponder = channel->Transponder();
      serChannel.Stream = (std::string)channel->GetChannelID().ToString() + (std::string)suffix;
      serChannel.IsAtsc = channel->IsAtsc();
      serChannel.IsCable = channel->IsCable();
      serChannel.IsSat = channel->IsSat();
      serChannel.IsTerr = channel->IsTerr();
      serChannels.push_back(serChannel);
    }
  }
  serializer.serialize(serChannels, "rows");
  serializer.finish();
}

// ChannelsService
//
typedef cxxtools::http::CachedService<ChannelsResponder> ChannelsService;

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

  reply.setContentType("application/json; charset=utf-8");
  cxxtools::JsonSerializer serializer(out);
  for (cRecording* recording = Recordings.First(); recording; recording = Recordings.Next(recording)) {
    recordingRec.Name = recording->Name();
    recordingRec.FileName = recording->FileName();
    recordingRec.IsNew = recording->IsNew();
    recordingRec.IsEdited = recording->IsEdited();
    recordingRec.IsPesRecording = recording->IsPesRecording();
    recordingsRec.push_back(recordingRec);
  }
  serializer.serialize(recordingsRec, "rows");
  serializer.finish();
}


// RecordingService
//
typedef cxxtools::http::CachedService<RecordingsResponder> RecordingsService;

cServerThread::cServerThread ()
{
  active = false;

  listenIp = "0.0.0.0";
  listenPort = 8002;

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

  RecordingsService recordingsService;
  ChannelsService channelsService;
  server->addService("/recordings.json", recordingsService);
  server->addService("/channels.json", channelsService);
  loop.run();

  dsyslog("JSONAPI: server thread ended (pid=%d)", getpid());
}
