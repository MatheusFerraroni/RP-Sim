# RP-Sim: Radio Propagation Simulator

RP-Sim is a completly free environment for simulate the propagation of wireless communication. Our goal with this project is allow students, teachers, researchers and companies better undestand radio propagation models e better plan the deployment of antennas.



<p align="center">
  <img src="./Samples/rp-sim_rssi.PNG" alt="rssi" width="738">
</p>


Access the demo here! [Live demo](https://matheusferraroni.github.io/RP-Sim/)


## Requirements

Browser :earth_americas:

## Functionalities


* Calculate received RSSI
* Calculate Bit Error Rate
* Export areas that can communicate with any antenna
* Many propagation models to be used


## Propagation Models

There are already many propagation models ready to be used 

- For no obstacles
    - :white_check_mark: SUI
    - :white_check_mark: Egli
    - :white_check_mark: Ericsson
    - :white_check_mark: Nakagami-m
    - :white_check_mark: Free Space
    - :white_check_mark: Okomura Hata
    - :white_check_mark: Two Ray Ground
    - :white_check_mark: Fixed Distance
- For obstacles
    - :white_check_mark: By distance on obstacles
- Cut on Signal
    - :white_check_mark: For cuts caused by obstacles


We plan to add some more but you can feel free to add your own!


### How to create new propagation model

It is really easy to add new propagation models to RP-Sim.

The file `assets/tool/ModelsPropagation.js` contains all propagation models

Here is a template used to implement the FreeSpace model. You can copy the code below, edit the class name, the calculate method and adjuste the popualteHTML method.

The `populateHTML()` is called on the constructor and it's function is insert the controls for this method in the right location for the user to be able to use it.

The `calculate()` method is called if this propagation model is enabled. It will always receive 3 parameters: distance on air, distance on obstacle and number of cuts caused by obstacles.

Inside this method you can decide how to use this parameters to calculate the RSSI.

There are 3 classes you can extend: PropagationOnAir, PropagationObstacle and PropagationCut. They are choosen based on what information the propagation model use.


    class PropagationOnAir_FreeSpace extends PropagationOnAir {
        constructor(supressHtml=false){
            super()

            this.tipo = "freespace"
            this.tipoCalculoDistancia = 1
            if(!supressHtml){
                this.populateHTML()
            }
        }

        populateHTML(){
        }

        calculate(dist_out, dist_ins, amt_walls){
            let dist = null;
            if(this.tipoCalculoDistancia==1){
                dist = (dist_out)/1000 // kilometers
            }else if(this.tipoCalculoDistancia==2){
                dist = (dist_out+dist_ins)/1000 // kilometers
            }

            let F = -(20*Math.log10(dist)+20*Math.log10(SD.getFrequencyMhz())+32.44-SD.gtx-SD.grx)
            return F
        }
    }

## Available Modulations

The available modulation on the simulator are:

- :white_check_mark: BSPK, QPSK
- :white_check_mark: 8PSK
- :white_check_mark: 16PSK
- :white_check_mark: 4QAM
- :white_check_mark: 16QAM
- :white_check_mark: 64QAM

If you need to add a new one you can just edit the function `snr_ber` on `assets/tool/ModelsPropagation.js`. The only parameter received on this function is the RSSI.


## Configuration

There are a lot of configuration that can be usefull while using RP-sim!

Some more general configuration

<p align="center">
  <img src="./Samples/config_env.PNG" width="738">
</p>


Configuration related to the communication

<p align="center">
  <img src="./Samples/config_com.PNG" width="738">
</p>

Configuration related to the antennas

<p align="center">
  <img src="./Samples/config_ant.PNG" width="738">
</p>

Configurations related to the buildings

<p align="center">
  <img src="./Samples/config_build.PNG" width="738">
</p>

Configuration and control of the propagation models

<p align="center">
  <img src="./Samples/config_models.PNG" width="738">
</p>


## How to use it

You can watch this quick video of how to use it :grinning: or you can read the tutorial below the video!
<a href="http://www.youtube.com/watch?feature=player_embedded&v=z59Plq7Yw34" target="_blank"><img src="http://img.youtube.com/vi/z59Plq7Yw34/0.jpg" alt="RP-Sim" width="720" border="10" /></a>


### Step by step of how to use it

1. Clone the repository or download the zip
2. Extract somewhere (Normally this work better if you are using a web development environment and extract in their folder to access from the browser (They need to be running..))
3. Access RP-Sim typing the folder on the browser (Or localhost/RP-Sim if you are using a web development environment)
(The version on github is shipped with 2 datasets you can use to test the tool!)
4. Click on config buildings on the right menu
5. Click on "Browse" and select the file `data/sp_buildings.geojson` and click on "Update".
6. Click on config antenna on the right menu
7. Click on "Browse" and select the file `data/sp_antenna.geojson` and click on "Update".
8. You can play with the configurations of "Environment" and "Communication", but we sugest that you leave this as it is for the first run. So you can known the tool once you change it
9. Click on calculate. Wait for a few seconds as the proccess is being done. This changes according with the zoom that you are using. More zoom means more granularity and slower processing
10. Now you have a beatiful and colorfull map! Don't change the zoom and change the transmission power on the settings of communication
11. Click on calculate again. If you you didn't change the zoom the processing now is really faster! The heavy processing is cached for each zoom 
12. Click on "View" and "BER". Now the map change the colors and you can see the bit error rate estimated for each location
13. You can click on "Environment" and change the value of "Noise Figure" and click on "Communication" and change the "Modulation". This will let you see easier this metric
14. Click on "Export" and "Communication Area"
15. Change the values for each area and click on export
16. You've done almost everything cool! You can explore the rest now