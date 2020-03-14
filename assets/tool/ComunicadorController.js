


//    SSSSSSSSSSSSSSS   iiii                                                          lllllll 
//  SS:::::::::::::::S i::::i                                                         l:::::l 
// S:::::SSSSSS::::::S  iiii                                                          l:::::l 
// S:::::S     SSSSSSS                                                                l:::::l 
// S:::::S            iiiiiii    ggggggggg   gggggnnnn  nnnnnnnn      aaaaaaaaaaaaa    l::::l 
// S:::::S            i:::::i   g:::::::::ggg::::gn:::nn::::::::nn    a::::::::::::a   l::::l 
//  S::::SSSS          i::::i  g:::::::::::::::::gn::::::::::::::nn   aaaaaaaaa:::::a  l::::l 
//   SS::::::SSSSS     i::::i g::::::ggggg::::::ggnn:::::::::::::::n           a::::a  l::::l 
//     SSS::::::::SS   i::::i g:::::g     g:::::g   n:::::nnnn:::::n    aaaaaaa:::::a  l::::l 
//        SSSSSS::::S  i::::i g:::::g     g:::::g   n::::n    n::::n  aa::::::::::::a  l::::l 
//             S:::::S i::::i g:::::g     g:::::g   n::::n    n::::n a::::aaaa::::::a  l::::l 
//             S:::::S i::::i g::::::g    g:::::g   n::::n    n::::na::::a    a:::::a  l::::l 
// SSSSSSS     S:::::Si::::::ig:::::::ggggg:::::g   n::::n    n::::na::::a    a:::::a l::::::l
// S::::::SSSSSS:::::Si::::::i g::::::::::::::::g   n::::n    n::::na:::::aaaa::::::a l::::::l
// S:::::::::::::::SS i::::::i  gg::::::::::::::g   n::::n    n::::n a::::::::::aa:::al::::::l
//  SSSSSSSSSSSSSSS   iiiiiiii    gggggggg::::::g   nnnnnn    nnnnnn  aaaaaaaaaa  aaaallllllll
//                                        g:::::g                                             
//                            gggggg      g:::::g                                             
//                            g:::::gg   gg:::::g                                             
//                             g::::::ggg:::::::g                                             
//                              gg:::::::::::::g                                              
//                                ggg::::::ggg                                                
//                                   gggggg                                                   

class Signal{
    constructor(){
        this.modules = []
        this.frequency = 5900 // in Mhz
        this.gtx = 0
        this.grx = 0
        this.ptx = 30
        this.tx_antenna_height = 20
        this.rx_antenna_height = 2
        this.frequency_channel = 10 // in Mhz
        this.temperature = 17
        this.noise_figure = 1

        this.modulation = "Pe_BPSK"
        this.modulation_str = "BPSK"

        this.signal_or_ber = 1

        this.propagation_models = {}
        let l = new PropagationOnAir_FreeSpace()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":true}
        l = new PropagationOnAir_OkomuraHata()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":false}
        l = new PropagationOnAir_Ericsson()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":false}
        l = new PropagationOnAir_Egli()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":false}
        l = new PropagationOnAir_SUI()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":false}
        l = new PropagationOnAir_TwoRayGround()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":false}
        l = new PropagationOnAir_Nakagamim()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":false}
        l = new PropagationOnAir_FixedDist()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":false}
        l = new PropagationObstacle_PerMeter()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":true}
        l = new PropagationCut_Amt()
        this.propagation_models[l.tipo] = {"modelo": l, "enable":true}



        this.setBindings()
        // this.pos = createVector(mouseX, mouseY)
    }

    getFrequencyGhz(){
        return this.frequency*10**3
    }

    getFrequencyMhz(){
        return this.frequency
    }
    getFrequencyKhz(){
        return this.frequency*10*3
    }
    getFrequencyHz(){
        return this.frequency*10**6
    }
    getFrequencyChannelHz(){
        return this.frequency_channel*10**6
    }
    dB_vezes(x){
        return 10**(x/10.0)
    }

