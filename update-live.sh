# settings
basepath=~/dev/my-athletics-club

# go to base path
cd $basepath

# get latest
git pull

# build frontend
cd $basepath/frontend
npm update
bower update
tsd reinstall -so
gulp --settings='production'

# stop webserver
sudo apache2ctl stop

# copy new frontend files
sudo rm -R /var/www/my-athletics-club/*
sudo cp -R dist/* /var/www/my-athletics-club

# update backend
sudo forever stopall
cd $basepath/api
npm install
tsc
sudo forever start 'dist/server.js'

# start webserver
sudo apache2ctl start

# list stuff
echo --------------------------------
echo All done. 
echo Below is the forever list showing whether the api is up and running or not. 
echo Please check https://gik.majig.dk too.
echo Have a nice day
echo --------------------------------
sudo forever list
echo --------------------------------
