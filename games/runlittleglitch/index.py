#!/usr/bin/env python
import os
import platform
import sqlite3
import cgi
from xml.dom import *

# database stuff
conn = sqlite3.connect('scores.db')
c = conn.cursor()
# DOM stuff
dom = getDOMImplementation()



print "Content-Type: text/html"
print ""
print """\
<!DOCTYPE HTML>
<html>
<head>
    <title>run, little glitch!</title>
    <script src='cl_game.js'></script>
    <script src='cl_library.js'></script>
    <style type='text/css'>
        body{
            background-color:#efefef;
            font-family:"Courier New";
            color:black;
            font-size:14px;}
        h1{
            font-family:"Courier New";}
        #gameCanvas{
            padding:0px;
            border:1px solid black;
            display: inline;}
        #description{
            display: inline-block;
            text-align: justify;
            position: absolute;
            height: 600px;
            width: 20em;
            top: 100px;
            left: 650px}
        #scores{
            display: inline-block;
            text-align: justify;
            position: absolute;
            height 300px;
            top: 500px;
            left: 650px;}
    </style>
    <script type="text/javascript">
        function getScore() {
            document.getElementById("scorefield").value = score;
        }
    </script>
    <script type="text/javascript">
        function clearForm() {
            var i;
            for (i = 0; (i < document.forms.length); i++) {
                document.forms[i].reset();
            }
            console.log('form cleared!');
        }
    </script>
</head>
<body onload=clearForm();>
    <h1>run, little glitch!</h1>
    <canvas id='gameCanvas' width='600' height='600'>Your browser is too weak to uphold the power of this canvas! <a href='http://www.google.com/chrome'>Get Google Chrome!</a></canvas>
    <div id='description'>
        <p>you are a computer glitch.</p>
        <p>avoid the squares, they are pieces of the BSOD (blue screen of death) and will crash the computer, getting rid of you forever!</p>
        <p>you have 3 healths</p>
        <p>press esc to reinvade the computer if the computer crashes</p>
    </div>"""
try:
    results = c.execute("SELECT * FROM scores ORDER BY score DESC;")
except:
    c.execute("CREATE TABLE scores (name TEXT, score INTEGER);")
    for i in range(0,5):
        c.execute("INSERT INTO scores VALUES ('nobody', 0);")
    
    conn.commit()
    results = c.execute("SELECT * FROM scores ORDER BY score DESC;")

    
i = 0
scores = []
for entry in results:
    scores.append("%s --- %s" % (entry[0], entry[1]))

    
print """\
    <div id='scores'>
        <h3>high scores</h3>
        <ol>
            <li>{0}</li>
            <li>{1}</li>
            <li>{2}</li>
            <li>{3}</li>
            <li>{4}</li>
        </ol>
        <form action="" method="POST">
            name: <input type="text" name="name">
            <input type="hidden" id="scorefield" name="score">
            <input type="submit" value="submit" onclick=getScore();>
        </form>
        <p style="inline;">(reload page to refresh scores)</p>
    </div>""".format(scores[0], scores[1], scores[2], scores[3], scores[4])

form = cgi.FieldStorage()
print("<br><br>")
name = form["name"].value
score = form["score"].value
for i in scores:
    entry = i.split(' ')
    hs_name = entry[0]
    hs_score = entry[2]
    if name == hs_name:
        if hs_score < score:
            str = "INSERT INTO scores VALUES (" + "'" + name + "'" + ", " + str(score) + ");"
            c.execute(str)
            conn.commit()
            break
        else:
            break
    else:
        if score > hs_score:
            str = "INSERT INTO scores VALUES (" + "'" + name + "'" + ", " + str(score) + ");"
            c.execute(str)
            conn.commit()
    
print """\
</body>
</html>
"""
    
    
    
    