    vezes_dB(x){
        return 10*math.log10(x)
    }

    calc_wave_length(){
        return 299792458.0 / this.getFrequencyHz() // speed of light / frequency
    }

    dbm_to_watt(dbm){
        return dbm-30
    }

    watt_to_dbm(watt){
        return Math.log10(watt * 1000.0) * 10.0
    }

    getPtxDBM(){
        return this.ptx
    }

    getPtxWatt(){
        return this.dbm_to_watt(this.ptx)
    }

    updateFrequency(p){
        this.frequency = p
        $("#frequency_main_label").html(this.frequency)
        $("#frequency_display").html(this.frequency)

    }

    updateGtx(p){
        this.gtx = p
        $("#gtx_main_label").html(this.gtx)
        $("#transmission_gain_display").html(this.gtx)
    }

    updatePtx(p){
        this.ptx = p
        $("#ptx_main_label").html(this.ptx)
        $("#transmission_power_display").html(this.ptx)
    }


    updateGrx(p){
        this.grx = p
        $("#grx_main_label").html(this.grx)
        $("#reception_gain_display").html(this.grx)
    }

    updateTxHeight(p){
        this.tx_antenna_height = p

        $("#transmission_heiht_main_disp").html(this.tx_antenna_height)
        $("#tranmission_height_display").html(this.tx_antenna_height)
    }
    
    updateRxHeight(p){
        this.rx_antenna_height = p

        $("#receiver_height_display").html(this.rx_antenna_height)
        $("#receiver_height_main_display").html(this.rx_antenna_height)
    }

    updateTemperature(p){
        this.temperature = p
        $("#temperature_display").html(this.temperature)
        $("#temperature_main_disp").html(this.temperature)
    }
    
    updateNoiseFigure(p){
        this.noise_figure = p

        $("#noise_figure_main_display").html(this.noise_figure)
        $("#noise_figure_display").html(this.noise_figure)
        if(localComunicadorC!=null){
            localComunicadorC.locals[myMap.getZoom()].map(function(e){ e.recalc_snr()})
        }
    }

    updateFrequencyChannel(p){
        this.frequency_channel = p

        $("#frequency_channel_main_label").html(this.frequency_channel)
        $("#frequency_channel_display").html(this.frequency_channel)
    }


    updateModulation(p){
        this.modulation = p
        this.modulation_str = $('#select_modulation').find(":selected").text()
        $("#modulation_main_label").html(this.modulation_str)
    }

    changeSignalBer(){
        if(this.signal_or_ber==1){
            this.signal_or_ber = 2
            $("#signal_or_ber").html("Signal")
        }else{
            this.signal_or_ber = 1
            $("#signal_or_ber").html("BER")
        }

        let dis = this
        localComunicadorC.locals[myMap.getZoom()].map(function(e){e.draw_type=dis.signal_or_ber})
    }

