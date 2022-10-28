#!/bin/sh
set -e

echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
echo "🥐 cleanup – START"

psql -q -f "./cleanup/cleanup.sql"

echo "🥐 cleanup – END"
echo "🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 🥐 "
