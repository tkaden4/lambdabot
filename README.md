# lambdabot

A discord bot that can compile and run code.

## Usage

```
git clone https://github.com/tkaden4/lambdabot
cd lambdabot
touch config.json
# populate config.json with the necessary values ...
npm install
node build/src
```

## Configuration

```
{
  "discord": {
    "token": <discord token>,
    "prefix": <command prefix>,
    "outputLengthMax": <set maximum output length>
  },
  "hackerearth": {
    "clientID": <hackerearth v3 API client id>,
    "clientSecret": <hackerearth client secret>,
  }
}

```