    setBindings(){
        this.updateFrequency(this.frequency)
        this.updateGtx(this.gtx)
        this.updatePtx(this.ptx)
        this.updateGrx(this.grx) 
        this.updateFrequencyChannel(this.frequency_channel)
        this.updateModulation(this.modulation)
        this.updateNoiseFigure(this.noise_figure)

        $("#tranmission_height_range").val(this.tx_antenna_height)
        this.updateTxHeight(this.tx_antenna_height)

        $("#receiver_height_range").val(this.rx_antenna_height)
        this.updateRxHeight(this.rx_antenna_height)

        $("#temperature_range").val(this.temperature)
        this.updateTemperature(this.temperature)

        $("#noise_figure_range").val(this.noise_figure)
        this.updateNoiseFigure(this.noise_figure)


        let dis = this;
        $(document).on('input change', '#frequency_range', function(e) { 
            let v = int(e.target.value)
            dis.updateFrequency(v)
        })
        $(document).on('input change', '#frequency_channel_range', function(e) { 
            let v = int(e.target.value)
            dis.updateFrequencyChannel(v)
        })
        $(document).on('input change', '#transmission_power_range', function(e) { 
            let v = int(e.target.value)
            dis.updatePtx(v)
        })
        $(document).on('input change', '#transmission_gain_range', function(e) { 
            let v = int(e.target.value)
            dis.updateGtx(v)
        })
        $(document).on('input change', '#reception_gain_range', function(e) { 
            let v = int(e.target.value)
            dis.updateGrx(v)
        })



        $(document).on('input change', '#temperature_range', function(e) { 
            let v = int(e.target.value)
            dis.updateTemperature(v)
        })

        $(document).on('input change', '#noise_figure_range', function(e) { 
            let v = int(e.target.value)
            dis.updateNoiseFigure(v)
        })
        $(document).on('input change', '#receiver_height_range', function(e) { 
            let v = int(e.target.value)
            dis.updateRxHeight(v)
        })
        $(document).on('input change', '#tranmission_height_range', function(e) { 
            let v = int(e.target.value)
            dis.updateTxHeight(v)
        })


        $(document).on('change', '#select_modulation', function(e) {
            dis.updateModulation(e.target.value)
        })


        $(document).on('click', '#signal_or_ber', function(e) {
            dis.changeSignalBer()
        });


        // if(typeof myMap!="undefined" && myMap!=null){
            // let zoomAtual = myMap.getZoom()
        //     if(localComunicadorC.locals[zoomAtual].length>0){
        //         if(localComunicadorC.locals[zoomAtual][0].distancias[antennaC.antennas[0].idd]!=null){
        //             comunicadorController.run()
        //         }
        //     }
        // }
    }

    getDegradation(dist_fora, dist_dentro, quantidade_walls){

        let degradacao = 0
        for(let propertyName in this.propagation_models) {
            if (this.propagation_models[propertyName].enable){
                degradacao += this.propagation_models[propertyName]["modelo"].calculate(dist_fora, dist_dentro, quantidade_walls)
            }
        }


        return degradacao
    }

    updatePropagation(type, status){
        this.propagation_models[type].enable = status
    }
}











                                                                                                                                                                                                                                                                                                    

                                                               
                                                               
// RRRRRRRRRRRRRRRRR                                              
// R::::::::::::::::R                                             
// R::::::RRRRRR:::::R                                            
// RR:::::R     R:::::R                                           
//   R::::R     R:::::R  aaaaaaaaaaaaa   yyyyyyy           yyyyyyy
//   R::::R     R:::::R  a::::::::::::a   y:::::y         y:::::y 
//   R::::RRRRRR:::::R   aaaaaaaaa:::::a   y:::::y       y:::::y  
//   R:::::::::::::RR             a::::a    y:::::y     y:::::y   
//   R::::RRRRRR:::::R     aaaaaaa:::::a     y:::::y   y:::::y    
//   R::::R     R:::::R  aa::::::::::::a      y:::::y y:::::y     
//   R::::R     R:::::R a::::aaaa::::::a       y:::::y:::::y      
//   R::::R     R:::::Ra::::a    a:::::a        y:::::::::y       
// RR:::::R     R:::::Ra::::a    a:::::a         y:::::::y        
// R::::::R     R:::::Ra:::::aaaa::::::a          y:::::y         
// R::::::R     R:::::R a::::::::::aa:::a        y:::::y          
// RRRRRRRR     RRRRRRR  aaaaaaaaaa  aaaa       y:::::y           
//                                             y:::::y            
//                                            y:::::y             
//                                           y:::::y              
//                                          y:::::y               
//                                         yyyyyyy                

