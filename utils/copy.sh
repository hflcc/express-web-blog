#!/bin/sh
cd /Users/HING/Desktop/node-web-blog/logs
# 拷贝进程日志到当前时间天进程日志
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
