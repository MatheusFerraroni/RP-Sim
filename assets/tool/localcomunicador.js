

// LLLLLLLLLLL                                                                    lllllll         CCCCCCCCCCCCC                                                                               iiii                                                            
// L:::::::::L                                                                    l:::::l      CCC::::::::::::C                                                                              i::::i                                                           
// L:::::::::L                                                                    l:::::l    CC:::::::::::::::C                                                                               iiii                                                            
// LL:::::::LL                                                                    l:::::l   C:::::CCCCCCCC::::C                                                                                                                                               
//   L:::::L                  ooooooooooo       cccccccccccccccc  aaaaaaaaaaaaa    l::::l  C:::::C       CCCCCC   ooooooooooo      mmmmmmm    mmmmmmm   uuuuuu    uuuuuu  nnnn  nnnnnnnn    iiiiiii     cccccccccccccccc  aaaaaaaaaaaaa   rrrrr   rrrrrrrrr   
//   L:::::L                oo:::::::::::oo   cc:::::::::::::::c  a::::::::::::a   l::::l C:::::C               oo:::::::::::oo  mm:::::::m  m:::::::mm u::::u    u::::u  n:::nn::::::::nn  i:::::i   cc:::::::::::::::c  a::::::::::::a  r::::rrr:::::::::r  
//   L:::::L               o:::::::::::::::o c:::::::::::::::::c  aaaaaaaaa:::::a  l::::l C:::::C              o:::::::::::::::om::::::::::mm::::::::::mu::::u    u::::u  n::::::::::::::nn  i::::i  c:::::::::::::::::c  aaaaaaaaa:::::a r:::::::::::::::::r 
//   L:::::L               o:::::ooooo:::::oc:::::::cccccc:::::c           a::::a  l::::l C:::::C              o:::::ooooo:::::om::::::::::::::::::::::mu::::u    u::::u  nn:::::::::::::::n i::::i c:::::::cccccc:::::c           a::::a rr::::::rrrrr::::::r
//   L:::::L               o::::o     o::::oc::::::c     ccccccc    aaaaaaa:::::a  l::::l C:::::C              o::::o     o::::om:::::mmm::::::mmm:::::mu::::u    u::::u    n:::::nnnn:::::n i::::i c::::::c     ccccccc    aaaaaaa:::::a  r:::::r     r:::::r
//   L:::::L               o::::o     o::::oc:::::c               aa::::::::::::a  l::::l C:::::C              o::::o     o::::om::::m   m::::m   m::::mu::::u    u::::u    n::::n    n::::n i::::i c:::::c               aa::::::::::::a  r:::::r     rrrrrrr
//   L:::::L               o::::o     o::::oc:::::c              a::::aaaa::::::a  l::::l C:::::C              o::::o     o::::om::::m   m::::m   m::::mu::::u    u::::u    n::::n    n::::n i::::i c:::::c              a::::aaaa::::::a  r:::::r            
//   L:::::L         LLLLLLo::::o     o::::oc::::::c     ccccccca::::a    a:::::a  l::::l  C:::::C       CCCCCCo::::o     o::::om::::m   m::::m   m::::mu:::::uuuu:::::u    n::::n    n::::n i::::i c::::::c     ccccccca::::a    a:::::a  r:::::r            
// LL:::::::LLLLLLLLL:::::Lo:::::ooooo:::::oc:::::::cccccc:::::ca::::a    a:::::a l::::::l  C:::::CCCCCCCC::::Co:::::ooooo:::::om::::m   m::::m   m::::mu:::::::::::::::uu  n::::n    n::::ni::::::ic:::::::cccccc:::::ca::::a    a:::::a  r:::::r            
// L::::::::::::::::::::::Lo:::::::::::::::o c:::::::::::::::::ca:::::aaaa::::::a l::::::l   CC:::::::::::::::Co:::::::::::::::om::::m   m::::m   m::::m u:::::::::::::::u  n::::n    n::::ni::::::i c:::::::::::::::::ca:::::aaaa::::::a  r:::::r            
// L::::::::::::::::::::::L oo:::::::::::oo   cc:::::::::::::::c a::::::::::aa:::al::::::l     CCC::::::::::::C oo:::::::::::oo m::::m   m::::m   m::::m  uu::::::::uu:::u  n::::n    n::::ni::::::i  cc:::::::::::::::c a::::::::::aa:::a r:::::r            
// LLLLLLLLLLLLLLLLLLLLLLLL   ooooooooooo       cccccccccccccccc  aaaaaaaaaa  aaaallllllll        CCCCCCCCCCCCC   ooooooooooo   mmmmmm   mmmmmm   mmmmmm    uuuuuuuu  uuuu  nnnnnn    nnnnnniiiiiiii    cccccccccccccccc  aaaaaaaaaa  aaaa rrrrrrr            