class Ray{
    interLine2Line(p1,p2,p3,p4){
        let x1 = p1.x;
        let y1 = p1.y;
        let x2 = p2.x;
        let y2 = p2.y;
        let x3 = p3.x;
        let y3 = p3.y;
        let x4 = p4.x;
        let y4 = p4.y;

        let bx = x2 - x1;
        let by = y2 - y1;
        let dx = x4 - x3;
        let dy = y4 - y3;

        let b_dot_d_perp = bx * dy - by * dx;

        if(b_dot_d_perp == 0) return null;

        let cx = x3 - x1;
        let cy = y3 - y1;

        let t = (cx * dy - cy * dx) / b_dot_d_perp;
        if(t < 0 || t > 1) return null;

        let u = (cx * by - cy * bx) / b_dot_d_perp;
        if(u < 0 || u > 1) return null;

        return createVector(x1+t*bx, y1+t*by)
    }

  




    communicate(antena, local){
        
        let dists = local.getDistance(antena)
        local.checkCommunication(dists)
    }
}





        // comunicadorController.run()
class ComunicadorController{

    constructor(){
        this.raio = new Ray()

        this.gradienteColor = null;
        this.area_comunicacao = {}

        this.show_comm = false
        this.resetSinal()
    }

    resetSinal(){
        this.niveis_sinal = []
        let start = 10
        let end = -120
        let step = 10

        for(let i=start;i>=end;i-=step){
            this.niveis_sinal.push({"total":0,"value":i})
        }
    }

    run(){

        if(this.gradienteColor==null){
            this.gradienteColor = new LocalComunicar({"lat":0,"lng":0}).getGradiente().map(function(e){return "rgba("+str(e[1][0])+","+str(e[1][1])+","+str(e[1][2])+", 0.9)"  }).reverse()
        }

        this.resetSinal()


        let zoomAtual = myMap.getZoom()
        if(localComunicadorC.locals[zoomAtual][localComunicadorC.locals[zoomAtual].length-1].distancias[antennaC.antennas[0].idd]==null){
            this.slowRun()
        }else{
            this.fastRun()
        }

        // // console.log("download")
        // let dis = this;
        // setTimeout(function() {
        //     return function() {
        //         dis.computeAreasCoverage()
        //         // downloadFiler("fris"+antennaC.antennas[0].posWGS.x+"_"+antennaC.antennas[0].posWGS.y+".geojson",
        //         //     JSON.stringify({"px":antennaC.antennas[0].posWGS.x, "py":antennaC.antennas[0].posWGS.y, "cobertura":dis.area_comunicacao})
        //         //     )
        //     }
        // }(), 0);
    }

    compute_communication_area_singlerun(){
        let zoomAtual = myMap.getZoom()
        let good = int($("#export_com_area_input_good").val())
        let mid = int($("#export_com_area_input_mid").val())
        let bad = int($("#export_com_area_input_bad").val())


        var reader = new jsts.io.WKTReader()
        let z = myMap.getZoom()
        this.area_comunicacao[z] = {}
        this.area_comunicacao[z][bad] = this.computeAreasCoverageProcess(zoomAtual, bad, reader)
        this.area_comunicacao[z][mid] = this.computeAreasCoverageProcess(zoomAtual, mid, reader)
        this.area_comunicacao[z][good] = this.computeAreasCoverageProcess(zoomAtual, good, reader)
    }

