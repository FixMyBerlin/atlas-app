
#!/bin/bash

format_left_right() {
  # Generate the padding string
  padding_length=$((80 - ${#1} - ${#2}))
  padding=""
  for ((i=0; i<padding_length; i++)); do
    padding="${padding}$3"
  done

  # Print the result
  echo "$1${padding}$2"
}

format_now() {
  # echo `date +"%Y-%m-%dT%H:%M:%S%z"` # with timezone
  echo $(date +"%Y-%m-%dT%H:%M:%S")
}

seconds() {
  echo $(date +%s)
}

start_time_varname() {
  local task_safe="${1//[^a-zA-Z0-9]/_}"
  echo start_time_$task_safe
}

log_start() {
  local topic="$1"
  local varname=$(start_time_varname $topic)
  declare -g $varname=$(seconds)
  local left="$(format_now) $topic "
  local formatted=$(format_left_right "$left" "" ">")
  echo -e "\e[1m\e[7m${formatted}\e[27m\e[21m\e[0m"
}

log_end() {
  local topic="$1"
  local varname=$(start_time_varname $topic)
  local start_time="${!varname}"
  local end_time=$(seconds)
  local duration=$((end_time - start_time))
  local left="$(format_now) $topic "
  local right=" $(date -d@$duration -u +%H:%M:%S)"
  local formatted=$(format_left_right "$left" "$right" "<")
  echo -e "\e[1m\e[7m${formatted}\e[27m\e[21m\e[0m"
  echo
}

log() {
  echo "$(format_now) $1"
}

# Post messages to Synology Chat Channel
# The alert `text` uses Markdown and #Hash tags to highlight the message in Synology Chat
notify() {
  if [ -z $SYNOLOGY_LOG_TOKEN ]; then
    return 0
  fi
  local payload="{\"text\": \"#$ENVIRONMENT: $1\"}"
  local url="$SYNOLOGY_URL$SYNOLOGY_LOG_TOKEN"
  curl ---silent --show-error --fail -X POST $url -d "payload=$payload" --output "/dev/null"
}

alert() {
  if [ -z $SYNOLOGY_ERROR_LOG_TOKEN ]; then
    return 0;
  fi
  local payload="{\"text\": \"#$ENVIRONMENT: $1\"}"
  local url="$SYNOLOGY_URL$SYNOLOGY_ERROR_LOG_TOKEN"
  curl --silent --show-error --fail -X POST $url -d "payload=$payload" --output "/dev/null"
}
