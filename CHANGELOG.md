# 2.0.0-next.8 (2024-05-03)


### Bug Fixes

* **core:** onChange -> onChangeSet on substitution ced2492
* **decorator-mui:** empty string default for input 343aa96

# 2.0.0-next.7 (2024-05-02)


### Bug Fixes

* **decorator-mui:** better size handling for tabs 4b96566

# 2.0.0-next.6 (2024-04-28)


### Bug Fixes

* **core:** coerce initial date/time values bc20857
* **decorator-mui:** disable empty datetime test e23c934
* **decorator-mui:** missing date/time helper module 8f5c322
* **decorator-mui:** workaround nondeterministic ID 54a0058
* **decorator-mui:** wrap date/time input values eacc5c8
* **hooks:** coerce tuple keys to numbers ff08267

# 2.0.0-next.5 (2024-04-28)


### Bug Fixes

* **core:** custom onChange for dynamic ce754e5
* **core:** pass onChange to tab panel af2df12

# 2.0.0-next.4 (2024-04-28)


### Bug Fixes

* **core:** custom validator for FormTypes 8fca4d2
* **core:** event propagation and passing 9f0c11a
* **core:** fix incorrect titleFun 02d2235
* **core:** fix proptypes for forms b9d871a
* **core:** make some zustand adaptations to arrays 05bbf5d
* **core:** remove titleFun model passing in tests ef4df28
* **core:** zustand store mock in tests 77c2228
* **decorator-mui:** no more React.memo 5aa7597
* **example:** boolean flag for email check 82305e6
* **example:** temporarily disable pdf fonts 5f58186
* **example:** update generator to use new hooks 064d397

# 2.0.0-next.3 (2023-12-01)


### Bug Fixes

* wildcard for ignoring js maps e88d69a

# 2.0.0-next.2 (2023-11-18)


### Bug Fixes

* don't publish js maps 8d6e62b

# 2.0.0-next.1 (2023-11-18)


### Bug Fixes

* **@forml/context, @forml/core, @forml/decorator-barebones, @forml/decorator-bootstrap, @forml/decorator-mui, @forml/decorator-pdf, @forml/hooks:** upgrade dependencies all around 2e0d738
* **@forml/context, @forml/core, @forml/decorator-barebones, @forml/decorator-mui, @forml/decorator-pdf, @forml/hooks:** remove unneeded babel plugins 146c83f
* **@forml/core, @forml/decorator-mui:** update tests after dep upgrades 0467c41
* **example:** fix loading of material-icons ccd590c


### BREAKING CHANGES

* **@forml/context, @forml/core, @forml/decorator-barebones, @forml/decorator-bootstrap, @forml/decorator-mui, @forml/decorator-pdf, @forml/hooks:** multiple major version upgrades

# 1.8.0-next.2 (2023-11-18)


### Bug Fixes

* **decorator-mui:** fix broken dependencies 32fa29a

# 1.8.0-next.1 (2023-11-17)


### Bug Fixes

* **@forml/context, @forml/core, @forml/decorator-barebones, @forml/decorator-pdf, @forml/hooks:** remove caching in babel configs 0bba1f3
* **@forml/decorator-mui:** missed babel config update 32efe1e
* **core:** fix passing of html name attribute 7b4d782
* **core:** ignore falsey forms 553b165
* **core:** missing imports a5aa645
* **core:** multiselect onChange value 457ee75
* **core:** need items in downward mover c282f1e
* **core:** point calculation in number 1c02e66
* **core:** prevent unnecessary rerenders 6b429fb
* **core:** refactor array mapper slightly 5bf768d
* **core:** unnecessary rerenders in select mapper 56c4bbd
* **core:** updated onChange in SchemaField 0075b59
* **decorator-barebones:** new array format 56a5a4c
* **decorator-mui:** add file accept attribute 34138c0
* **decorator-mui:** broader date adapter support 07114d7
* **decorator-mui:** extra props from root 7f7e951
* **decorator-mui:** forwarding unsupported props e89d569
* **decorator-mui:** increase memoization a59daac
* **decorator-mui:** memos and callbacks 06ad210
* **decorator-mui:** no undefined value in select 4a8d800
* **example:** memoize styles in RenderExample 1c9e15b
* **example:** missing React import 65b4412
* **example:** prevent unnecessary rerenders d670ca0
* **example:** replace old logging tag ba7b7a8
* **example:** tolerate empty onChange in editor 648b17f
* **example:** update localization provider 717fdfc
* **example:** use new generator pattern c849766
* **hooks:** include schema reference in useModel 599207d
* prerelease tag to be next 9d69277
* semantic-release/git to commit example mods 89dde8f