    exportCommunicationArea(){
        
        
        
        let zoomAtual = myMap.getZoom()
        let good = int($("#export_com_area_input_good").val())
        let mid = int($("#export_com_area_input_mid").val())
        let bad = int($("#export_com_area_input_bad").val())


        var reader = new jsts.io.WKTReader()
        let z = myMap.getZoom()
        this.area_comunicacao[z] = {}
        this.area_comunicacao[z][bad] = this.computeAreasCoverageProcess(zoomAtual, bad, reader)
        this.area_comunicacao[z][mid] = this.computeAreasCoverageProcess(zoomAtual, mid, reader)
        this.area_comunicacao[z][good] = this.computeAreasCoverageProcess(zoomAtual, good, reader)



        let e = {  "type": "GeometryCollection",
                   "geometries": []
                }


        let ar_good = this.area_comunicacao[z][good]
        let ar_mid = this.area_comunicacao[z][mid]
        let ar_bad = this.area_comunicacao[z][bad]

        if(ar_good.pos_latlng.length>0){
            ar_good.pos_latlng.map(function(ee){
                return ee.push(ee[ee.length-1])
            })
            let f1 = { "type": "MultiPolygon",
                           "coordinates": [ar_good.pos_latlng.map(function(ee){
                                                                                                return ee.map(function(eee){
                                                                                                    return [eee.lng, eee.lat]
                                                                                                })
                                                                                            })]
                   }
            e["geometries"].push(f1)
        }
        if(ar_mid.pos_latlng.length>0){
            ar_mid.pos_latlng.map(function(ee){
                return ee.push(ee[ee.length-1])
            })
            let f2 = { "type": "MultiPolygon",
                           "coordinates": [ar_mid.pos_latlng.map(function(ee){
                                                                                                return ee.map(function(eee){
                                                                                                    return [eee.lng, eee.lat]
                                                                                                })
                                                                                            })]
                   }
            e["geometries"].push(f2)
        }
        if(ar_bad.pos_latlng.length>0){
            ar_bad.pos_latlng.map(function(ee){
                return ee.push(ee[ee.length-1])
            })
            let f3 = { "type": "MultiPolygon",
                           "coordinates": [ar_bad.pos_latlng.map(function(ee){
                                                                                                return ee.map(function(eee){
                                                                                                    return [eee.lng, eee.lat]
                                                                                                })
                                                                                            })]
                   }
            e["geometries"].push(f3)
        }

        for (let i=0;i<antennaC.antennas.length;i++){
            let ant = antennaC.antennas[i]
            let p = {
                "type": "Point", 
                "coordinates": [ant.posWGS.x, ant.posWGS.y]
            }
            e["geometries"].push(p)
        }

        e = JSON.stringify(e)
        downloadFiler("communication_area.geojson",e)
    }

    computeAreasCoverageProcess(zoom, sinalLevel, reader){

        let arr = []
        for(let i =0; i<localComunicadorC.locals[zoom].length;i++){
            if(localComunicadorC.locals[zoom][i].potencia_recepcao>=sinalLevel){
                arr.push(localComunicadorC.locals[zoom][i])
            }
        }

        var union_pol = null
        for(let i=0;i<arr.length;i++){

            let cellSize = int(arr[i].sizeCell/2)
            let c =                  'POLYGON (('+  (arr[i].posDisplay.x-cellSize)+' '+(arr[i].posDisplay.y+cellSize)+', '+
                                                    (arr[i].posDisplay.x+cellSize)+' '+(arr[i].posDisplay.y+cellSize)+', '+
                                                    (arr[i].posDisplay.x+cellSize)+' '+(arr[i].posDisplay.y-cellSize)+', '+
                                                    (arr[i].posDisplay.x-cellSize)+' '+(arr[i].posDisplay.y-cellSize)+', '+
                                                    (arr[i].posDisplay.x-cellSize)+' '+(arr[i].posDisplay.y+cellSize)+
                                                    '))'
            arr[i] = reader.read(c)
            arr[i] = arr[i].buffer(1)

            if(i==0){
                union_pol = arr[i]
            }else{
                union_pol = union_pol.union(arr[i])
            }
        }

        let ret = []
        if(union_pol!=null){
            if(typeof union_pol._geometries!="undefined"){
                for(let i=0; i<union_pol._geometries.length; i++){
                    ret.push(union_pol._geometries[i]._shell._points._coordinates)
                }
            }else if(union_pol._shell._points._coordinates.length>0){
                    ret.push(union_pol._shell._points._coordinates)
            }
        }


        ret = {"pos":ret, "pos_latlng": []}

        for (let i=0;i<ret["pos"].length;i++){
            let pol = ret["pos"][i]
            let ar = []
            for(let j=0; j<pol.length;j++){
                ar.push(myMap.fromPointToLatLng(pol[j].x , pol[j].y))
            }
            ret["pos_latlng"].push(ar)
        }

        return ret
    }

