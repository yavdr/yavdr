#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Autorecord favorite VDR programs via SVDRP.
# Copyright (C) Kenneth Falck 2011.
# Distribution allowed under the Simplified BSD License.
import telnetlib
from datetime import datetime, timedelta
import re
import sys

# VDR server
VDR_HOST = '127.0.0.1'
VDR_PORT = 6419

class SVDRPClient(object):
    def __init__(self, host, port):
        self.telnet = telnetlib.Telnet()
        self.telnet.open(host, port)
        self.read_response()
    
    def close(self):
        self.telnet.close()
    
    def send_command(self, line):
        #print '>>>', line
        self.telnet.write(line + '\r\n')
    
    def read_line(self):
        line = self.telnet.read_until('\n', 10).replace('\n', '').replace('\r', '')
        #print '<<<', line
        if len(line) < 4: return None
        return int(line[0:3]), line[3] == '-', line[4:]
    
    def read_response(self):
        response = []
        line = self.read_line()
        if line: response.append(line)
        while line and line[1]:
            line = self.read_line()
            if line: response.append(line)
        return response
    
    def confirm_shutdown(self):
        self.send_command('PLUG shutdown CONF')
        line = self.read_response()
        num, dummy, message = line[0]
        return int(num), message
    
client = SVDRPClient(VDR_HOST, VDR_PORT)
num, message = client.confirm_shutdown()
print num, message
client.close()

