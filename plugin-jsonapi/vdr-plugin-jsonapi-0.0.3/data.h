#include <cxxtools/serializationinfo.h>

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

void operator<<= (cxxtools::SerializationInfo& si, const SerEvent& e);
void operator<<= (cxxtools::SerializationInfo& si, const SerEvents& e);

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

void operator<<= (cxxtools::SerializationInfo& si, const SerChannel& c);
void operator<<= (cxxtools::SerializationInfo& si, const SerChannels& c);

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

void operator<<= (cxxtools::SerializationInfo& si, const RecordingRec& p);
void operator<<= (cxxtools::SerializationInfo& si, const RecordingsRec& p);

