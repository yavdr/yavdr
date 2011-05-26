/*
 * shutdown.c: A plugin for shutting down the Video Disk Recorder
 *
 * See the README file for copyright information and how to reach the author.
 *
 */

#include <vdr/plugin.h>
#include "shutdown.h"

static const char *VERSION        = "0.0.2";
static const char *DESCRIPTION    = "How to shutdown via SVDRP";

class cPluginShutdown : public cPlugin {
private:
  // Add any member variables or functions you may need here.
public:
  virtual const char *Version(void) { return VERSION; }
  virtual const char *Description(void) { return DESCRIPTION; }
  virtual const char **SVDRPHelpPages(void);
  virtual cString SVDRPCommand(const char *Command, const char *Option, int &ReplyCode);
  };

const char **cPluginShutdown::SVDRPHelpPages(void)
{
  static const char *HelpPages[] = {
    "CONF\n"
    "    Confirm shutdown.",
    NULL
    };
  return HelpPages;
}

cString cPluginShutdown::SVDRPCommand(const char *Command, const char *Option, int &ReplyCode)
{
  if (strcasecmp(Command, "CONF") == 0) {
    isyslog("confirm shutdown request");
    // Check for activity, request power button again if active:
    cString Message = PlugShutdownHandler.ConfirmShutdown();
    if (!isempty(*Message))
      ReplyCode = 500;
    else
      Message = "shutdown confirmed";

    return Message;
  } 
  return NULL;
}

VDRPLUGINCREATOR(cPluginShutdown); // Don't touch this!

