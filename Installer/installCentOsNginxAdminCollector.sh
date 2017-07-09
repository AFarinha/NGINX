#!/bin/bash
usermod --password $(echo root | openssl passwd -1 -stdin) root

#yum update -y

localFolder=/opt/NginxAdmin
repository="https://github.com/AFarinha/NGINX.git"

rm -rf $localFolder

echo 'Instaling NGINXAdmin'

if ! rpm -q  git ; then
  echo 'Installing git...'
  yum install -y git
fi

if ! rpm -q  nano ; then
  echo 'Installing nano...'
  yum install -y nano
fi

if ! rpm -q  epel-release  ; then
  echo 'Installing epel-release...'
  yum install -y epel-release
fi

if ! rpm -q nginx  ; then
  echo 'Installing nginx...'
  yum install -y nginx

  #Nginx does not start on its own. To get Nginx running, type:
  sudo systemctl start nginx

  #Nginx to start when your system boots.
  systemctl enable nginx
fi


if ! rpm -q  curl  ; then
  echo 'Installing curl...'
  yum install -y curl
fi

if ! rpm -q  nodejs  ; then
  echo 'Installing nodejs...'
  curl -sL https://rpm.nodesource.com/setup_7.x | bash -
  yum  install -y nodejs
fi

if ! rpm -q  net-tools  ; then
  echo 'Installing net-tools...'
  yum  install -y net-tools
fi

#----- Instalar solucao ------
if [ ! -d $localFolder ]; then
  mkdir -p $localFolder;
  echo 'Creating folder '$localFolder
fi

git clone $repository $localFolder

#----- Configurar nginx  ------
cd /etc/nginx/
mkdir -p dashboard
cd ~

cp $localFolder/Installer/nginx/nginx.conf /etc/nginx/nginx.conf

cp $localFolder/Installer/nginx/confd/cache.conf /etc/nginx/dashboard/cache.conf
cp $localFolder/Installer/nginx/confd/0-cache.conf /etc/nginx/conf.d/0-cache.conf
cp $localFolder/Installer/nginx/confd/10-dashboard.conf /etc/nginx/conf.d/10-dashboard.conf

systemctl restart nginx

cd $localFolder

npm install
# ----- Instalar servico  ------
#fazer um script de node seria mais inteligente!!!! mas agora já está!
sed -i -e 's/\[\]/["http:\/\/[IPStation]"]/' config.json

cp $localFolder/Installer/service/NGINXAdminCollector /etc/systemd/system/NGINXAdminCollector.service

systemctl enable NGINXAdminCollector.service
systemctl start NGINXAdminCollector.service

# FIM

#SERVER=192.168.1.200:8080 MODE=collector node main.js
