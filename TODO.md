# TODOs

## Use a map for mapDataConfig

- We can use `.get(ID)` instead of `.find` or `.findIndex`
- Its recommended in https://immerjs.github.io/immer/update-patterns at the end of the page

## Switch from Zustand zu Jotai

It feels like Jotais model does fit more in our application.

https://jotai.org/docs/guides/typescript

## Test

Setup https://vitest.dev/api/ intead of Jest

## `@tanstack/react-location-devtools`: Cleanup package.json overwrite

This needs a kind of ugly override in package.json, see https://github.com/TanStack/router/issues/257#issuecomment-1154737874
Once that issue is resolved, we should cleanup the overwrite.
