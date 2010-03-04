////////////////////////////////////////////////////////////////////////
// get_hdf_value.cpp
// generated with ecppc
// date: Thu Mar  4 17:30:51 2010
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
  // </%args>

  // <%cpp>
  // <& authenticate ...
#line 14 "get_hdf_value.ecpp"
  tnt::QueryParams _tnt_cq0(qparam, false);
#line 14 "get_hdf_value.ecpp"
  callComp(tnt::Compident(std::string(), "authenticate"), request, reply, _tnt_cq0);
  // &>
#line 14 "get_hdf_value.ecpp"

  reply.setHeader ("Cache-Control", "no-cache", false);
  string value = "";
  const char *valid_hdf_requests[] = {
    "webfrontend.language",
    "vdr.frontend",
    "system.shutdown",
    "system.hardware.nvidia.overscan",
    "system.grub.timeout"
  };
  
  bool validRequest = false;
  int findex = 0;
  for (findex = 0; (findex < (sizeof(valid_hdf_requests) / sizeof(valid_hdf_requests[0]))) && !validRequest; findex++)
  {
      if (hdfpath == valid_hdf_requests[findex])
          validRequest = true;
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
          value = hdf_get_value(hdf, hdfpath.c_str(), "");
          reply.out() << value;
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

