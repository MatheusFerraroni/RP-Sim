

//                                                                dddddddd                    
//   iiii                                       iiii              d::::::d                    
//  i::::i                                     i::::i             d::::::d                    
//   iiii                                       iiii              d::::::d                    
//                                                                d:::::d                     
// iiiiiii nnnn  nnnnnnnn        ssssssssss   iiiiiii     ddddddddd:::::d     eeeeeeeeeeee    
// i:::::i n:::nn::::::::nn    ss::::::::::s  i:::::i   dd::::::::::::::d   ee::::::::::::ee  
//  i::::i n::::::::::::::nn ss:::::::::::::s  i::::i  d::::::::::::::::d  e::::::eeeee:::::ee
//  i::::i nn:::::::::::::::ns::::::ssss:::::s i::::i d:::::::ddddd:::::d e::::::e     e:::::e
//  i::::i   n:::::nnnn:::::n s:::::s  ssssss  i::::i d::::::d    d:::::d e:::::::eeeee::::::e
//  i::::i   n::::n    n::::n   s::::::s       i::::i d:::::d     d:::::d e:::::::::::::::::e 
//  i::::i   n::::n    n::::n      s::::::s    i::::i d:::::d     d:::::d e::::::eeeeeeeeeee  
//  i::::i   n::::n    n::::nssssss   s:::::s  i::::i d:::::d     d:::::d e:::::::e           
// i::::::i  n::::n    n::::ns:::::ssss::::::si::::::id::::::ddddd::::::dde::::::::e          
// i::::::i  n::::n    n::::ns::::::::::::::s i::::::i d:::::::::::::::::d e::::::::eeeeeeee  
// i::::::i  n::::n    n::::n s:::::::::::ss  i::::::i  d:::::::::ddd::::d  ee:::::::::::::e  
// iiiiiiii  nnnnnn    nnnnnn  sssssssssss    iiiiiiii   ddddddddd   ddddd    eeeeeeeeeeeeee  
                                                                                           

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    let x = point.x
    let y = point.y;

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i].x, yi = vs[i].y;
        let xj = vs[j].x, yj = vs[j].y;

        let intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};




                                                                                                                                                                                        
//             dddddddd                                                                                                                                                                    
//             d::::::d                                                                                  SSSSSSSSSSSSSSS                                       lllllll                     
//             d::::::d                                                                                SS:::::::::::::::S                                      l:::::l                     
//             d::::::d                                                                               S:::::SSSSSS::::::S                                      l:::::l                     
//             d:::::d                                                                                S:::::S     SSSSSSS                                      l:::::l                     
//     ddddddddd:::::d rrrrr   rrrrrrrrr     aaaaaaaaaaaaa   wwwwwww           wwwww           wwwwwwwS:::::S                cccccccccccccccc  aaaaaaaaaaaaa    l::::l     eeeeeeeeeeee    
//   dd::::::::::::::d r::::rrr:::::::::r    a::::::::::::a   w:::::w         w:::::w         w:::::w S:::::S              cc:::::::::::::::c  a::::::::::::a   l::::l   ee::::::::::::ee  
//  d::::::::::::::::d r:::::::::::::::::r   aaaaaaaaa:::::a   w:::::w       w:::::::w       w:::::w   S::::SSSS          c:::::::::::::::::c  aaaaaaaaa:::::a  l::::l  e::::::eeeee:::::ee
// d:::::::ddddd:::::d rr::::::rrrrr::::::r           a::::a    w:::::w     w:::::::::w     w:::::w     SS::::::SSSSS    c:::::::cccccc:::::c           a::::a  l::::l e::::::e     e:::::e
// d::::::d    d:::::d  r:::::r     r:::::r    aaaaaaa:::::a     w:::::w   w:::::w:::::w   w:::::w        SSS::::::::SS  c::::::c     ccccccc    aaaaaaa:::::a  l::::l e:::::::eeeee::::::e
// d:::::d     d:::::d  r:::::r     rrrrrrr  aa::::::::::::a      w:::::w w:::::w w:::::w w:::::w            SSSSSS::::S c:::::c               aa::::::::::::a  l::::l e:::::::::::::::::e 
// d:::::d     d:::::d  r:::::r             a::::aaaa::::::a       w:::::w:::::w   w:::::w:::::w                  S:::::Sc:::::c              a::::aaaa::::::a  l::::l e::::::eeeeeeeeeee  
// d:::::d     d:::::d  r:::::r            a::::a    a:::::a        w:::::::::w     w:::::::::w                   S:::::Sc::::::c     ccccccca::::a    a:::::a  l::::l e:::::::e           
// d::::::ddddd::::::dd r:::::r            a::::a    a:::::a         w:::::::w       w:::::::w        SSSSSSS     S:::::Sc:::::::cccccc:::::ca::::a    a:::::a l::::::le::::::::e          
//  d:::::::::::::::::d r:::::r            a:::::aaaa::::::a          w:::::w         w:::::w         S::::::SSSSSS:::::S c:::::::::::::::::ca:::::aaaa::::::a l::::::l e::::::::eeeeeeee  
//   d:::::::::ddd::::d r:::::r             a::::::::::aa:::a          w:::w           w:::w          S:::::::::::::::SS   cc:::::::::::::::c a::::::::::aa:::al::::::l  ee:::::::::::::e  
//    ddddddddd   ddddd rrrrrrr              aaaaaaaaaa  aaaa           www             www            SSSSSSSSSSSSSSS       cccccccccccccccc  aaaaaaaaaa  aaaallllllll    eeeeeeeeeeeeee  



