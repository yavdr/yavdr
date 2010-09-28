#!/usr/bin/env ruby
#
#  Author::    Arno Esser (mailto:arno.esser[at]gmx.de).
#  License::   Distributes under the same terms as Ruby.
#  Copyright:: Copyright (c) 2010. All rights reserved.
#  Version::   0.3
#
#  Acknowledgement:: This script is mainly based on the work from
#                    Sander van Woensel. You can find his version
#                    here
#                    http://svwtech.com/site/
#

require 'rubygems'
require 'dnssd'
require 'pathname'
require 'fileutils'
require 'daemons'
require 'logger'

class NetworkShareMountDaemon
  include Daemonize
  
  MAIN_LOOP_DELAY = 10
  SKIP_MOUNT_RETRIEVAL_COUNT = 4 # Number of times get_active_mounts is NOT called ater each main loop delay.
  NFS_SERVICE = '_nfs._tcp'
  LOG_FILE_LOCATION = '/tmp'
  
  def initialize()
  end

  def main
    i=0
    
    # Become a daemon
    # TODO: Give this process a low execution priority
    log_dir = File.expand_path(LOG_FILE_LOCATION)
    daemonize(log_dir+File::SEPARATOR+$0.split(File::SEPARATOR).last+'.log')
    
    # NOTE: Discovery of new mounts will be detected SKIP_MOUNT_RETRIEVAL_COUNT
    # times more faster.
    loop do
      sleep(MAIN_LOOP_DELAY)
      
      if i<=0
        @active_mounts = get_active_mounts
        i = SKIP_MOUNT_RETRIEVAL_COUNT
      end
      
      discover_nfs
      i-=1
    end
    
  end

  def get_active_mounts
    mounts = Array.new
    nfs_mounts = %x[mount -t nfs].split("\n")
    #nfs_mounts = `mount -t nfs`.split("\n")
    for nfs_mount in nfs_mounts do
      server_path = nfs_mount.split()[0]
      unless server_path.nil?
        (server, path) = server_path.split(':') 
        mounts.push(Mount.new(server, Mount::UNKNOWN_PORT, path))
      end
    end
    
    mounts
  end
  private :get_active_mounts

  def discover_nfs 
    @service = DNSSD.browse(NFS_SERVICE) do |browse_reply|
      # Found a NFS service, resolve it.
      DNSSD.resolve(browse_reply.name, 
                    browse_reply.type,
                    browse_reply.domain,
                    0,
                    browse_reply.interface) do |resolve_reply|
        
        mount = Mount.new(resolve_reply.target, resolve_reply.port, resolve_reply.text_record['path'])
        if !@active_mounts.include?(mount)
          # TODO: probe if directory could be created!!.
          
          if FileUtils.mkdir(mount.mount_point)
            if system("mount -t nfs -o,port=#{mount.port} #{mount.server}:#{mount.path} #{mount.mount_point}")
              @active_mounts.push(mount)
              mount.notify
              $log.info("Succesfully mounted dicovered NFS service "+mount.to_s)
            else
              $log.error("Failed to mount discovered NFS service: #{mount.to_s}. Error code #{$?}.")
              FileUtils.rmdir(mount.mount_point)
            end
          end
        end
      end
      
    end
    
  end
  private :discover_nfs
  
end

class Mount
  
  SEP = File::SEPARATOR
  MOUNT_POINT_ROOT = SEP+'srv'+SEP+'vdr'+SEP+'video.00'
  MOUNT_POINT_NET = MOUNT_POINT_ROOT+SEP+'net'
  MOUNT_NOTIFY = MOUNT_POINT_ROOT+SEP+'.update'
  UNKNOWN_PORT = -1
  
  attr_reader :server
  attr_reader :port
  attr_reader :path
  
  def initialize(server, port, path)
    @server = server.chomp('.')
    @port = port
    @path = path
    @mount_point = nil
  end
  
  def ==(other_mount)
    # NOTE: Port not checked for equality.
    @server == other_mount.server and @path == other_mount.path
  end
  
  def mount_point
    if @mount_point.nil?
      i=1
      
      mount_point = Pathname.new(MOUNT_POINT_NET)
      mount_point += @path.split(File::SEPARATOR).last
      new_mount_point = mount_point
      
      # Add an ever increasing number to the mount_point when the path already exists.
      while File.exists?(new_mount_point)
        new_mount_point = Pathname.new(mount_point.to_s + i.to_s)
        i+=1
        
        # When we had to count up to 50 and still did not find a valid path, something is really wrong.
        if i>50
          $log.error("Could not find a not existing mount point.")
          return
        end
      end
      
      @mount_point = new_mount_point
    end	   
    
    @mount_point
  end

  def notify
    FileUtils.touch(MOUNT_NOTIFY)
  end
  
  def to_s
    "nfs://#{server}:#{@port}#{@path} at #{@mount_point}"
  end
end

#------------------------------------------------------------------------------#
#                                    Main                                      #
#------------------------------------------------------------------------------#

if __FILE__ == $0
  $log = Logger.new(STDOUT, 1, 512000) # Logfile can be at most 500kB.
  $log.level = Logger::INFO # Log information and higher classes.
  
  nsmd = NetworkShareMountDaemon.new
  nsmd.main

end
