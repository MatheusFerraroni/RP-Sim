"use strict";
// https://www.messletters.com/pt/big-text/
var distancia_checar = 1000
var lastZoom = -1
var SD = null
var buildings = [];
var points_to_check = []
var antenas = []
var isLoadingSomething = true
var antennaC = null
var buildingsC = null
var Camera = null
var escala = null
var localComunicadorC = null
var comunicadorController = null
var white_background = false
var mouseWheel = false
var showMouseSignal = false
var canvas = null
var myMap = null
const mappa = new Mappa('Leaflet');




// function save_alterations_msg(){

//     let d = "<div class=\"m-2 alert alert-success alert-dismissible alert_success_alterations_saved\" role=\"alert\">\
//         <strong>Success!</strong> Alterations Saved\
//         <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\
//         <span aria-hidden=\"true\">&times;</span>\
//         </button>\
//     </div>"

//     $(".main_summary").prepend(d)

//     setTimeout(function(){ $(".alert_success_alterations_saved").alert("close") }, 5000);

//     save_alterations()
// }





//             dddddddd                                                                               
//             d::::::d                                                                               
//             d::::::d                                                                               
//             d::::::d                                                                               
//             d:::::d                                                                                
//     ddddddddd:::::d rrrrr   rrrrrrrrr     aaaaaaaaaaaaa   wwwwwww           wwwww           wwwwwww
//   dd::::::::::::::d r::::rrr:::::::::r    a::::::::::::a   w:::::w         w:::::w         w:::::w 
//  d::::::::::::::::d r:::::::::::::::::r   aaaaaaaaa:::::a   w:::::w       w:::::::w       w:::::w  
// d:::::::ddddd:::::d rr::::::rrrrr::::::r           a::::a    w:::::w     w:::::::::w     w:::::w   
// d::::::d    d:::::d  r:::::r     r:::::r    aaaaaaa:::::a     w:::::w   w:::::w:::::w   w:::::w    
// d:::::d     d:::::d  r:::::r     rrrrrrr  aa::::::::::::a      w:::::w w:::::w w:::::w w:::::w     
// d:::::d     d:::::d  r:::::r             a::::aaaa::::::a       w:::::w:::::w   w:::::w:::::w      
// d:::::d     d:::::d  r:::::r            a::::a    a:::::a        w:::::::::w     w:::::::::w       
// d::::::ddddd::::::dd r:::::r            a::::a    a:::::a         w:::::::w       w:::::::w        
//  d:::::::::::::::::d r:::::r            a:::::aaaa::::::a          w:::::w         w:::::w         
//   d:::::::::ddd::::d r:::::r             a::::::::::aa:::a          w:::w           w:::w          
//    ddddddddd   ddddd rrrrrrr              aaaaaaaaaa  aaaa           www             www           

function draw(){
    clear()

    if(white_background){
        fill(255)
        rect(0,0,width,height)
    }

    if(isLoadingSomething){
        textSize(32);
        fill(0)
        textAlign(CENTER, CENTER);
        text('Loading...', width/2, height/2);
        return;
    }
    noStroke()

    localComunicadorC.draw()
    antennaC.draw()
    buildingsC.draw()
    escala.draw()


    comunicadorController.showCommunicationArea()


    mouseSignal()
}



