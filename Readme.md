
# loo-papertrail

  Papertrail logging for [loo](https://github.com/matthewmueller/loo).

## Usage

```js
let Papertrail = require('loo-papertrail')
let log = require('loo')('app')
let Log = require('loo')

// PAPERTRAIL_URL
//  - format:  PAPERTRAIL_URL="SYSTEM@HOST:PORT"
//  - example: PAPERTRAIL_URL="loo@logs.papertrailapp.com:43434"
let papertrail = Papertrail(process.env.PAPERTRAIL_URL)

// send all "app" logs to papertrail
log.pipe(papertrail)

// send every error and fatal error to papertrail.
// this includes "app", but also any dependency
// that uses loo.
Log.pipe.error(papertrail)
Log.pipe.fatal(papertrail)
```

## Installation

```
npm install loo-papertrail
```

## License

MIT
