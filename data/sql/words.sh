#!/bin/bash

echo ".quit" | /usr/bin/sqlite3 -init createtables.sql ../words.db
