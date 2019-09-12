# Changes

## 1.0.0

__BREAKING__: The codebase was upgraded to ES5.

Choo v7 was added to the supported versions in `peerDependencies`. With this
release, `choo-test` is compatible with v5, v6 and v7.

- 📚 [`7ff4e9d`](https://github.com/mantoni/choo-test.js/commit/7ff4e9d208dc80d648237f93704083d4ed3a44e4)
  State choo compatibility, update URL and remove badge
- ✨ [`b85587b`](https://github.com/mantoni/choo-test.js/commit/b85587b192c2fc91295c0b68da892f541f9ea036)
  Switch to `@studio/eslint-config`
- ✨ [`4914419`](https://github.com/mantoni/choo-test.js/commit/4914419f0d546f03f337446d6ebe4f563b1e908f)
  Upgrade eslint to v6
- ✨ [`4603617`](https://github.com/mantoni/choo-test.js/commit/4603617e18fd6eeb3bd74473015ba530d7175608)
  Upgrade Studio Changes
- ✨ [`2d7122d`](https://github.com/mantoni/choo-test.js/commit/2d7122d0d4073fdbfa446486900a33cfbf85a423)
  Upgrade choo to v7
- ✨ [`8289a74`](https://github.com/mantoni/choo-test.js/commit/8289a7461a50d31f0587cb84e1f2e140e2527498)
  Update mochify

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2019-09-12._

## 0.5.0

- Capture window listeners and unregister in `restore()`

## 0.4.0

- Improve stack if `onRender` callback throws
- Improve example and description wording
- Add choo v6 as `peerDependency`

## 0.3.0

- Allow to pass a scope node to `$` and `$$`

## 0.2.0

- Choo v5

## 0.1.0

- Rewrite

## 0.0.5

- Add `$$` for `querySelectorAll`

## 0.0.4

- Add support for `onload` handler on nested elements

## 0.0.3

- Add `redraw()` and stub out `requestAnimationFrame`

## 0.0.2

- Add support for `onload` handler

## 0.0.1

- Initial release.
