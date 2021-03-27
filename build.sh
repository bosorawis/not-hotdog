#!/bin/bash

pushd ./goapp
go test ./...
go build -o ../.build/linebot/handler ./linebot
popd