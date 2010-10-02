////////////////////////////////////////////////////////////////////////
// get_x11.cpp
// generated with ecppc
// date: Sat Oct  2 19:43:49 2010
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

log_define("component.get_x11")

// <%pre>
#line 1 "get_x11.ecpp"

#include <algorithm>
#include <string>
#include <sstream>
#include <ctype.h>
#include <ClearSilver.h>
#include "../common.h"
#include <jsoncpp/json.h>
#include <math.h>

extern "C" {
#include <X11/Xlib.h>

#include "NVCtrl/NVCtrl.h"
#include "NVCtrl/NVCtrlLib.h"
}

using namespace std;

// </%pre>

namespace
{
template <typename T> inline void use(const T&) { }

class _component_get_x11 : public tnt::EcppComponent
{
    _component_get_x11& main()  { return *this; }

  protected:
    ~_component_get_x11();

  public:
    _component_get_x11(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl);

    unsigned operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam);
};

static tnt::ComponentFactoryImpl<_component_get_x11> get_x11Factory("get_x11");

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

string display_device_name(int mask) {
	switch (mask) {
		case (1 << 0): return "CRT-0"; break;
		case (1 << 1): return "CRT-1"; break;
		case (1 << 2): return "CRT-2"; break;
		case (1 << 3): return "CRT-3"; break;
		case (1 << 4): return "CRT-4"; break;
		case (1 << 5): return "CRT-5"; break;
		case (1 << 6): return "CRT-6"; break;
		case (1 << 7): return "CRT-7"; break;

		case (1 << 8): return "TV-0"; break;
		case (1 << 9): return "TV-1"; break;
		case (1 << 10): return "TV-2"; break;
		case (1 << 11): return "TV-3"; break;
		case (1 << 12): return "TV-4"; break;
		case (1 << 13): return "TV-5"; break;
		case (1 << 14): return "TV-6"; break;
		case (1 << 15): return "TV-7"; break;

		case (1 << 16): return "DFP-0"; break;
		case (1 << 17): return "DFP-1"; break;
		case (1 << 18): return "DFP-2"; break;
		case (1 << 19): return "DFP-3"; break;
		case (1 << 20): return "DFP-4"; break;
		case (1 << 21): return "DFP-5"; break;
		case (1 << 22): return "DFP-6"; break;
		case (1 << 23): return "DFP-7"; break;
		default: return "Unknown";
	}
}

inline std::string trim_right(const std::string &source , const std::string& t = " ")
{
	std::string str = source;
	return str.erase( str.find_last_not_of(t) + 1);
}

inline std::string trim_left( const std::string& source, const std::string& t = " ")
{
	std::string str = source;
	return str.erase(0 , source.find_first_not_of(t) );
}

inline std::string trim(const std::string& source, const std::string& t = " ")
{
	std::string str = source;
	return trim_left( trim_right( str , t) , t );
}

string char2hex( char dec )
{
	char dig1 = (dec&0xF0)>>4;
	char dig2 = (dec&0x0F);
	if ( 0<= dig1 && dig1<= 9) dig1+=48; //0,48inascii
	if (10<= dig1 && dig1<=15) dig1+=97-10; //a,97inascii
	if ( 0<= dig2 && dig2<= 9) dig2+=48;
	if (10<= dig2 && dig2<=15) dig2+=97-10;

	string r;
	r.append( &dig1, 1);
	r.append( &dig2, 1);
	return r;
}