### Features

* **context:** split rendering/model contexts 8039f6d
* **core:** reactor to use split contexts 9e97446
* **decorator-mui:** add path to useKey result 8f09393
* **example:** add iso example for one-off testing 18fa8f7
* **hooks:** dedicated array key handling c61f969
* **hooks:** model reducer and assorted hooks c658a65
* **hooks:** refactor to use split contexts 7b89411

# 1.8.0-develop.2 (2023-11-17)


### Bug Fixes

* semantic-release/git to commit example mods 89dde8f

# 1.8.0-develop.1 (2023-11-17)


### Bug Fixes

* **@forml/context, @forml/core, @forml/decorator-barebones, @forml/decorator-pdf, @forml/hooks:** remove caching in babel configs 0bba1f3
* **@forml/decorator-mui:** missed babel config update 32efe1e
* **core:** fix passing of html name attribute 7b4d782
* **core:** ignore falsey forms 553b165
* **core:** missing imports a5aa645
* **core:** multiselect onChange value 457ee75
* **core:** need items in downward mover c282f1e
* **core:** point calculation in number 1c02e66
* **core:** prevent unnecessary rerenders 6b429fb
* **core:** refactor array mapper slightly 5bf768d
* **core:** unnecessary rerenders in select mapper 56c4bbd
* **core:** updated onChange in SchemaField 0075b59
* **decorator-barebones:** new array format 56a5a4c
* **decorator-mui:** add file accept attribute 34138c0
* **decorator-mui:** broader date adapter support 07114d7
* **decorator-mui:** extra props from root 7f7e951
* **decorator-mui:** forwarding unsupported props e89d569
* **decorator-mui:** increase memoization a59daac
* **decorator-mui:** memos and callbacks 06ad210
* **decorator-mui:** no undefined value in select 4a8d800
* **example:** memoize styles in RenderExample 1c9e15b
* **example:** missing React import 65b4412
* **example:** prevent unnecessary rerenders d670ca0
* **example:** replace old logging tag ba7b7a8
* **example:** tolerate empty onChange in editor 648b17f
* **example:** update localization provider 717fdfc
* **example:** use new generator pattern c849766
* **hooks:** include schema reference in useModel 599207d


### Features

* **context:** split rendering/model contexts 8039f6d
* **core:** reactor to use split contexts 9e97446
* **decorator-mui:** add path to useKey result 8f09393
* **example:** add iso example for one-off testing 18fa8f7
* **hooks:** dedicated array key handling c61f969
* **hooks:** model reducer and assorted hooks c658a65
* **hooks:** refactor to use split contexts 7b89411

## 1.7.1 (2022-12-21)


### Bug Fixes

* **decorator-mui:** empty string bbfe9db

# 1.7.0 (2022-12-21)


### Bug Fixes

* **decorator-mui:** tweaks to array items e62d271


### Features

* **decorator-mui:** move to @mui/x-date-pickers 0d0ccbc

## 1.6.2 (2022-11-05)


### Bug Fixes

* **decorator-mui:** localize addText 50d667b

## 1.6.1 (2022-11-05)


### Bug Fixes

* **decorator-mui:** corrected addText calculation 9cd45ee
* **decorator-mui:** customize addText 421e388

# 1.6.0 (2022-11-05)


### Bug Fixes

* **decorator-mui:** better presentation for controls eb27b16


### Features

* **decorator-mui:** disable movement buttons 91d9d62

## 1.5.3 (2022-11-05)


### Bug Fixes

* additional semantic release deps 26be803
* **core:** not all errors have dataPath d234497
* **core:** nullish coalescing operator 9784fb2
* **decorator-mui:** remove misplaced comma 182b225
* **decorator/mui:** hide background tabs 1e5fc36
* **decorators/mui:** nullish coalescing operator cd45170
* only test on lts 8765fc3
* **packaging:** fix broken dependencies 24e8eb3
* **packaging:** need semantic-release-lerna 6e9362a
* **packaging:** resolve root dep vulnerabilities 2973166
* registry in package-lock 9a7c458
* **workflows:** no node 14 support 17b146c
* **workflows:** update setup-node to v2 edbcbe8
