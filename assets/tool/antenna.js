
class Antenna{
    constructor(idd, posWGS){

        this.idd = idd
        this.posWGS = posWGS
        this.img = loadImage('imgs/wifi-signal.png');

        this.displayPos = null
        this.sizeImg = 32
        this.sizeMarker = 10
        this.display = false
    }

    draw(){
        if(!this.display){
            return
        }
        fill(color(255,0,0))
        circle(this.displayPos.x, this.displayPos.y, this.sizeMarker)
        image(this.img, this.displayPos.x-(this.sizeImg/2), this.displayPos.y-(this.sizeImg+this.sizeMarker), this.sizeImg, this.sizeImg)
    }

    updateDisplay(){
        let p = myMap.latLngToPixel(this.posWGS.x , this.posWGS.y )
        p = createVector(p.x, p.y)
        this.displayPos = p

        this.display = (p.x>=0 && p.x<=width && p.y>=0 && p.y<=height)
    }
}


class AntennaController{
    constructor(){
        this.antennas = []
        this.canDraw = true

        this.ids_usados = {}
    }

    createNew(idd, posOriginal){
        if(this.ids_usados.hasOwnProperty(idd)){
            return false
        }
        this.ids_usados[idd] = true
        let a = new Antenna(idd, posOriginal)
        this.antennas.push(a)
        return a
    }

    updateDisplay(){
        for(let a of this.antennas){
            a.updateDisplay()
        }
    }

    draw(){
        if(this.canDraw){
            for(let a of this.antennas){
                a.draw()
            }
        }
    }
    
    clear(){
        this.antennas = []
        this.ids_usados = {}
    }


    toggleDraw(){
        this.canDraw = ! this.canDraw

        if(this.canDraw){
            $("#showantenascheck").removeClass("fa-square")
            $("#showantenascheck").addClass("fa-check-square")
        }else{
            $("#showantenascheck").addClass("fa-square")
            $("#showantenascheck").removeClass("fa-check-square")
        }
    }
}
