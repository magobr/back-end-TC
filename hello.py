import sys 
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="root",
  database="LogicGamesTC2"
)

# Takes first name and last name via command  
# line arguments and then display them 
print("Output from Python") 
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

mycursor = mydb.cursor()


val = (userId,numberOfSteps,points,numberOfBlocks,numberOfTries,level)

mycursor.execute("INSERT INTO niveis (id_usuario,n_passos,n_pontos,n_blocos,n_tentativas,nivel) VALUES (%s,%s,%s,%s,%s,%s)", (userId,numberOfSteps,points,numberOfBlocks,numberOfTries,level))
print (mycursor)
mydb.commit()

print(mycursor.rowcount, "record inserted.")