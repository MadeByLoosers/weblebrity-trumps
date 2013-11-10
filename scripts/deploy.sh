#!/bin/sh

clear

echo ""
echo "********** UPDATING SITE FROM GIT *********"
cd /srv/www/git_weblebritytrumps && sudo git pull

echo ""
echo "********** RUNNING DRY RUN RSYNC **********"
rsync -av -n --delete --exclude-from 'excludes.txt' /srv/www/git_weblebritytrumps /srv/www/weblebritytrumps.com

echo ""
echo "***************************************"
echo "Please review the output of the dry run above. Do you wish to continue? (y/n)"

read input

if [[ $input == "Y" ||  $input == "y" ]]; then
	rsync -av --delete --exclude-from 'excludes.txt' /srv/www/git_weblebritytrumps /srv/www/weblebritytrumps.com
else
	exit;
fi
