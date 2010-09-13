var locale_de = {
    meta_lang: {
        local : 'Deutsch',
        int : 'German',
        key : 'de'
    },
    menutabs: {
        vdr : {
            title: 'Ihr VDR',
            tabtip: 'Konfigurieren Sie die Grundeinstellungen rund um Ihren yaVDR',
            content: 'Willkommen im yaVDR Web-Frontend!'
        },
        system : {
            title: 'System',
            tabtip: 'Konfigurieren Sie die Grundeinstellungen des Systems',
            content: 'Konfigurieren Sie die Grundeinstellungen des Systems'
        },
        demos : {
            title: 'Demos',
            tabtip: 'Machbarkeitsnachweis, Ausblick auf mögliche neue Features',
            content: 'Machbarkeitsnachweis, Ausblick auf mögliche neue Features'
        },
        development : {
            title: 'Development',
            tabtip: 'Neue Funktionen die sich in Entwicklung befinden. Nicht benutzen, funktioniert noch nicht richtig.',
            content: 'Neue Funktionen die sich in Entwicklung befinden. Nicht benutzen, funktioniert noch nicht richtig.'
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
    remote: {
        menutab: {
            title : 'Fernbedienungen',
            tabtip :'Einstellungen für Fernbedienungen (Remote Control Receiver)',
            panel_title : 'Einstellungen für Fernbedienungen'
        },
        help: 
            'Um den Infrarot-Empfänger Ihrer Fernbedienung in Betrieb zu nehmen, '+
            'wählen Sie LIRC oder einen der beiden zu LIRC kompatiblen Server (Inputlirc oder IRServer) aus. '+
            'Sie sollten denjenigen Server auswählen, welcher am besten zu der von Ihnen verwendeten Hardware passt. ' +
            'Sobald Sie den Button "Speichern" drücken, wird die Anwendung VDR neu gestartet, um die Änderung zu übernehmen.<br />' +
            'Wenn Sie dem VDR noch keine Zuordnung der Fernbedienungstasten bekanntgegeben haben, wird Ihnen direkt nach dem Neustart auf der Bildschirmanzeige ("On-Screen-Display") eine Anlernphase für Ihre Fernbedienung angeboten. Die Anlernphase endet, wenn einige Sekunden lang keine Taste auf der Fernbedienung gedrückt wurde. Sie können die Anlernphase erneut starten, indem Sie erneut auf den Button "Speichern" drücken.'
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Lirc-Einstellungen (Fernbedienungs-Receiver)',
            panel_title : 'Fernbedienungs-Empfänger (LIRC)'
        },
        help: 'Dieses unterstützt die meisten Geräte.<br />'+
            'Zur Konfiguration ist es nötig zu wissen, welcher Treiber für das eigene Gerät benötigt wird.<br/>'+
            'Wenn es ein serieller Empfänger ist, muss zusätzlich noch die verwendete serielle Schnittstelle ausgewählt werden.',
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
            waitmsg : 'Fernbedienungs-Einstellungen werden gespeichert.',    
            success : 'Ihre Auswahl wurde erfolgreich gespeichert.',
            failure : 'Fehler beim Speichern. Bitte erneut versuchen.'
        },
        error: {
            json_decode : 'Konnte JSON Empfängerliste nicht dekodieren'
        }
    },
    inputlirc: {
        menutab: {
            title : 'Inputlirc',
            tabtip :'Input-Lirc-Einstellungen (Remote Control Receiver)',
            panel_title : 'Input-Lirc-Einstellungen für Fernbedienungen (Input-LIRC)'
        },
        help: 'Einige DVB Karten liefern einen Fernbedienungsempfänger mit. '+
            'Viele dieser Empfänger, sowie einige USB Empfänger werden als sogenannte INPUT Geräte eingebunden. '+
            'Hier muss nur der Fernbedienungsempfänger aus der Liste erkannter Geräte ausgewählt werden.',
        combobox: {
             tooltip : {
                 driver: 'Treiber',
                 lirc_driver: 'Inputlirc Treiber'
             },
             emptytext: 'Bitte Empfänger für Fernbedienung wählen...',
             label: 'Empfänger'
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
    irserver: {
        menutab: {
            title : 'IRServer',
            tabtip :'IRServer-Einstellungen (Remote Control Receiver)',
            panel_title : 'IRServer-Einstellungen für Fernbedienungen (IRServer)'
        },
        help: 'Einige HTPC-Gehäuse (z.B. OrigonAE) haben integrierte Infrarot-Empfänger, '+
            'welche einen speziellen Server (Irserver) benötigen. Hier muss nur der Server aktiviert und anschließend gespeichert werden.',
        combobox: {
             tooltip : {
                 driver: 'Treiber',
                 lirc_driver: 'IRServer Treiber'
             },
             emptytext: 'Bitte Empfänger für Fernbedienung wählen...',
             label: 'Empfänger'
        },
        submit: {
            waitmsg : 'Fernbedienungs-Einstellungen werden gespeichert.',    
            success : 'Ihre Auswahl wurde erfolgreich gespeichert.',
            failure : 'Fehler beim Speichern. Bitte noch einmal versuchen.'
        },
        error: {
            json_decode : 'Konnte JSON Empfängerliste nicht dekodieren'
        }
    },
    channels: {
        menutab: {
            title : 'Kanäle',
            tabtip : 'Kanal-Einstellungen (Radio- und Fernsehkanäle pflegen und sortieren)',
            panel_title : '' //unused
        },
        grid_header : { 
            cnumber : 'Nr.',
            cname : 'Name',
            cprovider : 'Anbieter',
            cstr : 'Kompletter Kanal-String',
            cfrequency : 'Frequenz',
            cmodulation : 'Modulation',
            csource : 'Quelle',
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
            c_friendly_lang: 'Sprache',
            c_friendly_type: 'TV/Radio',
            c_friendly_scrambled : 'FTA/verschlüsselt'
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
            tabtip : 'Wechseln Sie zwischen verschiedenen Shutdown-Methoden',
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
            s3unavailable: 'suspend to RAM (nicht verfügbar)',
            s4: 'suspend to DISK',
            s4unavailable: 'suspend to DISK (nicht verfügbar)',
            s5: 'shutdown',
        	reboot: 'reboot PowerOff-kernel'
        }
    },
    upload: {
        menutab: {
            title : 'Editor für VDR Konfigurations Dateien',
            tabtip : 'Bearbeiten Sie den Inhalt von einigen zentralen VDR-Konfigurationsdateien direkt, fügen Sie Inhalte aus früheren VDR-Installationen ein, welche Sie übernehmen möchten.',
            panel_title : 'VDR Konfigurations-Editor'
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
            title : 'Wartung',
            tabtip : 'Starten Sie den VDR oder den Rechner neu',
            panel_title : 'Wartungs-Befehle'
        },
        vdr_restart : {
            label: 'VDR Backend Neustarten!',
            submit: {
                waitmsg: 'Das Signal zum Neustarten des VDR wird gesendet.',
                success: 'Der VDR wird jetzt neu gestartet.',
                failure: 'Problem beim Senden des Signals. Bitte erneut versuchen.'
            }
        },
        kill_xbmc : {
            label: 'XBMC-Beendung erzwingen',
            submit: {
                waitmsg: 'Das Signal zum Beenden von XBMC wird gesendet.',
                success: 'XBMC wird jetzt beendet.',
                failure: 'Problem beim Senden des Signals. Bitte erneut versuchen.'
            }
        },
        system_restart : {
            label: 'Rechner sofort neu starten! (Keine weitere Warnung)',
            submit: {
                waitmsg: 'Das Signal zum Neustart wird gesendet.',
                success: 'Der Rechner wird jetzt neu gestartet.',
                failure: 'Problem beim Senden des Signals. Bitte erneut versuchen.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Netzwerk',
            tabtip : 'Verwalten des Netzwerks',
            panel_title : 'Netzwerkkonfiguration'
        },
        nfs: {
	    help: 'Hier können NFS Freigaben von anderen Hosts eingebunden werden. Die Verzeichnisse müssen in der Form "host:/ein/verzeichnis" eingegeben werden. Der Knopf "Übernehmen" trägt die Verzeichnisse in die lokale Konfiguration ein. Sie müssen den VDR Neustarten (Menü "System", Punkt "Wartung"), um die Änderungen zu aktivieren!',
            menutab: {
                title : 'NFS',
                tabtip : 'Verwalten der NFS-Mounts und -Freigaben'
            },
            labels: {
                newDir : 'Entferntes Verzeichnis',
                add : 'Hinzufügen',
                edit : 'Ändern',
                _delete: 'Löschen',
                apply: 'Übernehmen'
            }
        },
	samba: {
	    menutab: {
		title : 'Samba',
		tabtip : 'Verwalten der Samba-Freigaben'
	    }
	}
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Nvidia-Einstellungen pflegen',
            panel_title : 'Nvidia-Konfiguration'
        },
        overscan_slider_label : 'Nvidia Overscan-Kompensation',
        button_label : 'Wert anwenden',
        submit: {
            waitmsg : 'Der Nvidia Overscan-Wert wird aktualisiert.',
            success : 'Erfolg.',
            failure : 'Fehler.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web-Frontend',
            tabtip : 'Das Erscheinungsbild des Web-Frontends anpassen.',
            panel_title : 'Web Frontend Einstellungen'
        },
        label: 'Wählen Sie die Sprache des Web Frontends',
        button_label:  'Übernehmen',
        submit: {
            waitmsg : 'Die Spracheinstellungen für das Web-Frontend werden aktualisiert.',
            success : 'Die Spracheinstellungen für das Web-Frontend wurden erfolgreich aktualisiert. Möchten Sie das Web-Frontend nun mit den neuen Spracheinstellungen neu laden?',
            failure : 'Fehler.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Aktualisieren',
                refresh_tooltip: 'Klicken Sie hier, um den Inhalt der Seite zu aktualisieren.',
                jumpdown: 'Ans Ende springen',
                jumpdown_tooltip: 'Klicken Sie hier, um an das Endes des Inhalts dieser Seite zu springen.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : 'System-Informationen', 
                    tabtip : 'Netzwerk-Status, Auslastung, Prozesse, Dateisystem-Belegung und Kernel'
                },
                ifconfig : 'Netzwerkstatus',
                top: 'Systemauslastung',
                dmesg: 'Kernel',
                df: 'Dateisystem-Belegung'
            },
            system_logs: {
                menutab: {
                    title :'System-Logfiles',
                    tabtip : 'Wichtige System-Logfiles'
                }
            },
            xbmc: {
                menutab: {
                    title : 'XBMC-Abstürze',
                    tabtip : 'Finden Sie die Ursache für XBMC-Abstürze oder XBMC-Probleme'
                }
            },
            lirc: {
                menutab: {
                    title : 'LIRC-Konfiguration',
                    tabtip : 'Informieren Sie sich über die aktuelle LIRC-Konfiguration'
                }
            },
            vdr: {
                menutab: {
                    title : 'VDR-Konfiguration',
                    tabtip : 'Informieren Sie sich über die aktuelle VDR-Konfiguration'
                }
            },
            xorg: {
                menutab: {
                    title : 'X-Server',
                    tabtip : 'Informieren Sie sich über die aktuelle X-Konfiguration'
                }
            },
            sound: {
                menutab: {
                    title : 'Sound (ALSA)',
                    tabtip : 'Digitalsound-Problemdiagnose (Digital-/Analog-Ausgabe)'
                }
            },
            packages: {
                menutab: {
                    title : 'Pakete',
                    tabtip : 'Überprüfen Sie, welche Pakete und Paketversionen installiert sind'
                }
            },            
            yavdr: {
                menutab: {
                    title : 'yaVDR-Utils',
                    tabtip : 'yaVDR-Web-Frontend Diagnose (Datenbank + Webserver)'
                }
            }
        }
    },
    packages: {
        menutab: {
            title : 'yaVDR-Pakete',
            tabtip : 'Überprüfen Sie, welche Pakete und Paketversionen installiert sind',
            panel_title : 'yaVDR-Pakete'
        }
    },
    timeout: {
        menutab: {
            title : 'GRUB Timeout',
            tabtip : 'GRUB Timeout einstellen',
            panel_title : 'GRUB Timeout'
        },
        label: 'Wähle Timeout',
        button_label:  'Setze GRUB Timeout',
        submit: {
            waitmsg : 'Einstellungen werden aktualisiert.',    
            success : 'Erfolg.',
            failure : 'Fehler.'
        },
        maxText: 'Der Maximalwert ist {0}!',
        minText: 'Der Minimalwert ist {0}!'
    },
    x11: {
        menutab: {
            title : 'Anzeige',
            tabtip : 'Anzeigeeinstellungen',
            panel_title : 'Anzeige'
        },
        graphtft: {
        	label: 'GraphTFT',
        	boxlabel: 'aktiviert'
        },
       deinterlacer_hd: {
            label: 'Xine-HD-Deinterlacer (Voreinstellung: bob)'
        },
       deinterlacer_sd: {
            label: 'Xine-SD-Deinterlacer (Voreinstellung: temporal)'
        },
        button_label:  'Setze Anzeigeeinstellungen',
        submit: {
            waitmsg : 'Einstellungen werden aktualisiert.',    
            success : 'Erfolg.',
            failure : 'Fehler.'
        },
        dualhead: {
            label: 'Zwei-Bildschirm Betrieb',
            boxlabel: 'aktiviert',
            boxlabelunavailable: 'deaktiviert (< 2 Bildschirme gefunden)',
            switch_label: 'Wechsel des VDR-Frontends auf 2. Bildschirm'
        },
        primary: 'primär',
        secondary: 'sekundär',
        modeline: 'aktuelle Auflösung',
        device: 'Gerät',
        resolution: 'Auflösung',
        select_res: 'wähle Auflösung',
        enabled: 'aktiviert',
        disabled: 'deaktiviert'
    },
    sound: {
        menutab: {
            title : 'Ton',
            tabtip : 'Ton-Konfiguration',
            panel_title : 'Ton'
        },
        button_label:  'Setze Ton-Einstellungen',
        submit: {
            waitmsg : 'Einstellungen werden aktualisiert.',    
            success : 'Erfolg.',
            failure : 'Fehler.'
        },
        label: 'Ton-Konfiguration'
    },
    lifeguard: {
        help: 'VDR-Lifeguard kann vor dem Ausschalten prüfen ob bestimmte Prozesse aktiv sind. Soll ein Prozess nicht unterbrochen werden, wird das Ausschalten verschoben. Fügen Sie hier Prozesse hinzu, die das Ausschalten verhindern sollen. Nicht markiert bedeutet: VDR-Lifeguard ist deaktiviert',
        menutab: {
            title : 'VDR-Lifeguard',
            tabtip : 'Lifeguard settings',
            panel_title : 'VDR-Lifeguard'
        },
        button_label:  'Setze Lifeguard-Einstellungen',
        submit: {
            waitmsg : 'Einstellungen werden aktualisiert.',    
            success : 'Erfolg.',
            failure : 'Fehler.'
        },
        label: 'VDR-Lifeguard Einstellungen'
    }
};
