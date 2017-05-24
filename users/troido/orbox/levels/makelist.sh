#! /bin/bash

# empty the file
#echo "" > list.txt

# the first file to be loaded:
#echo "SPack.json" >> list.txt

#echo ";" >> list.txt

# put all json files in this directory (my levels) in the list
ls | grep -i .json > list.txt

#echo ";" >> list.txt

# put all json files in the folder public (files by other tilde.red users) in the list
#ls public/ | grep -i .json >> list.txt

# inform user of succes
cowsay "List updated!"
