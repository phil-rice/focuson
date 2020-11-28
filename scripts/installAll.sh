
log=$(mktemp)

function log(){
   echo "$1 $2" >> $log
}

function finish(){
  echo "log is $log"
  cat $log
  log "Total took ${SECONDS}s"
}
trap finish EXIT

function doOne(){
  (
    SECONDS=0
    cd $1
    npm i
    log "$1"
    pwd >> $log
    log "  $1 npm install" $?
    npm test
    log "  $1 npm test" $?
    tsc
    log "  $1 tsc" $?
    log "  $1 took ${SECONDS}s"
  )

}
SECONDS=0
doOne lens
doOne codeondemand
doOne nav
doOne examples/lens/cpq
doOne examples/lens/dragon
doOne examples/codeondemand/tictactoe
doOne examples/codeondemand/cpq

