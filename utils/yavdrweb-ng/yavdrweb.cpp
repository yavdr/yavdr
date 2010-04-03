////////////////////////////////////////////////////////////////////////
// yavdrweb.cpp
// generated with ecppc
// date: Sat Apr  3 19:22:07 2010
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

log_define("component.yavdrweb")

// <%pre>
#line 1 "yavdrweb.ecpp"

#include <string>
#include <ClearSilver.h>
#include "../common.h"

using namespace std;

// </%pre>

namespace
{
template <typename T> inline void use(const T&) { }

class _component_yavdrweb : public tnt::EcppComponent
{
    _component_yavdrweb& main()  { return *this; }

  protected:
    ~_component_yavdrweb();

  public:
    _component_yavdrweb(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl);

    unsigned operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam);
};

static tnt::ComponentFactoryImpl<_component_yavdrweb> yavdrwebFactory("yavdrweb");

static const char* rawData = "\030\000\000\000\317\000\000\000\315\005\000\000\350\005\000\000\320\010\000\000\300\016\000\000<html>\n    <head>\n        <title>yaVDR Configuration</title>\n        \n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n        <meta name=\"lang\" content=\"\" />\n        <meta name=\"author\" content=\"yaVDR Team\" />\n        \n        <link rel=\"stylesheet\" type=\"text/css\" href=\"ext/resources/css/ext-all.css\" />\n        <!-- overrides to base library -->\n        <link rel=\"stylesheet\" type=\"text/css\" href=\"static/ext-extensions/Portal.css\" />\n        <link rel=\"stylesheet\" type=\"text/css\" href=\"static/ext-extensions/GroupTab.css\" />\n        <link rel=\"stylesheet\" type=\"text/css\" href=\"static/ext-extensions/Spinner.css\" />\n\n        <link rel=\"shortcut icon\" href=\"/static/images/favicon.ico\" type=\"image/vnd.microsoft.icon\">\n        <link rel=\"icon\" href=\"/static/images/favicon.ico\" type=\"image/vnd.microsoft.icon\">\n        <style>\n\t\t\t.x-viewport, .x-viewport body {\n\t\t\t\toverflow: auto !important;\n\t\t\t}\n\t\t</style>\n        <script type=\"text/javascript\" src=\"ext/adapter/ext/ext-base.js\"></script>\n        <script type=\"text/javascript\" src=\"ext/ext-all.js\"></script>\n        <!-- script type=\"text/javascript\" src=\"ext/ext-all-debug.js\"></script -->\n        <!-- TODO: only use those parts of ext that a really used by this application. saves a lot of http traffic -->\n        \n        <script>\n            Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';\n            var yavdrwebGlobalInfo = { \n                user : \"\",\n                lang : \"\"\n            };\n        </script>\n\n        <script type=\"text/javascript\" src=\"static/ext-extensions/GroupTabPanel.js\"></script>\n        <script type=\"text/javascript\" src=\"static/ext-extensions/GroupTab.js\"></script>\n        <script type=\"text/javascript\" src=\"static/ext-extensions/Portal.js\"></script>\n        <script type=\"text/javascript\" src=\"static/ext-extensions/PortalColumn.js\"></script>\n        <script type=\"text/javascript\" src=\"static/ext-extensions/Portlet.js\"></script>\n        <script type=\"text/javascript\" src=\"static/ext-extensions/Spinner.js\"></script>\n        <script type=\"text/javascript\" src=\"static/ext-extensions/SpinnerField.js\"></script>\n\n        <script type=\"text/javascript\" src=\"static/locale/en.js\"></script>\n\n        <script type=\"text/javascript\" src=\"static/config_tabs/remote.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/lirc.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/inputlirc.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/irserver.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/channels.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/diagnose.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/system.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/network.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/nvidia.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/vdr-frontend.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/web-frontend.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/vdr-upload-config.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/shutdown.js\"></script>\n\t\t<script type=\"text/javascript\" src=\"static/config_tabs/shutdown.js\"></script>\n\t\t<script type=\"text/javascript\" src=\"static/config_tabs/timeout.js\"></script>\n        <script type=\"text/javascript\" src=\"static/config_tabs/grouptabs.js\"></script>\n\t\t<script type=\"text/javascript\" src=\"static/config_tabs/x11.js\"></script>\n    </head>\n    <body style=\"background-color: #4E78B1;\"></body>\n</html>\n";

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

_component_yavdrweb::_component_yavdrweb(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl)
  : EcppComponent(ci, um, cl)
{
  // <%init>
  // </%init>
}

_component_yavdrweb::~_component_yavdrweb()
{
  // <%cleanup>
  // </%cleanup>
}

