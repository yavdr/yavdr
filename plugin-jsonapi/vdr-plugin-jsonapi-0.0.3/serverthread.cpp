/*
 * serverthread.cpp: JSONAPI plugin for the Video Disk Recorder
 *
 * See the README file for copyright information and how to reach the author.
 *
 */

#include "serverthread.h"
cxxtools::Utf8Codec codec;
// Helper methods
//

int GetIntParam(std::string qparams, std::string param)
{
  int result = -1;
  int begin_parse = qparams.find(param);
  if ( begin_parse != -1 )
  {
     int end_parse = qparams.find_first_of("& ", begin_parse + param.length());
     if ( end_parse == -1 ) { end_parse = qparams.length() - 1; }
     if( qparams.length() > 0 && begin_parse != -1 ) { result = atoi(qparams.substr(begin_parse+param.length(), end_parse).c_str()); }
  }
  return result;
}

cChannel* GetChannel(int number)
{
  cChannel* result = NULL;
  int counter = 1;
  for (cChannel *channel = Channels.First(); channel; channel = Channels.Next(channel))
  {
      if (!channel->GroupSep()) {
         if (counter == number)
         {
            result = channel;
            break;
         }
         counter++;
      }
  }
  return result;
}

// Event related
//

struct SerEvent
{
  int Id;
  cxxtools::String Title;
  cxxtools::String ShortText;
  cxxtools::String Description;
  int StartTime;
  int Duration;
};

struct SerEvents
{
  std::vector < struct SerEvent > event;
};

void operator<<= (cxxtools::SerializationInfo& si, const SerEvent& e)
{
  si.addMember("id") <<= e.Id;
  si.addMember("title") <<= e.Title;
  si.addMember("short_text") <<= e.ShortText;
  si.addMember("description") <<= e.Description;
  si.addMember("start_time") <<= e.StartTime;
  si.addMember("duration") <<= e.Duration;
}

void operator<<= (cxxtools::SerializationInfo& si, const SerEvents& e)
{
  si.addMember("rows") <<= e.event;
}

// Channel related
//

struct SerChannel
{
  cxxtools::String Name;
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

void operator<<= (cxxtools::SerializationInfo& si, const SerChannels& c)
{
  si.addMember("rows") <<= c.channel;
}

// Recording related
//

struct RecordingRec
{
  cxxtools::String Name;
  cxxtools::String FileName;
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