class LocalComunicar{
    constructor(pos, x, y){
        this.pos = pos
        this.updatePosicaoDisplay()
        this.sizeCell = 5 // sizecell%2!=0 && sizecell>3
        this.potencia_recepcao = -Infinity

        this.distancias = {}

        this.buildings_descartados = 0
        this.pos_cartesian = [x,y]

        this.draw_type = SD.signal_or_ber
    }

    updatePosicaoDisplay(){
        this.posDisplay = myMap.latLngToPixel(this.pos.lat , this.pos.lng )
        this.posDisplay = createVector(this.posDisplay.x, this.posDisplay.y)
    }

    getGradiente(){
        return [[-120 , [0  , 0  , 0 ]],
                [-110 , [24, 22, 138  ]],
                [-100,  [66, 81, 191  ]],
                [-90,   [66,102,188  ]],
                [-80,   [51,173,174  ]],
                [-70,   [52,214,50  ]],
                [-60,   [179,241,51  ]],
                [-50,   [255,255,50  ]],
                [-40,   [254,220,51  ]],
                [-30,   [255,187,52  ]],
                [-20,   [255,143,52  ]],
                [-10,   [255,50,52  ]],
                [0,     [255 , 255  , 255  ]],
        ]
    }

    getGradienteBER(){
        return [
                [10**-16, [0  , 0  , 128 ]],
                [10**-14, [0  , 0  , 160 ]],
                [10**-12, [0  , 0  , 200 ]],
                [10**-8,  [0, 1, 255  ]],
                [10**-7,  [0, 129, 255  ]],
                [10**-6,  [22, 255, 225  ]],
                [10**-5,  [125, 255, 122  ]],
                [10**-4,  [228, 255, 19  ]],
                [10**-3,  [255, 148, 0  ]],
                [10**-2,  [255, 30, 0  ]],
                [5**-1,   [0 , 0  , 0  ]],
        ]
    }



    getColorGradiente(val){
        let gradiente = this.getGradiente()
        let startGradienteAt = 0
        if(val<=gradiente[startGradienteAt][0]){
            return [startGradienteAt,startGradienteAt]
        }
        let amt = gradiente.length

        for(let i=startGradienteAt;i<amt;i++){
            if(val<=gradiente[i][0]){
                return [i-1,i]
            }
        }
        let last = gradiente.length-1
        return [last,last]
    }
    getColorGradienteBER(val){
        let gradiente = this.getGradienteBER()
        let startGradienteAt = 0
        if(val<=gradiente[startGradienteAt][0]){
            return [startGradienteAt,startGradienteAt]
        }
        let amt = gradiente.length

        for(let i=startGradienteAt;i<amt;i++){
            if(val<=gradiente[i][0]){
                return [i-1,i]
            }
        }
        let last = gradiente.length-1
        return [last,last]
    }

