
function getRDW(kenteken) {
        $.get("https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=" + kenteken, function (data) {
        console.log(JSON.stringify(data[0]))

        //$("#RDWDATA").append("<p></p>")
        jQuery.each(data[0], function(key, value) {
        $("#RDWDATA").append('<tr><td><b>'+key + "</b></td><td> "+ value + "</td><tr>")
          console.log(key + ": "+ value)
        });
    })
;};

$('#RDW').click(function() {
    console.log($('#kenteken').val())
    getRDW($('#kenteken').val())

});





$('#image-map area').hover(
    function () {
        var coords = $(this).attr('coords').split(',');
        //console.log(coords)
        var width = $('.image-map-container').width();
        var height = $('.image-map-container').height();
                   $('.image-map-container .map-selector').addClass('hover').css({
                        'left': coords[0]+'px',
                        'top': coords[1] + 'px',
                        'right': width - coords[2],
                        'bottom': height - coords[3]
                   })
    },
    function () {
        $('.image-map-container .map-selector').removeClass('hover').attr('style','');
    }

);



var schadelist = []

$('#image-map area').click(
    function (){
    //modal.style.display = "block";
    var coords = $(this).attr('coords').split(',');
    var schade = $(this).attr("alt")
    schadelist.push({"coords" : coords, "schade": schade, "detail": []})
    console.log(schadelist)
    showkrasdeuk(schade)
    //$("#krasdeuk").show();
    schadelist.forEach(highlightcovers)
});

function hidekrasdeuk() {
    $('#krasdeuk').hide()
}
hidekrasdeuk()


function showkrasdeuk(schade) {

    $("#kradeukoptions").empty() 

    function checkselected(optie) {
        schadelist.forEach(
            function(item) {  if ( item["schade"] == schade && item["detail"].includes(optie)  ) {return true} }        
    ) }
    function templati(optie) {if (checkselected(optie) == true) {return '<div class="level-item has-text-centered"><label class="checkbox"><input type="checkbox" checked> </div>' + optie +'</label>'} else {return '<div class="level-item has-text-centered"><label class="checkbox"><input type="checkbox">' + optie +'</label></div>'}  }
    
    var content = templati(' kras groot ') + templati(' kras klein ') + templati(' deuk klein ') + templati(' deuk groot ')

    switch (schade) {
        case 'linkerzijkant':
            content +=  templati(' spiegel ')
            break;
        case 'rechterzijkant':
            content +=  templati(' spiegel ')
            break;
        }


    $("#kradeukoptions").append(content)
    $("#krasdeuk").show()
}





function removeschade(el) {
    var element = el;
    //console.log(element.id);
    schadelist  = schadelist.filter(function( obj ) {
        return obj.schade !== element.id;
    });
    element.remove();
    
  }

async function addcovers(item) {
    $('.image-map-container').append('<div id="'+item["schade"] + '"  onclick="removeschade(this)"</div>' )
}

function clearcovers(item){
    $('.image-map-container').remove('#' +item["schade"] )


}
async function highlightcovers (item){
    await addcovers(item)
    var width = $('.image-map-container').width();
    var height = $('.image-map-container').height();
    $('#'+item["schade"]).css({
                    'border': '5px solid #363636',
                    'opacity': 0.5,
                    'position': 'absolute',
                    'left': item["coords"][0]+'px',
                    'top': item["coords"][1] + 'px',
                    'right': width - item["coords"][2],
                    'bottom': height - item["coords"][3]
               })
};



$(document).ready(function() {

    $('div#Schade').hide()
    $('div#Next').hide()
    $('div#Voertuig').hide()

    $('#tab li').click( function() {
        $('#tab').find('li').removeClass('is-active');
        $(this).toggleClass('is-active');
        var choice =  $(this).text().trim()
        console.log(choice);

        $('div#Eenzijdig').hide()
        $('div#Voertuig').hide()
        $('div#Schade').hide()
        $('div#Next').hide()

       switch (choice) {
        case 'Eenzijdige schade':
            $('div#Eenzijdig').show()
            break;
        case 'Voertuig':
            $('div#Voertuig').show()
            break;
        case 'Schade':
            $('div#Schade').show()
            break;
        case 'Next':
 
            generate_advies()
            $('div#Next').show()
            break;
        default:
           console.log("Sorry, we are out of ${expr}.");
        }
    });
});