function mouseSignal(){
    fill(0,0,0)
    if(!showMouseSignal) return
    let localmouse = new LocalComunicar(myMap.pixelToLatLng(mouseX,mouseY))

    for(let antena of antennaC.antennas){
        let dists = localmouse.getDistance(antena)
        localmouse.checkCommunication(dists)
    }

    let s = (round(localmouse.potencia_recepcao*10)/10).toFixed(1)

    strokeWeight(1);
    stroke(255, 255, 255);
    beginShape();
    vertex(mouseX, mouseY);
    vertex(mouseX+10, mouseY-10);
    vertex(mouseX-10, mouseY-10);
    vertex(mouseX-10, mouseY-60);
    vertex(mouseX+100, mouseY-60);
    vertex(mouseX+100, mouseY-10);
    vertex(mouseX+20, mouseY-10);
    endShape(CLOSE);
    textSize(14);
    fill(255)
    textStyle(BOLD);

    noStroke()
    text(s,mouseX+15, mouseY-20)

    let ber = float(localmouse.snr_ber[SD.modulation].toExponential()).toPrecision(3)
    text(ber,mouseX+15, mouseY-40)


    let cores = localmouse.getColorGradiente(localmouse.potencia_recepcao)
    let cor = localmouse.pickRGB(localmouse.getGradiente()[cores[0]],localmouse.getGradiente()[cores[1]],localmouse.potencia_recepcao)
    fill(cor[0], cor[1], cor[2])
    strokeWeight(1);
    stroke(255, 255, 255);
    rect(mouseX+40, mouseY-25, 10, 10)

    noStroke()


}
    

                                                                                                                           
//                                                                                                                    dddddddd
//                                                             lllllll                                                d::::::d
//                                                             l:::::l                                                d::::::d
//                                                             l:::::l                                                d::::::d
//                                                             l:::::l                                                d:::::d 
// ppppp   ppppppppp   rrrrr   rrrrrrrrr       eeeeeeeeeeee     l::::l    ooooooooooo     aaaaaaaaaaaaa       ddddddddd:::::d 
// p::::ppp:::::::::p  r::::rrr:::::::::r    ee::::::::::::ee   l::::l  oo:::::::::::oo   a::::::::::::a    dd::::::::::::::d 
// p:::::::::::::::::p r:::::::::::::::::r  e::::::eeeee:::::ee l::::l o:::::::::::::::o  aaaaaaaaa:::::a  d::::::::::::::::d 
// pp::::::ppppp::::::prr::::::rrrrr::::::re::::::e     e:::::e l::::l o:::::ooooo:::::o           a::::a d:::::::ddddd:::::d 
//  p:::::p     p:::::p r:::::r     r:::::re:::::::eeeee::::::e l::::l o::::o     o::::o    aaaaaaa:::::a d::::::d    d:::::d 
//  p:::::p     p:::::p r:::::r     rrrrrrre:::::::::::::::::e  l::::l o::::o     o::::o  aa::::::::::::a d:::::d     d:::::d 
//  p:::::p     p:::::p r:::::r            e::::::eeeeeeeeeee   l::::l o::::o     o::::o a::::aaaa::::::a d:::::d     d:::::d 
//  p:::::p    p::::::p r:::::r            e:::::::e            l::::l o::::o     o::::oa::::a    a:::::a d:::::d     d:::::d 
//  p:::::ppppp:::::::p r:::::r            e::::::::e          l::::::lo:::::ooooo:::::oa::::a    a:::::a d::::::ddddd::::::dd
//  p::::::::::::::::p  r:::::r             e::::::::eeeeeeee  l::::::lo:::::::::::::::oa:::::aaaa::::::a  d:::::::::::::::::d
//  p::::::::::::::pp   r:::::r              ee:::::::::::::e  l::::::l oo:::::::::::oo  a::::::::::aa:::a  d:::::::::ddd::::d
//  p::::::pppppppp     rrrrrrr                eeeeeeeeeeeeee  llllllll   ooooooooooo     aaaaaaaaaa  aaaa   ddddddddd   ddddd
//  p:::::p                                                                                                                   
//  p:::::p                                                                                                                   
// p:::::::p                                                                                                                  
// p:::::::p                                                                                                                  
// p:::::::p                                                                                                                  
// ppppppppp                                                                                                                  

