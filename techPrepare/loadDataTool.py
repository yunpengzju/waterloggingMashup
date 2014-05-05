# -*- coding:utf-8 -*- #
#! /usr/bin/env python

import urllib
import urllib2
import string
import sys
import json

def readFile(fname):
    try:
        data = open(fname)
        lines_data = []
        #data = unicode(data,"gb2312").encode("utf8")
        for each_line in data:
            try:
                each_line = unicode(each_line, "gb2312").encode("utf8")
                line_data = each_line.split(',', 11)
                lines_data.append(line_data)
            except:
                print("data error")
        return lines_data
    except:
        print "error"
def uploadData(data_lines):
    count = 0
    for tmp in data_lines:
        count += 1
        print count
        try:
            url = 'http://api.map.baidu.com/geodata/v3/poi/create'
            values = {
                'title'                 : tmp[0],
                'address'               : tmp[1],
                'latitude'              : tmp[2],
                'longitude'             : tmp[3],
                'coord_type'            : tmp[4],
                'original_coord_type'   : tmp[5],
                'hz_time'               : tmp[6],
                'hz_type'               : tmp[7],
                'icon_style_id'         : tmp[8],
                'weibo_pic'             : tmp[9],
                'weibo_weather'         : tmp[10],
                'isupdate'              : string.atoi(tmp[11]),
                'geotable_id'           : '61976',
                'ak'                    : 'XGyE1v4MgjGyiw1DObKCu7xs',
            }
            data = urllib.urlencode(values)
            req = urllib2.Request(url, data)
            response = urllib2.urlopen(req)
            res_page = response.read()
            res_json = json.loads(res_page)

            print  res_json['status'],  # 输出服务器返回信息
            print  res_json['message']
        except:
            print "request error"
if __name__ == '__main__':
    fname = 'test_data.csv'
    lines = readFile(fname)
    uploadData(lines)