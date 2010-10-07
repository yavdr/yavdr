#!/usr/bin/ruby
#
# proof of concept ruby scripting 
# udisk automounter for vdr integration 
#
#
# BEWARE: this is not fully functional yet !!!!!
#

require "dbus"

bus = DBus::SystemBus.instance


# connect to udisks service
service = bus.service("org.freedesktop.UDisks")
udisks = service.object("/org/freedesktop/UDisks")
udisks.introspect
udisks.default_iface = "org.freedesktop.UDisks"

# connect to device added
udisks.on_signal("DeviceAdded") do |input|

  # get the handle and properties of the device
  device = service.object(input)
  device.introspect

  handle = device["org.freedesktop.UDisks.Device"]
  properties = device["org.freedesktop.DBus.Properties"].GetAll("")[0]

  # check if we should mount it (by properties) and if it is mounted
  if ( !properties["DeviceIsSystemInternal"] &&
        properties["DriveCanDetach"] &&
        properties["DeviceIsPartition"] )

    puts "A new device matching criteria has just been added: #{input}"

    # try&catch at mounting it
    begin
          mountpoint = handle.FilesystemMount("",[]).join
          puts "Device #{input} mounted to #{mountpoint}"
    rescue DBus::Error => error
          puts "ERROR:" + error.inspect
    end

    mount = properties["DeviceMountPaths"][0]
    if (!mount.nil? && system("test ! 0 -eq $(find \"#{mount}\" -name *.rec | wc -l)"))
        puts "Contains VDR Recording"
    end
  end
end

# connect to device removed
udisks.on_signal("DeviceRemoved") do |input|
  puts "A new device has just been removed: #{input}"
end

main = DBus::Main.new
main << bus
main.run

