#!/bin/bash

git ls-files | entr prettier -w $(git ls-files)
