////////////////////////////////////////////////////////////////////////
// get_svdrp_response.cpp
// generated with ecppc
// date: Sun Jun  6 14:57:19 2010
//

#include <tnt/ecpp.h>
#include <tnt/convert.h>
#include <tnt/httprequest.h>
#include <tnt/httpreply.h>
#include <tnt/httpheader.h>
#include <tnt/http.h>
#include <tnt/data.h>
#include <tnt/componentfactory.h>
#include <cxxtools/log.h>
#include <stdexcept>

log_define("component.get_svdrp_response")

// <%pre>
#line 1 "get_svdrp_response.ecpp"

#include <stdio.h>
#include <string>
#include <jsoncpp/json.h>

using namespace std;

// </%pre>

namespace
{
template <typename T> inline void use(const T&) { }

class _component_get_svdrp_response : public tnt::EcppComponent
{
    _component_get_svdrp_response& main()  { return *this; }

  protected:
    ~_component_get_svdrp_response();

  public:
    _component_get_svdrp_response(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl);

    unsigned operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam);
};

static tnt::ComponentFactoryImpl<_component_get_svdrp_response> get_svdrp_responseFactory("get_svdrp_response");

static const char* rawData = "\010\000\000\000\t\000\000\000\n";

// <%shared>
// </%shared>

// <%config>
// </%config>

#define SET_LANG(lang) \
     do \
     { \
       request.setLang(lang); \
       reply.setLocale(request.getLocale()); \
     } while (false)

_component_get_svdrp_response::_component_get_svdrp_response(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl)
  : EcppComponent(ci, um, cl)
{
  // <%init>
  // </%init>
}

_component_get_svdrp_response::~_component_get_svdrp_response()
{
  // <%cleanup>
  // </%cleanup>
}

unsigned _component_get_svdrp_response::operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam)
{
  tnt::DataChunks data(rawData);

  // <%args>
std::string command = qparam.param("command");
  // </%args>

  // <%cpp>
  // <& authenticate ...
#line 7 "get_svdrp_response.ecpp"
  tnt::QueryParams _tnt_cq0(qparam, false);
#line 7 "get_svdrp_response.ecpp"
  callComp(tnt::Compident(std::string(), "authenticate"), request, reply, _tnt_cq0);
  // &>
#line 9 "get_svdrp_response.ecpp"

reply.setHeader ("Cache-Control", "no-cache", false);
reply.setHeader ("Content-Type", "application/json", false);

/*
  DELC Delete Channel
  LSTC List Channel(s)
  MOVC Move Channel
  NEWC New Channel
  
  214-This is VDR version 1.7.10
  214-Topics:
  214-    CHAN      CLRE      DELC      DELR      DELT      
  214-    EDIT      GRAB      HELP      HITK      LSTC      
  214-    LSTE      LSTR      LSTT      MESG      MODC      
  214-    MODT      MOVC      MOVT      NEWC      NEWT      
  214-    NEXT      PLAY      PLUG      PUTE      REMO      
  214-    RENR      SCAN      STAT      UPDT      VOLU      
  214-    QUIT      
  214-Plugin epgsearch v0.9.25.beta15 - Suche im EPG nach Wiederholungen und anderem
  214-    LSTS      NEWS      DELS      EDIS      MODS      
  214-    UPDS      UPDD      SETS      FIND      QRYS      
  214-    QRYF      LSRD      LSTC      NEWC      EDIC      
  214-    DELC      RENC      LSTB      NEWB      DELB      
  214-    EDIB      LSTE      SETP      LSTT      NEWT      
  214-    DELT      EDIT      DEFT      LSCC      MENU      
  214-Plugin xineliboutput v1.0.90-cvs - X11/xine-lib Ausgabe-Plugin
  214-    PMDA      PDVD      PMSC      PIMG      QMSC      
  214-Plugin text2skin v1.3 - Lader für textbasierte Skins
  214-    FLUS      
  214-To report bugs in the implementation send email to
  214-    vdr-bugs@tvdr.de
  214 End of HELP info
*/  

//TODO: check if charset conversion is needed, we assume UTF-8

//restrict commands
//string svdrpcmd = "/usr/bin/svdrpsend " + command;

if (command == "LSTC") // || command == "NEWC")
{
    string svdrpcmd = "/usr/bin/svdrpsend LSTC :groups";

    if (FILE *stream = popen(svdrpcmd.c_str(), "r"))
    {
        char buffer[1024];
        int counter = 0;
        int groupcounter = 0;
        Json::Value json_channels;
        while (!feof(stream))
        {
          if (fgets(buffer, sizeof(buffer), stream) != NULL)
          {
             int status = atoi(string(buffer).substr(0, 3).c_str());
             if ( status != 220 && status != 221 ) //don't output meta lines
             {
                 string sBuffer = string(buffer);
                 string::size_type bof = 0;
                 int channel_length = strlen(buffer);
                 string::size_type begin_of_channel_name  = sBuffer.substr(4, channel_length -4 ).find_first_of(" ", bof) + 4;
                 string::size_type first_semicolon = sBuffer.substr(4, channel_length -4 ).find_first_of(";", bof);
                 string::size_type first_doppelpunkt = sBuffer.substr(4, channel_length -4 ).find_first_of(":", bof);
                 string::size_type end_of_channel_name;
                 
                 string provider = "";
                 if (first_semicolon != string::npos && first_doppelpunkt != string::npos){
                     if( first_semicolon > first_doppelpunkt){
                         //after channel name there is no transponder info
                         first_semicolon = first_doppelpunkt;
                     }
                     else{
                         provider = sBuffer.substr(first_semicolon + 5, first_doppelpunkt - 1 - first_semicolon );
                         
                     }
                 }
                 
                 if (first_semicolon != string::npos)
                     end_of_channel_name = first_semicolon + 3;
                 else
                     end_of_channel_name = first_doppelpunkt + 3;
                 
                 int channel_nr = atoi(sBuffer.substr(4, begin_of_channel_name -4).c_str());
                 string channel = "";
                 string channel_name = "";
                 
                 //check if we have got a channel group label
                 if (channel_nr != 0)
                 {
                     channel = sBuffer.substr(begin_of_channel_name + 1, strlen(buffer) - 3 - begin_of_channel_name );
                     if (end_of_channel_name > 0 && begin_of_channel_name > 0)
                         channel_name = sBuffer.substr(begin_of_channel_name + 1, end_of_channel_name - begin_of_channel_name );
                     else
                         channel_name = "unknown";
                     counter ++;
                 }
                 else if (sBuffer.substr(begin_of_channel_name + 1,1) == ":")
                 {
                     channel_name = "GROUP: " + sBuffer.substr(begin_of_channel_name + 2, strlen(buffer) - begin_of_channel_name - 4);
                     groupcounter++;
                     
                 }
                 
                 int big_channel_id = groupcounter * 10000 + channel_nr;
                 
                 json_channels[counter]["cid"]     = big_channel_id;
                 json_channels[counter]["cnumber"] = channel_nr;
                 json_channels[counter]["cname"]   = channel_name;
                 json_channels[counter]["cprovider"] = provider;
                 json_channels[counter]["cstr"]    = channel;
             }
          }
        }
        pclose(stream);
        Json::Value json_channellist;
        json_channellist["channelList"] = json_channels;
        json_channellist["totalCount"]  = counter;
        reply.out() << json_channellist;
    }
}
else
    reply.out() << "Illegal command.";


  reply.out() << data[0]; // \n
  // <%/cpp>
  return HTTP_OK;
}

} // namespace