function preload(){
    SD = new Signal()
    antennaC = new AntennaController()
    buildingsC = new BuildingsController()
    comunicadorController = new ComunicadorController()

    escala = new Escala()
    localComunicadorC = new LocalComunicarController()


    // let n = 0.00000001
    // n = n.toPrecision(3)
    // print(typeof(n), n)

    $(document).on('click', '#btn_update_buildings', function() { btn_update_buildings() })
    $(document).on('click', '#btn_update_antenna', function() { btn_update_antenna() })
    
    $(document).on('click', '#bigline', function(e){ escala.toggleBigLine() })
    $(document).on('click', '#showbuildings', function(e){ buildingsC.toggleDraw() })
    $(document).on('click', '#showantenas', function(e){ antennaC.toggleDraw() })
    $(document).on('click', '#communication_area', function(e){ comunicadorController.toggleDraw() })

    $(document).on('click', '#export_communication_area', function(e){ comunicadorController.exportCommunicationArea() })
    $(document).on('click', '#export_communication_area_singlerun', function(e){ comunicadorController.compute_communication_area_singlerun() })


    $(document).on('click', '#centermap', function(e){ centermap() })

    

    $(document).on('click', '#whitebackground', function(e){ 

        white_background = ! white_background

        if(white_background){
            $("#whitebackgroundcheck").removeClass("fa-square")
            $("#whitebackgroundcheck").addClass("fa-check-square")
        }else{
            $("#whitebackgroundcheck").addClass("fa-square")
            $("#whitebackgroundcheck").removeClass("fa-check-square")
        }

    })
    $(document).on('click', '#mousesignal', function(e){ 

        showMouseSignal = ! showMouseSignal

        if(showMouseSignal){
            $("#mousesignalcheck").removeClass("fa-square")
            $("#mousesignalcheck").addClass("fa-check-square")
        }else{
            $("#mousesignalcheck").addClass("fa-square")
            $("#mousesignalcheck").removeClass("fa-check-square")
        }

    })




    // enable and disable propagation
    $(document).on('change', '.input_enable_prop_model', function(e) {
        let l = $("#"+e.target.defaultValue+"_label")

        if(e.target.checked){
            $(l.html("Enabled"))
            $(l.addClass("badge-success"))
            $(l.removeClass("badge-danger"))
        }else{
            $(l.html("Disabled"))
            $(l.removeClass("badge-success"))
            $(l.addClass("badge-danger"))
        }

        SD.updatePropagation(e.target.defaultValue, e.target.checked)
    })
    


    // Loading buildings input
    $(document).ready(function(){
        $('input[id="file_buildings_input"]').change(function(e){
            var file = e.target.files[0];
            $("#lbl_input_building").html("File: "+file.name)
            var content = file.text()

            if($("#loading_buildings").hasClass("d-none")){
                $("#loading_buildings").removeClass("d-none");
            }

            content.then(function(e){
                $("#buildings_loaded_hidden").val(e)


                if(!$("#loading_buildings").hasClass("d-none")){
                    $("#loading_buildings").addClass("d-none");
                }
            })
        });
    });

    // Loading buildings antena
    $(document).ready(function(){
        $('input[id="file_antenna_input"]').change(function(e){
            var file = e.target.files[0];
            $("#lbl_input_antenna").html("File: "+file.name)
            var content = file.text()

            if($("#loading_antenna").hasClass("d-none")){
                $("#loading_antenna").removeClass("d-none");
            }

            content.then(function(e){
                $("#antenna_loaded_hidden").val(e)


                if(!$("#loading_antenna").hasClass("d-none")){
                    $("#loading_antenna").addClass("d-none");
                }
            })
        });
    });






    // $(document).on('click', '#btn_reload_communication_area', function() { comunicadorController.computeAreasCoverage() })


    $(document).on('click', '#btn_calculate_signal', function() { 
        mouseWheel = true;
        var id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
        comunicadorController.run()
    })




    // $(".toggle_charts").click(function(e){
    //     $("#chart_here").toggle()
    // })










    $.get( "./data/pol_sp_ilha.geojson", function( data ) {
        if (typeof(data)=="string"){
            $("#buildings_loaded_hidden").val(data)
        }else if(typeof(data)=="object"){
            $("#buildings_loaded_hidden").val(JSON.stringify(data))
        }else{
            console.log("buildings",data)
        }
        
        $.get( "./data/antena_sp_ilha.geojson", function( data ) {
            if (typeof(data)=="string"){
                $("#antenna_loaded_hidden").val(data)
            }else if(typeof(data)=="object"){
                $("#antenna_loaded_hidden").val(JSON.stringify(data))
            }else{
                console.log("antena",data)
            }

            btn_update_buildings()
            btn_update_antenna()
            isLoadingSomething = false
        })
    })

}


