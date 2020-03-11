

var MersenneTwister = function(seed) {
    // https://gist.github.com/banksean/300494
  if (seed == undefined) {
    seed = new Date().getTime();
  } 
  /* Period parameters */  
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;   /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
 
  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

  this.init_genrand(seed);
}  

 
/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
  this.mt[0] = s >>> 0;
  for (this.mti=1; this.mti<this.N; this.mti++) {
      var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
   this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
  + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
  }
}
 
/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
  var i, j, k;
  this.init_genrand(19650218);
  i=1; j=0;
  k = (this.N>key_length ? this.N : key_length);
  for (; k; k--) {
    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
      + init_key[j] + j; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++; j++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
    if (j>=key_length) j=0;
  }
  for (k=this.N-1; k; k--) {
    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
      - i; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
  }

  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
}
 
/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) { /* generate N words at one time */
    var kk;

    if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
      this.init_genrand(5489); /* a default initial seed is used */

    for (kk=0;kk<this.N-this.M;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (;kk<this.N-1;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
    this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
}
 
/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
  return (this.genrand_int32()>>>1);
}
 
/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
  return this.genrand_int32()*(1.0/4294967295.0); 
  /* divided by 2^32-1 */ 
}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
  return this.genrand_int32()*(1.0/4294967296.0); 
  /* divided by 2^32 */
}
 
/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0); 
  /* divided by 2^32 */
}
 
/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() { 
  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6; 
  return(a*67108864.0+b)*(1.0/9007199254740992.0); 
} 







var merTwi = new MersenneTwister();

var DEFAULT_SYSTEM_LOSS = 1.0






var DEFAULT_NAKAGAMI_M0 = 1.50
var DEFAULT_NAKAGAMI_M1 = 0.75
var DEFAULT_NAKAGAMI_M2 = 0.75
var DEFAULT_NAKAGAMI_D0_M =  80
var DEFAULT_NAKAGAMI_D1_M = 200


function friis(lambda, l, d){
    // let DEFAULT_TX_POWER = 0.1 /* Watt */
    let DEFAULT_TX_POWER = SD.getPtxWatt()
    let gtx = SD.gtx //SD.dbm_to_watt(SD.gtx)
    let grx = SD.grx //SD.dbm_to_watt(SD.grx)
        /*
         * Friis free space equation:
         *
         *       Pt * Gt * Gr * (lambda^2)
         *   P = --------------------------
         *       (4 * pi * d)^2 * L
         */
  let m = lambda / (4 * Math.PI * d);
  return (DEFAULT_TX_POWER * gtx * grx * (m * m)) / l;
}




function calc_three_log_distance(node_distance){
    let rx_power_dbm = null
    // let path_loss_d = null
    let wave_length = null
    let rxc = null
    let reference_lost = null
    let path_loss_db = null

    let DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_1 = 1.0
    let DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE = 1.0
    let DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_2 = 200.0
    let DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_3 = 500.0
    let DEFAULT_THREE_LOG_DISTANCE_EXPONENT_1 = 1.9
    let DEFAULT_THREE_LOG_DISTANCE_EXPONENT_2 = 3.8
    let DEFAULT_THREE_LOG_DISTANCE_EXPONENT_3 = 3.8

    wave_length = SD.calc_wave_length();

    rx_power_dbm = friis(wave_length,
                    DEFAULT_SYSTEM_LOSS,
                    node_distance);


    // console.log("#",wave_length, DEFAULT_SYSTEM_LOSS, node_distance, " = ", rx_power_dbm)

    if (node_distance < DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_1) {
        return rx_power_dbm;
    }

    /* calculate reference lost */
    reference_lost = friis(wave_length,
                    DEFAULT_SYSTEM_LOSS,
                    DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE);

    // console.log("@", wave_length, DEFAULT_SYSTEM_LOSS, DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE, " = ", reference_lost)

    if (node_distance < DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_2) {

        path_loss_db = 10 * DEFAULT_THREE_LOG_DISTANCE_EXPONENT_1 *
                Math.log10(node_distance / DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_1);

    } else if (node_distance < DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_3) {

        path_loss_db =
            10 * DEFAULT_THREE_LOG_DISTANCE_EXPONENT_1 *
                Math.log10(DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_2 / DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_1) +
            10 * DEFAULT_THREE_LOG_DISTANCE_EXPONENT_2 *
                Math.log10(node_distance /  DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_2);

    } else { /* broader away then distance_3 */
        path_loss_db =
            10 * DEFAULT_THREE_LOG_DISTANCE_EXPONENT_1 *
                Math.log10(DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_2 / DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_1) +
            10 * DEFAULT_THREE_LOG_DISTANCE_EXPONENT_2 *
                Math.log10(DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_3 /  DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_2) +
            10 * DEFAULT_THREE_LOG_DISTANCE_EXPONENT_3 *
                Math.log10(node_distance /  DEFAULT_THREE_LOG_DISTANCE_REFERENCE_DISTANCE_3);
    }

    rxc = - reference_lost - path_loss_db;

    return rx_power_dbm + rxc;
}



