# 2019ncov项目介绍

## 项目技术栈
+ Express
+ Seqlize 
+ PostgreSQL 10.11


## 后期地图服务
Geoserver

GeoMesa

Geospark



## 目录结构
+ bin ```系统服务程序的存储路径，一些需要初始启动的和需要做进程守护的都放在这里```
+ config ```系统配置文件，含项目启动时必须的一些服务路径和数据库配置，所有的配置文件都可以放在这里```
+ lib ```系统工具和一些自做的常用模块，最好不要动```
+ models ```数据库文件，在这里写完模型自动映射```
+ public ```上传文件所用```
+ routes 
    - ```路由，除index外，其他文件或目录必须在url中加上对应的目录和文件名才可访问```
    - ```如routes/user/login.js文件里的online路由配置，在url里应该访问/user/login/online```
- index.js ```项目启动入口```
