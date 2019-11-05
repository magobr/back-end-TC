import sys 
# Takes first name and last name via command  
# line arguments and then display them 
# save the script as hello.py 
import pandas as pd
import numpy as np 
import seaborn as sns
import matplotlib.pyplot as plt


lista = np.array([1,8,3,3,'bom',1,5,4,4,'razoavel',1,2,7,7,'ruim'])

lista.reshape(3,5)

df = pd.DataFrame(np.array(lista.reshape(3,5)),  columns='nivel pontuacao passos blocos classificacao'.split())

from sklearn.model_selection import train_test_split

X = df.drop('classificacao',axis=1)
y = df['classificacao']


X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.30)


from sklearn.tree import DecisionTreeClassifier

dtree = DecisionTreeClassifier()


dtree.fit(X_train,y_train)


teste = np.array([[5,8,0,12],[5,15,0,12],[5,7,20,12]])


y_pred = dtree.predict(X_test)


test_pred = dtree.predict(teste)

from sklearn.metrics import classification_report, confusion_matrix

print(classification_report(y_test,y_pred))

print(confusion_matrix(y_test,y_pred))

print(test_pred)