class Escala{
    constructor(){
        this.texts = []
        this.showBigScale = false

        this.localbase = null
    }

    updateDistances(){


        this.texts = []

        let escala_Y = []
        let escala_X = []
        for(let i=0;i<width;i+=50){
            escala_X.push([i,height])
        }


        for(let i= 0;i<height;i+=50){
            escala_Y.push([0,i])
        }


        for(let i = 0; i<escala_X.length; i++){
            let p1 = myMap.fromPointToLatLng(escala_X[0][0],escala_X[0][1])
            let p2 = myMap.fromPointToLatLng(escala_X[i][0],escala_X[i][1])
            let dist = round(myMap.map.distance(p1,p2))+"m"
            this.texts.push({pos:[escala_X[i][0], escala_X[i][1]-10], val:dist})
        }

        for(let i = 0; i<escala_Y.length; i++){
            let p1 = myMap.fromPointToLatLng(escala_Y[0][0],escala_Y[0][1])
            let p2 = myMap.fromPointToLatLng(escala_Y[i][0],escala_Y[i][1])
            let dist = round(myMap.map.distance(p1,p2))+"m"
            this.texts.push({pos:[escala_Y[i][0]+20, escala_Y[i][1]], val:dist})
        }
    }

    draw(){
        fill(0)
        strokeWeight(0)

        let size_black_target = 40
        rect(0,0,size_black_target,height)
        size_black_target = 20
        rect(0,height-size_black_target,width,size_black_target)

        strokeWeight(1)
        stroke(255,255,255)
        fill(255)


        strokeWeight(2);
        textSize(10)


        if(this.showBigScale){
            for(let i=25;i<width;i+=25){
                line(i,height,i,0)
            }
            for(let i= 25;i<height;i+=25){
                line(0,i,width,i)
            }
        }else{
            for(let i=25;i<width;i+=25){
                line(i,height,i,height-5)
            }
            for(let i= 25;i<height;i+=25){
                line(0,i,5,i)
            }
        }


        textSize(10)
        strokeWeight(0);


        for(let t of this.texts){
            text(t["val"], t["pos"][0], t["pos"][1])
        }


        fill(255)
        rect(width-251,height-60,251,40)

        if(this.localbase==null){
            this.localbase = new LocalComunicar({lat:0,lng:0})
        }


        if(SD.signal_or_ber==1){

            textSize(10)
            let gradiente = this.localbase.getGradiente()
            fill(0)
            for(let i=0;i>=-240;i-=2){
                let valor = int(i/2)

                let cores = this.localbase.getColorGradiente(valor)
                let cor = this.localbase.pickRGB(gradiente[cores[0]],gradiente[cores[1]],valor)
                stroke(cor[0], cor[1], cor[2])
                let px = width-240-i
                let py1 = height-32
                let py2 = height-21
                strokeWeight(2)
                line(px, py1, px, py2)

                strokeWeight(0)
                stroke(0)
                if(valor%10==0){
                    text(valor,px-7,py1-5)


                }
            }

            text("Signal Received (dBw)",width-200,height-50)
        }else if(SD.signal_or_ber==2){


            textSize(10)
            let gradiente = this.localbase.getGradienteBER()
            fill(0)


            for(let i=0;i>=-240;i-=2){
                let valor = int(i/2)

                let ber = snr_ber(valor)

                valor = ber[SD.modulation]

                let cores = this.localbase.getColorGradienteBER(valor)
                let cor = this.localbase.pickRGBBER(gradiente[cores[0]],gradiente[cores[1]],valor)
                stroke(cor[0], cor[1], cor[2])
                let px = width-240-i
                let py1 = height-32
                let py2 = height-21
                strokeWeight(2)
                line(px, py1, px, py2)

                strokeWeight(0)
                stroke(0)
                if(int(i/2)%20==0){

                    if(valor<0.48){
                        if(valor!=0){
                            valor = float(valor.toExponential()).toPrecision(3)
                        }
                        text(valor,px-7,py1-5)
                    }

                }
            }
            text("Bit Error Rate",width-220,height-50)
        }


        // let jaux = 0
        // for(let i=-120;i>=-240;i-=4){
        //     let valor = int(i/2)

        //     let cores = this.localbase.getColorGradiente(valor)
        //     let cor = this.localbase.pickRGB(gradiente[cores[0]],gradiente[cores[1]],valor)
        //     stroke(cor[0], cor[1], cor[2])


        //     let px,py1,py2
        //     for(let j=0;j<4;j++){
        //         jaux += 1
        //         px = width-240-i-120+jaux
        //         py1 = height-32
        //         py2 = height-22
        //         strokeWeight(2)
        //         line(px+j, py1-38, px+j, py2-38)
        //     }

        //     strokeWeight(0)
        //     stroke(0)
        //     if(valor%10==0){
        //         // text(valor,px-7,py1-45)
        //         let r = snr_ber(valor)
        //         let v = r[SD.modulation]
        //         if (v>0){
        //             v = float(v.toExponential()).toPrecision(3)
        //         }
        //         text(v,px-7,py1-45)
        //     }
        // }
        // text("BER "+SD.modulation_str+" (%)",width-214,height-90)
    }

