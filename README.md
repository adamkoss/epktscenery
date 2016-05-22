# EPKT Scenery

> Katowice-Pyrzowice Airport Scenery for X-Plane 10

## Installation 
If you have ever installed an additional scenery, the installation should be easy for you. Otherwise if it is your first time, follow steps.

#### First step
- Extract all folders (`EPKT`, `Custom Data`) from downloaded archive.

#### Second step - adding scenery files
- Put the `EPKT` folder into `Custom Scenery` folder (located in main X-Plane folder).

#### Third step - adding navigation files
- Open downloaded `Custom Data` folder (contains: `earth_nav.dat`, `earth_fix.dat`, `EPKT.txt`).
- Open default `Custom Data` folder (located in main X-Plane folder).
- Now, you have two possibilities:
    - If you don't have files in the default `Custom Data` folder yet - you should put `earth_nav.dat` and `earth_fix.dat` into this folder.
    - If you have already `earth_nav.dat` and `earth_fix.dat` files - edit* `EPKT.txt` file and:
        - copy the first part (with "FIX" header) and paste to `earth_fix.dat`,
        - copy the second part (with "NAV" header) and paste to `earth_nav.dat`.

**Windows users: use Wordpad, Notepad++ or Sublime instead of Notepad.*

### That's all! Have a nice flight!
