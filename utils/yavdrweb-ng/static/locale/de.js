var locale = {
    menutabs: {
        basics : {
            title: 'Basics',
            tabtip: 'Konfigurieren Sie die Grundeinstellungen wie Fernbedienung, Senderliste, etc.',
            content: 'Willkommen im yaVDR Web-Frontend!'
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
            label: 'VDR-Service neu starten',
            submit: {
                waitmsg: 'Das Signal zum Neustarten des VDR wird abgesetzt.',
                success: 'Der VDR wird nun neu gestartet.',
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
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Aktualisieren',
                refresh_tooltip: 'Klicken Sie auf diesen Button, um den Inhalt des Panels zu aktualisieren.',
                jumpdown: 'Ans Ende springen',
                jumpdown_tooltip: 'Klicken Sie auf diesen Button, um an das Endes des Inhalts dieses Panels zu springen.'
            }
        }
    }
};