function snr_ber(received_dbw){
    let ret = {}
    let t_kelvin = SD.temperature + 273               

    let No_zero = 10*Math.log10(math.boltzmann.value)
    let No = 10*Math.log10(math.boltzmann.value) + 10*Math.log10(t_kelvin)



    let BW = SD.getFrequencyHz()
    BW = SD.getFrequencyChannelHz()
    let Pn = No + SD.noise_figure + 10*Math.log10(BW)

    ret["noise_power_dBW"] = Pn


    // let free = 20*Math.log10(dist)+20*Math.log10(SD.getFrequencyMhz())+32.45
    // let PRx_dBw = SD.getPtxWatt() +  SD.gtx + SD.grx - free
    let PRx_dBw = received_dbw
    let SNR =  PRx_dBw - Pn
    let SNR_vezes = SD.dB_vezes(SNR)
    ret["snr_dB"] = SNR
    ret["snr_vezes"] = SNR_vezes




    let BR =  (BW*math.log(1+SNR,2))/1000000 //Mbps
    ret["shannon_limit_Mbps"] = BR

    let Pe_BPSK = 0.5*(1-math.erf(math.sqrt(SNR_vezes)))
    ret["Pe_BPSK"] = Pe_BPSK

    let M=8
    let Pe_8PSK = (1/math.log(M,2))*(1-math.erf(math.sqrt(SNR_vezes*math.log(M,2))*math.sin(math.pi/M)))
    ret["Pe_8PSK"] = Pe_8PSK

    M=16
    Pe_16PSK = (1/math.log(M,2))*(1-math.erf(math.sqrt(SNR_vezes*math.log(M,2))*math.sin(math.pi/M)))
    ret["Pe_16PSK"] = Pe_16PSK




    M=4
    Pe_4QAM = (float(1)/2)*(1-math.erf(math.sqrt(SNR_vezes)))
    ret["Pe_4QAM"] = Pe_4QAM

    M=16
    Pe_16QAM = (float(3)/8)*(1-math.erf(math.sqrt((float(2)/5)*SNR_vezes)))
    ret["Pe_16QAM"] = Pe_16QAM

    M=64
    Pe_64QAM = (float(7)/24)*(1-math.erf(math.sqrt((float(1)/7)*SNR_vezes)))
    ret["Pe_64QAM"] = Pe_64QAM

    return ret
}


class BasePropagationModel{
    constructor(){
        this.tipo = null
    }


