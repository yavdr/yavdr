/*
 * shutdown.c: Handling of shutdown and inactivity
 *
 * See the main source file 'vdr.c' for copyright information and
 * how to reach the author.
 *
 * Original version written by Udo Richter <udo_richter@gmx.de>.
 *
 * $Id: shutdown.c 2.0 2008/02/24 10:29:00 kls Exp $
 */

#include "shutdown.h"
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <vdr/channels.h>
#include <vdr/config.h>
#include <vdr/cutter.h>
#include <vdr/i18n.h>
#include <vdr/interface.h>
#include <vdr/menu.h>
#include <vdr/plugin.h>
#include <vdr/timers.h>
#include <vdr/tools.h>

cPlugShutdownHandler PlugShutdownHandler;

cPlugShutdownHandler::cPlugShutdownHandler(void)
{
  activeTimeout = 0;
  retry = 0;
  shutdownCommand = NULL;
  exitCode = -1;
  emergencyExitRequested = false;
}

cPlugShutdownHandler::~cPlugShutdownHandler()
{
  free(shutdownCommand);
}

void cPlugShutdownHandler::RequestEmergencyExit(void)
{
  if (Setup.EmergencyExit) {
     esyslog("initiating emergency exit");
     emergencyExitRequested = true;
     Exit(1);
     }
  else
     dsyslog("emergency exit request ignored according to setup");
}

void cPlugShutdownHandler::CheckManualStart(int ManualStart)
{
  time_t Delta = Setup.NextWakeupTime ? Setup.NextWakeupTime - time(NULL) : 0;

  if (!Setup.NextWakeupTime || abs(Delta) > ManualStart) {
     // Apparently the user started VDR manually
     dsyslog("assuming manual start of VDR");
     // Set inactive after MinUserInactivity
     SetUserInactiveTimeout();
     }
  else {
     // Set inactive from now on
     dsyslog("scheduled wakeup time in %ld minutes, assuming automatic start of VDR", Delta / 60);
     SetUserInactive();
     }
}

void cPlugShutdownHandler::SetShutdownCommand(const char *ShutdownCommand)
{
  free(shutdownCommand);
  shutdownCommand = ShutdownCommand ? strdup(ShutdownCommand) : NULL;
}

void cPlugShutdownHandler::CallShutdownCommand(time_t WakeupTime, int Channel, const char *File, bool UserShutdown)
{
  time_t Delta = WakeupTime ? WakeupTime - time(NULL) : 0;
  cString cmd = cString::sprintf("%s %ld %ld %d \"%s\" %d", shutdownCommand, WakeupTime, Delta, Channel, *strescape(File, "\\\"$"), UserShutdown);
  isyslog("executing '%s'", *cmd);
  int Status = SystemExec(cmd, true);
  if (!WIFEXITED(Status) || WEXITSTATUS(Status))
     esyslog("SystemExec() failed with status %d", Status);
  else {
     Setup.NextWakeupTime = WakeupTime; // Remember this wakeup time for comparison on reboot
     Setup.Save();
     }
}

void cPlugShutdownHandler::SetUserInactiveTimeout(int Seconds, bool Force)
{
  if (!Setup.MinUserInactivity && !Force) {
     activeTimeout = 0;
     return;
     }
  if (Seconds < 0)
     Seconds = Setup.MinUserInactivity * 60;
  activeTimeout = time(NULL) + Seconds;
}

cString cPlugShutdownHandler::ConfirmShutdown()
{
  cString Message = NULL;

  if (cCutter::Active())
     Message = tr("Editing");

  cTimer *timer = Timers.GetNextActiveTimer();
  time_t Next = timer ? timer->StartTime() : 0;
  time_t Delta = timer ? Next - time(NULL) : 0;

  if (cRecordControls::Active() || (Next && Delta <= 0))
     // VPS recordings in timer end margin may cause Delta <= 0
     if (isempty(*Message))
        Message = tr("Recording");
     else
        Message = cString::sprintf("%s\n%s", *Message, tr("Recording"));

  else if (Next && Delta <= Setup.MinEventTimeout * 60) {
     // Timer within Min Event Timeout
     cString buf = tr("Recording in %ld minutes");
     if (isempty(*Message))
        Message = cString::sprintf(*buf, Delta / 60);
     else {
        buf = cString::sprintf("%s%s", "%s\n", *buf);
        Message = cString::sprintf(*buf, *Message, Delta / 60);
        }
     }
  cPlugin *plugin;
  for (int i = 0; (plugin = cPluginManager::GetPlugin(i)) != NULL; i++) {
     cString s = plugin->Active();
     if (!isempty(*s)) {
        if (isempty(*Message))
           Message = s;
        else
           Message = cString::sprintf("%s\n%s", *Message, *s);
        }
     }      

  cPlugin *Plugin = cPluginManager::GetNextWakeupPlugin();
  Next = Plugin ? Plugin->WakeupTime() : 0;
  Delta = Next ? Next - time(NULL) : 0;
  if (Next && Delta <= Setup.MinEventTimeout * 60) {
     // Plugin wakeup within Min Event Timeout
     cString buf = tr("Plugin %s wakes up in %ld min");
     if (isempty(*Message))
        Message = cString::sprintf(*buf, Plugin->Name(), Delta / 60);
     else {
        buf = cString::sprintf("%s%s", "%s\n", *buf);
        Message = cString::sprintf(*buf, *Message, Plugin->Name(), Delta / 60);
        }
     }
  return Message;
}

bool cPlugShutdownHandler::ConfirmRestart(bool Interactive)
{
  if (cCutter::Active()) {
     if (!Interactive || !Interface->Confirm(tr("Editing - restart anyway?")))
        return false;
     }

  cTimer *timer = Timers.GetNextActiveTimer();
  time_t Next  = timer ? timer->StartTime() : 0;
  time_t Delta = timer ? Next - time(NULL) : 0;

  if (cRecordControls::Active() || (Next && Delta <= 0)) {
     // VPS recordings in timer end margin may cause Delta <= 0
     if (!Interactive || !Interface->Confirm(tr("Recording - restart anyway?")))
        return false;
     }

  if (cPluginManager::Active(Interactive ? tr("restart anyway?") : NULL))
     return false;

  return true;
}

bool cPlugShutdownHandler::DoShutdown(bool Force)
{
  time_t Now = time(NULL);
  cTimer *timer = Timers.GetNextActiveTimer();
  cPlugin *Plugin = cPluginManager::GetNextWakeupPlugin();

  time_t Next = timer ? timer->StartTime() : 0;
  time_t NextPlugin = Plugin ? Plugin->WakeupTime() : 0;
  if (NextPlugin && (!Next || Next > NextPlugin)) {
     Next = NextPlugin;
     timer = NULL;
     }
  time_t Delta = Next ? Next - Now : 0;

  if (Next && Delta < Setup.MinEventTimeout * 60) {
     if (!Force)
        return false;
     Delta = Setup.MinEventTimeout * 60;
     Next = Now + Delta;
     timer = NULL;
     dsyslog("reboot at %s", *TimeToString(Next));
     }

  if (Next && timer) {
     dsyslog("next timer event at %s", *TimeToString(Next));
     CallShutdownCommand(Next, timer->Channel()->Number(), timer->File(), Force);
     }
  else if (Next && Plugin) {
     CallShutdownCommand(Next, 0, Plugin->Name(), Force);
     dsyslog("next plugin wakeup at %s", *TimeToString(Next));
     }
  else
     CallShutdownCommand(Next, 0, "", Force); // Next should always be 0 here. Just for safety, pass it.

  return true;
}
