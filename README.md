<p align="center">
    <img
        width="200px"
        src="https://github.com/Snap-AV/ovrc-ui/blob/main/app/src/assets/images/ovrc-logo.svg"
        alt="OvrC"
    />
</p>
<p align="center">
      <img src="https://img.shields.io/badge/version-2.12.3-blue" alt="version">
      <img src="https://img.shields.io/website?down_message=offline&label=app.ovrc.com&up_message=online&url=https%3A%2F%2Fapp.ovrc.com">
    <br>
    <a href="https://play.google.com/store/apps/details?id=com.ovrc.app&hl=en_US&gl=US">
        <img src="https://img.shields.io/badge/Google%20Play-green?logo=google-play">
    </a>
    <a href="https://apps.apple.com/sz/app/ovrc/id1413853229">
        <img src="https://img.shields.io/badge/App%20Store-lightgrey?logo=app-store&logoColor=white">
    </a>
</p>


## Requirements
- [Node](https://nodejs.org/en/download/) and NPM are installed and up-to-date
- [iOS and Android build tools and environments](https://capacitorjs.com/docs/v3/getting-started/environment-setup)


## Getting Started
1. **Clone the repository.**
1. **Install project dependencies.**
    
    ```
    $ npm i
    ```
    
1. **Start the development server.**
    
    ```
    $ ovrc start
    ```


## OvrC CLI
The OvrC CLI is available from within the root of the project and is the preferred way to run
scripts and automations within the development environment (instead of `npm run`).
You can view a list of available commands and their usage, by running:

```
$ ovrc --help
```

## OvrC Git CLI
The OvrC Git (`og`) is available from within the root of the project and is the preferred way to handle git commits (instead of `git commit`).
You can view a list of available commands and their usage, by running:

```
$ og --help
```

## Dev Menu
A developer menu to the login page, accessible by keying in the Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) on desktop.

Currently the developer menu only allows the changing of API environments.
