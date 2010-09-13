var locale_en = {
    meta_lang: {
        local : 'Englisch',
        int : 'English',
        key : 'en'
    },
    menutabs: {
        vdr : {
            title: 'Your VDR',
            tabtip: 'Configuration of basic settings of your VDR',
            content: 'Welcome to the yaVDR Web Frontend!'
        },
        system : {
            title: 'System',
            tabtip: 'Configuration of basic settings of the system',
            content: 'Welcome to the yaVDR Web Frontend!'
        },
        demos : {
            title: 'Demos',
            tabtip: 'Proof of concept, demos of possible new features, can be used for testing purposes',
            content: 'Proof of concept, demos of possible new features, can be used for testing purposes'
        },
        development : {
            title: 'Development',
            tabtip: 'New features that are under construction, don\'t use them. They don\'t work properly yet.',
            content: 'New features that are under construction, don\'t use them. They don\'t work properly yet.'
        },
        diagnose : {
            title: 'Diagnostics',
            tabtip: 'Stay informed about your system status, track problems',
            content: 'Access to important log files and configuration files'
        }
    },
    standardform: {
        button: {
            save: 'Save'
        },
        messagebox_caption: {
            message: 'Message',
            error: 'Error',
            wait: 'Please wait...'
        }
    },
    remote: {
        menutab: {
            title : 'Remotes',
            tabtip :'Remote-Settings (Remote Control Receiver)',
            panel_title : 'Remote Control Receiver'
        },
        help: 'There are 3 different LIRC compatible servers supported at the moment. Please choose the one, which is fitting your device best. <br /><h1>LIRC</h1><br /><br /> This is supporting most devices. Please inform yourself, what driver is supporting your device. You have to choose the correct driver for your device and in case its a homebrew-serial port device (Attric, self-build and other similar devices) you need to choose the correct serial port.<br /><br /><h1>Input Lirc</h1><br /><br /> Some DVB cards include a remote control receiver. Most of them as well as some USB devices are made available as so called input devices. You only need to choose the correct device from the drop  down.<br /><br /><h1>Irserver</h1><br /><br /> Some HTPC cases (for instance OrigenAE) have included remote control receiver, which can only be used with irserver. You only need to enable it and save it afterwards.' 
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Lirc-Settings (Remote Control Receiver)',
            panel_title : 'Remote Control Receiver (LIRC)'
        },
        help: 'When you press the button "Save" VDR will be restarted to notify VDR about the changed LIRC receiver settings. If you haven\'t assigned the buttons of your remote control (via remote.conf) VDR will offer you a step-by-step dialog on the OSD to learn the button assignment of your remote control from you. This dialog disappears after a few seconds if no key on the remote control was pressed. You can restart the dialog by simply pressing "Save" again.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'LIRC Driver'
             },
             emptytext: 'Please choose a receiver for your remote control...',
             label: 'Receiver'
        },
        serial_radiogroup: {
             label : 'Serial Interface',
             boxlabel_none : 'none'
        },
        submit: {
            waitmsg : 'LIRC receiver settings are being saved.',    
            success : 'The settings were successfully saved.',
            failure : 'Error on saving settings. Please try again.'
        },
        error: {
            json_decode : 'Could not decode JSON receiver list'
        }
    },
    inputlirc: {
        menutab: {
            title : 'Inputlirc',
            tabtip :'Inputlirc-Settings (Remote Control Receiver)',
            panel_title : 'Remote Control Receiver (LIRC)'
        },
        help: 'Please Choose your Remote Receiver from above list. When you press the button "Save" VDR will be restarted to notify VDR about the changed inputlirc receiver settings.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'Inputlirc Driver'
             },
             emptytext: 'Please choose a receiver for your remote control...',
             label: 'Receiver'
        },
        submit: {
            waitmsg : 'Inputlirc receiver settings are being saved.',    
            success : 'The settings were successfully saved.',
            failure : 'Error on saving settings. Please try again.'
        },
        error: {
            json_decode : 'Could not decode JSON receiver list'
        }
    },
    irserver: {
        menutab: {
            title : 'IRServer',
            tabtip :'IRServer-Settings (Remote Control Receiver)',
            panel_title : 'Remote Control Receiver (IRServer)'
        },
        help: 'When you press the button "Save" VDR will be restarted to notify VDR about the changed IRServer receiver settings.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'IRDriver Driver'
             },
             emptytext: 'Please choose a receiver for your remote control...',
             label: 'Receiver'
        },
        submit: {
            waitmsg : 'IRServer receiver settings are being saved.',    
            success : 'The settings were successfully saved.',
            failure : 'Error on saving settings. Please try again.'
        },
        error: {
            json_decode : 'Could not decode JSON receiver list'
        }
    },
    channels: {
        menutab: {
            title : 'Channels',
            tabtip : 'Channel settings (Maintain and sort radio and TV channels)',
            panel_title : '' //unused
        },
        grid_header : { 
            cnumber : 'No',
            cname : 'Channel Name',
            cprovider : 'Provider',
            cstr : 'Complete Channel String',
            cfrequency : 'Frequency',
            cmodulation : 'Modulation',
            csource : 'Source',
            csymbolrate : 'Symbolrate',
            cvpid : 'VPID',
            capid : 'APID',
            ctpid : 'TPID',
            ccaid : 'CAID',
            csid : 'SID',
            cnid : 'NID',
            ctid : 'TID',
            crid : 'RID',
            cgroup : 'Gruppe',
            c_friendly_transp: 'Transponder',
            c_friendly_lang: 'Language',
            c_friendly_type: 'TV/Radio',
            c_friendly_scrambled : 'FTA/scrambled'
        },
        grid_title : 'Channel List (all radio and TV channels)' 
    },
    frontend: {
        menutab: {
            title : 'VDR Frontend',
            tabtip : 'Switch between xine and xineliboutput frontend',
            panel_title : 'VDR Frontend'
        },
        label: 'Choose frontend',
        button_label:  'Apply frontend settings',
        submit: {
            waitmsg : 'Frontend settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        }
    },
    shutdown: {
        menutab: {
            title : 'Shutdown',
            tabtip : 'Switch between different shutdown methods',
            panel_title : 'VDR Shutdown'
        },
        label: 'Choose shutdown',
        button_label:  'Apply shutdown settings',
        submit: {
            waitmsg : 'Shutdown settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        },
        items: {
            s3: 'suspend to RAM',
            s3unavailable: 'suspend to RAM (unavailable)',
            s4: 'suspend to DISK',
            s4unavailable: 'suspend to DISK  (unavailable)',
            s5: 'shutdown',
            reboot: 'reboot "PowerOff" kernel'
        }
    },
    upload: {
        menutab: {
            title : 'VDR Config Editor',
            tabtip : 'Edit some plaintext VDR configuration files, upload your pre-existing config files',
            panel_title : 'VDR plaintext config editor'
        },
        button_label: 'Upload',
        submit: {
            waitmsg : 'File is being uploaded.',    
            success : 'File was uploaded successfully.',
            failure : 'There was a problem during file upload.'
        }
    },
    system: {
        menutab: {
            title : 'System',
            tabtip : 'Restart VDR or the whole system',
            panel_title : 'System Commands'
        },
        vdr_restart : {
            label: 'Restart VDR backend',
            submit: {
                waitmsg: 'The signal to restart VDR is being sent.',
                success: 'VDR will restart now.',
                failure: 'Problem on sending signal. Please try again.'
            }
        },
        kill_xbmc : {
            label: 'Kill XBMC (if frozen)',
            submit: {
                waitmsg: 'The signal to stop XBMC is being sent.',
                success: 'XBMC was stopped.',
                failure: 'Problem on sending signal. Please try again.'
            }
        },        
        system_restart : {
            label: 'Reboot machine (Caution: Not asking for confirmation!)',
            submit: {
                waitmsg: 'The signal to reboot is being sent.',
                success: 'The machine will reboot now.',
                failure: 'Problem on sending signal. Please try again.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Network',
            tabtip : 'Maintain network',
            panel_title : 'Network configuration'
        },
        nfs: {
            help: 'Define the nfs shares from other hosts that should be used from VDR. Directories have to be qualified like "server:/path". The button "Apply" actually submits the changes to your local configuration. VDR uses them after next restart.',
            menutab: {
                title : 'NFS',
                tabtip : 'Maintain NFS mounts and shares'
            },
            labels: {
                newDir : 'Remote directory',
                add : 'Add',
                edit : 'Edit',
                _delete: 'Remove',
                apply: 'Apply'
            }
        },
        samba: {
	        menutab: {
                title : 'Samba',
                tabtip : 'Maintain samba shares'
            }
	   }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Maintain Nvidia settings',
            panel_title : 'Nvidia configuration'
        },
        overscan_slider_label : 'Nvidia Overscan compensation',
        button_label : 'Apply value',
        submit: {
            waitmsg : 'Nvidia overscan settings are updated.',
            success : 'Success.',
            failure : 'Failure.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web Frontend',
            tabtip : 'Configure the appearance of the web frontend',
            panel_title : 'Web Frontend Settings'
        },
        label: 'Choose web frontend language',
        button_label:  'Apply language settings',
        submit: {
            waitmsg : 'Web frontend language settings are updated.',
            success : 'Success. Do you want to reload the web frontend now with the new language settings?',
            failure : 'Failure.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Refresh',
                refresh_tooltip: 'Please click this button to refresh the content of this panel.',
                jumpdown: 'Jump to end of panel',
                jumpdown_tooltip: 'Please click this button to jump to the end of this panel.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : 'System information', 
                    tabtip: 'Network status, system load, file system usage, kernel'
                },
                ifconfig : 'Network Status',
                top: 'System Load',
                dmesg: 'Kernel',
                df: 'File System Usage'
            },
            system_logs: {
                menutab: {
                    title :'System Logfiles',
                    tabtip: 'Important system Logfiles'
                }
            },
            xbmc: {
                menutab: {
                    title : 'XBMC log files',
                    tabtip : 'Find the reason for XBMC crashes or other XBMC problems'
                }
            },
            lirc: {
                menutab: {
                    title : 'LIRC Configuration',
                    tabtip : 'Check the current configuration of LIRC'
                }
            },
            vdr: {
                menutab: {
                    title : 'VDR Configuration',
                    tabtip : 'Check the current configuration of VDR'
                }
            },
            xorg: {
                menutab: {
                    title : 'X-Server',
                    tabtip : 'Check the current configuration of X'
                }
            },
            sound: {
                menutab: {
                    title : 'Sound (ALSA)',
                    tabtip : 'Troubleshoot sound problems (digital / analog output)'
                }
            },
            packages: {
                menutab: {
                    title : 'Packages',
                    tabtip : 'Check which packages and package versions are installed'
                }
            },
            yavdr: {
                menutab: {
                    title : 'yaVDR-Utils',
                    tabtip : 'Troubleshoot problems with the yaVDR web frontend (database + web server)'
                }
            }
        }
    },
    packages: {
        menutab: {
            title : 'yaVDR-Packages',
            tabtip : 'Check which packages and package versions are installed',
            panel_title : 'yaVDR-Packages'
        }
    },
    timeout: {
        menutab: {
            title : 'GRUB Timeout',
            tabtip : 'Set GRUB Timeout',
            panel_title : 'GRUB Timeout'
        },
        label: 'Choose timeout',
        button_label:  'Apply timeout settings',
        submit: {
            waitmsg : 'Timeout settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        },
        maxText: 'The maximum value for this field is {0}',
        minText: 'The minimum value for this field is {0}'
    },
    x11: {
        menutab: {
            title : 'Display Settings',
            tabtip : 'Display Settings',
            panel_title : 'Display Settings'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: 'activated'
        },
       deinterlacer_hd: {
            label: 'Xine-HD-Deinterlacer (default bob)'
        },
       deinterlacer_sd: {
            label: 'Xine-SD-Deinterlacer (default temporal)'
        },
        button_label:  'Apply display settings',
        submit: {
            waitmsg : 'Display settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        },
        dualhead: {
            label: 'dual head',
            boxlabel: 'activated',
            boxlabelunavailable: 'disabled (< 2 screens found)',
            switch_label: 'switch head of vdr frontend'
        },
        primary: 'primary',
        secondary: 'secondary',
        modeline: 'current modeline',
        device: 'device',
        resolution: 'resolution',
        select_res: 'select resolution',
        enabled: 'enabled',
        disabled: 'disabled'
    },
    sound: {
        menutab: {
            title : 'Sound Settings',
            tabtip : 'Sound Settings',
            panel_title : 'Sound Settings'
        },
        button_label:  'Apply sound settings',
        submit: {
            waitmsg : 'Sound settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        },
        label: 'sound setting'
    },
    lifeguard: {
        help: 'Check whether VDR should shutdown the machine Perform various tests specified by the user when VDR wants to shutdown the machine. Shutdown is postponed if any of the tests indicate, that there are other processes that should not be interrupted. Enable here the processes, which VDR shoud not interrupt. Nothing selected is similar to deaktivate VDR-Lifeguard',
        menutab: {
            title : 'VDR-Lifeguard',
            tabtip : 'Lifeguard Settings',
            panel_title : 'Lifeguard Settings'
        },
        button_label:  'Apply Lifeguard settings',
        submit: {
            waitmsg : 'Lifeguard settings are updated.',    
            success : 'Success.',
            failure : 'Failure.'
        },
        label: 'VDR-Lifeguard settings'
    }
};
