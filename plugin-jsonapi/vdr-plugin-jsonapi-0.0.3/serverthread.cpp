/*
 * serverthread.cpp: JSONAPI plugin for the Video Disk Recorder
 *
 * See the README file for copyright information and how to reach the author.
 *
 */

#include "serverthread.h"
cxxtools::Utf8Codec codec;

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

  reply.addHeader("Content-Type", "application/json; charset=utf-8");
  cxxtools::JsonSerializer serializer(out);

  std::string suffix = (std::string) ".ts";  

  for(cChannel *channel = Channels.First(); channel; channel = Channels.Next(channel))
  {
    if(!channel->GroupSep()) {
      serChannel.Name = codec.decode(channel->Name());
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
  serializer.serialize(serChannels, "channels");
  serializer.finish();
}

// ChannelsService
//
typedef cxxtools::http::CachedService<ChannelsResponder> ChannelsService;

// EventResponder
//
class EventsResponder : public cxxtools::http::Responder
{
  public:
    explicit EventsResponder(cxxtools::http::Service& service)
      : cxxtools::http::Responder(service)
      { }
    virtual void reply(std::ostream&, cxxtools::http::Request& request, cxxtools::http::Reply& reply);
};

void EventsResponder::reply(std::ostream& out, cxxtools::http::Request& request, cxxtools::http::Reply& reply)
{
  std::string qparams = request.qparams();
  
  int channel_number = GetIntParam(qparams, (std::string)"channel=");
  int from = GetIntParam(qparams, (std::string)"from=");
  int timespan = GetIntParam(qparams, (std::string)"timespan=");
  
  dsyslog("jsonapi: %s ///%i///%i///%i///", qparams.c_str(), channel_number, from, timespan);

  if ( channel_number == -1 || channel_number ) channel_number = 1;
  cChannel* channel = GetChannel(channel_number);
  if ( !channel ) return;

  if ( from == -1 ) from = time(NULL); // default time is now
  if ( timespan == -1 ) timespan = 3600; // default timespan is one hour
  
  int to = from + timespan;

  SerEvent serEvent;
  std::vector < struct SerEvent > serEvents;
  cxxtools::String eventTitle;
  cxxtools::String eventShortText;
  cxxtools::String eventDescription;
  cxxtools::String empty = codec.decode("");

  cSchedulesLock MutexLock;
  const cSchedules *Schedules = cSchedules::Schedules(MutexLock);

  if(!Schedules) return;

  const cSchedule *Schedule = Schedules->GetSchedule(channel->GetChannelID());
  
  if(!Schedule) return;

  bool atLeastOneEvent = false;

  for(const cEvent* event = Schedule->Events()->First(); event; event = Schedule->Events()->Next(event))
  {
    int ts = event->StartTime();
    int te = ts + event->Duration();
    if ( ts <= to && te >= from ) {
       if( !event->Title() ) { eventTitle = empty; } else { eventTitle = codec.decode(event->Title()); }
       if( !event->ShortText() ) { eventShortText = empty; } else { eventShortText = codec.decode(event->ShortText()); }
       if( !event->Description() ) { eventDescription = empty; } else { eventDescription = codec.decode(event->Description()); }

       serEvent.Id = event->EventID();
       serEvent.Title = eventTitle;
       serEvent.ShortText = eventShortText;
       serEvent.Description = eventDescription;
       serEvent.StartTime = event->StartTime();
       serEvent.Duration = event->Duration();
       serEvents.push_back(serEvent);
       atLeastOneEvent = true;
    }else{
      if(ts > to) break;
    }
  }

  if(!atLeastOneEvent) return;
  
  reply.addHeader("Content-Type", "application/json; charset=utf-8");
  cxxtools::JsonSerializer serializer(out);
  serializer.serialize(serEvents, "rows");
  serializer.finish();
}


// EventsService
//
typedef cxxtools::http::CachedService<EventsResponder> EventsService;

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

  reply.addHeader("Content-Type", "application/json; charset=utf-8");
  cxxtools::JsonSerializer serializer(out);
  for (cRecording* recording = Recordings.First(); recording; recording = Recordings.Next(recording)) {
	recordingRec.Name = codec.decode(recording->Name());
	recordingRec.FileName = codec.decode(recording->FileName());
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
  EventsService eventsService;
  server->addService("/recordings.json", recordingsService);
  server->addService("/channels.json", channelsService);
  server->addService("/events.json", eventsService);
  loop.run();

  dsyslog("JSONAPI: server thread ended (pid=%d)", getpid());
}