unsigned _component_yavdrweb::operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam)
{
  tnt::DataChunks data(rawData);

  // <%args>
  // </%args>

  // <%cpp>
  // <& authenticate ...
#line 7 "yavdrweb.ecpp"
  tnt::QueryParams _tnt_cq0(qparam, false);
#line 7 "yavdrweb.ecpp"
  callComp(tnt::Compident(std::string(), "authenticate"), request, reply, _tnt_cq0);
  // &>
#line 7 "yavdrweb.ecpp"

string lang = "";
HDF *hdf = NULL;
NEOERR *err;
if (((err = hdf_init(&hdf)) != STATUS_OK) || ((err = hdf_read_file(hdf, YAVDRDB)) != STATUS_OK))
{
  //reply.out() << "Error on hdf_read_file.";
  nerr_log_error(err);
}
else
{
    lang = hdf_get_value(hdf, "webfrontend.language", "");
}
hdf_destroy(&hdf);

if (lang == "") 
    lang = "en";


  reply.out() << data[0]; // <html>\n    <head>\n        <title>yaVDR Configuration</title>\n        \n        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n        <meta name="lang" content="
#line 30 "yavdrweb.ecpp"
  reply.sout() << (lang);
  reply.out() << data[1]; // " />\n        <meta name="author" content="yaVDR Team" />\n        \n        <link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css" />\n        <!-- overrides to base library -->\n        <link rel="stylesheet" type="text/css" href="static/ext-extensions/Portal.css" />\n        <link rel="stylesheet" type="text/css" href="static/ext-extensions/GroupTab.css" />\n        <link rel="stylesheet" type="text/css" href="static/ext-extensions/Spinner.css" />\n\n        <link rel="shortcut icon" href="/static/images/favicon.ico" type="image/vnd.microsoft.icon">\n        <link rel="icon" href="/static/images/favicon.ico" type="image/vnd.microsoft.icon">\n        <style>\n\t\t\t.x-viewport, .x-viewport body {\n\t\t\t\toverflow: auto !important;\n\t\t\t}\n\t\t</style>\n        <script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>\n        <script type="text/javascript" src="ext/ext-all.js"></script>\n        <!-- script type="text/javascript" src="ext/ext-all-debug.js"></script -->\n        <!-- TODO: only use those parts of ext that a really used by this application. saves a lot of http traffic -->\n        \n        <script>\n            Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';\n            var yavdrwebGlobalInfo = { \n                user : "
#line 54 "yavdrweb.ecpp"
  reply.sout() << (request.getUsername());
  reply.out() << data[2]; // ",\n                lang : "
#line 55 "yavdrweb.ecpp"
  reply.sout() << (lang);
  reply.out() << data[3]; // "\n            };\n        </script>\n\n        <script type="text/javascript" src="static/ext-extensions/GroupTabPanel.js"></script>\n        <script type="text/javascript" src="static/ext-extensions/GroupTab.js"></script>\n        <script type="text/javascript" src="static/ext-extensions/Portal.js"></script>\n        <script type="text/javascript" src="static/ext-extensions/PortalColumn.js"></script>\n        <script type="text/javascript" src="static/ext-extensions/Portlet.js"></script>\n        <script type="text/javascript" src="static/ext-extensions/Spinner.js"></script>\n        <script type="text/javascript" src="static/ext-extensions/SpinnerField.js"></script>\n\n        <script type="text/javascript" src="static/locale/en.js"></script>\n
#line 68 "yavdrweb.ecpp"
 if (lang != "en") reply.out() << "        <script type=\"text/javascript\" src=\"static/locale/" << lang << ".js\"></script>\n"; 
  reply.out() << data[4]; // \n        <script type="text/javascript" src="static/config_tabs/remote.js"></script>\n        <script type="text/javascript" src="static/config_tabs/lirc.js"></script>\n        <script type="text/javascript" src="static/config_tabs/inputlirc.js"></script>\n        <script type="text/javascript" src="static/config_tabs/irserver.js"></script>\n        <script type="text/javascript" src="static/config_tabs/channels.js"></script>\n        <script type="text/javascript" src="static/config_tabs/diagnose.js"></script>\n        <script type="text/javascript" src="static/config_tabs/system.js"></script>\n        <script type="text/javascript" src="static/config_tabs/network.js"></script>\n        <script type="text/javascript" src="static/config_tabs/nvidia.js"></script>\n        <script type="text/javascript" src="static/config_tabs/vdr-frontend.js"></script>\n        <script type="text/javascript" src="static/config_tabs/web-frontend.js"></script>\n        <script type="text/javascript" src="static/config_tabs/vdr-upload-config.js"></script>\n        <script type="text/javascript" src="static/config_tabs/shutdown.js"></script>\n\t\t<script type="text/javascript" src="static/config_tabs/shutdown.js"></script>\n\t\t<script type="text/javascript" src="static/config_tabs/timeout.js"></script>\n        <script type="text/javascript" src="static/config_tabs/grouptabs.js"></script>\n\t\t<script type="text/javascript" src="static/config_tabs/x11.js"></script>\n    </head>\n    <body style="background-color: #4E78B1;"></body>\n</html>\n
  // <%/cpp>
  return HTTP_OK;
}

} // namespace

