var locale_de = {
    meta_lang: {
        local : 'Deutsch',
        int : 'German',
        key : 'de'
    },
    menutabs: {
        basics : {
            title: 'Basics',
            tabtip: 'Konfigurieren Sie die Grundeinstellungen wie Fernbedienung, Senderliste, etc.',
            content: 'Willkommen im yaVDR Web-Frontend!'
        },
        diagnose : {
            title: 'Diagnose',
            tabtip: 'Informieren Sie sich über den Zustand des Systems, betreiben Sie Fehleranalyse',
            content: 'Inhalte von wichtigen Logfiles und Konfigurationsdateien'
        }
    },
    standardform: {
        button: {
            save: 'Speichern'
        },
        messagebox_caption: {
            message: 'Hinweis',
            error: 'Fehler',
            wait: 'Bitte warten...'
        }
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Lirc-Einstellungen (Fernbedienungs-Receiver)',
            panel_title : 'Fernbedienungs-Empfänger (LIRC)'
        },
        help: 'Sobald Sie den Button "Speichern" drücken, wird der VDR neu gestartet, um dem VDR die Änderung des LIRC-Empfängers bekanntzumachen. Wenn Sie dem VDR noch keine Zuordnung der Fernbedienungstasten bekanntgegeben haben (via remote.conf), wird der VDR Ihnen direkt nach dem Neustart auf dem On-Screen-Display eine Anlernphase für Ihre Fernbedienung anbieten. Die Anlernphase endet, wenn einige Sekunden lang keine Taste auf der Fernbedienung gedrückt wurde. Sie können die Anlernphase erneut starten, indem Sie unten wieder auf den Button "Speichern" drücken.',
        combobox: {
             tooltip : {
                 driver: 'Treiber',
                 lirc_driver: 'LIRC-Treiber'
             },
             emptytext: 'Bitte Empfänger für Fernbedienung wählen...',
             label: 'Empfänger'
        },
        serial_radiogroup: {
             label : 'Serielle Schnittstelle',
             boxlabel_none : 'keine'
        },
        submit: {
            waitmsg : 'Fernbedienungs-Settings werden gespeichert.',    
            success : 'Ihre Auswahl wurde erfolgreich gespeichert.',
            failure : 'Fehler beim Speichern. Bitte noch einmal versuchen.'
        },
        error: {
            json_decode : 'Konnte JSON Empfängerliste nicht dekodieren'
        }
    },
    channels: {
        menutab: {
            title : 'Kanal-Liste',
            tabtip : 'Kanal-Einstellungen (Radio- und Fernsehkanäle pflegen und sortieren)',
            panel_title : '' //unused
        },
        grid_header : { 
            cid : 'Nr.',
            cname : 'Kanal-Name',
            cstr : 'Kompletter Kanal-String'
        },
        grid_title : 'Kanal-Liste (alle Radio- und TV-Kanäle)' 
    },
    frontend: {
        menutab: {
            title : 'VDR-Frontend w&auml;hlen',
            tabtip : 'Wechseln Sie zwischen xine und xineliboutput',
            panel_title : 'VDR-Frontend'
        },
        label: 'Gew&uuml;nschtes Frontend',
        button_label: 'Frontend-Einstellung aktivieren',
        submit: {
            waitmsg : 'Frontend-Einstellungen werden aktualisiert.',    
            success : 'OK.',
            failure : 'Fehler.'
        }
    },
    shutdown: {
        menutab: {
            title : 'VDR-Shutdown w&auml;hlen',
            tabtip : 'Wechseln Sie zwischen verschiedenen Shutdown-Mothoden',
            panel_title : 'VDR-Shutdown'
        },
        label: 'Gew&uuml;nschte Methode',
        button_label: 'Shutdown-Einstellung aktivieren',
        submit: {
            waitmsg : 'Shutdown-Einstellungen werden aktualisiert.',    
            success : 'OK.',
            failure : 'Fehler.'
        },
        items: {
        	s3: 'suspend to RAM',
        	s4: 'suspend to DISK',
        	s5: 'shutdown',
        	reboot: 'reboot PowerOff-kernel'
        }
    },
    upload: {
        menutab: {
            title : 'VDR-Konfig-Upload',
            tabtip : 'Laden Sie existierende VDR-Konfigurationsdateien hoch',
            panel_title : 'VDR-Konfig-Upload (der Upload überschreibt die bestehende Datei-Version)'
        },
        button_label: 'Datei hochladen',
        submit: {
            waitmsg : 'Konfigurationsdatei wird hochgeladen.',    
            success : 'Datei wurde erfolgreich hochgeladen.',
            failure : 'Ein Problem beim Hochladen der Datei ist aufgetreten.'
        }
    },
    system: {
        menutab: {
            title : 'System',
            tabtip : 'Starten Sie den VDR oder den Rechner neu',
            panel_title : 'System-Kommandos'
        },
        vdr_restart : {
            label: 'VDR Backend neu starten',
            submit: {
                waitmsg: 'Das Signal zum Neustarten des VDR wird abgesetzt.',
                success: 'Der VDR wird nun neu gestartet.',
                failure: 'Problem beim Absetzen des Signals. Bitte noch einmal versuchen.'
            }
        },
        kill_xbmc : {
            label: 'Eingefrorenes XBMC abwürgen',
            submit: {
                waitmsg: 'Das Signal zum Abwürgen von XBMC wird abgesetzt.',
                success: 'XBMC wird nun gestoppt.',
                failure: 'Problem beim Absetzen des Signals. Bitte noch einmal versuchen.'
            }
        },
        system_restart : {
            label: 'Rechner neu starten (Vorsicht: Keine Sicherheitsabfrage!)',
            submit: {
                waitmsg: 'Das Signal zum Neu-Start wird abgesetzt.',
                success: 'Der Rechner wird nun neu gestartet.',
                failure: 'Problem beim Absetzen des Signals. Bitte noch einmal versuchen.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Netzwerk',
            tabtip : 'Verwalten des Netzwerks',
            panel_title : 'Netzwerk-Konfiguration'
        },
        nfs: {
            menutab: {
                title : 'NFS',
                tabtip : 'Verwalten der NFS Mounts und Freigaben',
                panel_title : 'NFS-Konfiguration'
            },
            labels: {
                newDir : 'Entferntes Verzeichnis',
                add : 'Hinzufügen',
                edit : 'Ändern',
                _delete: 'Löschen',
                apply: 'Übernehmen'
            }
        }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Nvidia-Einstellungen pflegen',
            panel_title : 'Nvidia Konfiguration'
        },
        overscan_slider_label : 'Nvidia-Overscan Kompensation',
        button_label : 'Wert anwenden',
        submit: {
            waitmsg : 'Der Nvidia-Overscan-Wert wird aktualisiert.',
            success : 'Erfolg.',
            failure : 'Fehler.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web Frontend',
            tabtip : 'Das Erscheinungsbild des Web-Frontends anpassen.',
            panel_title : 'Web Frontend Einstellungen'
        },
        label: 'Wählen Sie die Sprache des Web Frontends',
        button_label:  'Anwenden',
        submit: {
            waitmsg : 'Die Spracheinstellungen für das Web Frontend werden aktualisiert.',
            success : 'Die Spracheinstellungen für das Web Frontend wurden erfolgreich aktualisiert. Bitte F5 drücken, um das Web-Frontend neu zu laden.',
            failure : 'Fehler.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Aktualisieren',
                refresh_tooltip: 'Klicken Sie auf diesen Button, um den Inhalt des Panels zu aktualisieren.',
                jumpdown: 'Ans Ende springen',
                jumpdown_tooltip: 'Klicken Sie auf diesen Button, um an das Endes des Inhalts dieses Panels zu springen.'
            }
        },
        section : {
            system_info: {
                title : 'System-Informationen', 
                description : 'Netzwerk-Status, Auslastung und Prozesse, Dateisystem-Belegung, Kernel',
                ifconfig : 'Netzwerkstatus',
                top: 'Systemauslastung',
                dmesg: 'Kernel',
                df: 'Dateisystem-Belegung'
            },
            system_logs: {
                title :'System-Logfiles',
                description : 'Wichtige System-Logfiles'
            },
            xbmc: {
                title : 'XBMC-Crashes',
                description : 'Finden Sie die Ursache von XBMC-Crashes oder andere XBMC-Problemen'
            },
            lirc: {
                title : 'LIRC-Konfiguration',
                description : 'Informieren Sie sich über die aktuelle LIRC-Konfiguration'
            },
            vdr: {
                title : 'VDR-Konfiguration',
                description : 'Informieren Sie sich über die aktuelle VDR-Konfiguration'
            },
            xorg: {
                title : 'X-Server',
                description : 'Informieren Sie sich über die aktuelle X-Konfiguration'
            },
            sound: {
                title : 'Sound (ALSA)',
                description : 'Digitalsound-Problemdiagnose (digital/analog-Ausgabe)'
            },
            packages: {
                title : 'Pakete',
                description : 'Überprüfen Sie, welche Pakete und Paketversionen installiert sind'
            },            
            yavdr: {
                title : 'yaVDR-Utils',
                description : 'yaVDR-Web-Frontend Diagnose (Datenbank + Web-Server)'
            }
        }
    }
};