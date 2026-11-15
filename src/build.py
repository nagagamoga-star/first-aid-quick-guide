import os
d=os.path.dirname(os.path.abspath(__file__))
r=lambda f: open(os.path.join(d,f)).read()
html=r('shell.html').replace('/*CSS*/', r('style.css')).replace('/*JS*/', r('art.js')+'\n'+r('topics.js')+'\n'+r('app.js'))
open(os.path.join(d,'..','index.html'),'w').write(html)
print(len(html))