function btn_update_buildings(){
    localComunicadorC.clearLocals()
    buildingsC.clear()

    let pol_buildings = null;
    try {
        if($("#buildings_loaded_hidden").val().length==0) return
        pol_buildings = JSON.parse($("#buildings_loaded_hidden").val())
    }catch{
        alert("Error on geojson")
        return
    }
    $("#buildings_loaded_hidden").val("")
    $("#lbl_input_building").html("Choose File")
    $("#list_buildings").html("")


    let bugged_polygons = false
    let total_coords = 0
    for(let i=0;i<pol_buildings.features.length;i++){
        let p = pol_buildings.features[i]

        if(p.properties.type=="multipolygon"){
            let coords = p.geometry.coordinates
            while(typeof(coords[0][0])!="number"){
                coords = coords[0]
            }
            total_coords += coords.length
            let r = buildingsC.createNew(pol_buildings.features[i].properties["@id"], coords, float(pol_buildings.features[i].properties.height))
            if(r==false){
                bugged_polygons = true
            }
        }else if(p.geometry.type=="Polygon"){
            total_coords += p.geometry.coordinates[0].length
            let r = buildingsC.createNew(pol_buildings.features[i].properties["@id"], p.geometry.coordinates[0], float(pol_buildings.features[i].properties.height))
            if(r==false){
                bugged_polygons = true
            }
        }
    }

    for (let i=0; i<buildingsC.buildings.length; i++){
        let t =  "<div class=\"media text-muted pt-3\">\
                            <img class=\"mr-2 rounded\" style=\"width: 64px; height: 64px;\" src=\"data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_170a76cca61%20text%20%7B%20fill%3A%23007bff%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A2pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_170a76cca61%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22%23007bff%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2211.0390625%22%20y%3D%2217.2%22%3E32x32%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E\">\
                            <p class=\"media-body pb-3 mb-0 small lh-125 border-bottom border-gray\">\
                                <strong class=\"d-block text-gray-dark\">Building #"+buildingsC.buildings[i].idd+"</strong>\
                                Points: "+buildingsC.buildings[i].posicaoOriginal.length+"\
                            </p>\
                        </div>"
        $("#list_buildings").append(t)
    }

    if(bugged_polygons){
        alert("At least 1 build were not added")
    }
    $("#info_total_buildings").html(buildingsC.buildings.length)
    $("#total_buildings_main").html(buildingsC.buildings.length)
    $("#info_total_buildings_cords").html(total_coords)
    $("#total_buildings_cords_main").html(total_coords)

    comunicadorController.area_comunicacao = {}
    centermap()
}

