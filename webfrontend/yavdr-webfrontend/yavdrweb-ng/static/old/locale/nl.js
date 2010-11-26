var locale_nl = {
    meta_lang: {
        local : 'Nederlands',
        int : 'Dutch',
        key : 'nl'
    },
    menutabs: {
        vdr : {
            title: 'Your VDR',
            tabtip: 'Configuration of basic settings of your VDR',
            content: 'Welkom in het yaVDR Web-Frontend!'
        },
        system : {
            title: 'System',
            tabtip: 'Configuration of basic settings of the system',
            content: 'Welkom in het yaVDR Web-Frontend!'
        },
        diagnose : {
            title: 'Diagnose',
            tabtip: 'Blijf ge-informeert over de toestand van Uw systeem of vindt eventuele problemen',
            content: 'Bekijken van belangrijke Logfiles en Configuratie bestanden'
        }
    },
    standardform: {
        button: {
            save: 'Opslaan'
        },
        messagebox_caption: {
            message: 'Bericht',
            error: 'Fout',
            wait: 'Even wachten AUB...'
        }
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Lirc instellingen (Infrarood ontvanger)',
            panel_title : 'Infrarood ontvanger (LIRC)'
        },
        help: 'Als U op de knop "Bewaar" klikt wordt VDR opnieuw gestart om de veranderingen die U in de LIRC infrarood-ontvanger instellingen heeft gemaakt toe te passen. Als U geen knoppen van uw afstandsbediening (via remote.conf) heeft toegewezen zal VDR een stap-voor-stap instruktie geven via de OSD om de knoppen op uw afstandsbediening toe te wijzen aan de juiste commando\'s (bijv. kanaal omhoog/omlaag enz.). Dit is de zgn "leer-funktie". Deze instrukties verdwijnt als U na een paar seconden geen knop op uw afstandsbediening heeft ingedrukt. U kunt deze "Stap voor Stap" instrukties opnieuw oproepen als U weer op "Bewaar" klikt.',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'LIRC Driver'
             },
             emptytext: 'Kies Uw Infrarood ontvanger voor U afstands bediening...',
             label: 'Ontvanger'
        },
        serial_radiogroup: {
             label : 'Serieele Poort',
             boxlabel_none : 'geen'
        },
        submit: {
            waitmsg : 'De instellingen voor U afstands bediening worden opgeslagen.',
            success : 'Uw instellingen zijn succesvol opgeslagen.',
            failure : 'Er is een fout opgetreden bij het opslaan van Uw instellingen. Probeert U het nog eens.'
        },
        error: {
            json_decode : 'Kan JSON Ontvangerlijst niet decoderen'
        }
    },
    channels: {
        menutab: {
            title : 'Kanaal lijst',
            tabtip : 'Kanaal instellingen (Radio en TV kanalen onderhouden en sorteren)',
            panel_title : '' //unused
        },
        grid_header : {
            cid : 'Nr.',
            cname : 'Kanaal naam',
            cstr : 'Komplete Kanaal string'
        },
        grid_title : 'Kanaal lijst (alle Radio en TV Kanalen)'
    },
    frontend: {
        menutab: {
            title : ' Kies VDR-Frontend ',
            tabtip : 'Maak Uw keuze tussen Xine of Xineliboutput',
            panel_title : 'VDR-Frontend'
        },
        label: 'Kies Uw Frontend',
        button_label: 'Frontend instellingen activeren',
        submit: {
            waitmsg : 'Frontend instellingen worden ge-actualiseert.',
            success : 'OK.',
            failure : 'Fout.'
        }
    },
    upload: {
        menutab: {
            title : 'VDR Configuratie uploaden',
            tabtip : 'Sla U eigen aangepaste VDR Configuratie bestand op',
            panel_title : 'VDR Configuratie Upload (de Upload overschrijft de bestaande Bestands-Versie)'
        },
        button_label: 'Bestand uploaden',
        submit: {
            waitmsg : 'Configuratie-bestand wordt opgeslagen.',
            success : 'Bestand is succesvol opgeslagen.',
            failure : 'Er is een probleem opgetreden bij het opslaan van het bestand.'
        }
    },
    system: {
        menutab: {
            title : 'Systeem',
            tabtip : 'Herstarten van VDR of de Computer',
            panel_title : 'Systeem-Commando'
        },
        vdr_restart : {
            label: 'VDR Backend herstarten',
            submit: {
                waitmsg: 'Het signaal om VDR te herstarten is verstuurd.',
                success: 'VDR wordt opnieuw gestart.',
                failure: 'Probleem bij het sturen van het herstart signaal. Probeert U het nog eens.'
            }
        },
        kill_xbmc : {
            label: 'Vastgelopen XBMC "killen" ',
            submit: {
                waitmsg: 'Het "Kill" signaal voor XBMC is verstuurd.',
                success: 'XBMC wordt nu gestopt.',
                failure: 'Probleem bij het versturen v.h "Kill" signaal.Probeert U het nog eens.'
            }
        },
        system_restart : {
            label: 'Computer opnieuw starten (Let op: Geen bevestigingen !)',
            submit: {
                waitmsg: 'Het signaal om de Computer te herstarten is verstuurd.',
                success: 'Computer wordt opnieuw gestart.',
                failure: 'Probleem bij het versturen v.h signaal.Probeert U het nog eens.'
            }
        }
    },
    network: {
        menutab: { //translate
            title : 'Network',
            tabtip : 'Maintain network',
            panel_title : 'Network configuration'
        },
        nfs: {
            menutab: {
                title : 'NFS', 
                tabtip : 'Onderhoud NFS mounts en shares',
                panel_title : 'NFS-Configuratie'
            },
            labels: { //translate
                newDir : 'Remote directory',
                add : 'Add',
                edit : 'Edit',
                _delete: 'Remove',
                apply: 'Apply'
            }
        }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia', 
            tabtip : 'Onderhoud Nvidia instellingen', 
            panel_title : 'Nvidia configuratie' 
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web Frontend',
            tabtip : 'Het uiterlijk van Web-Frontend aanpassen.',
            panel_title : 'Web Frontend Instellingen'
        },
        label: 'Kies Uw taal voor Web Frontend',
        button_label:  'Toepassen',
        submit: {
            waitmsg : 'De taal instellingen voor Web Frontend wordt ge-actualiseert.',
            success : 'De taal instellingen voor Web Frontend is succesvol ge-actualiseert. Druk op F5 om Web-Frontend opnieuw te laden.',
            failure : 'Fout.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Actualiseren',
                refresh_tooltip: 'Druk op deze knop om de inhoud van de informatie-box te verversen.',
                jumpdown: 'Naar laatste regel gaan',
                jumpdown_tooltip: 'Druk op deze knop om naar de laatste regel te gaan van de informatie-box.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : 'Systeem informatie',
                    tabtip : 'Netwerk status, Systeem belasting en Processen, verbruik bestand systeem, Kernel'
                },
                ifconfig : 'Netwerk status',
                top: 'Systeem belasting',
                dmesg: 'Kernel',
                df: 'Bestand systeem verbruik'
            },
            system_logs: {
                menutab: {
                    title :'Systeem logfiles',
                    tabtip : 'Belangrijke Systeem logfiles'
                }
            },
            xbmc: {
                menutab: {
                    title : 'XBMC-Crashes',
                    tabtip : 'Vindt de oorzaak van XBMC-Crashes of andere XBMC problemen'
                }
            },
            lirc: {
                menutab: {
                    title : 'LIRC configuratie',
                    tabtip : 'Informatie over de huidige LIRC configuratie'
                }
            },
            vdr: {
                menutab: {
                    title : 'VDR configuratie',
                    tabtip : 'Informatie over de huidige VDR configuratie'
                }
            },
            xorg: {
                menutab: {
                    title : 'X-Server',
                    tabtip : 'Informatie over de huidige X-Server configuratie'
                }
            },
            sound: {
                menutab: {
                    title : 'Geluid (ALSA)',
                    tabtip : 'Digitalsound Probleem-diagnose (digitale/analoge uitvoer)'
                }
            },
            packages: {
                menutab: {
                    title : 'Pakketten',
                    tabtip : 'Controleer welke pakketten en pakket versies ge-installeerd zijn'
                }
            },
            yavdr: {
                menutab: {
                    title : 'yaVDR Utilities',
                    tabtip : 'yaVDR-Web-Frontend Diagnose (Databank + Web-Server)'
                }
            }
        }
    }
};