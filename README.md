# Multipaint

## Description

MultiPaint is a multi-user web application for real-time collaborative drawing.

### Key features:

- Co-drawing with other users
- Custom drawing settings
- Selecting design themes

### Technologies:

- HTML5
- Canvas API
- WebSockets
- WebStorage
- File API
- Geolocation API

## Set up

```
npm install
```

```
npm start
```

Open in browser:

```
http://localhost:8888
```

## Dependencies

Run command:

```
npm ls --all
```

Output:

```
├─┬ express@5.1.0
│ ├─┬ accepts@2.0.0
│ │ ├── mime-types@3.0.1 deduped
│ │ └── negotiator@1.0.0
│ ├─┬ body-parser@2.2.0
│ │ ├── bytes@3.1.2
│ │ ├── content-type@1.0.5 deduped
│ │ ├── debug@4.4.0 deduped
│ │ ├── http-errors@2.0.0 deduped
│ │ ├─┬ iconv-lite@0.6.3
│ │ │ └── safer-buffer@2.1.2
│ │ ├── on-finished@2.4.1 deduped
│ │ ├── qs@6.14.0 deduped
│ │ ├─┬ raw-body@3.0.0
│ │ │ ├── bytes@3.1.2 deduped
│ │ │ ├── http-errors@2.0.0 deduped
│ │ │ ├── iconv-lite@0.6.3 deduped
│ │ │ └── unpipe@1.0.0
│ │ └── type-is@2.0.1 deduped
│ ├─┬ content-disposition@1.0.0
│ │ └── safe-buffer@5.2.1
│ ├── content-type@1.0.5
│ ├── cookie-signature@1.2.2
│ ├── cookie@0.7.2
│ ├─┬ debug@4.4.0
│ │ └── ms@2.1.3
│ ├── encodeurl@2.0.0
│ ├── escape-html@1.0.3
│ ├── etag@1.8.1
│ ├─┬ finalhandler@2.1.0
│ │ ├── debug@4.4.0 deduped
│ │ ├── encodeurl@2.0.0 deduped
│ │ ├── escape-html@1.0.3 deduped
│ │ ├── on-finished@2.4.1 deduped
│ │ ├── parseurl@1.3.3 deduped
│ │ └── statuses@2.0.1 deduped
│ ├── fresh@2.0.0
│ ├─┬ http-errors@2.0.0
│ │ ├── depd@2.0.0
│ │ ├── inherits@2.0.4
│ │ ├── setprototypeof@1.2.0
│ │ ├── statuses@2.0.1 deduped
│ │ └── toidentifier@1.0.1
│ ├── merge-descriptors@2.0.0
│ ├─┬ mime-types@3.0.1
│ │ └── mime-db@1.54.0
│ ├─┬ on-finished@2.4.1
│ │ └── ee-first@1.1.1
│ ├─┬ once@1.4.0
│ │ └── wrappy@1.0.2
│ ├── parseurl@1.3.3
│ ├─┬ proxy-addr@2.0.7
│ │ ├── forwarded@0.2.0
│ │ └── ipaddr.js@1.9.1
│ ├─┬ qs@6.14.0
│ │ └─┬ side-channel@1.1.0
│ │   ├── es-errors@1.3.0
│ │   ├── object-inspect@1.13.4
│ │   ├─┬ side-channel-list@1.0.0
│ │   │ ├── es-errors@1.3.0 deduped
│ │   │ └── object-inspect@1.13.4 deduped
│ │   ├─┬ side-channel-map@1.0.1
│ │   │ ├─┬ call-bound@1.0.4
│ │   │ │ ├─┬ call-bind-apply-helpers@1.0.2
│ │   │ │ │ ├── es-errors@1.3.0 deduped
│ │   │ │ │ └── function-bind@1.1.2 deduped
│ │   │ │ └── get-intrinsic@1.3.0 deduped
│ │   │ ├── es-errors@1.3.0 deduped
│ │   │ ├─┬ get-intrinsic@1.3.0
│ │   │ │ ├── call-bind-apply-helpers@1.0.2 deduped
│ │   │ │ ├── es-define-property@1.0.1
│ │   │ │ ├── es-errors@1.3.0 deduped
│ │   │ │ ├─┬ es-object-atoms@1.1.1
│ │   │ │ │ └── es-errors@1.3.0 deduped
│ │   │ │ ├── function-bind@1.1.2
│ │   │ │ ├─┬ get-proto@1.0.1
│ │   │ │ │ ├─┬ dunder-proto@1.0.1
│ │   │ │ │ │ ├── call-bind-apply-helpers@1.0.2 deduped
│ │   │ │ │ │ ├── es-errors@1.3.0 deduped
│ │   │ │ │ │ └── gopd@1.2.0 deduped
│ │   │ │ │ └── es-object-atoms@1.1.1 deduped
│ │   │ │ ├── gopd@1.2.0
│ │   │ │ ├── has-symbols@1.1.0
│ │   │ │ ├─┬ hasown@2.0.2
│ │   │ │ │ └── function-bind@1.1.2 deduped
│ │   │ │ └── math-intrinsics@1.1.0
│ │   │ └── object-inspect@1.13.4 deduped
│ │   └─┬ side-channel-weakmap@1.0.2
│ │     ├── call-bound@1.0.4 deduped
│ │     ├── es-errors@1.3.0 deduped
│ │     ├── get-intrinsic@1.3.0 deduped
│ │     ├── object-inspect@1.13.4 deduped
│ │     └── side-channel-map@1.0.1 deduped
│ ├── range-parser@1.2.1
│ ├─┬ router@2.2.0
│ │ ├── debug@4.4.0 deduped
│ │ ├── depd@2.0.0 deduped
│ │ ├── is-promise@4.0.0
│ │ ├── parseurl@1.3.3 deduped
│ │ └── path-to-regexp@8.2.0
│ ├─┬ send@1.2.0
│ │ ├── debug@4.4.0 deduped
│ │ ├── encodeurl@2.0.0 deduped
│ │ ├── escape-html@1.0.3 deduped
│ │ ├── etag@1.8.1 deduped
│ │ ├── fresh@2.0.0 deduped
│ │ ├── http-errors@2.0.0 deduped
│ │ ├── mime-types@3.0.1 deduped
│ │ ├── ms@2.1.3 deduped
│ │ ├── on-finished@2.4.1 deduped
│ │ ├── range-parser@1.2.1 deduped
│ │ └── statuses@2.0.1 deduped
│ ├─┬ serve-static@2.2.0
│ │ ├── encodeurl@2.0.0 deduped
│ │ ├── escape-html@1.0.3 deduped
│ │ ├── parseurl@1.3.3 deduped
│ │ └── send@1.2.0 deduped
│ ├── statuses@2.0.1
│ ├─┬ type-is@2.0.1
│ │ ├── content-type@1.0.5 deduped
│ │ ├── media-typer@1.1.0
│ │ └── mime-types@3.0.1 deduped
│ └── vary@1.1.2
├─┬ ol@10.5.0
│ ├── @types/rbush@4.0.0
│ ├── earcut@3.0.1
│ ├─┬ geotiff@2.1.3
│ │ ├── @petamoriken/float16@3.9.2
│ │ ├── lerc@3.0.0
│ │ ├── pako@2.1.0
│ │ ├── parse-headers@2.0.6
│ │ ├── quick-lru@6.1.2
│ │ ├── web-worker@1.5.0
│ │ ├── xml-utils@1.10.1
│ │ └── zstddec@0.1.0
│ ├─┬ pbf@4.0.1
│ │ └─┬ resolve-protobuf-schema@2.1.0
│ │   └── protocol-buffers-schema@3.6.0
│ └─┬ rbush@4.0.1
│   └── quickselect@3.0.0
└─┬ ws@8.18.1
  ├── UNMET OPTIONAL DEPENDENCY bufferutil@^4.0.1
  └── UNMET OPTIONAL DEPENDENCY utf-8-validate@>=5.0.2
```
