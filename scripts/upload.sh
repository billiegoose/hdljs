#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
# Magic formula from this YouTube video: https://www.youtube.com/watch?v=P-9WCFi0p-0
cp scripts/constraints.pcf out/constraints.pcf
rm -rf out/lib
cp -R src/lib/verilog out/lib
docker run -v $(pwd)/out:/workdir dimdm/icetools yosys -p "read_verilog goboard.sv; synth_ice40 -blif goboard.blif"
docker run -v $(pwd)/out:/workdir dimdm/icetools arachne-pnr -d 1k -p constraints.pcf -P vq100 -o goboard.txt goboard.blif
docker run -v $(pwd)/out:/workdir dimdm/icetools icepack goboard.txt goboard.bin
iceprog out/goboard.bin
