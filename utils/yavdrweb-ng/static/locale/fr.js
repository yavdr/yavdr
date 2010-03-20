var locale_fr = {
    meta_lang: {
        local : 'Francais',
        int : 'French',
        key : 'fr'
    },
    menutabs: {
        vdr : {
            title: 'Votre VDR',
            tabtip: 'Configuration des param�tres de base de votre VDR',
            content: 'Bienvenue sur l\'interface Web de yaVDR!'
        },
        system : {
            title: 'Systeme',
            tabtip: 'Configuration des param�tres de base du systeme',
            content: 'Bienvenue sur l\'interface Web de yaVDR!'
        },
        diagnose : {
            title: 'Diagnostiquer',
            tabtip: 'Restez inform� sur l\'�tat du syst�me, le suivi des probl�mes',
            content: 'Acc�s aux fichiers de log importants et aux fichiers de configuration'
        }
    },
    standardform: {
        button: {
            save: 'Enregistrer'
        },
        messagebox_caption: {
            message: 'Message',
            error: 'Erreur',
            wait: 'Patienter S\'il vous plait...'
        }
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'Lirc-Param�tres (R�cepteur de la t�l�commande)',
            panel_title : 'R�cepteur de la t�l�commande (LIRC)'
        },
        help: 'Lorsque vous appuyez sur le bouton "Enregistrer" VDR sera red�marr� pour prendre en compte les nouveaux param�tres du r�cepteur LIRC. Si vous n\'avez pas affect� les boutons de votre t�l�commande (via remote.conf), VDR vous offrira a travers l\'OSD �tape par �tape la configuration de chaque touche de votre t�l�commande. Cette bo�te de dialogue dispara�tra apr�s quelques secondes si aucune touche de la t�l�commande n\'est press�e. Vous pouvez relancer le dialogue en appuyant simplement sur "Enregistrer".',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'LIRC Driver'
             },
             emptytext: 'S\'il vous pla�t choisissez un r�cepteur pour votre t�l�commande ...',
             label: 'Recepteur'
        },
        serial_radiogroup: {
             label : 'Interface S�rie',
             boxlabel_none : 'Aucun'
        },
        submit: {
            waitmsg : 'Les param�tres LIRC vont maintenant �tre enregistr�s.',    
            success : 'Les param�tres ont �t� correctement enregistr�.',
            failure : 'Erreur pendant l\'enregistrement des param�tres. S\'il vous pla�t essayez de nouveau.'
        },
        error: {
            json_decode : 'Impossible de d�coder la liste de r�cepteur JSON'
        }
    },
    channels: {
        menutab: {
            title : 'Liste de Cha�ne',
            tabtip : 'R�glages des cha�nes (modifs et tri des radios et cha�nes de t�l�vision)',
            panel_title : '' //unused
        },
        grid_header : { 
            cid : 'N�',
            cname : 'Cha�ne Nom',
            cstr : 'S�quence Complete de la Cha�ne'
        },
        grid_title : 'Liste de Cha�ne (toute radio et cha�nes de TV)' 
    },
    frontend: {
        menutab: {
            title : 'VDR Interface',
            tabtip : 'Basculer entre l\'interface xine et xineliboutput',
            panel_title : 'VDR Interface'
        },
        label: 'Choix de l\'interface',
        button_label:  'Appliquer les param�tres de l\'interface',
        submit: {
            waitmsg : 'Les param�tres de l\'interface on �t� modifi�s.',    
            success : 'Succ�s.',
            failure : '�chec.'
        }
    },
    shutdown: {
        menutab: {
            title : 'Extinction',
            tabtip : 'Choix entre diff�rente m�thode d\'extinction',
            panel_title : 'VDR Extinction'
        },
        label: 'Choisisser l\'extinction',
        button_label:  'Appliquer les param�tres d\'extinction',
        submit: {
            waitmsg : 'Les param�tres d\'extinction on �t� modifi�.',    
            success : 'Succ�s.',
            failure : 'Echec.'
        },
        items: {
            s3: 'suspend to RAM',
            s4: 'suspend to DISK',
            s5: 'extinction',
            reboot: 'red�marrage "PowerOff" kernel'
        }
    },
    upload: {
        menutab: {
            title : 'VDR Configue Import',
            tabtip : 'Importez votre configuration existante de VDR',
            panel_title : 'VDR Configue Import (la version import�e supprime la version existante)'
        },
        button_label: 'Import',
        submit: {
            waitmsg : 'Le fichier est en cours d\'importation.',    
            success : 'Le fichier a �t� import� avec succ�s.',
            failure : 'Un probl�me est survenu durant l\'importation.'
        }
    },
    system: {
        menutab: {
            title : 'Systeme',
            tabtip : 'Red�marrez VDR ou l\'ensemble du syst�me.',
            panel_title : 'Systeme Commandes'
        },
        vdr_restart : {
            label: 'Red�marrez VDR',
            submit: {
                waitmsg: 'Le signal pour red�marrer VDR a �t� envoy�.',
                success: 'VDR va maintenant red�marrer.',
                failure: 'Probl�me sur le signal d\'envoi. S\'il vous pla�t essayez de nouveau.'
            }
        },
        kill_xbmc : {
            label: 'Tuer XBMC (Si bloquer)',
            submit: {
                waitmsg: 'Le signal pour arr�ter XBMC a �t� envoy�.',
                success: 'XBMC est arr�t�.',
                failure: 'Probl�me sur le signal d\'envoi. S\'il vous pla�t essayez de nouveau.'
            }
        },        
        system_restart : {
            label: 'Red�marrer la machine (Attention: pas de demande de confirmation!)',
            submit: {
                waitmsg: 'Le signal de red�marrage a �t� envoy�.',
                success: 'La machine va maintenant red�marrer.',
                failure: 'Probl�me sur le signal d\'envoi. S\'il vous pla�t essayez de nouveau.'
            }
        }
    },
    network: {
        menutab: {
            title : 'R�seau',
            tabtip : 'Entretien du r�seau',
            panel_title : 'R�seau configuration'
        },
        nfs: {
        help: 'D�finir les partages NFS depuis d\'autres h�tes qui devraient �tre utilis�s par VDR. Les r�pertoires doivent �tre qualifi�s comme "serveur: / chemin". Le bouton "Appliquer" soutient effectivement les modifications de votre configuration locale. VDR les utilisera au prochain red�marrage.',
            menutab: {
                title : 'NFS',
                tabtip : 'Entretien des montages NFS et partages',
            },
            labels: {
                newDir : 'R�pertoire',
                add : 'Ajouter',
                edit : 'Editer',
                _delete: 'Supprimer',
                apply: 'Appliquer'
            }
        }, 
    samba: { 
        menutab: { 
        title : 'Samba', 
        tabtip : 'Entretien des partages samba' 
        } 
    } 
    },
    nvidia: {
        menutab: {
            title : 'Nvidia',
            tabtip : 'Entretien des param�tres Nvidia',
            panel_title : 'Nvidia configuration'
        },
        overscan_slider_label : 'Nvidia compensation Overscan',
        button_label : 'Appliquer la valeur',
        submit: {
            waitmsg : 'Nvidia overscan param�tres mise � jour.',
            success : 'Succ�s.',
            failure : 'Echec.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web Interface',
            tabtip : 'Configure l\'apparance de l\'interface web',
            panel_title : 'Web Interface Param�tres'
        },
        label: 'Choisisser le langage de l\'interface web',
        button_label:  'Appliquer les param�tres du langage',
        submit: {
            waitmsg : 'La langue de l\'interface Web � �t� mise � jour.',
            success : 'Succ�s. S\'il vous pla�t pressez F5 pour recharger l\interface web avec la nouvelle langue.',
            failure : 'Echec.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Rafraichir',
                refresh_tooltip: 'S\'il vous pla�t cliquer sur ce bouton pour rafra�chir le contenu du panneau.',
                jumpdown: 'Sauter jusqu\'a la fin du panneau',
                jumpdown_tooltip: 'S\'il vous pla�t cliquer sur ce bouton pour sauter jusqu\'a la fin du panneau.'
            }
        },
        section : {
            system_info: {
                title : 'Information Systeme', 
                description : 'L\'�tat du r�seau, la charge du syst�me, l\'utilisation des fichiers syst�me, le kernel',
                ifconfig : 'L\'�tat du r�seau',
                top: 'La charge du syst�me',
                dmesg: 'Kernel',
                df: 'L\'utilisation des fichiers syst�me'
            },
            system_logs: {
                title :'Logs des Fichiers Systeme',
                description : 'Les fichiers de log importants'
            },
            xbmc: {
                title : 'XBMC-Plantage',
                description : 'Trouver la cause des plantages d\'XBMC ou autres probl�mes'
            },
            lirc: {
                title : 'LIRC Configuration',
                description : 'V�rifiez la configuration actuelle de LIRC'
            },
            vdr: {
                title : 'VDR Configuration',
                description : 'V�rifiez la configuration actuelle de VDR'
            },
            xorg: {
                title : 'X-Serveur',
                description : 'V�rifiez la configuration actuelle de X'
            },
            sound: {
                title : 'Son (ALSA)',
                description : 'R�soudre les probl�mes de son (num�rique / sortie analogique)'
            },
            packages: {
                title : 'Paquets',
                description : 'V�rifier quels paquets et versions sont install�s'
            },
            yavdr: {
                title : 'yaVDR-Utils',
                description : 'R�soudre les probl�mes de l\'interface web yaVDR (base de donn�es + serveur web)'
            }
        }
    },
    timeout: {
        menutab: {
            title : 'GRUB d�lai',
            tabtip : 'Fixer le d�lai de GRUB',
            panel_title : 'GRUB d�lai'
        },
        label: 'Choisir le d�lai',
        button_label:  'Appliquer le d�lai',
        submit: {
            waitmsg : 'Le param�tre du d�lai ont �t� mise � jour.',    
            success : 'Succ�s.',
            failure : 'Echec.'
        },
        maxText: 'La valeur maximum de ce champ est (0)',
        minText: 'La valeur minimum de ce champ est (0)'
    },
    x11: {
        menutab: {
            title : 'param�tres d\'affichage',
            tabtip : 'param�tres d\'affichage',
            panel_title : 'param�tres d\'affichage'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: 'activater'
        },
        button_label:  'Appliquer les param�tres d\'affichage',
        submit: {
            waitmsg : 'Les param�tres d\'affichage on �t� mise � jour.',    
            success : 'Succ�s.',
            failure : 'Echec.'
        }
    }
};