function btn_update_antenna(){
    localComunicadorC.clearLocals()


    let point_antennas = null

    try {
        if($("#antenna_loaded_hidden").val().length==0) return
        point_antennas = JSON.parse($("#antenna_loaded_hidden").val())
    }catch{
        alert("Error on geojson")
        return
    }
    $("#list_antenna").html("")
    $("#antenna_loaded_hidden").val("")
    $("#lbl_input_antenna").html("Choose File")


    let bugged_antennas = false
    for(let i=0;i<point_antennas.features.length;i++){
        let p = point_antennas.features[i]
        if(p.geometry.type=="Point"){
            let pos = createVector(p.geometry.coordinates[1],p.geometry.coordinates[0])
            let r = antennaC.createNew(p.properties["@id"],pos)

            if(r==false){
                bugged_antennas = true
            }
        }
    }


    for (let i=0; i<antennaC.antennas.length; i++){
        let t =  "<div class=\"media text-muted pt-3\">\
                            <p class=\"media-body pb-3 mb-0 small lh-125 border-bottom border-gray\">\
                                <strong class=\"d-block text-gray-dark\">Antenna #"+antennaC.antennas[i].idd+"</strong>\
                                Position: LatLng("+antennaC.antennas[i].posWGS.x+","+antennaC.antennas[i].posWGS.y+")\
                            </p>\
                            <span style=\"font-size: 32px\"><i class=\"fas fa-broadcast-tower\"></i></span>\
                        </div>"
        $("#list_antenna").append(t)
    }

    $("#info_total_antenna").html(antennaC.antennas.length)
    $("#lbl_antenas_main").html(antennaC.antennas.length)

    if(bugged_antennas){
        alert("At least 1 antenna were not added.")
    }
    comunicadorController.area_comunicacao = {}
}

//                                                                        dddddddd                                                                                                                                                                                                        
// LLLLLLLLLLL                                                            d::::::dPPPPPPPPPPPPPPPPP                                                                                                                tttt                                                                   
// L:::::::::L                                                            d::::::dP::::::::::::::::P                                                                                                            ttt:::t                                                                   
// L:::::::::L                                                            d::::::dP::::::PPPPPP:::::P                                                                                                           t:::::t                                                                   
// LL:::::::LL                                                            d:::::d PP:::::P     P:::::P                                                                                                          t:::::t                                                                   
//   L:::::L                  ooooooooooo     aaaaaaaaaaaaa       ddddddddd:::::d   P::::P     P:::::P  aaaaaaaaaaaaa   rrrrr   rrrrrrrrr     aaaaaaaaaaaaa      mmmmmmm    mmmmmmm       eeeeeeeeeeee    ttttttt:::::ttttttt        eeeeeeeeeeee    rrrrr   rrrrrrrrr       ssssssssss   
//   L:::::L                oo:::::::::::oo   a::::::::::::a    dd::::::::::::::d   P::::P     P:::::P  a::::::::::::a  r::::rrr:::::::::r    a::::::::::::a   mm:::::::m  m:::::::mm   ee::::::::::::ee  t:::::::::::::::::t      ee::::::::::::ee  r::::rrr:::::::::r    ss::::::::::s  
//   L:::::L               o:::::::::::::::o  aaaaaaaaa:::::a  d::::::::::::::::d   P::::PPPPPP:::::P   aaaaaaaaa:::::a r:::::::::::::::::r   aaaaaaaaa:::::a m::::::::::mm::::::::::m e::::::eeeee:::::eet:::::::::::::::::t     e::::::eeeee:::::eer:::::::::::::::::r ss:::::::::::::s 
//   L:::::L               o:::::ooooo:::::o           a::::a d:::::::ddddd:::::d   P:::::::::::::PP             a::::a rr::::::rrrrr::::::r           a::::a m::::::::::::::::::::::me::::::e     e:::::etttttt:::::::tttttt    e::::::e     e:::::err::::::rrrrr::::::rs::::::ssss:::::s
//   L:::::L               o::::o     o::::o    aaaaaaa:::::a d::::::d    d:::::d   P::::PPPPPPPPP        aaaaaaa:::::a  r:::::r     r:::::r    aaaaaaa:::::a m:::::mmm::::::mmm:::::me:::::::eeeee::::::e      t:::::t          e:::::::eeeee::::::e r:::::r     r:::::r s:::::s  ssssss 
//   L:::::L               o::::o     o::::o  aa::::::::::::a d:::::d     d:::::d   P::::P              aa::::::::::::a  r:::::r     rrrrrrr  aa::::::::::::a m::::m   m::::m   m::::me:::::::::::::::::e       t:::::t          e:::::::::::::::::e  r:::::r     rrrrrrr   s::::::s      
//   L:::::L               o::::o     o::::o a::::aaaa::::::a d:::::d     d:::::d   P::::P             a::::aaaa::::::a  r:::::r             a::::aaaa::::::a m::::m   m::::m   m::::me::::::eeeeeeeeeee        t:::::t          e::::::eeeeeeeeeee   r:::::r                  s::::::s   
//   L:::::L         LLLLLLo::::o     o::::oa::::a    a:::::a d:::::d     d:::::d   P::::P            a::::a    a:::::a  r:::::r            a::::a    a:::::a m::::m   m::::m   m::::me:::::::e                 t:::::t    tttttte:::::::e            r:::::r            ssssss   s:::::s 
// LL:::::::LLLLLLLLL:::::Lo:::::ooooo:::::oa::::a    a:::::a d::::::ddddd::::::ddPP::::::PP          a::::a    a:::::a  r:::::r            a::::a    a:::::a m::::m   m::::m   m::::me::::::::e                t::::::tttt:::::te::::::::e           r:::::r            s:::::ssss::::::s
// L::::::::::::::::::::::Lo:::::::::::::::oa:::::aaaa::::::a  d:::::::::::::::::dP::::::::P          a:::::aaaa::::::a  r:::::r            a:::::aaaa::::::a m::::m   m::::m   m::::m e::::::::eeeeeeee        tt::::::::::::::t e::::::::eeeeeeee   r:::::r            s::::::::::::::s 
// L::::::::::::::::::::::L oo:::::::::::oo  a::::::::::aa:::a  d:::::::::ddd::::dP::::::::P           a::::::::::aa:::a r:::::r             a::::::::::aa:::am::::m   m::::m   m::::m  ee:::::::::::::e          tt:::::::::::tt  ee:::::::::::::e   r:::::r             s:::::::::::ss  
// LLLLLLLLLLLLLLLLLLLLLLLL   ooooooooooo     aaaaaaaaaa  aaaa   ddddddddd   dddddPPPPPPPPPP            aaaaaaaaaa  aaaa rrrrrrr              aaaaaaaaaa  aaaammmmmm   mmmmmm   mmmmmm    eeeeeeeeeeeeee            ttttttttttt      eeeeeeeeeeeeee   rrrrrrr              sssssssssss    



