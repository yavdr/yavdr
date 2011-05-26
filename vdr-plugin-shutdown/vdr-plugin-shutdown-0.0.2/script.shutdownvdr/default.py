import sys
import xbmcaddon
import xbmcgui
import xbmc
import telnetlib

Addon = xbmcaddon.Addon('script.shutdownvdr')

# Script constants
__scriptname__ = Addon.getAddonInfo('name')
__id__ = Addon.getAddonInfo('id')
__version__ = Addon.getAddonInfo('version')


class SVDRPClient(object):

    def __init__(self, host, port):
        self.telnet = telnetlib.Telnet()
        self.host = host
        self.port = port

    def connect(self):
        self.telnet.open(self.host, self.port)
        connect_string = self.read_response()
        return connect_string

    def close(self):
        self.telnet.close()

    def send_command(self, line):
        self.telnet.write(line + '\n')

    def read_line(self):
        line = self.telnet.read_until('\n', 3)
        line = line.replace('\n', '').replace('\r', '')
        try:
            return int(line[0:3]), line[4:]
        except:
            return line

    def read_response(self):
        response = []
        line = self.read_line()
        if line:
            response.append(line)
        while line and line[1]:
            line = self.read_line()
            if line:
                response.append(line)
        return response


class Script:

    DEBUG = True

    VDR_PLUG_CMD = 'PLUG shutdown CONF'
    VDR_PLUG_CMD_FORCE = 'PLUG shutdown FORCE'  # fixme: needs a real cmd!
    VDR_PLUG_RET_CONFIRMED = 900
    VDR_PLUG_RET_REFUSED = 500

    SID_PROG_HEADING = 3000
    SID_ERROR = 3001
    SID_STARTED = 3002
    SID_CONNECTED = 3003
    SID_CMDSENT = 3004
    SID_FINISHED = 3005
    SID_SHUTD_CONFIRMED = 3006
    SID_SHUTD_REFUSED = 3007
    SID_ABORT = 3008
    SID_FORCE = 3009
    SID_REASON = 3010
    SID_WANT_FORCE = 3011
    SID_FORCE_SENT = 3012

    def __init__(self):
        # create instances of needed xbmc classes
        self.getString = Addon.getLocalizedString
        self.getSetting = Addon.getSetting
        # create progress dialog
        self.pDialog = xbmcgui.DialogProgress()
        self.pDialog.create(self.getString(self.SID_PROG_HEADING))
        # create Dialog for OK- and YESNO-Dialogs
        self.Dialog = xbmcgui.Dialog()
        # get Settings
        self.VDR_HOST = self.getSetting('vdr_host')
        self.VDR_PORT = int(self.getSetting('vdr_port'))
        # create instance of telnet client
        self.Connection = SVDRPClient(self.VDR_HOST,
                                      self.VDR_PORT)

    def start(self):
        self.updateProgress(self.getString(self.SID_STARTED), 5)
        # try to connect
        if self.connect():
            print '[SCRIPT][%s] Connected to: "%s"' % (__scriptname__,
                                                       self.vdr_welcome_string)
            self.updateProgress(self.getString(self.SID_CONNECTED), 60)
            confirmed = self.askShutdown()
            self.updateProgress(self.getString(self.SID_CMDSENT), 80)
            if confirmed == True:
                self.shutdownConfirmed()
            elif confirmed == False:
                self.shutdownRefused()

    def connect(self):
        self.vdr_welcome_string = None
        ret = False
        try:
            self.vdr_welcome_string = self.Connection.connect()[0][1]
            ret = True
        except Exception, error:
            # Connection refused
            self.openPopup(self.getString(self.SID_ERROR),
                           str(error))
        return ret

    def askShutdown(self):
        self.Connection.send_command(self.VDR_PLUG_CMD)
        line = self.Connection.read_response()
        code, self.message = line[0]
        if code == 550:
            # ex. Plugin "shutdown" not found
            self.openPopup(self.getString(self.SID_ERROR),
                           self.message)
        elif code == self.VDR_PLUG_RET_CONFIRMED:
            # Shutdown confirmed by plugin
            return True
        elif code == self.VDR_PLUG_RET_REFUSED:
            # shutdown refused by plugin
            return False
        else:
            # Unknown return code
            self.openPopup(self.getString(self.SID_ERROR), code, self.message)
            return None

    def shutdownConfirmed(self):
        self.endProgress()
        self.openPopup(self.getString(self.SID_SHUTD_CONFIRMED))

    def shutdownRefused(self):
        reason = self.message
        force = self.Dialog.yesno(self.getString(self.SID_PROG_HEADING),
                                  self.getString(self.SID_SHUTD_REFUSED),
                                  self.getString(self.SID_REASON) % reason,
                                  self.getString(self.SID_WANT_FORCE),
                                  self.getString(self.SID_ABORT),
                                  self.getString(self.SID_FORCE))
        if force:
            self.updateProgress(self.getString(self.SID_FORCE_SENT), 90)
            self.forceShutdown()
        self.endProgress()

    def forceShutdown(self):
        self.Connection.send_command(self.VDR_PLUG_CMD_FORCE)
        self.openPopup(self.getString(self.SID_SHUTD_CONFIRMED))

    def updateProgress(self, message, percent):
        if self.DEBUG:
            print "[SCRIPT][%s] DEBUG: %s%%: %s" % (__scriptname__,
                                                    percent,
                                                    message)
        self.pDialog.update(percent, message)
        xbmc.sleep(100)

    def endProgress(self):
        self.updateProgress(self.getString(self.SID_FINISHED), 100)
        self.pDialog.close()

    def openPopup(self, line1, line2=''):
        if self.DEBUG:
            print "[SCRIPT][%s] MSG: %s %s" % (__scriptname__,
                                               line1,
                                               line2)
        self.Dialog.ok(self.getString(self.SID_PROG_HEADING),
                       line1,
                       line2)

# Here starts the Addon :-)
if (__name__ == '__main__'):
    print '[SCRIPT][%s] version %s initialized!' % (__scriptname__,
                                                    __version__)
    gui = Script()
    gui.start()
    del gui
    print '[SCRIPT][%s] version %s exited!' % (__scriptname__,
                                               __version__)
    sys.modules.clear()
