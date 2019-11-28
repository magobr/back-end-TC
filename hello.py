import sys 
import mysql.connector 
import pandas as pd 
import os 
import numpy as np 

print("Output from Python") 
conn = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="root",
  database="LogicGamesTC2"
)
cur = conn.cursor() 
 

print("numberOfBlocks: " + sys.argv[1]) 
print("numberOfSteps: " + sys.argv[2]) 
print("numberOfTries: " + sys.argv[3]) 
print("points: " + sys.argv[4]) 
print ("userId: " + sys.argv[5])
print ("level: " + sys.argv[6])
numberOfBlocks= sys.argv[1]
numberOfSteps=sys.argv[2]
numberOfTries=sys.argv[3]
points=sys.argv[4]
userId=sys.argv[5]
level=sys.argv[6]

 

df = pd.read_csv("treino de niveis - Treino.csv") 
print(df)
 
from sklearn.model_selection import train_test_split 
 
X = df.drop('resultado',axis=1) 
y = df['resultado'] 
print(X)
 
X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.30) 
 

from sklearn.tree import DecisionTreeClassifier 
 
dtree = DecisionTreeClassifier() 
print(X_train,y_train)
dtree.fit(X_train,y_train) 
 
print(X_train,y_train)
pred = dtree.predict(X_test) 
x_random = [[level,numberOfBlocks,points,numberOfSteps,numberOfTries]]
print(x_random)
resultPred = dtree.predict(x_random) 
test = resultPred[0]
print(resultPred[0])
 
val = (userId,numberOfSteps,points,numberOfBlocks,numberOfTries,level,test)

cur.execute("INSERT INTO niveis (id_usuario,n_passos,n_pontos,n_blocos,n_tentativas,nivel,resultadoDesempenho) VALUES (%s,%s,%s,%s,%s,%s,%s)", (userId,numberOfSteps,points,numberOfBlocks,numberOfTries,level,test))
print (cur)
conn.commit()

print(cur.rowcount, "record inserted.")