//based on javascript encodeURIComponent()
string urlencode(const string &c)
{

	string escaped="";
	int max = c.length();
	for(int i=0; i<max; i++)
	{
		if (c[i]=='"')
		{
			escaped.append( "\\" );
		}
		escaped.append( &c[i], 1 );
	}
	return escaped;
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

_component_get_x11::_component_get_x11(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl)
  : EcppComponent(ci, um, cl)
{
  // <%init>
  // </%init>
}

_component_get_x11::~_component_get_x11()
{
  // <%cleanup>
  // </%cleanup>
}

unsigned _component_get_x11::operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam)
{

  // <%args>
std::string display = qparam.param("display");
  // </%args>

  // <%cpp>
  // <& authenticate ...
#line 19 "get_x11.ecpp"
  tnt::QueryParams _tnt_cq0(qparam, false);
#line 19 "get_x11.ecpp"
  callComp(tnt::Compident(std::string(), "authenticate"), request, reply, _tnt_cq0);
  // &>
#line 125 "get_x11.ecpp"

reply.setHeader ("Cache-Control", "no-cache", false);
reply.setHeader ("Content-Type", "application/json", false);

HDF *hdf = NULL;
NEOERR *err;

string dualhead_enabled = "";
string graphtft_enabled = "";
string deinterlacer_hd = "bob";
string deinterlacer_sd = "temporal";
string devmode = "0";

Json::Value json;

//get current lirc settings from database
if (((err = hdf_init(&hdf)) != STATUS_OK) || ((err = hdf_read_file(hdf, YAVDRDB)) != STATUS_OK))
{
	nerr_log_error(err);
}
else
{
	dualhead_enabled = hdf_get_value(hdf, "system.x11.dualhead.enabled", "0");
	if (dualhead_enabled == "") {
		dualhead_enabled = "0";
	}
	graphtft_enabled = hdf_get_value(hdf, "vdr.plugin.graphtft.enabled", "0");
	if (graphtft_enabled == "") {
		graphtft_enabled = "0";
	}
	deinterlacer_hd = hdf_get_value(hdf, "vdr.deinterlacer.hd.type", "bob");
	if (deinterlacer_hd == "") {
		deinterlacer_hd = "bob";
	}
	deinterlacer_sd = hdf_get_value(hdf, "vdr.deinterlacer.sd.type", "temporal");
	if (deinterlacer_hd == "") {
		deinterlacer_hd = "temporal";
	}
	devmode = hdf_get_value(hdf, "webfrontend.devmode", "0");

	Display *dpy;
	Bool ret;
	int screen, display_devices, enabled_devices, screen_devices, mask, len, j;
	char *str, *start;
	string _s;
	int nDisplayDevice;

	json["system"]["x11"]["dualhead"]["enabled"] = dualhead_enabled;
	/*
	 * Open a display connection, and make sure the NV-CONTROL X
	 * extension is present on the screen we want to use.
	 */
	dpy = XOpenDisplay((display == ""?NULL:display.c_str()));

	if (dpy) {
		screen = DefaultScreen(dpy);
		if (XNVCTRLIsNvScreen(dpy, screen)) {

			int num_gpus, i;
			/* Get the number of gpus in the system */
			ret = XNVCTRLQueryTargetCount(dpy, NV_CTRL_TARGET_TYPE_GPU,
					&num_gpus);

			Json::Value displays;
			if (ret) {
				int nDisplayDevice = 0;

				/* display information about all GPUs */
				for (int gpu = 0; gpu < num_gpus; gpu++) {
					/* Probe for new devices at GPU */
					ret = XNVCTRLQueryTargetAttribute(dpy,
							NV_CTRL_TARGET_TYPE_GPU, gpu,
							0,
							NV_CTRL_PROBE_DISPLAYS,
							&display_devices);

					int *pData;
					/* X Screens driven by this GPU */
					ret = XNVCTRLQueryTargetBinaryData(dpy,
							NV_CTRL_TARGET_TYPE_GPU,
							gpu, // target_id
							0, // display_mask
							NV_CTRL_BINARY_DATA_XSCREENS_USING_GPU,
							(unsigned char **) &pData,
							&len);

					if (ret) {

						/* Connected Display Devices on X Screen */
						ret = XNVCTRLQueryTargetAttribute(dpy,
								NV_CTRL_TARGET_TYPE_X_SCREEN,
								0, // target_id
								0, // display_mask
								NV_CTRL_CONNECTED_DISPLAYS,
								&display_devices);
						//						printf("   Display Device Mask (Connected)   : 0x%08x\n",
						//								display_devices);

						/* List all X Screens on GPU */
						for (j = 1; j <= pData[0]; j++) {
							screen = pData[j];

							/* Enabled Display Devices on X Screen */
							ret = XNVCTRLQueryTargetAttribute(dpy,
									NV_CTRL_TARGET_TYPE_X_SCREEN,
									screen, // target_id
									0, // display_mask
									NV_CTRL_ENABLED_DISPLAYS,
									&enabled_devices);
							//							printf("   Display Device Mask (Enabled)   : 0x%08x\n",
							//									enabled_devices);

							/* List all display devices on this X Screen */
							for (mask = 1; mask < (1 << 24); mask <<= 1) {
								if (!(enabled_devices & mask)) {
									continue;
								}

								/* remove current enabled device from devices */
								display_devices ^= mask;

								XNVCTRLQueryStringAttribute(dpy, screen, mask,
										NV_CTRL_STRING_DISPLAY_DEVICE_NAME,
										&str);

								string name = string(str);
								string displayDeviceName = display_device_name(mask);

								displays[nDisplayDevice]["name"] = name;
								displays[nDisplayDevice]["primary"] = (screen == 0);
								displays[nDisplayDevice]["secondary"] = (screen == 1);
								displays[nDisplayDevice]["displaynumber"] = 1;
								displays[nDisplayDevice]["screen"] = screen;
								displays[nDisplayDevice]["devicename"] = displayDeviceName;
								XFree(str);

								Json::Value known;
								Json::Value modelines;

								int next = 0;

								modelines[next]["id"] = "disabled";
								modelines[next]["hz"]["0"]["modeline"] = "";
								modelines[next]["hz"]["0"]["x"] = 0;
								modelines[next]["hz"]["0"]["y"] = 0;
								next++;

								ret = XNVCTRLQueryBinaryData(dpy, screen, mask,
										NV_CTRL_BINARY_DATA_MODELINES,
										(unsigned char **) &str, &len);

								if (ret) {
									/*
									 * the returned data is in the form:
									 *
									 *  "ModeLine 1\0ModeLine 2\0ModeLine 3\0Last ModeLine\0\0"
									 *
									 * so walk from one "\0" to the next to print each ModeLine.
									 */
									start = str;
									for (int k = 0; k < len; k++) {
										if (str[k] == '\0' && start[0] != '\0') {
											_s = string(start);
											vector<string> tokens;
											vector<string> parts;
											Tokenize(_s, parts, ":");
											Tokenize(parts[parts.size()-1], tokens);

											string resolution = tokens[2]+"x"+tokens[6];

											bool interlace = false;
											bool doublescan = false;

											for(int i=10; i<tokens.size();i++) {

												std::transform(tokens[i].begin(), tokens[i].end(),
														tokens[i].begin(), ::tolower);
												if (tokens[i] == "doublescan") {
													doublescan = true;
												} else if (tokens[i] == "interlace") {
													interlace = true;
												}
											}
											std::stringstream ss;
											ss << floor(0.5 + atof(tokens[1].c_str()) * pow(10,6) / (atof(tokens[5].c_str()) * atof(tokens[9].c_str())) * (interlace?2:1) / (doublescan?2:1));
											string freq = ss.str() + (interlace?"i":"") + (doublescan?"d":"");

											int pos;
											if (!known.isMember(resolution)) {
												known[resolution] = next;
												modelines[next]["id"] = resolution;
												pos = next++;
											} else {
												pos = known[resolution].asInt();
											}

											if (!modelines[pos].isMember("hz") || !modelines[pos]["hz"].isMember(freq)) {
												Json::Value modeline;
												modeline["id"] = trim(tokens[0].substr(1, tokens[0].length()-2));
												modeline["modeline"] = trim(parts[parts.size()-1].substr(tokens[0].length()+1));
												modeline["x"] = tokens[2];
												modeline["y"] = tokens[6];
												//clock h_active h_sync h_sync_end h_blank_end v_active v_sync v_sync_end v_blanking OPTIONEN
												for(int l=1; l < tokens.size() && l < 10; l++) {
													modeline["clock"][l-1] = atof(tokens[l].c_str());
												}
												modeline["hz"] = floor(0.5 + atof(tokens[1].c_str()) * pow(10,6) / (atof(tokens[5].c_str()) * atof(tokens[9].c_str())) * (interlace?2:1) / (doublescan?2:1));
												modelines[pos]["hz"][freq] = modeline;
											}
											start = &str[k+1];
										}
									}

									XFree(str);
								}

								if ((displayDeviceName.substr(0,3) == "CRT" && name == displayDeviceName) || devmode == "1") {
									Json::Value modeline;
									modeline["id"] = "VGA2Scart_16_9";
									modeline["modeline"] = "19 1024 1032 1120 1216 576 581 586 625 -Hsync -Vsync interlace";
									modeline["x"] = 1024;
									modeline["y"] = 576;
									modeline["clock"][0u] = 19;
									modeline["clock"][1u] = 1024;
									modeline["clock"][2u] = 1032;
									modeline["clock"][3u] = 1120;
									modeline["clock"][4u] = 1216;
									modeline["clock"][5u] = 576;
									modeline["clock"][6u] = 581;
									modeline["clock"][7u] = 586;
									modeline["clock"][8u] = 625;
									modeline["hz"] = 50;

									modelines[next]["id"] = "VGA2Scart_16_9";
									modelines[next]["hz"]["50i"] = modeline;

									next++;
									modeline["id"] = "VGA2Scart_4_3";
									modeline["modeline"] = "13.875 720 744 808 888 576 580 585 625 -HSync -Vsync interlace";
									modeline["x"] = 720;
									modeline["y"] = 576;
									modeline["clock"][0u] = 13.875;
									modeline["clock"][1u] = 720;
									modeline["clock"][2u] = 744;
									modeline["clock"][3u] = 808;
									modeline["clock"][4u] = 888;
									modeline["clock"][5u] = 576;
									modeline["clock"][6u] = 580;
									modeline["clock"][7u] = 586;
									modeline["clock"][8u] = 625;
									modeline["hz"] = 50;

									modelines[next]["id"] = "VGA2Scart_4_3";
									modelines[next]["hz"]["50i"] = modeline;
								}

								displays[nDisplayDevice]["modelines"] = modelines;

								ret = XNVCTRLQueryStringAttribute(dpy, screen, mask,
										NV_CTRL_STRING_CURRENT_MODELINE,
										&str);
								if (ret) {
									_s = string(str);
									vector<string> tokens, parts;
									tokens.clear();
									Tokenize(_s, parts, ":");
									Tokenize(parts[parts.size()-1], tokens);

									displays[nDisplayDevice]["current_modeline"]["id"] = trim(tokens[0].substr(1, tokens[0].length()-2));
									displays[nDisplayDevice]["current_modeline"]["modeline"] = trim(parts[parts.size()-1].substr(tokens[0].length()+1));
									displays[nDisplayDevice]["current_modeline"]["x"] = tokens[2];
									displays[nDisplayDevice]["current_modeline"]["y"] = tokens[6];
									char *overscan = hdf_get_valuef(hdf, "system.x11.display.%u.overscan", nDisplayDevice);
									if (overscan != NULL)
									{
										displays[nDisplayDevice]["current_modeline"]["overscan"] = overscan;
									}
									else
									{
										displays[nDisplayDevice]["current_modeline"]["overscan"] = "";
									}
									XFree(str);
								}
								else
								{
									log_error("Failed to query current ModeLine.\n\n");
								}
							}

							nDisplayDevice++;
						}

						if (display_devices != 0) {
							//							printf("   Display Device Mask (disabled)   : 0x%08x\n",
							//									display_devices);
							/* List all display devices on this X Screen */
							for (mask = 1; mask < (1 << 24); mask <<= 1) {
								if (!(display_devices & mask)) {
									continue;
								}

								XNVCTRLQueryStringAttribute(dpy, screen, mask,
										NV_CTRL_STRING_DISPLAY_DEVICE_NAME,
										&str);

								string name = string(str);
								string displayDeviceName = display_device_name(mask);

								displays[nDisplayDevice]["name"] = name;
								displays[nDisplayDevice]["primary"] = false;
								displays[nDisplayDevice]["secondary"] = false;
								displays[nDisplayDevice]["devicename"] = displayDeviceName;

								XFree(str);

								Json::Value modelines;

								modelines[0u]["id"] = "disabled";
								modelines[0u]["modeline"] = "";
								modelines[0u]["x"] = 0;
								modelines[0u]["y"] = 0;

								ret = XNVCTRLQueryBinaryData(dpy, screen, mask,
										NV_CTRL_BINARY_DATA_MODELINES,
										(unsigned char **) &str, &len);

								if (ret) {
									/*
									 * the returned data is in the form:
									 *
									 *  "ModeLine 1\0ModeLine 2\0ModeLine 3\0Last ModeLine\0\0"
									 *
									 * so walk from one "\0" to the next to print each ModeLine.
									 */
									int next = 1;
									start = str;
									for (int k = 0; k < len; k++) {
										if (str[k] == '\0' && start[0] != '\0') {

											_s = string(start);
											vector<string> tokens;
											vector<string> parts;
											Tokenize(_s, parts, ":");
											Tokenize(parts[parts.size()-1], tokens);

											modelines[next]["id"] = trim(tokens[0].substr(1, tokens[0].length()-2));
											modelines[next]["modeline"] = trim(parts[parts.size()-1].substr(tokens[0].length()+1));
											modelines[next]["x"] = tokens[2];
											modelines[next]["y"] = tokens[6];
											//clock h_active h_sync h_sync_end h_blank_end v_active v_sync v_sync_end v_blanking OPTIONEN
											for(int l=1; l < tokens.size() && l < 10; l++) {
												modelines[next]["clock"][l-1] = atof(tokens[l].c_str());
											}
											modelines[next]["hz"] = floor(0.5 + atof(tokens[1].c_str()) * pow(10,6) / (atof(tokens[5].c_str()) * atof(tokens[9].c_str())));

											start = &str[k+1];
											next++;
										}
									}

									modelines[next]["id"] = "enabled";
									modelines[next]["modeline"] = "X11 restart required";
									modelines[next]["x"] = 0;
									modelines[next]["y"] = 0;

									XFree(str);

									if ((displayDeviceName.substr(0,3) == "CRT" && name == displayDeviceName) || devmode == "1") {
										next++;
										modelines[next]["id"] = "VGA2Scart_16_9";
										modelines[next]["modeline"] = "19 1024 1032 1120 1216 576 581 586 625 -Hsync -Vsync interlace";
										modelines[next]["x"] = 1024;
										modelines[next]["y"] = 576;
										modelines[next]["clock"][0u] = 19;
										modelines[next]["clock"][1u] = 1024;
										modelines[next]["clock"][2u] = 1032;
										modelines[next]["clock"][3u] = 1120;
										modelines[next]["clock"][4u] = 1216;
										modelines[next]["clock"][5u] = 576;
										modelines[next]["clock"][6u] = 581;
										modelines[next]["clock"][7u] = 586;
										modelines[next]["clock"][8u] = 625;
										modelines[next]["hz"] = 19.0 * pow(10,6) / (1216 * 625);

										next++;
										modelines[next]["id"] = "VGA2Scart_4_3";
										modelines[next]["modeline"] = "13.875 720 744 808 888 576 580 585 625 -HSync -Vsync interlace";
										modelines[next]["x"] = 720;
										modelines[next]["y"] = 576;
										modelines[next]["clock"][0u] = 13.875;
										modelines[next]["clock"][1u] = 720;
										modelines[next]["clock"][2u] = 744;
										modelines[next]["clock"][3u] = 808;
										modelines[next]["clock"][4u] = 888;
										modelines[next]["clock"][5u] = 576;
										modelines[next]["clock"][6u] = 580;
										modelines[next]["clock"][7u] = 586;
										modelines[next]["clock"][8u] = 625;
										modelines[next]["hz"] = 13.875 * pow(10,6) / (888 * 625);
									}
								} else {
									int next = modelines.size();
									modelines[next]["id"] = "enabled";
									modelines[next]["modeline"] = "X11 restart required";
									modelines[next]["x"] = 0;
									modelines[next]["y"] = 0;
								}

								displays[nDisplayDevice]["modelines"] = modelines;

								displays[nDisplayDevice]["current_modeline"]["id"] = "disabled";
								displays[nDisplayDevice]["current_modeline"]["modeline"] = "enable display";
								displays[nDisplayDevice]["current_modeline"]["x"] = 0;
								displays[nDisplayDevice]["current_modeline"]["y"] = 0;

								nDisplayDevice++;
							}
						}

						XFree(pData);
					}
				}
			} // number of gpus
			else
			{
				log_error("Failed to query number of GPUS.\n\n");
			}
			json["system"]["x11"]["displays"] = displays;
		}
		else
		{
			log_error("The NV-CONTROL X extension is not available on screen "
					<< screen << " of '" << XDisplayName(NULL) << "'.\n\n");
		}

		XCloseDisplay(dpy);

	}
	else
	{
		log_error("Cannot open display '" << XDisplayName(NULL) << "'.\n\n");
	}

	json["vdr"]["plugin"]["graphtft"]["enabled"] = graphtft_enabled;
	json["vdr"]["deinterlacer"]["hd"]["type"] = deinterlacer_hd;
	json["vdr"]["deinterlacer"]["sd"]["type"] = deinterlacer_sd;

}

reply.out() << json;


  // <%/cpp>
  return HTTP_OK;
}

} // namespace