    calculate(dist_out, dist_ins, amt_walls){
        throw "NOT IMPLEMENTED"
    }
}

    class PropagationOnAir extends BasePropagationModel {
        constructor(){
            super()
            this.tipo = "on_air"
        }

    }

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
                let ne = "\
                    <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">FreeSpace</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"freespace\" checked>\
                                <label class=\"form-check-label badge badge-success chkbox_enable_propagation\" id=\"freespace_label\">\
                                    Enabled\
                                </label>\
                            </small>\
                        </div>\
                        \
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Total distance calculation\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"freespace_distance_calculation\" value=\"1\" checked>\
                                    <label class=\"form-check-label\" for=\"freespace_distance_calculation\">\
                                        Total Distance = Distance on air\
                                    </label>\
                                </div>\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"freespace_distance_calculation\" value=\"2\">\
                                    <label class=\"form-check-label\" for=\"freespace_distance_calculation\">\
                                        Total Distance = Distance on air + Distance on obstacle\
                                    </label>\
                                </div>\
                            </div>\
                        </div>\
                    </a>"

                $("#holder_list_propagation_openair").append(ne)

                let dis = this;
                $('input[name="freespace_distance_calculation"]').change(function(e){
                    let v = int($('input[name="freespace_distance_calculation"]:checked').val())
                    dis.tipoCalculoDistancia = v
                })
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



        class PropagationOnAir_OkomuraHata extends PropagationOnAir {
            constructor(supressHtml=false){
                super()

                this.tipo = "okomurahata"
                this.tipoCalculoDistancia = 1
                this.type_scenery = 1
                if(!supressHtml){
                    this.populateHTML()
                }
            }

            populateHTML(){

                let ne = "\
                <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">Okomura Hata</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"okomurahata\">\
                                <label class=\"form-check-label badge badge-danger chkbox_enable_propagation\" id=\"okomurahata_label\">\
                                    Disabled\
                                </label>\
                            </small>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Total distance calculation\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"okomurahata_distance_calculation\" value=\"1\" checked>\
                                    <label class=\"form-check-label\" for=\"okomurahata_distance_calculation\">\
                                        Total Distance = Distance on air\
                                    </label>\
                                </div>\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"okomurahata_distance_calculation\" value=\"2\">\
                                    <label class=\"form-check-label\" for=\"okomurahata_distance_calculation\">\
                                        Total Distance = Distance on air + Distance on obstacle\
                                    </label>\
                                </div>\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Scenario Type\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <select class=\"form-control\" id=\"select_okomurahata\">\
                                    <option value=\"1\">Urban Scenario</option>\
                                    <option value=\"2\">Suburban Scenario</option>\
                                    <option value=\"3\">Rural Scenario</option>\
                                </select>\
                            </div>\
                        </div>\
                    </a>"

                $("#holder_list_propagation_openair").append(ne)

                let dis = this;
                $('input[name="okomurahata_distance_calculation"]').change(function(e){
                    let v = int($('input[name="okomurahata_distance_calculation"]:checked').val())
                    dis.tipoCalculoDistancia = v
                })

                $("#select_okomurahata").change(function(){
                    dis.type_scenery = int($("#select_okomurahata").val())
                })
            }

            calculate(dist_out, dist_ins, amt_walls){

                let dist_total = null;
                if(this.tipoCalculoDistancia==1){
                    dist_total = (dist_out) // kilometers
                }else if(this.tipoCalculoDistancia==2){
                    dist_total = (dist_out+dist_ins) // kilometers
                }

                let a0=0
                let a1=0
                let a2=12
                let a3=0.1
                if (this.type_scenery==1){
                   a0=36.2
                   a1=30.2
                }else if(this.type_scenery==2){
                   a0=43.2
                   a1=68.93
                }else if(this.type_scenery==3){
                   a0=45.95
                   a1=100.6
                }


                dist_total /= 1000

                let hRx_correlation = (1.1*Math.log10(SD.frequency)-0.7)*SD.rx_antenna_height-(1.56*Math.log10(SD.frequency)-0.8)
                let hata = 69.55 + 26.16*Math.log10(SD.frequency)-13.82*Math.log10(SD.tx_antenna_height)-hRx_correlation+Math.log10(dist_total)*(44.9-6.55*Math.log10(SD.rx_antenna_height))
                hata = -hata
                return hata
            }
        }


        class PropagationOnAir_Ericsson extends PropagationOnAir {
            constructor(supressHtml=false){
                super()

                this.tipo = "ericsson"
                this.tipoCalculoDistancia = 1
                if(!supressHtml){
                    this.populateHTML()
                }
            }

            populateHTML(){

                let ne = "\
                    <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">Ericsson</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"ericsson\">\
                                <label class=\"form-check-label badge badge-danger chkbox_enable_propagation\" id=\"ericsson_label\">\
                                    Disabled\
                                </label>\
                            </small>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Total distance calculation\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"ericsson_distance_calculation\" value=\"1\" checked>\
                                    <label class=\"form-check-label\" for=\"ericsson_distance_calculation\">\
                                        Total Distance = Distance on air\
                                    </label>\
                                </div>\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"ericsson_distance_calculation\" value=\"2\">\
                                    <label class=\"form-check-label\" for=\"ericsson_distance_calculation\">\
                                        Total Distance = Distance on air + Distance on obstacle\
                                    </label>\
                                </div>\
                            </div>\
                        </div>\
                    </a>"

                $("#holder_list_propagation_openair").append(ne)

                let dis = this;
                $('input[name="ericsson_distance_calculation"]').change(function(e){
                    let v = int($('input[name="ericsson_distance_calculation"]:checked').val())
                    dis.tipoCalculoDistancia = v
                })
            }

            calculate(dist_out, dist_ins, amt_walls){
                let dist_total = null;
                if(this.tipoCalculoDistancia==1){
                    dist_total = (dist_out)/1000 // kilometers
                }else if(this.tipoCalculoDistancia==2){
                    dist_total = (dist_out+dist_ins)/1000 // kilometers
                }
                let scenario = 1
                let a0 = null
                let a1 = null
                let a2=12
                let a3=0.1
                if (scenario == 1){
                    a0=36.2
                    a1=30.2
                }else if (scenario == 2){
                    a0=43.2
                    a1=68.93
                }else if (scenario == 3){
                    a0=45.95
                    a1=100.6
                }


                let g = 44.49*Math.log10(SD.frequency)-4.78*((Math.log10(SD.frequency))**2)
                let ericsson = a0 + a1*Math.log10(dist_total) + a2*Math.log10(SD.tx_antenna_height) + a3*Math.log10(SD.tx_antenna_height)*Math.log10(dist_total)-3.2*((Math.log10(11.75*SD.rx_antenna_height))**2)+ g

                return -ericsson
            }
        }


        class PropagationOnAir_Egli extends PropagationOnAir {
            constructor(supressHtml=false){
                super()

                this.tipo = "egli"
                this.tipoCalculoDistancia = 1
                if(!supressHtml){
                    this.populateHTML()
                }
            }

            populateHTML(){

                let ne = "\
                    <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">Egli</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"egli\">\
                                <label class=\"form-check-label badge badge-danger chkbox_enable_propagation\" id=\"egli_label\">\
                                    Disabled\
                                </label>\
                            </small>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Total distance calculation\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"egli_distance_calculation\" value=\"1\" checked>\
                                    <label class=\"form-check-label\" for=\"egli_distance_calculation\">\
                                        Total Distance = Distance on air\
                                    </label>\
                                </div>\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"egli_distance_calculation\" value=\"2\">\
                                    <label class=\"form-check-label\" for=\"egli_distance_calculation\">\
                                        Total Distance = Distance on air + Distance on obstacle\
                                    </label>\
                                </div>\
                            </div>\
                        </div>\
                    </a>"


                $("#holder_list_propagation_openair").append(ne)

                let dis = this;
                $('input[name="egli_distance_calculation"]').change(function(e){
                    let v = int($('input[name="egli_distance_calculation"]:checked').val())
                    dis.tipoCalculoDistancia = v
                })
            }

            calculate(dist_out, dist_ins, amt_walls){
                let dist_total = null;
                if(this.tipoCalculoDistancia==1){
                    dist_total = (dist_out)/1000 // kilometers
                }else if(this.tipoCalculoDistancia==2){
                    dist_total = (dist_out+dist_ins)/1000 // kilometers
                }
                let loss = 139.1 - 20*Math.log10(SD.tx_antenna_height) + 40*Math.log10(dist_total)

                return -loss;
            }
        }


        class PropagationOnAir_SUI extends PropagationOnAir {
            constructor(supressHtml=false){
                super()

                this.tipo = "sui"
                this.tipoCalculoDistancia = 1
                if(!supressHtml){
                    this.populateHTML()
                }
            }

            populateHTML(){

                let ne = "\
                    <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">SUI</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"sui\">\
                                <label class=\"form-check-label badge badge-danger chkbox_enable_propagation\" id=\"sui_label\">\
                                    Disabled\
                                </label>\
                            </small>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Total distance calculation\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"sui_distance_calculation\" value=\"1\" checked>\
                                    <label class=\"form-check-label\" for=\"sui_distance_calculation\">\
                                        Total Distance = Distance on air\
                                    </label>\
                                </div>\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"sui_distance_calculation\" value=\"2\">\
                                    <label class=\"form-check-label\" for=\"sui_distance_calculation\">\
                                        Total Distance = Distance on air + Distance on obstacle\
                                    </label>\
                                </div>\
                            </div>\
                        </div>\
                    </a>"


                $("#holder_list_propagation_openair").append(ne)

                let dis = this;
                $('input[name="sui_distance_calculation"]').change(function(e){
                    let v = int($('input[name="sui_distance_calculation"]:checked').val())
                    dis.tipoCalculoDistancia = v
                })
            }

            calculate(dist_out, dist_ins, amt_walls){
                                                   

                let dist = null;
                if(this.tipoCalculoDistancia==1){
                    dist = (dist_out)/1000 // kilometers
                }else if(this.tipoCalculoDistancia==2){
                    dist = (dist_out+dist_ins)/1000 // kilometers
                }

                let scenario = 1
                let a=0
                let b=0
                let c=0
                // if(scenario == 1){ 
                   a=4.6
                   b=0.0075
                   c=12.6
               //  }else if(scenario == 2){
               //     a=4
               //     b=0.0065
               //     c=17.1
               //  }else if(scenario == 3){
               //     a=3.6
               //     b=0.005
               //     c=20
               // }

                let doo=100
                let lamda=(299792458)/SD.frequency // speed of light/f
                let A = 20*Math.log10((4*Math.PI*doo)/lamda)
                let r = a-b*SD.tx_antenna_height+(c/SD.tx_antenna_height)
                let Xf = 6*Math.log10((SD.frequency*1000*1000)/2000)
                let Xh =0
                let s = 8.2 // 8.2<s<10.6


                let SUI = -A + 10*r*Math.log10((dist*1000)/doo)+Xf+s
                return -SUI
            }
        }


        class PropagationOnAir_TwoRayGround extends PropagationOnAir {
            constructor(supressHtml=false){
                super()

                this.tipo = "tworayground"
                this.tipoCalculoDistancia = 1
                if(!supressHtml){
                    this.populateHTML()
                }
            }

            populateHTML(){

                let ne = "\
                    <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">TwoRayGround</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"tworayground\">\
                                <label class=\"form-check-label badge badge-danger chkbox_enable_propagation\" id=\"tworayground_label\">\
                                    Disabled\
                                </label>\
                            </small>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Total distance calculation\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"tworayground_distance_calculation\" value=\"1\" checked>\
                                    <label class=\"form-check-label\" for=\"tworayground_distance_calculation\">\
                                        Total Distance = Distance on air\
                                    </label>\
                                </div>\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"tworayground_distance_calculation\" value=\"2\">\
                                    <label class=\"form-check-label\" for=\"tworayground_distance_calculation\">\
                                        Total Distance = Distance on air + Distance on obstacle\
                                    </label>\
                                </div>\
                            </div>\
                        </div>\
                    </a>"
                $("#holder_list_propagation_openair").append(ne)

                let dis = this;
                $('input[name="tworayground_distance_calculation"]').change(function(e){
                    let v = int($('input[name="tworayground_distance_calculation"]:checked').val())
                    dis.tipoCalculoDistancia = v
                })
            }


            calculate(dist_out, dist_ins, amt_walls){

                let d = null;
                if(this.tipoCalculoDistancia==1){
                    d = (dist_out)/1000 // kilometers
                }else if(this.tipoCalculoDistancia==2){
                    d = (dist_out+dist_ins)/1000 // kilometers
                }


                let lamda = 299792458/SD.getFrequencyHz()

                let freeSpace_vezes = (4*Math.PI*d*1000)/lamda
                let freeSpace_dB = 20*Math.log10(freeSpace_vezes)

                let alfa=2.5 // Alfa=2 -> Equal to free space
                let freeSpaceEmp_vezes = (16*(Math.PI**2)*((d)**alfa))/(lamda**alfa)
                let freeSpaceEmp_dB = 10*Math.log10(freeSpaceEmp_vezes)

                let d_LOS = ((d)**2+(SD.tx_antenna_height+SD.rx_antenna_height)**2)**0.5
                let d_ref = ((d)**2+(SD.tx_antenna_height-SD.rx_antenna_height)**2)**0.5
                let dc = (4*Math.PI*SD.tx_antenna_height*SD.rx_antenna_height)/lamda 

                let omega = (2*Math.PI*(d_LOS-d_ref))/lamda
                let sin_teta_i = (SD.tx_antenna_height+SD.rx_antenna_height)/d_ref
                let cos_teta_i = d/d_ref
                let Er = 1.02
                let rc = (sin_teta_i - (Er-(cos_teta_i**2))**0.5)/(sin_teta_i + (Er-(cos_teta_i**2))**0.5) // reflection coefficient
                let absolute_value = abs(1+rc*(Math.E**omega))

                let TwoRayGround_vezes_1 = freeSpace_vezes/absolute_value
                let TwoRayGround_dB_1 = 20*Math.log10(TwoRayGround_vezes_1)

                let TwoRayGround_vezes_2 = ((d)**2)/(SD.tx_antenna_height*SD.rx_antenna_height)
                let TwoRayGround_dB_2 = 20*Math.log10(TwoRayGround_vezes_2)

                let TwoRayGround_final = null
                if(d<dc){
                    TwoRayGround_final=freeSpace_dB
                }else{
                    TwoRayGround_final=TwoRayGround_dB_1
                }
                return -TwoRayGround_final;
            }
        }

        class PropagationOnAir_Nakagamim extends PropagationOnAir {
            constructor(supressHtml=false){
                super()

                this.tipo = "nakagamim"
                this.tipoCalculoDistancia = 1

                this.frew = new PropagationOnAir_FreeSpace(true)
                if(!supressHtml){
                    this.populateHTML()
                }
            }

            populateHTML(){

                let ne = "\
                    <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">Nakagami-m</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"nakagamim\">\
                                <label class=\"form-check-label badge badge-danger chkbox_enable_propagation\" id=\"nakagamim_label\">\
                                    Disabled\
                                </label>\
                            </small>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Total distance calculation\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"nakagamim_distance_calculation\" value=\"1\" checked>\
                                    <label class=\"form-check-label\" for=\"nakagamim_distance_calculation\">\
                                        Total Distance = Distance on air\
                                    </label>\
                                </div>\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"nakagamim_distance_calculation\" value=\"2\">\
                                    <label class=\"form-check-label\" for=\"nakagamim_distance_calculation\">\
                                        Total Distance = Distance on air + Distance on obstacle\
                                    </label>\
                                </div>\
                            </div>\
                        </div>\
                    </a>"


                $("#holder_list_propagation_openair").append(ne)

                let dis = this;
                $('input[name="nakagamim_distance_calculation"]').change(function(e){
                    let v = int($('input[name="nakagamim_distance_calculation"]:checked').val())
                    dis.tipoCalculoDistancia = v
                })
            }

            calculate(dist_out, dist_ins, amt_walls){
                let f = this.frew.calculate(dist_out, dist_ins, amt_walls)



                let node_distance = null;
                if(this.tipoCalculoDistancia==1){
                    node_distance = (dist_out)
                }else if(this.tipoCalculoDistancia==2){
                    node_distance = (dist_out+dist_ins)
                }

                f = SD.dbm_to_watt(f);

                let m;
                if (node_distance <= DEFAULT_NAKAGAMI_D0_M)
                    m = DEFAULT_NAKAGAMI_M0;
                else if (node_distance <= DEFAULT_NAKAGAMI_D1_M)
                    m = DEFAULT_NAKAGAMI_M1;
                else
                    m = DEFAULT_NAKAGAMI_M2;

                f = jStat.gamma.sample( m, f / m);
                f = SD.watt_to_dbm(f)

                return f;
            }
        }



        // class PropagationOnAir_Cost231 extends PropagationOnAir {
        //     constructor(supressHtml=false){
        //         super()

        //         if(!supressHtml){
        //             this.enable = true
        //             this.configuracao_html = {"value":"cost231","name_display":"Cost231"}
        //             this.populateHTML()
        //         }
        //     }

        //     calculate(dist_out, dist_ins, amt_walls){
        //         let dist = (dist_out+dist_ins)/1000 // kilometers
        //         let A = 46.3 + 33.9*Math.log10(SD.frequency)-13.82*Math.log10(this.tx_antenna_height)
        //         let B = 44.9-6.55*Math.log10(this.tx_antenna_height)
        //         let ahRx = (1.1*Math.log10(SD.frequency)-0.7)*this.rx_antenna_height-(1.56*Math.log10(SD.frequency)-0.8)
        //         let C=3

        //         let cost231 = A + B*Math.log10(dist)+C-ahRx
        //         return -cost231
        //     }
        // }

        // class PropagationOnAir_SimplePathLoss extends PropagationOnAir {
        //     constructor(supressHtml=false){
        //         super()

        //         if(!supressHtml){
        //             this.enable = true
        //             this.configuracao_html = {"value":"simplepathloss","name_display":"SimplePathLoss"}
        //             this.populateHTML()
        //         }
        //     }

        //     calculate(dist_out, dist_ins, amt_walls){

        //         //# k = constant for a given environment
        //         let k = 10

        //         //# 2 < a < 4 
        //         //#a=2 //# For the free-space condition the
        //         let a=3
        //         //#a=4 //# For conductive terrain 


        //         //# 2 < y < 3
        //         //#y = 2 //# For suburban and rutal areas with f < 450 MHz
        //         let y = 3 //# For urban areas with f > 450 MHz.

        //         //# 1<x<2 
        //         let x=1 //# For hRx < 3m 
        //         //#x=2 //# For 3m < hRx < 10m

        //         let dist = (dist_out+dist_ins)/1000 // kilometers
        //         let simplePathLoss_vezes = (k*(this.tx_antenna_height**2)*(this.rx_antenna_height**x))/((dist**a)*(SD.frequency**y))
        //         let simplePathLoss_db = -1*( 10*Math.log10(simplePathLoss_vezes) )

        //         return -simplePathLoss_db
        //     }
        // }

        // class PropagationOnAir_PlanetEarth extends PropagationOnAir {
        //     constructor(supressHtml=false){
        //         super()

        //         this.tx_antenna_height = 30
        //         this.rx_antenna_height = 1.5
        //         if(!supressHtml){
        //             this.enable = true
        //             this.configuracao_html = {"value":"planetearth","name_display":"PlanetEarth"}
        //             this.populateHTML()
        //         }
        //     }

        //     calculate(dist_out, dist_ins, amt_walls){
        //         let dist = (dist_out+dist_ins) // kilometers
        //         let loss = 40*Math.log10(dist) - 20*Math.log10(this.tx_antenna_height*this.rx_antenna_height)
        //         return -loss-SD.gtx-SD.grx
        //     }
        // }




    class PropagationObstacle extends BasePropagationModel {
        constructor(){
            super()
            this.tipo = "obst"
        }

    }
        class PropagationObstacle_PerMeter extends PropagationObstacle {
            constructor(supressHtml=false){
                super()

                this.tipo = "dbpermeter"
                this.amt_per_db = 0.4
                this.tipoCalculoDistancia = 1
                if(!supressHtml){
                    this.populateHTML()
                }
            }

            populateHTML(){

                let ne = "\
                    <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">DB per meter</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"dbpermeter\" checked>\
                                <label class=\"form-check-label badge badge-success chkbox_enable_propagation\" id=\"dbpermeter_label\">\
                                    Enabled\
                                </label>\
                            </small>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Total distance calculation\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"dbpermeter_distance_calculation\" value=\"1\" checked>\
                                    <label class=\"form-check-label\" for=\"dbpermeter_distance_calculation\">\
                                        Total Distance = Distance on air\
                                    </label>\
                                </div>\
                                <div class=\"form-check\">\
                                    <input class=\"form-check-input\" type=\"radio\" name=\"dbpermeter_distance_calculation\" value=\"2\">\
                                    <label class=\"form-check-label\" for=\"dbpermeter_distance_calculation\">\
                                        Total Distance = Distance on air + Distance on obstacle\
                                    </label>\
                                </div>\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Amount of DB reduced by meter\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                <input type=\"number\" class=\"form-control\" value=\""+this.amt_per_db +"\" min=\"0\" max=\"100\" step=\"0.1\" id=\"input_amoutdbreducedbyobstacle\">\
                            </div>\
                        </div>\
                    </a>"

                $("#holder_list_propagation_obstacle").append(ne)

                let dis = this;
                $('input[name="dbpermeter_distance_calculation"]').change(function(e){
                    let v = int($('input[name="dbpermeter_distance_calculation"]:checked').val())
                    dis.tipoCalculoDistancia = v
                })
                $('input[id="input_amoutdbreducedbyobstacle"]').change(function(e){
                    let v = float($('input[id="input_amoutdbreducedbyobstacle"]').val())
                    dis.amt_per_db = v
                })


            }


            calculate(dist_out, dist_ins, amt_walls){
                let dist = null;
                if(this.tipoCalculoDistancia==1){
                    dist = (dist_ins) // kilometers
                }else if(this.tipoCalculoDistancia==2){
                    dist = (dist_out+dist_ins) // kilometers
                }
                return -(dist*this.amt_per_db)
            }
        }

    class PropagationCut extends BasePropagationModel {
        constructor(){
            super()
            this.tipo = "cut"
        }
    }

        class PropagationCut_Amt extends PropagationCut {
            constructor(supressHtml=false){
                super()

                this.tipo = "dbpercut"
                this.amt_per_corte = 9
                if(!supressHtml){
                    this.populateHTML()
                }
            }

            populateHTML(){

                let ne = "\
                    <a href=\"#\" class=\"list-group-item list-group-item-action flex-column align-items-start\">\
                        <div class=\"d-flex w-100 justify-content-between\">\
                            <h5 class=\"mb-1\">DB per cut</h5>\
                            <small>\
                                <input class=\"form-check-input input_enable_prop_model\" type=\"checkbox\" value=\"dbpercut\" checked>\
                                <label class=\"form-check-label badge badge-success chkbox_enable_propagation\" id=\"dbpercut_label\">\
                                    Enabled\
                                </label>\
                            </small>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                Amount of DB reduced per cut\
                            </div>\
                        </div>\
                        <div class=\"row\">\
                            <div class=\"col\">\
                                    <input type=\"number\" class=\"form-control\" value=\""+this.amt_per_corte+"\" min=\"0\" max=\"100\" step=\"0.1\" id=\"input_amoutdbreducedbycut\">\
                            </div>\
                        </div>\
                    </a> "


                $("#holder_list_cut").append(ne)

                let dis = this;
                $('input[id="input_amoutdbreducedbycut"]').change(function(e){
                    let v = float($('input[id="input_amoutdbreducedbycut"]').val())
                    dis.amt_per_corte = v
                })
            }

            calculate(dist_out, dist_ins, amt_walls){
                return -(amt_walls*this.amt_per_corte)
            }
        }



