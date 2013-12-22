#!/bin/bash

WORDDIR=../txt

for char in A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
do
   echo "Loading $char file"
   TABLE=`echo "$char"words`
   FILE=`echo "$char"Words.txt`
   key=1
   tmp=`echo "$char"file`
##   rm -f $tmp
   for word in `cat $WORDDIR/$FILE`
   do
      # following perl line - prints the length of the word followed by the sorted word (both separated by ,)
      out=`echo $word | xargs perl -e 'my $len=length($ARGV[0]);my @arr = split "", $ARGV[0]; print $len,",",sort @arr;'`
      echo "$key,$word,$out" >>$tmp
      printdot=`echo "$key % 100" | bc`
      if [ $printdot -eq 0 ]; then
         echo -n "."
      fi
      key=`expr $key + 1`
   done
done
rm -f tmp
for char in A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
do
   echo "Importing $char file"
   tmp=`echo $PWD/"$char"file`
   TABLE=`echo "$char"words`
   echo "LOAD DATA LOCAL INFILE $tmp REPLACE INTO TABLE $TABLE FIELDS TERMINATED BY ',' LINES TERMINATED BY  '\n';" >>tmp
done

for char in A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
do
   echo "Deleting $char file"
#   rm "$char"file
done
rm tmpfile
