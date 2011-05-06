////////////////////////////////////////////////////////////////////////
// set_dvb.cpp
// generated with ecppc
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

log_define("component.set_dvb")

// <%pre>
#line 1 "set_dvb.ecpp"

#include <stdlib.h>
#include <string>
#include <ctype.h>


extern "C" {
	#include <yavdr/db-utils/dbset.h>
	#include <yavdr/db-utils/dbget.h>
	#include <yavdr/db-utils/dbremove.h>
};

#include <yavdr/common.h>
#include <jsoncpp/json.hpp>

using namespace std;

// </%pre>

namespace
{
class _component_ : public tnt::EcppComponent
{
    _component_& main()  { return *this; }

  protected:
    ~_component_();

  public:
    _component_(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl);

    unsigned operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam);
};

static tnt::ComponentFactoryImpl<_component_> Factory("set_dvb");

static const char* rawData = "\014\000\000\000\033\000\000\000\036\000\000\000{\n    success: \n}\n";

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

_component_::_component_(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl)
  : EcppComponent(ci, um, cl)
{
  // <%init>
  // </%init>
}

_component_::~_component_()
{
  // <%cleanup>
  // </%cleanup>
}

unsigned _component_::operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam)
{
  log_trace("set_dvb " << qparam.getUrl());

  tnt::DataChunks data(rawData);

  // <%args>
typedef std::vector<string> serials_type;
serials_type serials;
tnt::convertRange("serials", "string", qparam.begin("serials"), qparam.end(), serials, reply.out().getloc());
string enablenetwork = tnt::stringTo<string>("enablenetwork", "string", qparam.param("enablenetwork"), reply.out().getloc());
  // </%args>

  // <%cpp>
  // <& authenticate@yavdrweb ...
  { 
#line 17 "set_dvb.ecpp"
    tnt::QueryParams _tnt_cq0(qparam, false);
#line 17 "set_dvb.ecpp"
    callComp(tnt::Compident("yavdrweb", "authenticate"), request, reply, _tnt_cq0);
    // &>
  }
#line 20 "set_dvb.ecpp"


string success = "false";

if (enablenetwork == "1") {
	dbset((char *)"system.hardware.sundtek.enablenetwork=1");
} else {
	dbremove((char *)"system.hardware.sundtek.enablenetwork");
}

for (serials_type::const_iterator it = serials.begin(); it != serials.end(); ++it) {
	string serial = (*it);
	
	string isDBVT = dbget((char *)("system.hardware.sundtek.stick." + serial + ".info.capabilities.dvbt").c_str(), (char *)"0");
	string isDBVC = dbget((char *)("system.hardware.sundtek.stick." + serial + ".info.capabilities.dvbc").c_str(), (char *)"0");
	
	if ("1" == isDBVT && "1" == isDBVC) {
		string mode = qparam[serial + "|mode"];

		if (mode == "DVBT") {
			dbset(("system.hardware.sundtek.stick." + serial + ".mode=DVBT").c_str());
		} else if (mode == "DVBC") {
			dbset(("system.hardware.sundtek.stick." + serial + ".mode=DVBC").c_str());
		} else
			dbremove(("system.hardware.sundtek.stick." + serial + ".mode").c_str());
	}
	
	string remoteIP = dbget((char *)("system.hardware.sundtek.stick." + serial + ".info.ip").c_str(), (char *)"");
	if (remoteIP != "") {
		string mount = qparam[serial + "|mount"];
		if (mount == "1") {
			dbset(("system.hardware.sundtek.stick." + serial + ".mount=1").c_str());
		} else {
			dbremove(("system.hardware.sundtek.stick." + serial + ".mount").c_str());
			dbremove(("system.hardware.sundtek.stick." + serial + ".static").c_str());
		}
		string _static = qparam[serial + "|static"];
		if (_static == "1") {
			dbset(("system.hardware.sundtek.stick." + serial + ".static=1").c_str());
		} else {
			dbremove(("system.hardware.sundtek.stick." + serial + ".static").c_str());
		}
	}
}


string cmd = "/usr/bin/signal-event update-sundtek";
int ret = system( cmd.c_str() );

success = "true"; //TODO: use ret to find out if we were successful.


  reply.out() << data[0]; // {\n    success: 
#line 72 "set_dvb.ecpp"
  reply.sout() << (success);
  reply.out() << data[1]; // \n}\n
  // <%/cpp>
  return HTTP_OK;
}

} // namespace
