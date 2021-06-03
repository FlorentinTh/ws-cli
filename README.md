# ws-cli

Universal WS recorder app for LIARA Laboratory.

## Authors

- [**Florentin Thullier**](https://github.com/FlorentinTh) - 2021

## Installation

### Simple

1. Download the [latest release](https://github.com/FlorentinTh/ws-cli/releases) of the executable for your platform and rename it as ```ws-cli```.

2. Copy the executable and paste it somewhere safe. For example on windows it can be : ```C:/dev/ws-cli-[release_version]/ws-cli.exe```.

3. Add the path to you environment variable :

> **Note**: replace ```<ws-cli.exe_parent_directory_path>``` by your actual path. Such as ```C:/dev/ws-cli-v1.x/```

   - **Windows** :
     - with PowerShell :
     ```sh
     $ setx PATH "%PATH%;<ws-cli.exe_parent_directory_path>"
     ```

     _your powershell session need to be restarted._

   - **Linux / macOS** :
     ```sh
     $ cd $HOME
     $ nano .bashrc
     # add the following line to the file then save and exit :
     export PATH=<ws-cli.exe_parent_directory_path>
     $ source .bashrc
     ```

4. The command ```ws-cli``` should now be available from anywhere through your terminal.

### Manual

1. [Install or update node](https://nodejs.org/dist/latest-v12.x/) to 12.x or greater if not already done.

2. Clone this repo :
```sh
$ git clone https://github.com/FlorentinTh/ws-cli.git

```

2. Build the project :

```sh
$ npm run build
```

3. Once completed, in the root project directory you should have a new folder called ```dist``` containing three executables. Rename the executable corresponding to your platform as ```ws-cli``` and follow the same instructions as for the [simple installation process](#simple) beginning at step 2.

## Usage
```
Usage: ws-cli [OPTIONS]

Options:
  -c, --configuration  Path of the YAML configuration file containing the list
                       of the WebSocket servers [string] [default: "servers.yml"]
  -d, --default        Automatically respond to questions with default values
                                                      [boolean] [default: false]
      --help           Show help                                       [boolean]
      --no-sanitize    Disable default sanitization of both first and last
                       seconds of recording           [boolean] [default: false]
  -l, --label          Label output folder according to user entry instead of a
                       timestamp by default           [boolean] [default: false]
      --version        Show version number                             [boolean]
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
