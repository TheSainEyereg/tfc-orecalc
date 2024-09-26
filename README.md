# TerraFirma ore calculator

Calculator for calculating optimal combination of ores in TerraFirmaCraft originally created to try out Tailwind and Flolwbite

## Building and running from source
#### Building steps
1. [Download and install NodeJS 20 or higher](https://nodejs.org/en/download)
0. Open terminal (*sh/cmd/powershell)
0. Install yarn: run `npm i -g yarn` 
0. [Download repo as ZIP](https://github.com/TheSainEyereg/tfc-orecalc/archive/refs/heads/master.zip) and unpack it or if you have [git](https://git-scm.com/downloads) installed run `git clone https://github.com/TheSainEyereg/tfc-orecalc.git`
0. Open terminal in the project's directory or run `cd tfc-orecalc` if you cloned repo in previous step
0. Install dependencies and build: run `yarn` and after that `yarn build`
#### Running with simple python web server
1. [Download and install Python](https://www.python.org/downloads/)
0. Open terminal in the `build` folder or run `cd build` from project's directory
0. Run `python3 -m http.server`
0. Navigate to [localhost:8000](http://localhost:8000/) in your browser and enjoy