var locale_zh = {
    meta_lang: {
        local : 'Chinese',
        int : '中文',
        key : 'zh_CN'
    },
    menutabs: {
        vdr : {
            title: '我的 VDR',
            tabtip: 'yaVDR的基本设置',
            content: '欢迎到yaVDR网络前端！'
        },
        system : {
            title: '系统',
            tabtip: '系统的基本配置',
            content: '欢迎到yaVDR网络前端！'
        },
        demos : {
            title: '演示',
            tabtip: '概念验证，可能的新功能演示，用于测试目的',
            content: '概念验证，可能的新功能演示，用于测试目的'
        },
        development : {
            title: '发展',
            tabtip: '新功能，正在兴建中，不要使用它们。他们还不能正常工作',
            content: '新功能，正在兴建中，不要使用它们。他们还不能正常工作'
        },
        diagnose : {
            title: '诊断',
            tabtip: '随时了解您的系统状态，跟踪问题',
            content: '访问重要日志文件和配置文件'
        }
    },
    standardform: {
        button: {
            save: '保存'
        },
        messagebox_caption: {
            message: '消息',
            error: '错误',
            wait: '请稍等...'
        }
    },
    remote: {
        menutab: {
            title : '遥控设置',
            tabtip :'遥控接收设置（远程控制接收器）',
            panel_title : '遥控接收头'
        },
        help: '在目前，有3种不同的LIRC服务支持，请给你的设备选择一个适合的 <br /><h1>LIRC</h1><br /><br />这里支持大多数的设备，查找你的设备型号，你必须为您的设备选择正确的驱动程序，如果是一个自制串行端口设备（Attric, self-build and other similar devices自制和其他类似设备），你需要选择正确的串口。<br /><br /><h1>Input Lirc</h1><br /><br />一些DVB卡，包括一个遥控器和接收器。他们中的大多数以及一些USB设备作出所谓的输入设备，你只需要从下拉菜单中选择正确的设备。<br /><br /><h1>Irserver</h1><br /><br />一些HTPC（例如OrigenAE）包括遥控接收器，只能用于irserver，你只需要启用它 并事后保存' 
    },
    lirc: {
        menutab: {
            title : 'LIRC',
            tabtip :'LIRC的设置（遥控接收器）',
            panel_title : '遥控接收器（LIRC）'
        },
        help: '当您按下“保存”按钮，VDR将重新启动，通知VDR重新设置LIRC。如果你没有指定遥控器设置（通过remote.conf），VDR将提供OSD对话框，一步一步配置遥控器上的按钮。如果没有按下遥控器的按键，这个对话框在几秒钟后消失。你可以重新启动OSD对话框，只需再次按下“保存”按钮',
        combobox: {
             tooltip : {
                 driver: 'Driver',
                 lirc_driver: 'LIRC Driver'
             },
             emptytext: '请选择你的遥控器型号...',
             label: '接收器'
        },
        serial_radiogroup: {
             label : 'Serial 接口',
             boxlabel_none : 'none'
        },
        submit: {
            waitmsg : 'LIRC的接收器的设置被保存。',    
            success : '该设置被成功地保存。',
            failure : '设置保存错误。请再试一次。'
        },
        error: {
            json_decode : '无法解码JSON接收列表。'
        }
    },
    inputlirc: {
        menutab: {
            title : 'Inputlirc',
            tabtip :'Inputlirc--设置（远程控制接收器）',
            panel_title : '遥控接收器（LIRC）'
        },
        help: '请从上面的列表中选择你的遥控接收器，当您按下“保存”按钮，VDR将重新启动，通知VDR的Inputlirc改变接收器设置。',
        combobox: {
             tooltip : {
                 driver: '驱动程序',
                 lirc_driver: 'Inputlirc驱动程序'
             },
             emptytext: '请选择你的遥控器型号...',
             label: '接收器'
        },
        submit: {
            waitmsg : 'Inputlirc接收器的设置被保存。',    
            success : '该设置成功保存。',
            failure : '设置上的错误。请再试一次。'
        },
        error: {
            json_decode : '无法解码JSON的接收列表'
        }
    },
    irserver: {
        menutab: {
            title : 'IRServer',
            tabtip :'IRServer -设置（远程控制接收器）',
            panel_title : '远程控制接收器 (IRServer)'
        },
        help: '当您按下“保存”按钮，VDR将重新启动，通知VDR的 IRServer改变接收器设置。',
        combobox: {
             tooltip : {
                 driver: '驱动程序',
                 lirc_driver: 'IRDriver驱动程序'
             },
             emptytext: '请为您的遥控器接收器...',
             label: '接收器'
        },
        submit: {
            waitmsg : 'IRServer 接收器的设置被保存。',    
            success : '该设置成功保存。',
            failure : '设置上的错误。请再试一次。'
        },
        error: {
            json_decode : '无法解码JSON的接收列表'
        }
    },
    channels: {
        menutab: {
            title : '频道列表 (SVDRP)',
            tabtip : '频道设置（维护和排序电台和电视频道）',
            panel_title : '' //unused
        },
        grid_header : { 
            cid : '序号',
            cname : '频 道 名 称',
            cstr : '频 道 参 数'
        },
        grid_title : '频道列表（所有电台和电视频道）' 
    },
    frontend: {
        menutab: {
            title : 'VDR 前端',
            tabtip : '在xine和xineliboutput前端之间切换',
            panel_title : 'VDR 前端'
        },
        label: '选择前端',
        button_label:  '应用前端设置',
        submit: {
            waitmsg : '更改“前端”设置.',    
            success : '成功.',
            failure : '失败.'
        }
    },
    shutdown: {
        menutab: {
            title : '关机方式',
            tabtip : '在不同的关机方式中切换',
            panel_title : 'VDR 关机方式'
        },
        label: '选择关机方式',
        button_label:  '应用关机方式设置',
        submit: {
            waitmsg : '更改关机方式设置.',    
            success : '成功.',
            failure : '失败.'
        },
        items: {
            s3: '挂起到内存',
            s3unavailable: '挂起到内存（不可用）',
            s4: '挂起到硬盘',
            s4unavailable: '挂起到硬盘（不可用）',
            s5: '关闭电脑',
            reboot: '重启内核"PowerOff"'
        }
    },
    upload: {
        menutab: {
            title : '上传VDR 配置',
            tabtip : '上传您现有VDR的配置',
            panel_title : 'VDR的配置上传（上传的版本将覆盖现有的版本）'
        },
        button_label: '上传',
        submit: {
            waitmsg : '文件开始上传.',    
            success : '文件上传成功.',
            failure : '文件上传出现问题.'
        }
    },
    system: {
        menutab: {
            title : '系统重启',
            tabtip : '重启VDR或整个系统',
            panel_title : '系统命令'
        },
        vdr_restart : {
            label: '重启VDR后台',
            submit: {
                waitmsg: '发送VDR重启信号.',
                success: 'VDR 正在重启.',
                failure: '重启信号发送失败，请再试一次.'
            }
        },
        kill_xbmc : {
            label: '关闭 XBMC （如果冻结）',
            submit: {
                waitmsg: '停止XBMC的信号正在发送.',
                success: 'XBMC 停止.',
                failure: '发送信号失败. 请再试一次.'
            }
        },        
        system_restart : {
            label: '重新启动机器（注意：不请求确认！）',
            submit: {
                waitmsg: '重启信号正在发送.',
                success: '机器正在重启.',
                failure: '发送信号失败. 请再试一次..'
            }
        }
    },
    network: {
        menutab: {
            title : '网络配置',
            tabtip : '网络维护',
            panel_title : '网络配置'
        },
        nfs: {
            help: '定义从其他主机使用VDR的NFS共享。目录要像"server:/path"。“应用”按钮实际上更改您的本地配置。 Define the nfs shares from other hosts that should be used from VDR. Directories have to be qualified like "server:/path". The button "Apply" actually submits the changes to your local configuration. VDR uses them after next restart.',
            menutab: {
                title : 'NFS',
                tabtip : '维护 NFS 的挂载和共享'
            },
            labels: {
                newDir : '挂载目录',
                add : '增加',
                edit : '编辑',
                _delete: '删除',
                apply: '应用'
            }
        },
        samba: {
	        menutab: {
                title : 'Samba',
                tabtip : 'samba共享维护'
            }
	   }
    },
    nvidia: {
        menutab: {
            title : 'Nvidia设置',
            tabtip : '保存 Nvidia 设置',
            panel_title : 'Nvidia 配置'
        },
        overscan_slider_label : 'Nvidia的画面放大补偿',
        button_label : '应用值',
        submit: {
            waitmsg : 'Nvidia的画面放大补偿上传.',
            success : '成功.',
            failure : '失败.'
        }
    },
    webfrontend: {
        menutab: {
            title : 'Web 前端设置',
            tabtip : '配置“Web前端”的外观',
            panel_title : 'Web 前端设置'
        },
        label: '修改Wed前端的语言',
        button_label:  '语言设置',
        submit: {
            waitmsg : 'Web 前端语言设置.',
            success : '成功. 请按“F5”键刷新设置.',
            failure : '失败.'
        }
    },
    diagnose : {
        toolbar : {
            button : {
                refresh: '刷新',
                refresh_tooltip: '请按一下这个按钮来刷新本面板的内容.',
                jumpdown: '跳转到面板底部',
                jumpdown_tooltip: '请按一下此按钮，跳转到该面板结束.'
            }
        },
        section : {
            system_info: {
                menutab: {
                    title : '系统信息', 
                    tabtip : '网络状态、系统负载、文件系统、内核'
                },
                ifconfig : '网络状态',
                top: '系统负载',
                dmesg: '内核',
                df: '文件系统'
            },
            system_logs: {
                menutab: {
                    title :'系统日志文件',
                    tabtip : '重要的系统日志文件'
                }
            },
            xbmc: {
                menutab: {
                    title : 'XBMC 日志文件',
                    tabtip : '寻找XBMC崩溃或其他的XBMC问题'
                }
            },
            lirc: {
                menutab: {
                    title : 'LIRC 配置文件',
                    tabtip : '检查LIRC的当前配置'
                }
            },
            vdr: {
                menutab: {
                    title : 'VDR 配置文件',
                    tabtip : '检查VDR的当前配置'
                }
            },
            xorg: {
                menutab: {
                    title : 'X-Server配置文件',
                    tabtip : '检查 X 环境的当前配置'
                }
            },
            sound: {
                menutab: {
                    title : '声卡 （ALSA）配置文件',
                    tabtip : '解决声音问题 （数字 / 模拟）'
                }
            },
            packages: {
                menutab: {
                    title : '已安装的软件包',
                    tabtip : '检查软件包的版本和安装的软件包'
                }
            },
            yavdr: {
                menutab: {
                    title : 'yaVDR-Utils配置文件',
                    tabtip : '解决yaVDR网络前端问题（数据库+服务器）'
                }
            }
        }
    },
    timeout: {
        menutab: {
            title : 'GRUB 退出时间',
            tabtip : '设置 GRUB 退出时间',
            panel_title : 'GRUB 退出时间'
        },
        label: '更改退出时间',
        button_label:  '应用“退出时间”设置',
        submit: {
            waitmsg : '设置更新.',    
            success : '成功.',
            failure : '失败.'
        },
        maxText: '该字段最大值是 {0}',
        minText: '该字段最小值是 {0}'
    },
    x11: {
        menutab: {
            title : '显示设置',
            tabtip : '显示设置',
            panel_title : '显示设置'
        },
        graphtft: {
            label: 'graphTFT',
            boxlabel: '激活'
        },
        button_label:  '应该显示设置',
        submit: {
            waitmsg : '显示设置上传.',    
            success : '成功.',
            failure : '失败.'
        },
        dualhead: {
            label: '双显示模式',
            boxlabel: '激活',
            boxlabelunavailable: '禁用 (< 2 screens found)',
            switch_label: '切换VDR前端输出头'
        },
        primary: '主要的',
        secondary: '次要的',
        modeline: '当前模式',
        device: 'device',
        resolution: 'resolution',
        select_res: 'select resolution',
        enabled: '允许',
        disabled: '禁止'
    },
    sound: {
        menutab: {
            title : '声音输出方式',
            tabtip : '声音输出方式',
            panel_title : '声音输出方式'
        },
        button_label:  '应用声音输出方式',
        submit: {
            waitmsg : '声音输出方式设置上传.',    
            success : '成功.',
            failure : '失败.'
        },
        label: '声音输出方式'
    }
};