    pickRGB(color1, color2, weight){
        let div = 0
        if (color1[0]==color2[0]){
            div = 1
            // return color1
        }else{
            div = (color2[0]-color1[0])
        }

        weight = ((weight-color1[0])*100)/div
        weight -= 100
        weight *=-1
        color1 = color1[1]
        color2 = color2[1]
        let p = weight
        let w = p * 2 - 1
        let w1 = (w/1+1) / 2/100
        let w2 = 1 - w1
        let rgb = [int(round(color1[0] * w1 + color2[0] * w2)),
            int(round(color1[1] * w1 + color2[1] * w2)),
            int(round(color1[2] * w1 + color2[2] * w2))]
        return rgb
    }


    pickRGBBER(color1, color2, weight){
        let div = 0
        if (color1[0]==color2[0]){
            div = 1
            // return color1
        }else{
            div = (color2[0]-color1[0])
        }

        weight = ((weight-color1[0])*100)/div
        weight -= 100
        weight *=-1
        color1 = color1[1]
        color2 = color2[1]
        let p = weight
        let w = p * 2 - 1
        let w1 = (w/1+1) / 2/100
        let w2 = 1 - w1
        let rgb = [int(round(color1[0] * w1 + color2[0] * w2)),
            int(round(color1[1] * w1 + color2[1] * w2)),
            int(round(color1[2] * w1 + color2[2] * w2))]
        return rgb
    }


    draw(){
        if(this.draw_type ==1){
            if(this.potencia_recepcao<-120) return
            rectMode(CENTER);
            let cores = this.getColorGradiente(this.potencia_recepcao)
            let cor = this.pickRGB(this.getGradiente()[cores[0]],this.getGradiente()[cores[1]],this.potencia_recepcao)


            fill("rgba("+cor[0]+", "+cor[1]+", "+cor[2]+",0.5)")
            noStroke()
            rect(this.posDisplay.x, this.posDisplay.y, this.sizeCell, this.sizeCell)
            rectMode(CORNER);
        }else if(this.draw_type==2){
            if(this.potencia_recepcao<-120) return
            rectMode(CENTER);
            let cores = this.getColorGradienteBER(this.snr_ber[SD.modulation])
            let cor = this.pickRGBBER(this.getGradienteBER()[cores[0]],this.getGradienteBER()[cores[1]],this.snr_ber[SD.modulation])
            // console.log(this.snr_ber[SD.modulation],cores,cor)


            fill("rgba("+cor[0]+", "+cor[1]+", "+cor[2]+",0.5)")
            noStroke()
            rect(this.posDisplay.x, this.posDisplay.y, this.sizeCell, this.sizeCell)
            rectMode(CORNER);
        }

    }

    checkCommunication(raypath){
        let dist_fora = raypath.out
        let dist_dentro = raypath.ins
        let quantidade_walls = raypath.amt_obst

        let newRecpt = -Infinity
        if(dist_fora+dist_dentro==0){ // se distancia for 0, sinal = max
            newRecpt = SD.getPtxDBM()
        }else{
            let F = SD.getDegradation(dist_fora, dist_dentro, quantidade_walls)
            newRecpt = SD.getPtxDBM()+F
        }

        this.potencia_recepcao = max(this.potencia_recepcao, newRecpt)

        this.recalc_snr()
    }

    recalc_snr(){
        this.snr_ber = snr_ber(this.potencia_recepcao)
    }

    clean(){
        this.potencia_recepcao = -Infinity
    }


