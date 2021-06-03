# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.2](https://github.com/FlorentinTh/ws-cli/compare/v1.1.1...v1.1.2) (2021-06-03)


### CI

* **upload-assets:** update command in upload-assets workflow file ([7a6ae26](https://github.com/FlorentinTh/ws-cli/commit/7a6ae269829fbf5406dec583051972aad531f415))

### [1.1.1](https://github.com/FlorentinTh/ws-cli/compare/v1.1.0...v1.1.1) (2021-06-03)


### CI

* **upload-assets:** fix an issue with upload-assets.yml file content ([c8c5f6b](https://github.com/FlorentinTh/ws-cli/commit/c8c5f6b2094ba7bbdc59866335afafc02d856aea))

## 1.1.0 (2021-06-03)


### Features

* **cli:** add cli options to use external YAML configuration file for WebSocket servers ([d643556](https://github.com/FlorentinTh/ws-cli/commit/d64355667950543e2cc261797c6efd28395fa47a))
* **cli:** add compilation scripts to produce executable files for the 3 main targets ([224f09d](https://github.com/FlorentinTh/ws-cli/commit/224f09dabf93f931144feca3c91b9ad4a799b020))
* **cli:** start working on cli ([7ffc784](https://github.com/FlorentinTh/ws-cli/commit/7ffc784d6cf237d03f31083b5d5bdea9090aebbb))
* **consolehelper:** add CLI description ([a4a6785](https://github.com/FlorentinTh/ws-cli/commit/a4a6785fca69546fbe0ed1cc703253899e0e4f5d))
* **postprocessing:** start working on PostProcessing features ([85965aa](https://github.com/FlorentinTh/ws-cli/commit/85965aaed0f93d8835b3b6d2f5099c56bc43d8cc))


### Bug Fixes

* **cli:** add missing exit codes ([efbf991](https://github.com/FlorentinTh/ws-cli/commit/efbf9914f5211ff0e6ec60e0cb3c11b0f97d5b84))
* **cli:** fix weird issue replacing original name of isOptionSet function ([f4839a6](https://github.com/FlorentinTh/ws-cli/commit/f4839a6edf481e7341f7d53edd58a13a245734b8))
* **cli-label-opt:** add override or rename capability if same folder for label already exists ([0e181e2](https://github.com/FlorentinTh/ws-cli/commit/0e181e2e7b240667ca6cc3bcd29079d83b1c9818))
* **consolehelper:** add missing default null value for error object parameter in printError function ([c7db2ae](https://github.com/FlorentinTh/ws-cli/commit/c7db2aeecbd66bcdaa7855cb24359eddeecaaf48))
* **filehelper:** add missing function required to check if conf file exists for default value ([8d71269](https://github.com/FlorentinTh/ws-cli/commit/8d71269bbe17f986244a0d28aa00acb103c1a2b0))
* **main:** use dynamic app name instead of a hardcoded value ([f0b8d68](https://github.com/FlorentinTh/ws-cli/commit/f0b8d68bcaba570412a6f3bd90ffcce5b612944a))
* **mock:** remove now unused mock function for WebSocket connection ([05458a9](https://github.com/FlorentinTh/ws-cli/commit/05458a9f5a6f50abba5484ff5924c032d0853832))
* **project:** fix intial project configuration according to the needs ([abdb4a1](https://github.com/FlorentinTh/ws-cli/commit/abdb4a1735d173ff0eb51ba42c4086f7cdaf64dc))
* **websocketserver:** fix issues with all servers ([bdc491d](https://github.com/FlorentinTh/ws-cli/commit/bdc491df2137058f46ff31555a7e08d09b021326))


### Chore

* **deps:** update dependencies ([c762e4c](https://github.com/FlorentinTh/ws-cli/commit/c762e4c9e2f89a04aa74219dc8b6d84f2facb4c1))
* **deps:** update dependencies ([022ea3b](https://github.com/FlorentinTh/ws-cli/commit/022ea3b77f0e5e133f931879bb803d466fe1a13d))
* **deps:** update dependencies ([db9791b](https://github.com/FlorentinTh/ws-cli/commit/db9791b78abe12ca76174e91c0138d391741075a))
* **deps:** update dependencies ([0750f05](https://github.com/FlorentinTh/ws-cli/commit/0750f05e45aff19841e6d04b24199f4673bd32f6))
* **deps:** update dependencies ([bd6c293](https://github.com/FlorentinTh/ws-cli/commit/bd6c293393ae29a3537ecc6bcf122e49acc8616d))
* **deps:** update dependencies and update npm to v7.x ([96411b7](https://github.com/FlorentinTh/ws-cli/commit/96411b7e852dea446ac9d32d49851ae43a1edbd9))


### Documentation

* **readme:** update readme ([bbf4d79](https://github.com/FlorentinTh/ws-cli/commit/bbf4d7975b2251d6a8ef721f015fa51cf525f71b))


### Styling

* **.vscode:** remove useless space in vscode settings file ([7b31624](https://github.com/FlorentinTh/ws-cli/commit/7b31624df39572c4da18145526bbafcbfb22f8f5))


### Refactors

* **cli:** change the way bin file call the main app source file ([c556cc1](https://github.com/FlorentinTh/ws-cli/commit/c556cc1dcf1918bb13fd89e0f7290bc94f6d52c1))
* **cli-default:** replace yes option name by default option name ([13f6e80](https://github.com/FlorentinTh/ws-cli/commit/13f6e802f280fd70d82be6f56428801f916f0962))
* **commandhelper:** move optionsHelper to commandHelper and add few aliases ([e3fc610](https://github.com/FlorentinTh/ws-cli/commit/e3fc61089f9f8937409d97811579699aec1b810a))
* **project:** add better error handling and better class member visibility ([8478554](https://github.com/FlorentinTh/ws-cli/commit/8478554e1aa4824c8c3129223db0530a57d7056b))
* **project:** init project ([a1cd811](https://github.com/FlorentinTh/ws-cli/commit/a1cd811939cb657b8786d4cae4cdf007fea84e8a))
* **recording:** add new required dependencies ([7a78966](https://github.com/FlorentinTh/ws-cli/commit/7a7896670a1e0c1350530ae27dc2fce2607f2145))
* **recording:** remove recording and refactor websocketServer accordingly ([d5ee6f3](https://github.com/FlorentinTh/ws-cli/commit/d5ee6f3e4676cef308be3908c3aa6c123937669b))
* **websocketserver:** refactor unused code ([8ee4b74](https://github.com/FlorentinTh/ws-cli/commit/8ee4b74ef1f72e671accc37df95022fb1f2868e6))


### Build System

* **npm:** add pkg-ver to version executables created by vercel/pkg at the end of the build ([bfd83b1](https://github.com/FlorentinTh/ws-cli/commit/bfd83b1b68b9d634559ec0d73c9980f959dae798))
* **npm:** add some scripts in package.json ([afd1744](https://github.com/FlorentinTh/ws-cli/commit/afd1744ec7b2a22677b43994bc8268cf9a4c9682))
* **npm script:** remove dist folder before a new build ([205f56b](https://github.com/FlorentinTh/ws-cli/commit/205f56b41944cdd36ccfe5430583741da3b425b1))


### CI

* **gh actions:** add first version of github actions workflow to upload executables in release assets ([dc1d8b1](https://github.com/FlorentinTh/ws-cli/commit/dc1d8b1dfbc44a98537d6fcbd7cb1a79f752e518))
