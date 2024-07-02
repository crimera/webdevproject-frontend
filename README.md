# Prerequisites
## Building whisper.wasm (windows)

### Getting buildtools
- Use https://github.com/Data-Oriented-House/PortableBuildTools
- install cmake and ninja with `winget install cmake Ninja-build.Ninja`

### Setup emscripten
https://emscripten.org/docs/getting_started/downloads.html

**Notes**
- ***Emscripten requires python 3.6+***
- ***Use .ps1 scripts when on powershell or bat when on cmd***
```sh
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
./emsdk_env
```

### Building whisper.wasm
https://github.com/ggerganov/whisper.cpp/tree/master/examples/whisper.wasm

```sh
# source emdsk
# ./emsdk_env.ps1

# build using Emscripten
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
mkdir build-em && cd build-em
emcmake cmake ..
ninja

# copy binaries to .\public
cp .\bin\libmain.worker.js \path\to\public\
cp .\bin\whisper.wasm\main.js \path\to\public\
cp .\bin\whisper.wasm\helpers.js \path\to\public\
```

## Getting the models
- Download the models on https://ggml.ggerganov.com and place them on ./public
- Current code only has support for q5_1.bin models.

# Usage
```sh
git clone https://github.com/crimera/transcriptor
npm install
```

# Dev
```sh
npm run dev
```