    computeDistancesToAntennas(antena){
        let beg = turf.point([antena.posWGS.y, antena.posWGS.x]);
        let end = turf.point([this.pos.lng, this.pos.lat]);


        var distanceTotal = turf.distance(beg, end, {units: 'meters'});


        var lineComm = turf.lineString([ [antena.posWGS.y, antena.posWGS.x], [this.pos.lng, this.pos.lat] ]);




        let interseccoes = []
        for(let bui of buildingsC.buildings){

            
            if(turf.inside(beg, bui.polygon)){
                continue
            }

            let pol1 = bui.polygon
            let inte1 = turf.lineIntersect(lineComm, pol1);


            
            if(turf.inside(end, bui.polygon)){
                inte1.features.push(end)
            }
            if(inte1.features.length>1){ // >1 para evitar quando apenas toca o poligono
                // console.log(inte1)
                if(inte1.features.length%2==0){
                    interseccoes.push(inte1)
                }else{
                    console.log("oi")
                    this.buildings_descartados += 1
                }
            }
            
        }
        

        let p1,p2
        let dist_inside = 0
        let total_obs = 0
        for(let pontos of interseccoes){
            for(let i=0; i<pontos.features.length; i+=2){
                p1 = pontos.features[i]
                p2 = pontos.features[i+1]
                dist_inside += turf.distance(p1, p2, {units: 'meters'});
                total_obs += 1
            }
        }

        let dist_fora = distanceTotal-dist_inside

        this.distancias[antena.idd] = {"out": dist_fora, "ins": dist_inside, "amt_obst":total_obs}
    }

    getDistance(antena){
        if(this.distancias.hasOwnProperty(antena.idd)){
            return this.distancias[antena.idd]
        }else{
            this.computeDistancesToAntennas(antena)
            return this.distancias[antena.idd]
        }
    }
}





class LocalComunicarController{
    constructor(){
        this.mapMaxZoom = 20
        this.locals = []

        this.clearLocals()
    }

    clearLocals(){
        this.locals = []
        for(let i=0;i<this.mapMaxZoom;i++){
            this.locals.push([])
        }
    }


    draw(){

        let zoomAtual = myMap.getZoom()
        for(let a of this.locals[zoomAtual]){
            a.draw()
        }
    }
    toRad(t) {
        return t * Math.PI / 180;
    }
    toDeg(t) {
        return t * 180 / Math.PI;
    }

    computeOffset(p1, dist, brng) {
        // 0 = cima
        // 90 = direita
        // 180 = baixo
        // 270 = esquerda
       dist = dist / 6371;  
       brng = this.toRad(brng);  

       let lat1 = this.toRad(p1.lat)
       let lon1 = this.toRad(p1.lng)

       let lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + 
                            Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

       let lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                    Math.cos(lat1), 
                                    Math.cos(dist) - Math.sin(lat1) *
                                    Math.sin(lat2));

       if (isNaN(lat2) || isNaN(lon2)) return null;

       return {lat: this.toDeg(lat2), lng: this.toDeg(lon2)}
    }

    reloadLocaisToCheck(){

        let zoomAtual = myMap.getZoom()
        

        if(this.locals[zoomAtual].length>0){
            return
        }

        let bounds = buildingsC.getBounds()

        let minLat = bounds[0].lat
        let maxLat = bounds[1].lat
        let minLng = bounds[0].lng
        let maxLng = bounds[1].lng

        var atual_lat = minLat
        var atual_lng = minLng

        let dist_between_km = distancia_checar/1000


        let ponto = {lat:minLat, lng:minLng}
        let ponto2 = null

        let pos_y = 0;
        while(ponto.lat<=maxLat){
            let pos_x = 0;
            ponto2 = {lat:ponto.lat, lng: ponto.lng}
            while(ponto2.lng<=maxLng){
                this.locals[zoomAtual].push(new LocalComunicar(ponto2, pos_x, pos_y))
                ponto2 = this.computeOffset(ponto2, dist_between_km, 90)
                pos_x++;
            }

            ponto = this.computeOffset(ponto, dist_between_km, 0)
            pos_y++;
        }

    }

    updatePosicaoDisplay(){
        let zoomAtual = myMap.getZoom()
        for(let i=0; i<this.locals[zoomAtual].length; i++){
            this.locals[zoomAtual][i].updatePosicaoDisplay()
        }
    }

    updateSizeCell(s){
        // if(s%2==0) return
        // if(s<3) return
        // let zoomAtual = myMap.getZoom()
        for(let zoom=0;zoom<this.mapMaxZoom;zoom++){
            for(let i=0; i<this.locals[zoom].length; i++){
                this.locals[zoom][i].sizeCell = s
            }
        }
    }

}
