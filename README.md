# ws-cli

![platform](https://img.shields.io/badge/platform-linux--64%20%7C%20win--32%20%7C%20osx--64%20%7C%20win--64%20-lightgrey) ![node](https://img.shields.io/badge/node-%3E%3D16-blue) [![License](https://img.shields.io/github/license/FlorentinTh/ws-cli)](https://github.com/FlorentinTh/ws-cli/blob/master/LICENSE) [![snyk](https://github.com/FlorentinTh/ws-cli/actions/workflows/dependencies.yml/badge.svg)](https://github.com/FlorentinTh/ws-cli/actions/workflows/dependencies.yml) [![build](https://github.com/FlorentinTh/ws-cli/actions/workflows/build.yml/badge.svg)](https://github.com/FlorentinTh/ws-cli/actions/workflows/build.yml) [![GitHub Release](https://img.shields.io/github/release/FlorentinTh/ws-cli)](https://github.com/FlorentinTh/ws-cli/releases)

This CLI allows you to record data from a provided list of WebSocket servers.

## Authors

- [**Florentin Thullier**](https://github.com/FlorentinTh) - 2021

## Installation

### Simple

1. [Install or update node](https://nodejs.org/dist/latest-v16.x/) to 16 or greater if not already done.

2. Install the project :

```sh
$ npm install -g @florentinth/ws-cli
```

### Manual

1. [Install or update node](https://nodejs.org/dist/latest-v16.x/) to 16 or greater if not already done.

2. Clone this repo:
```sh
$ git clone https://github.com/FlorentinTh/ws-cli.git

# or

$ git clone git@github.com:FlorentinTh/ws-cli.git

# or

$ gh repo clone FlorentinTh/ws-cli

```

2. Install the project:

```sh
$ cd ws-cli/
$ npm i
```

3. Run the program locally:

```sh
$ node ./bin/ws-cli.js

# or

$ npm run start
```
4. Run the program globally:

```sh
$ npm run link
```
_You should now have access to the ```ws-cli``` command from anywhere in your favorite terminal appication._

## Usage
```
Usage:
  $ ws-cli [options]

Options:
  -c, -C, --conf     Path of the YAML configuration file containing the list of
                     the WebSocket servers   [string] [default: "./servers.yml"]

  -h, -H, --help     Show help                                         [boolean]

  -l, -L, --label    Label output folder according to the user entry instead of
                     a timestamp by default and add the provided label to the
                     data                             [boolean] [default: false]

  -v, -V, --version  Show version number                               [boolean]
```

## Example of YAML Configuration File

```yml
- name: 'WebSocket Server 1'
  host: 127.0.0.1
  port: 5001
  secured: false

- name: 'WebSocket Server 2'
  host: 127.0.0.1
  port: 5002
  secured: true

- name: 'WebSocket Server 3'
  host: 127.0.0.1
  port: 5003
  endpoint: 'data'
  secured: false
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
