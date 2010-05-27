var locale_fr = {
    meta_lang: {
        local : 'Francais',
        int : 'French',
        key : 'fr'
    },
    menutabs: {
        vdr : {
            title: 'Votre VDR',
            tabtip: 'Configuration des paramètres de base de votre VDR',
            content: 'Bienvenue sur l\'interface Web de yaVDR!'
        },
        system : {
            title: 'Systeme',
            tabtip: 'Configuration des paramètres de base du systeme',
            content: 'Bienvenue sur l\'interface Web de yaVDR!'
        },
        diagnose : {
            title: 'Diagnostiquer',
            tabtip: 'Restez informé sur l\'état du système, le suivi des problèmes',
            content: 'Accès aux fichiers des logs importants et aux fichiers de configuration'
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
            tabtip :'Lirc-Paramètres (Récepteur de la télécommande)',
            panel_title : 'Récepteur de la télécommande (LIRC)'
        },
        help: 'Lorsque vous appuyez sur le bouton "Enregistrer" VDR sera redémarré pour prendre en compte les nouveaux paramètres du récepteur LIRC. Si vous n\'avez pas affecté les boutons de votre télécommande (via remote.conf), VDR vous offrira à travers l\'OSD, étape par étape, la configuration de chaque touche de votre télécommande. Cette boîte de dialogue disparaîtra après quelques secondes si aucune touche de la télécommande n\'est pressée. Vous pouvez relancer le dialogue en appuyant simplement sur "Enregistrer".',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'LIRC Driver'
             },
             emptytext: 'S\'il vous plaît choisissez un récepteur pour votre télécommande ...',
             label: 'Recepteur'
        },
        serial_radiogroup: {
             label : 'Interface Série',
             boxlabel_none : 'Aucun'
        },
        submit: {
            waitmsg : 'Les paramètres LIRC vont maintenant être enregistrés.',    
            success : 'Les paramètres ont été correctement enregistrés.',
            failure : 'Erreur pendant l\'enregistrement des paramètres. S\'il vous plaît essayez de nouveau.'
        },
        error: {
            json_decode : 'Impossible de décoder la liste de récepteur JSON'
        }
    },
    channels: {
        menutab: {
            title : 'Liste des Chaînes',
            tabtip : 'Réglages des chaînes (modifs et tri des radios et chaînes de télévision)',
            panel_title : '' //unused
        },
        grid_header : { 
            cid : 'N°',
            cname : 'Chaîne Nom',
            cstr : 'Séquence Complete de la Chaîne'
        },
        grid_title : 'Liste des Chaînes (toute radio et chaînes de TV)' 
    },
    frontend: {
        menutab: {
            title : 'VDR Interface',
            tabtip : 'Basculer entre l\'interface xine et xineliboutput',
            panel_title : 'VDR Interface'
        },
        label: 'Choix de l\'interface',
        button_label:  'Appliquer les paramètres de l\'interface',
        submit: {
            waitmsg : 'Les paramètres de l\'interface ont été modifiés.',    
            success : 'Succès.',
            failure : 'Échec.'
        }
    },
    shutdown: {
        menutab: {
            title : 'Extinction',
            tabtip : 'Choix entre différentes méthodes d\'extinction',
            panel_title : 'VDR Extinction'
        },
        label: 'Choisisser l\'extinction',
        button_label:  'Appliquer les paramètres d\'extinction',
        submit: {
            waitmsg : 'Les paramètres d\'extinction ont été modifiés.',    
            success : 'Succès.',
            failure : 'Echec.'
        },
        items: {
            s3: 'suspend to RAM',
            s4: 'suspend to DISK',
            s5: 'extinction',
            reboot: 'redémarrage "PowerOff" kernel'
        }
    },
    upload: {
        menutab: {
            title : 'VDR Configue Import',
            tabtip : 'Importez votre configuration existante de VDR',
            panel_title : 'VDR Configue Import (la version importée supprime la version existante)'
        },
        button_label: 'Import',
        submit: {
            waitmsg : 'Le fichier est en cours d\'importation.',    
            success : 'Le fichier a été importé avec succès.',
            failure : 'Un problème est survenu durant l\'importation.'
        }
    },
    system: {
        menutab: {
            title : 'Systeme',
            tabtip : 'Redémarrez VDR ou l\'ensemble du système.',
            panel_title : 'Systeme Commandes'
        },
        vdr_restart : {
            label: 'Redémarrez VDR',
            submit: {
                waitmsg: 'Le signal pour redémarrer VDR a été envoyé.',
                success: 'VDR va maintenant redémarrer.',
                failure: 'Problème sur le signal d\'envoi. S\'il vous plaît essayez de nouveau.'
            }
        },
        kill_xbmc : {
            label: 'Tuer XBMC (Si bloquer)',
            submit: {
                waitmsg: 'Le signal pour arrêter XBMC a été envoyé.',
                success: 'XBMC est arrêté.',
                failure: 'Problème sur le signal d\'envoi. S\'il vous plaît essayez de nouveau.'
            }
        },        
        system_restart : {
            label: 'Redémarrer la machine (Attention: pas de demande de confirmation!)',
            submit: {
                waitmsg: 'Le signal de redémarrage a été envoyé.',
                success: 'La machine va maintenant redémarrer.',
                failure: 'Problème sur le signal d\'envoi. S\'il vous plaît essayez de nouveau.'
            }
        }
    },
    network: {
        menutab: {
            title : 'Réseau',
            tabtip : 'Entretien du réseau',
            panel_title : 'Réseau configuration'
        },
        nfs: {
        help: 'Définir les partages NFS depuis d\'autres hôtes qui devraient être utilisés par VDR. Les répertoires doivent être qualifiés comme "serveur: / chemin". Le bouton "Appliquer" soutient effectivement les modifications de votre configuration locale. VDR les utilisera au prochain redémarrage.',
            menutab: {
                title : 'NFS',
                tabtip : 'Entretien des montages NFS et partages'
            },
            labels: {
                newDir : 'Répertoire',
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
            tabtip : 'Entretien des paramètres Nvidia',
            panel_title : 'Nvidia configuration'
        },
        overscan_slider_label : 'Nvidia compensation Overscan',
        button_label : 'Appliquer la valeur',
        submit: {
            waitmsg : 'Nvidia overscan paramètres mis à jour.',
            success : 'Succès.',
            failure : 'Echec.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web Interface',
            tabtip : 'Configure l\'apparance de l\'interface web',
            panel_title : 'Web Interface Paramètres'
        },
        label: 'Choisisser le langage de l\'interface web',
        button_label:  'Appliquer les paramètres du langage',
        submit: {
            waitmsg : 'La langue de l\'interface Web à été mise à jour.',
            success : 'Succès. S\'il vous plaît pressez F5 pour recharger l\interface web avec la nouvelle langue.',
            failure : 'Echec.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: 'Rafraichir',
                refresh_tooltip: 'S\'il vous plaît cliquer sur ce bouton pour rafraîchir le contenu du panneau.',
                jumpdown: 'Sauter jusqu\'a la fin du panneau',
                jumpdown_tooltip: 'S\'il vous plaît cliquer sur ce bouton pour sauter jusqu\'a la fin du panneau.'
            }
        },
        section : {
            system_info: {
                title : 'Information Systeme', 
                description : 'L\'état du réseau, la charge du système, l\'utilisation des fichiers système, le kernel',
                ifconfig : 'L\'état du réseau',
                top: 'La charge du système',
                dmesg: 'Kernel',
                df: 'L\'utilisation des fichiers système'
            },
            system_logs: {
                title :'Logs des Fichiers Systeme',
                description : 'Les fichiers des logs importants'
            },
            xbmc: {
                title : 'XBMC-Plantage',
                description : 'Trouver la cause des plantages d\'XBMC ou autres problèmes'
            },
            lirc: {
                title : 'LIRC Configuration',
                description : 'Vérifiez la configuration actuelle de LIRC'
            },
            vdr: {
                title : 'VDR Configuration',
                description : 'Vérifiez la configuration actuelle de VDR'
            },
            xorg: {
                title : 'X-Serveur',
                description : 'Vérifiez la configuration actuelle de X'
            },
            sound: {
                title : 'Son (ALSA)',
                description : 'Résoudre les problèmes de son (numérique / sortie analogique)'
            },
            packages: {
                title : 'Paquets',
                description : 'Vérifier quels paquets et versions sont installés'
            },
            yavdr: {
                title : 'yaVDR-Utils',
                description : 'Résoudre les problèmes de l\'interface web yaVDR (base de données + serveur web)'
            }
        }
    },
    timeout: {
        menutab: {
            title : 'GRUB délai',
            tabtip : 'Fixer le délai de GRUB',
            panel_title : 'GRUB délai'
        },
        label: 'Choisir le délai',
        button_label:  'Appliquer le délai',
        submit: {
            waitmsg : 'Le paramètre du délai a été mis à jour.',    
            success : 'Succès.',
            failure : 'Echec.'
        },
        maxText: 'La valeur maximum de ce champ est (0)',
        minText: 'La valeur minimum de ce champ est (0)'
    },
    x11: {
        menutab: {
            title : 'paramètres d\'affichage',
            tabtip : 'paramètres d\'affichage',
            panel_title : 'paramètres d\'affichage'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: 'activater'
        },
        button_label:  'Appliquer les paramètres d\'affichage',
        submit: {
            waitmsg : 'Les paramètres d\'affichage ont été mis à jour.',    
            success : 'Succès.',
            failure : 'Echec.'
        }
    }
};