function getRandomnumber(min, max) {
    return Math.random() * (max - min) + min;
}

function get_type(){
    return $("#TYPESCHADE :selected").text();
}


function generate_advies() {
    $("#advies").empty();
    $("p").remove("#advies"); 
    if (schadelist.length ==1 && ['Eenzijdig ongeval', 'Inbraak', 'Aanrijding met dieren'].includes(get_type())) {
    var bedrag = getRandomnumber(500, 2000)
    var advies1 = "<p id=\"advies\">De geschatte schade omvang is <strong>tussen " + Math.round(bedrag).toString() +" en "  + Math.round((bedrag+950)).toString() + " euro</strong> op basis van 94 vergelijkbare schade<br>Omdat de spreiding in soortgelijke schades vrij groot is, is het advies <strong>expertise</strong> in te schakelen.Indien de nota aanwezig is, is het aanbevolen een <strong>notacontrole</strong> uit te laten voeren. <br><br>of verwijs naar een aangesloten hersteller:<br><br><button class=\"button is-primary\" onclick=\"window.open('https://www.centraalbeheer.nl/verzekeringen/autoverzekering/schadeherstellers')\">Aangesloten herstellers</button><br><br><br><br><br></p>"
    var advies2 = "<p id=\"advies\">De geschatte schade omvang is <strong>tussen " + Math.round(bedrag).toString() +" en "  + (Math.round(bedrag+180)).toString() + " euro</strong> op basis van 321 vergelijkbare schade<br>Expertise of notacontrole zijn niet nodig, u kunt deze schade <strong>direct uitbetalen</strong> <br><br>of verwijs naar een aangesloten hersteller:<br><br><button class=\"button is-primary\" onclick=\"window.open('https://www.centraalbeheer.nl/verzekeringen/autoverzekering/schadeherstellers')\">Aangesloten herstellers</button><br><br><br><br><br></p>"
    var gekozenadvies = Math.random() < 0.5 ? advies1 : advies2;   
    $("#adviescontainer").append(gekozenadvies)
    }
    else if (schadelist.length >1 && ['Eenzijdig ongeval', 'Inbraak', 'Aanrijding met dieren'].includes(get_type()) ){
        var bedrag = getRandomnumber(1800, 5000)
        var advies3 = "<p id=\"advies\"> De geschatte schade omvang is <strong>tussen " + Math.round(bedrag).toString() +" en "  + (Math.round(bedrag+1500)).toString() + " euro</strong> <br>Omdat er sprake is van meerdere schades is de spreiding in soortgelijke schades erg groot. Het advies <strong>expertise</strong> in te schakelen.Indien de nota aanwezig is, is het aanbevolen een <strong>notacontrole</strong> uit te laten voeren. <br><br>of verwijs naar een aangesloten hersteller:<br><br><button class=\"button is-primary\" onclick=\"window.open('https://www.centraalbeheer.nl/verzekeringen/autoverzekering/schadeherstellers')\">Aangesloten herstellers</button><br><br><br><br><br></p>"
        $("#adviescontainer").append(advies3)
    }
    else if (['Van buitenkomend onheil', 'Brand', 'Storm Natuur'].includes(get_type()) ){
        var advies4 = "<p id=\"advies\">We kennen een te grote diversiteit aan schades binnen dit type en er kan daarom geen redelijke schatting worden gemaakt van de schadeomvag. Het advies is om <strong>expertise</strong> in te schakelen. Indien de nota aanwezig is, is het aanbevolen een <strong>notacontrole</strong> uit te laten voeren. <br><br>of indien mogelijk verwijs naar een aangesloten hersteller:<br><br><button class=\"button is-primary\" onclick=\"window.open('https://www.centraalbeheer.nl/verzekeringen/autoverzekering/schadeherstellers')\">Aangesloten herstellers</button><br><br><br><br><br></p>"
        $("#adviescontainer").append(advies4)    
    }
    else {
        var advies5 = "<p id=\"advies\">Er is nog onvoldoende informatie ingevoerd om een juist advies te kunnen geven <br><br><br><br><br></p>"
        $("#adviescontainer").append(advies5)

    }

}