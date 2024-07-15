# Unit tests
 We use the luarocks package [busted](https://lunarmodules.github.io/busted/) as our testing framework
## Conventions

- Create one test file per helper
- Filename has to be `\*.test.lua`
- Place it in a `__tests__` folder next to the file

## Run

From the root of this file repo, run `run-tests.sh` to run all `*.test.lua` files inside the Docker container.
