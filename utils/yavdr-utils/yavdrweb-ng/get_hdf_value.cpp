////////////////////////////////////////////////////////////////////////
// get_hdf_value.cpp
// generated with ecppc
// date: Sun Sep 12 23:00:54 2010
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

log_define("component.get_hdf_value")

// <%pre>
#line 1 "get_hdf_value.ecpp"

#include <string>
#include <iostream>
#include <fstream>
#include <ctype.h>
#include <ClearSilver.h>
#include "../common.h"
#include <jsoncpp/json.h>

using namespace std;

// </%pre>

namespace
{
template <typename T> inline void use(const T&) { }

class _component_get_hdf_value : public tnt::EcppComponent
{
    _component_get_hdf_value& main()  { return *this; }

  protected:
    ~_component_get_hdf_value();

  public:
    _component_get_hdf_value(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl);

    unsigned operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam);
};

static tnt::ComponentFactoryImpl<_component_get_hdf_value> get_hdf_valueFactory("get_hdf_value");

static const char* rawData = "\004\000\000\000";

// <%shared>

void Tokenize(const string& str,
		vector<string>& tokens,
		const string& delimiters = " ")
{
	tokens.clear();
	// Skip delimiters at beginning.
	string::size_type lastPos = str.find_first_not_of(delimiters, 0);
	// Find first "non-delimiter".
	string::size_type pos = str.find_first_of(delimiters, lastPos);

	while (string::npos != pos || string::npos != lastPos)
	{
		// Found a token, add it to the vector.
		tokens.push_back(str.substr(lastPos, pos - lastPos));
		// Skip delimiters.  Note the "not_of"
		lastPos = str.find_first_not_of(delimiters, pos);
		// Find next "non-delimiter"
		pos = str.find_first_of(delimiters, lastPos);
	}
}

void hdfwalk(HDF *hdf, HDF *child, Json::Value *json) {
	while (child != NULL) {
		if (child->child != NULL) {
			Json::Value dummy;
			hdfwalk(hdf, child->child, &dummy);
			(*json)[child->name] = dummy;
		} else {
			printf("%s = %s\n", child->name, child->value);
			(*json)[child->name] = child->value;
		}
		child = child->next;
	}
}
// </%shared>

// <%config>
// </%config>

#define SET_LANG(lang) \
     do \
     { \
       request.setLang(lang); \
       reply.setLocale(request.getLocale()); \
     } while (false)

_component_get_hdf_value::_component_get_hdf_value(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl)
  : EcppComponent(ci, um, cl)
{
  // <%init>
  // </%init>
}

_component_get_hdf_value::~_component_get_hdf_value()
{
  // <%cleanup>
  // </%cleanup>
}

unsigned _component_get_hdf_value::operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam)
{

  // <%args>
std::string hdfpath = qparam.param("hdfpath");
std::string hdftree = qparam.param("hdftree");
typedef std::vector<string> hdfpaths_type;
hdfpaths_type hdfpaths;
std::transform(qparam.begin("hdfpaths"), qparam.end(), std::back_inserter(hdfpaths), tnt::stringToConverter<string>(reply.out().getloc()));
  // </%args>

  // <%cpp>
  // <& authenticate ...
#line 11 "get_hdf_value.ecpp"
  tnt::QueryParams _tnt_cq0(qparam, false);
#line 11 "get_hdf_value.ecpp"
  callComp(tnt::Compident(std::string(), "authenticate"), request, reply, _tnt_cq0);
  // &>
#line 52 "get_hdf_value.ecpp"

  reply.setHeader ("Cache-Control", "no-cache", false);
  string value = "";
  const char *valid_hdf_requests[] = {
    "webfrontend.language",
    "vdr.frontend",
    "vdr.lifeguard.enable",
    "system.shutdown",
    "system.sound.type",
    "system.hardware.nvidia.overscan",
    "system.grub.timeout",
    "vdr.plugin.graphtft.enabled",
    "system.x11.dualhead.enabled",
    "system"
  };
  
  bool validRequest = false;
  if (hdfpaths.size() == 0) {
	  for (int findex = 0; (findex < (sizeof(valid_hdf_requests) / sizeof(valid_hdf_requests[0]))) && !validRequest; findex++)
	  {
		  if (hdfpath == valid_hdf_requests[findex] || hdftree == valid_hdf_requests[findex])
			  validRequest = true;
	  }
  } else {
	  validRequest = true;
	  for (int i = 0; i < hdfpaths.size() && validRequest; i++) {
		  bool localValidRequest = false;

		  for (int findex = 0; (findex < (sizeof(valid_hdf_requests) / sizeof(valid_hdf_requests[0]))) && !localValidRequest; findex++) {
			  if (hdfpaths[i] == valid_hdf_requests[findex])
				  localValidRequest = true;
		  }
		  validRequest &= localValidRequest;
	  }
  }
  if (validRequest){
      HDF *hdf = NULL;
      NEOERR *err;
      if (((err = hdf_init(&hdf)) != STATUS_OK) || ((err = hdf_read_file(hdf, YAVDRDB)) != STATUS_OK))
      {
        reply.out() << "Error on hdf_read_file.";
        nerr_log_error(err);
      }
      else
      {
    	  if (hdfpaths.size() == 0) {
    		  if (hdfpath.size() > 0) {
    			  value = hdf_get_value(hdf, hdfpath.c_str(), "");
    			  reply.out() << value;
    		  } else {
    			  reply.setHeader ("Content-Type", "application/json", false);

        		  Json::Value json;
        		  hdfwalk(hdf, hdf_get_child(hdf, hdftree.c_str()), &json);
        		  reply.out() << json;
    		  }
    	  } else {
    		  reply.setHeader ("Content-Type", "application/json", false);

    		  Json::Value json;

    		  for (int i = 0; i < hdfpaths.size() && validRequest; i++) {
				  vector<string> parts;
				  Tokenize(hdfpaths[i], parts, ".");
				  string value = hdf_get_value(hdf, hdfpaths[i].c_str(), "");

				  switch (parts.size()) {
				  case 1:
					  json[parts[0]] = value;
					  break;
				  case 2:
					  json[parts[0]][parts[1]] = value;
					  break;
				  case 3:
					  json[parts[0]][parts[1]][parts[2]] = value;
					  break;
				  case 4:
					  json[parts[0]][parts[1]][parts[2]][parts[3]] = value;
					  break;
				  case 5:
					  json[parts[0]][parts[1]][parts[2]][parts[3]][parts[4]] = value;
					  break;
				  case 6:
					  json[parts[0]][parts[1]][parts[2]][parts[3]][parts[4]][parts[5]] = value;
					  break;
				  case 7:
					  json[parts[0]][parts[1]][parts[2]][parts[3]][parts[4]][parts[5]][parts[6]] = value;
					  break;
				  }
    		  }

    		  reply.out() << json;
    	  }
      }
      hdf_destroy(&hdf);
  }
  else{
      reply.out() << "Invalid request.";
  }

  // <%/cpp>
  return HTTP_OK;
}

} // namespace

