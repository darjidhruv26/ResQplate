#!/bin/bash

docker stop resqplate
docker rm resqplate
docker image rm dhruvdarji123/resqplate-app:latest 