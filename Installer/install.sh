#!/bin/sh
#sudo /bin/bash installer.sh

function package_exists(){
  return dpkg -l "$1" &> /dev/null
}

localFolder=/usr/bin/NGINXAdmin

rm -rf $localFolder

echo 'Instaling NGINXAdmin'

if ! package_exists git-core ; then
  echo 'Installing git-core...'
  apt-get install git-core
fi

repository="https://github.com/AFarinha/NGINX.git"

if [ ! -d $localFolder ]; then
  mkdir -p $localFolder;
  echo 'Creating folder '$localFolder

fi


git clone $repository $localFolder

if ! package_exists npm ; then
  echo 'Installing npm...'
  apt-get install npm
fi

if ! package_exists nodejs ; then
  echo 'Installing nodejs...'
  apt-get install nodejs
fi

if ! package_exists nginx ; then
  echo 'Installing nginx...'
  apt-get install nginx
fi

ufw allow 'Nginx HTTP'
ufw status
service nginx start

cp $localFolder/confd/0-cache.conf /etc/nginx/conf.d/0-cache.conf
cp $localFolder/confd/10-dashboard.conf /etc/nginx/conf.d/10-dashboard.conf

cd $localFolder

echo 'Installing express...'
sudo npm install express

echo 'Installing node-pre-gyp...'
sudo npm install node-pre-gyp -g

echo 'Installing sqlite3...'
sudo npm install sqlite3 --no-bin-links

echo 'Installing body-parser...'
sudo npm install body-parser

echo 'Installing tail...'
sudo npm install tail

sudo nodejs $localFolder/main.js