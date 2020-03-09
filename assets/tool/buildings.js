// https://overpass-api.de/api/interpreter?data=%0A%5Bout%3Ajson%5D%3B%0A%28%0A%20%20node%5B%22building%22%5D%2840.59150271320878%2C-73.93468379974365%2C40.62147744009939%2C-73.87657642364502%29%3B%0A%20%20way%5B%22building%22%5D%2840.59150271320878%2C-73.93468379974365%2C40.62147744009939%2C-73.87657642364502%29%3B%0A%20%20relation%5B%22building%22%5D%2840.59150271320878%2C-73.93468379974365%2C40.62147744009939%2C-73.87657642364502%29%3B%0A%29%3B%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B


// https://overpass-turbo.eu/
//
// [out:json];
// (
//   node["building"]({{bbox}});
//   way["building"]({{bbox}});
//   relation["building"]({{bbox}});
// );
// out body;
// >;
// out skel qt;


class FormaGeometrica{
    constructor(building_id, posicaoOriginal, altura){
        this.idd = building_id
        this.posicaoOriginal = posicaoOriginal
        this.altura = altura
        this.posicaoDisplay = []
        this.display = false


        this.polygon = turf.polygon([this.posicaoOriginal], { name: this.idd });
        this.polygonConvex = turf.convex(this.polygon)

        this.showConvexVersion = false
    }

    draw(){
        if(!this.display){
            return
        }


        fill(128, 128, 128);
        beginShape();
        for(var i = 0; i<this.posicaoDisplay.length;i++){
            vertex(this.posicaoDisplay[i].x, this.posicaoDisplay[i].y);
        }
        endShape(CLOSE);


        if(this.showConvexVersion){
            fill(0, 255, 0);
            beginShape();
            for(var i = 0; i<this.posicaoDisplaySimple.length;i++){
                vertex(this.posicaoDisplaySimple[i].x, this.posicaoDisplaySimple[i].y);
            }
            endShape(CLOSE);
        }
    }

    updateDisplay(){


        this.posicaoDisplay = []
        this.display = false
        for(let p of this.posicaoOriginal){
            p = myMap.latLngToPixel(p[1] , p[0] )
            p = createVector(p.x, p.y)
            this.posicaoDisplay.push( p )

            if(!this.display){
                this.display = (p.x>=0 && p.x<=width && p.y>=0 && p.y<=height)
            }
        }


        if(this.showConvexVersion){
            this.posicaoDisplaySimple = []
            for(let p of this.polygonConvex.geometry.coordinates[0]){
                p = myMap.latLngToPixel(p[1] , p[0] )
                p = createVector(p.x, p.y)
                this.posicaoDisplaySimple.push( p )
            }
        }

    }
}



class BuildingsController{
    constructor(){
        this.buildings = []
        this.maxLat = -Infinity
        this.maxLng = -Infinity
        this.minLat = Infinity
        this.minLng = Infinity

        this.canDraw = true
        this.ids_usados = {}
    }

    getBounds(){
        return [{lat:this.minLat,lng:this.minLng},{lat:this.maxLat, lng:this.maxLng}]
    }

    createNew(idd, cordsOriginais, altura){


        if(this.ids_usados.hasOwnProperty(idd)){
            return false
        }
        this.ids_usados[idd] = true
        
        for(let i = 0; i<cordsOriginais.length;i++){
            this.maxLng = max(this.maxLng,cordsOriginais[i][0])
            this.maxLat = max(this.maxLat,cordsOriginais[i][1])
            this.minLng = min(this.minLng,cordsOriginais[i][0])
            this.minLat = min(this.minLat,cordsOriginais[i][1])
        }
        let a = new FormaGeometrica(idd, cordsOriginais, altura)
        this.buildings.push(a)
        return a
    }

    updateDisplay(){
        for(let a of this.buildings){
            a.updateDisplay()
        }
    }

    draw(){
        if(this.canDraw){
            for(let a of this.buildings){
                a.draw()
            }
        }
    }

    clear(){
        this.buildings = []
        this.ids_usados = {}
    }

    toggleDraw(){
        this.canDraw = ! this.canDraw

        if(this.canDraw){
            $("#showbuildingscheck").removeClass("fa-square")
            $("#showbuildingscheck").addClass("fa-check-square")
        }else{
            $("#showbuildingscheck").addClass("fa-square")
            $("#showbuildingscheck").removeClass("fa-check-square")
        }
    }
}