    toggleBigLine(){
        this.showBigScale = ! this.showBigScale

        if(this.showBigScale){
            $("#biglinecheck").removeClass("fa-square")
            $("#biglinecheck").addClass("fa-check-square")
        }else{
            $("#biglinecheck").addClass("fa-square")
            $("#biglinecheck").removeClass("fa-check-square")
        }
    }
}



// class MouseController{
//     constructor(){
//         this.pos = createVector(mouseX,mouseY)
//         this.coordenadas_marcando_building = []
//     }

//     getPos(){
//         return this.pos
//     }

//     update(){
//         this.pos = createVector(mouseX,mouseY)

//         // console.log(Camera.getWGSFromDisplay(this.pos))
//         if (mouseIsPressed) {

//             if(this.pos.x>0 && this.pos.y>0 && this.pos.x<width && this.pos.y<height){
//                 let pos = createVector(this.pos.x, this.pos.y)
//                 if(this.coordenadas_marcando_building.length>0){
//                     if(pos.dist(this.coordenadas_marcando_building[this.coordenadas_marcando_building.length-1])>10){
//                         this.coordenadas_marcando_building.push(pos)
//                     }
//                 }else{
//                     this.coordenadas_marcando_building.push(pos)
//                 }
//             }
//         }
//     }
// }