function setup(){
    canvas = createCanvas($("#canvas_holder").width(), $(window).height()-56);
    canvas.parent("canvas_holder")

    const options = {
        lat: -17.0,
        lng: -52.0,
        zoom: 5,
        style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
    }
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas) 
    myMap.onChange(mapChangeHandler)
}


function downloadFiler(filename, content) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}



//                                                                       CCCCCCCCCCCCChhhhhhh                                                                                         HHHHHHHHH     HHHHHHHHH                                                d::::::dlllllll                                         
//                                                                    CCC::::::::::::Ch:::::h                                                                                         H:::::::H     H:::::::H                                                d::::::dl:::::l                                         
//                                                                  CC:::::::::::::::Ch:::::h                                                                                         H:::::::H     H:::::::H                                                d::::::dl:::::l                                         
//                                                                 C:::::CCCCCCCC::::Ch:::::h                                                                                         HH::::::H     H::::::HH                                                d:::::d l:::::l                                         
//    mmmmmmm    mmmmmmm     aaaaaaaaaaaaa   ppppp   ppppppppp    C:::::C       CCCCCC h::::h hhhhh         aaaaaaaaaaaaa   nnnn  nnnnnnnn       ggggggggg   ggggg    eeeeeeeeeeee      H:::::H     H:::::H    aaaaaaaaaaaaa   nnnn  nnnnnnnn        ddddddddd:::::d  l::::l     eeeeeeeeeeee    rrrrr   rrrrrrrrr   
//  mm:::::::m  m:::::::mm   a::::::::::::a  p::::ppp:::::::::p  C:::::C               h::::hh:::::hhh      a::::::::::::a  n:::nn::::::::nn    g:::::::::ggg::::g  ee::::::::::::ee    H:::::H     H:::::H    a::::::::::::a  n:::nn::::::::nn    dd::::::::::::::d  l::::l   ee::::::::::::ee  r::::rrr:::::::::r  
// m::::::::::mm::::::::::m  aaaaaaaaa:::::a p:::::::::::::::::p C:::::C               h::::::::::::::hh    aaaaaaaaa:::::a n::::::::::::::nn  g:::::::::::::::::g e::::::eeeee:::::ee  H::::::HHHHH::::::H    aaaaaaaaa:::::a n::::::::::::::nn  d::::::::::::::::d  l::::l  e::::::eeeee:::::eer:::::::::::::::::r 
// m::::::::::::::::::::::m           a::::a pp::::::ppppp::::::pC:::::C               h:::::::hhh::::::h            a::::a nn:::::::::::::::ng::::::ggggg::::::gge::::::e     e:::::e  H:::::::::::::::::H             a::::a nn:::::::::::::::nd:::::::ddddd:::::d  l::::l e::::::e     e:::::err::::::rrrrr::::::r
// m:::::mmm::::::mmm:::::m    aaaaaaa:::::a  p:::::p     p:::::pC:::::C               h::::::h   h::::::h    aaaaaaa:::::a   n:::::nnnn:::::ng:::::g     g:::::g e:::::::eeeee::::::e  H:::::::::::::::::H      aaaaaaa:::::a   n:::::nnnn:::::nd::::::d    d:::::d  l::::l e:::::::eeeee::::::e r:::::r     r:::::r
// m::::m   m::::m   m::::m  aa::::::::::::a  p:::::p     p:::::pC:::::C               h:::::h     h:::::h  aa::::::::::::a   n::::n    n::::ng:::::g     g:::::g e:::::::::::::::::e   H::::::HHHHH::::::H    aa::::::::::::a   n::::n    n::::nd:::::d     d:::::d  l::::l e:::::::::::::::::e  r:::::r     rrrrrrr
// m::::m   m::::m   m::::m a::::aaaa::::::a  p:::::p     p:::::pC:::::C               h:::::h     h:::::h a::::aaaa::::::a   n::::n    n::::ng:::::g     g:::::g e::::::eeeeeeeeeee    H:::::H     H:::::H   a::::aaaa::::::a   n::::n    n::::nd:::::d     d:::::d  l::::l e::::::eeeeeeeeeee   r:::::r            
// m::::m   m::::m   m::::ma::::a    a:::::a  p:::::p    p::::::p C:::::C       CCCCCC h:::::h     h:::::ha::::a    a:::::a   n::::n    n::::ng::::::g    g:::::g e:::::::e             H:::::H     H:::::H  a::::a    a:::::a   n::::n    n::::nd:::::d     d:::::d  l::::l e:::::::e            r:::::r            
// m::::m   m::::m   m::::ma::::a    a:::::a  p:::::ppppp:::::::p  C:::::CCCCCCCC::::C h:::::h     h:::::ha::::a    a:::::a   n::::n    n::::ng:::::::ggggg:::::g e::::::::e          HH::::::H     H::::::HHa::::a    a:::::a   n::::n    n::::nd::::::ddddd::::::ddl::::::le::::::::e           r:::::r            
// m::::m   m::::m   m::::ma:::::aaaa::::::a  p::::::::::::::::p    CC:::::::::::::::C h:::::h     h:::::ha:::::aaaa::::::a   n::::n    n::::n g::::::::::::::::g  e::::::::eeeeeeee  H:::::::H     H:::::::Ha:::::aaaa::::::a   n::::n    n::::n d:::::::::::::::::dl::::::l e::::::::eeeeeeee   r:::::r            
// m::::m   m::::m   m::::m a::::::::::aa:::a p::::::::::::::pp       CCC::::::::::::C h:::::h     h:::::h a::::::::::aa:::a  n::::n    n::::n  gg::::::::::::::g   ee:::::::::::::e  H:::::::H     H:::::::H a::::::::::aa:::a  n::::n    n::::n  d:::::::::ddd::::dl::::::l  ee:::::::::::::e   r:::::r            
// mmmmmm   mmmmmm   mmmmmm  aaaaaaaaaa  aaaa p::::::pppppppp            CCCCCCCCCCCCC hhhhhhh     hhhhhhh  aaaaaaaaaa  aaaa  nnnnnn    nnnnnn    gggggggg::::::g     eeeeeeeeeeeeee  HHHHHHHHH     HHHHHHHHH  aaaaaaaaaa  aaaa  nnnnnn    nnnnnn   ddddddddd   dddddllllllll    eeeeeeeeeeeeee   rrrrrrr            
//                                            p:::::p                                                                                                     g:::::g                                                                                                                                                    
//                                            p:::::p                                                                                         gggggg      g:::::g                                                                                                                                                    
//                                           p:::::::p                                                                                        g:::::gg   gg:::::g                                                                                                                                                    
//                                           p:::::::p                                                                                         g::::::ggg:::::::g                                                                                                                                                    
//                                           p:::::::p                                                                                          gg:::::::::::::g                                                                                                                                                     
//                                           ppppppppp                                                                                            ggg::::::ggg                                                                                                                                                       
//                                                                                                                                                   gggggg                                                                                                                                                          

