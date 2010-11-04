#!/usr/bin/python

"""Simple Zeroconf service publication. Copyright 2008, Pierre of
stackp.online.fr. License appears to be "Do whatever you want".
Original code at http://stackp.online.fr/?p=35
"""

from __future__ import with_statement

import threading
# import functools
import time
import os
import subprocess
import avahi
import gobject
import dbus
from dbus import DBusException
from dbus.mainloop.glib import DBusGMainLoop

__all__ = ["ZeroconfBrowser"]


class ZeroconfBrowser(object):
	def __init__(self, loop=None):
		print "initialize the browser"
		self.local_loop = False
		if loop is None:
			gobject.threads_init()
			loop = DBusGMainLoop()
			self.local_loop = True
		self.bus = dbus.SystemBus(mainloop=loop)

		self.server = dbus.Interface(
			self.bus.get_object(avahi.DBUS_NAME, '/'),
			'org.freedesktop.Avahi.Server')

		self.lock = threading.Lock()
		print "ready"

	def __call__(self):
		print "__called__"
		if self.local_loop:
			gobject.MainLoop().run()

	def browse(self,
		   type,
		   interface=avahi.IF_UNSPEC,
		   protocol=avahi.PROTO_UNSPEC,
		   domain='local',
		   flags=dbus.UInt32(0)):
		print "browse"
		with self.lock:
			sbrowser = dbus.Interface(
				self.bus.get_object(
					avahi.DBUS_NAME,
					self.server.ServiceBrowserNew(
						interface,
						protocol,
						type,
						domain,
						flags)
					),
				avahi.DBUS_INTERFACE_SERVICE_BROWSER)

			sbrowser.connect_to_signal("ItemNew", self.resolve)
			sbrowser.connect_to_signal("ItemRemove", self.removal)
			sbrowser.connect_to_signal("AllForNow", self.allfornow)
			sbrowser.connect_to_signal("Failure", self.browse_error)
			print "connected_to_signals"

	def resolve(self, interface, protocol, name,
				type, domain, aprotocol, flags=dbus.UInt32(0)):
		print "Service found async:", interface, protocol, name, type, domain, flags
		with self.lock:
			self.server.ResolveService(
				interface, protocol, name,
				type, domain, avahi.PROTO_UNSPEC, dbus.UInt32(0), 
				reply_handler=self.resolved, error_handler=self.resolve_error)

	def resolved(self, interface, protocol, name, type,
				 domain, host, aprotocol, address,
				 port, txt, flags):
		path = []
		subtype = []
		for t in txt:
			x = "".join((chr(c) for c in t))
			(key, value) = x.split("=")
			if key == "path":
				path = value
			elif key == "subtype":
				subtype = value

		mount = Mount(host, path, name)
		mount.create()
		print "Service resolved: %s:%s nach %s" % (host, path, name)
		
	def resolve_error(self, exception):
		print "Resolution error:", exception

	def browse_error(self, *args, **kwargs):
		print "Browse Error:", args, kwargs

	def removal(self, interface, protocol, name, type, domain, flags):
		mount = Mount(host, path, name)
		mount.remove()
		print "Service removed: %s:%s nach %s" % (host, path, name)

	def allfornow(self):
		time.sleep(2)
		os.utime("/srv/vdr/video.00/.update", None)
		print "allfornow"

class Mount:
	def __init__(self, host, path, name):
		print "Mount created"
		self.remote = host + ":" + path
		self.media = "/srv/media/"
		self.name = name + " on " + host
		self.local = self.media + self.name
		self.vdr = "/srv/vdr/video.00/" + self.name

	def create(self):
		print "create"
		p1 = subprocess.Popen(["mount"], stdout=subprocess.PIPE)
		mounts = subprocess.Popen(["grep", "type nfs"],
					  stdin=p1.stdout,
					  stdout=subprocess.PIPE).communicate()[0]
		for path in mounts.split('\n'):
			print "compare " + path
			if len(path) != 0 and path.split()[2] == self.local:
				return
		try:
			os.mkdir(self.local)
		except OSError as (errno, strerror):
			if errno != 17:
				print "unable to make dir: " + strerror
				return
		subprocess.call(['/bin/mount',
				 '-t', 'nfs',
				 self.remote,
				 self.local])
		try:
			os.symlink(self.local, self.vdr)
		except OSError as (errno, strerror):
			print "I/O error({0}): {1}".format(errno, strerror)

	def remove(self):
		subprocess.Popen(["umount", self.local])
		os.rmdir(self.local)

browser = ZeroconfBrowser()
browser.browse('_nfs._tcp')
browser()


# import subprocess
# subprocess.Popen(["mount", "-t nfs", "data:/dir/", "/mnt/data_dir"])

# import os
# os.cmd ("mount -t nfs data:/dir/ /mnt/data_dir")