    updatePosicaoPoligonoComunicacao(){

        let zoomAtual = myMap.getZoom()

        if(typeof this.area_comunicacao[zoomAtual]=="undefined"){
            return
        }

        let good = int($("#export_com_area_input_good").val())
        let mid = int($("#export_com_area_input_mid").val())
        let bad = int($("#export_com_area_input_bad").val())

        for(let i=0;i<this.area_comunicacao[zoomAtual][bad]["pos_latlng"].length;i++){
            for(let j=0;j<this.area_comunicacao[zoomAtual][bad]["pos_latlng"][i].length;j++){
                this.area_comunicacao[zoomAtual][bad]["pos"][i][j] = myMap.fromLatLngtoPixel(this.area_comunicacao[zoomAtual][bad]["pos_latlng"][i][j])
            }
        }

        for(let i=0;i<this.area_comunicacao[zoomAtual][mid]["pos_latlng"].length;i++){
            for(let j=0;j<this.area_comunicacao[zoomAtual][mid]["pos_latlng"][i].length;j++){
                this.area_comunicacao[zoomAtual][mid]["pos"][i][j] = myMap.fromLatLngtoPixel(this.area_comunicacao[zoomAtual][mid]["pos_latlng"][i][j])
            }
        }

        for(let i=0;i<this.area_comunicacao[zoomAtual][good]["pos_latlng"].length;i++){
            for(let j=0;j<this.area_comunicacao[zoomAtual][good]["pos_latlng"][i].length;j++){
                this.area_comunicacao[zoomAtual][good]["pos"][i][j] = myMap.fromLatLngtoPixel(this.area_comunicacao[zoomAtual][good]["pos_latlng"][i][j])
            }
        }
    }

    slowRun(){

        let zoomAtual = myMap.getZoom()
        let dis = this
        mouseWheel = false
        for(let i=0;i<localComunicadorC.locals[zoomAtual].length;i++){

            setTimeout(function(i) {
                return function() {
                    if(mouseWheel)
                        return 0
                    let local = localComunicadorC.locals[zoomAtual][i]
                    local.clean()
                    for(let antena of antennaC.antennas){
                        dis.raio.communicate(antena,local)
                    }

                    let sinal = local.potencia_recepcao

                }
            }(i), 0);

        }


        setTimeout(function() {
            return function() {
                for(let i=0;i<localComunicadorC.locals[zoomAtual].length;i++){
                    let local = localComunicadorC.locals[zoomAtual][i]
                    let sinal = local.potencia_recepcao
                    for(let j=0;j<dis.niveis_sinal.length;j++){
                        if(sinal>dis.niveis_sinal[j].value){
                            dis.niveis_sinal[j].total += 1
                            break
                        }
                    }
                }

                $("#chart_holder").html("<canvas id=\"myChart\"></canvas>")
                var ctx = $('#myChart');

                let data_y = comunicadorController.niveis_sinal.map(function(e){ return str(e.value) })
                let data_x = comunicadorController.niveis_sinal.map(function(e){ return e.total })


                let m = data_x.reduce(function(a,b){ return a+b })
                data_x = data_x.map(function(e){return e/m})
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data_y,
                        datasets: [{
                            label: 'Signal Received',
                            data: data_x,
                            backgroundColor: dis.gradienteColor,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        animation: {
                            duration: 0
                        }
                    },
                });
            }
        }(),0)


        setTimeout(function() {
            return function() {
                if(dis.show_comm){
                    dis.compute_communication_area_singlerun()
                }
            }
        }(),0)


