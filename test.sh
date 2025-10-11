git submodule add https://github.com/jquery/jquery-dist
ln -s ../jquery-dist/dist/jquery.js
git add .gitmodules jquery.js
git commit -m "add a symbolic link to logback.xml with the respective submodule"