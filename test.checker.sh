#! /bin/bash

FILES=src/*
TESTS_NEEDED=0

echo "Checking files for corresponding tests"

for f in $FILES
do
  if [ -d "$f" ]
  then
    for ff in $f/*
    do
      TESTFILE=${ff/src/test}
      TESTFILE=${TESTFILE/\.js/Spec.js}

      if [ ! -f $TESTFILE ]
      then
        TESTS_NEEDED=$((TESTS_NEEDED+1))
        echo "\033[31mTest not found, please create $TESTFILE!\033[0m"
      fi
    done
  fi
done

if [ $TESTS_NEEDED -eq 0 ]
then
  echo "\033[32mAll files have corresponding tests, no problems"
  exit 0
else
  echo "\033[31mYou need to create some tests, exiting\033[0m"
  exit 1
fi