        setTimeout(function() {
            return function() {
                for(let i=0;i<localComunicadorC.locals[zoomAtual].length;i++){
                    let local = localComunicadorC.locals[zoomAtual][i]

                }
            }
        }(),0)
    }

    fastRun(){

        let zoomAtual = myMap.getZoom()
        for(let i=0;i<localComunicadorC.locals[zoomAtual].length;i++){
            let local = localComunicadorC.locals[zoomAtual][i]
            local.clean()
            for(let antena of antennaC.antennas){
                this.raio.communicate(antena,local)
            }
            let sinal = local.potencia_recepcao
        }


        for(let i=0;i<localComunicadorC.locals[zoomAtual].length;i++){
            let local = localComunicadorC.locals[zoomAtual][i]
            let sinal = local.potencia_recepcao
            for(let j=0;j<this.niveis_sinal.length;j++){
                if(sinal>this.niveis_sinal[j].value){
                    this.niveis_sinal[j].total += 1
                    break
                }
            }
        }

        $("#chart_holder").html("<canvas id=\"myChart\"></canvas>")
        var ctx = $('#myChart');

        let data_y = comunicadorController.niveis_sinal.map(function(e){ return str(e.value) })
        let data_x = comunicadorController.niveis_sinal.map(function(e){ return e.total })

        let m = data_x.reduce(function(a,b){ return a+b })
        data_x = data_x.map(function(e){return e/m})

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data_y,
                datasets: [{
                    label: 'Signal Received',
                    data: data_x,
                    backgroundColor: this.gradienteColor,
                    borderWidth: 1
                }]
            },
            options: {
                animation: {
                    duration: 0
                }
            },
        });

        // let dis = this;
        // setTimeout(function() {
        if(this.show_comm){
            this.compute_communication_area_singlerun()
        }
        // }(),0)
    }


    toggleDraw(){
        this.show_comm = ! this.show_comm

        if(this.show_comm){
            $("#communication_areacheck").removeClass("fa-square")
            $("#communication_areacheck").addClass("fa-check-square")
            this.compute_communication_area_singlerun()
        }else{
            $("#communication_areacheck").addClass("fa-square")
            $("#communication_areacheck").removeClass("fa-check-square")
        }
    }

    showCommunicationArea(){
        if(!this.show_comm){
            return
        }

        let good = int($("#export_com_area_input_good").val())
        let mid = int($("#export_com_area_input_mid").val())
        let bad = int($("#export_com_area_input_bad").val())


        let z = myMap.getZoom()

        if(typeof comunicadorController.area_comunicacao[z]!="undefined"){
            if(typeof comunicadorController.area_comunicacao[z][bad]!="undefined"){
                fill(255, 0, 0);
                for(let pol_pos=0;pol_pos<comunicadorController.area_comunicacao[z][bad].pos.length; pol_pos++){

                    let pol = comunicadorController.area_comunicacao[z][bad].pos[pol_pos]
                    beginShape();
                    for(let p=0; p<pol.length;p++){
                        vertex(pol[p].x, pol[p].y);
                    }
                    endShape(CLOSE);

                }
            }
        }



        if(typeof comunicadorController.area_comunicacao[z]!="undefined"){
            if(typeof comunicadorController.area_comunicacao[z][mid]!="undefined"){
                fill(200, 128, 0);
                for(let pol_pos=0;pol_pos<comunicadorController.area_comunicacao[z][mid].pos.length; pol_pos++){

                    let pol = comunicadorController.area_comunicacao[z][mid].pos[pol_pos]
                    beginShape();
                    for(let p=0; p<pol.length;p++){
                        vertex(pol[p].x, pol[p].y);
                    }
                    endShape(CLOSE);

                }
            }
        }



        if(typeof comunicadorController.area_comunicacao[z]!="undefined"){
            if(typeof comunicadorController.area_comunicacao[z][good]!="undefined"){
                fill(0, 255, 0);
                for(let pol_pos=0;pol_pos<comunicadorController.area_comunicacao[z][good].pos.length; pol_pos++){

                    let pol = comunicadorController.area_comunicacao[z][good].pos[pol_pos]
                    beginShape();
                    for(let p=0; p<pol.length;p++){
                        vertex(pol[p].x, pol[p].y);
                    }
                    endShape(CLOSE);

                }
            }
        }
    }
}