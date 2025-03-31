a=[2,3,1,1,4]
k=0
n=len(a)
for i in range(len(a)):
    k=a[i]
    l=a[k]
    if l==a[::-1]:
      print("true")
      break
print("False")
