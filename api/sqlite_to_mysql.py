from distutils.util import check_environ
import mysql.connector
import sqlite3
import sys
from dateutil.parser import parse as time_parse

# sqlite3 part
conn=sqlite3.connect('./db.sqlite3')

def get_table(table,time_index=-1):
    cur=conn.cursor()
    cur.execute(f"SELECT * FROM {table}")
    data=[]
    for row in cur:
        drow=list(row)
        if time_index>=0:
            drow[time_index]=time_parse(drow[time_index])
        data.append(drow)
    return data

players=get_table('web_player')
in_game_names=get_table('web_ingamename')
levels=get_table('web_levelupdate',time_index=3)
ranks=get_table('web_rankupdate',time_index=4)
checks=get_table('web_apexabilitycheck',time_index=2)

conn.close()

if False:
    sys.exit(0)
# mysql part
cnx = mysql.connector.connect(user='nextpex', password='nextpex',
                              host='127.0.0.1', port=3600,
                              database='nextpex')
cnx.start_transaction()
cursor=cnx.cursor()

try:
    player_insert="INSERT INTO Player(id,display_name) VALUES(%s,%s)"
    for player_data in players:
        cursor.execute(player_insert,player_data)
    
    ingame_insert="INSERT INTO InGameName(id,in_game_name,player_id) VALUES(%s,%s,%s)"
    for ingame in in_game_names:
        cursor.execute(ingame_insert,ingame)

    level_insert="INSERT INTO LevelUpdate(id,old_level,new_level,time,player_id) VALUES(%s,%s,%s,%s,%s)"
    for level in levels:
        cursor.execute(level_insert,level)

    rank_insert="INSERT INTO RankUpdate(id,old_rank,new_rank,rank_type,time,player_id,old_name,new_name) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)"
    for rank in ranks:
        cursor.execute(rank_insert,rank)

    check_insert="INSERT INTO ApexabilityCheck(id,entry_type,time,player_id) VALUES(%s,%s,%s,%s)"
    for check in checks:
        cursor.execute(check_insert,check)
except Exception as e:
    print(e)
    cnx.rollback()
    cnx.close()
    sys.exit(1)

cnx.commit()
cnx.close()