function mapChangeHandler(){



    antennaC.updateDisplay()
    buildingsC.updateDisplay()
    escala.updateDistances()
    localComunicadorC.updatePosicaoDisplay()


   comunicadorController.updatePosicaoPoligonoComunicacao()

    let zoomLevel = myMap.map.getZoom()
    if(zoomLevel!=lastZoom){
        lastZoom = zoomLevel
        if(zoomLevel>14){
            distancia_checar = 14
        }else if(zoomLevel==14){
            distancia_checar = 28
        }else if(zoomLevel==13){
            distancia_checar = 58
        }else if(zoomLevel==12){
            distancia_checar = 116
        }else if(zoomLevel<12){
            distancia_checar = 236
        }

        $("#distance_check_display").html(distancia_checar)
        localComunicadorC.reloadLocaisToCheck()
        localComunicadorC.updatePosicaoDisplay()
        $("#total_check_points_display").html(localComunicadorC.locals[zoomLevel].length)

        if(typeof localComunicadorC.locals[zoomLevel][localComunicadorC.locals[zoomLevel].length-1]!="undefined"){
            if(antennaC.antennas.length>0){
                if(localComunicadorC.locals[zoomLevel][localComunicadorC.locals[zoomLevel].length-1].distancias[antennaC.antennas[0].idd]!=null){
                    mouseWheel = true;
                    var id = window.setTimeout(function() {}, 0);
                    while (id--) {
                        window.clearTimeout(id);
                    }
                    comunicadorController.run()
                }
            }
        }
    }
}


function centermap(){

    let bounds = buildingsC.getBounds()

    let lat = (bounds[0].lat+bounds[1].lat)/2
    let lng = (bounds[0].lng+bounds[1].lng)/2

    if(typeof(myMap.map)!="undefined"){
        myMap.map.setView(new L.LatLng(lat,lng),13)
    }
}


function salvarImagem(){
    saveCanvas(canvas, "RP-Sim exported" ,"png")
}

// window.addEventListener("wheel", event => {
//     mouseWheel = true;


//     var id = window.setTimeout(function() {}, 0);
//     while (id--) {
//         window.clearTimeout(id); // will do nothing if no timeout with id is present
//     }
// });



