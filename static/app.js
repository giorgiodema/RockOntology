var current_item = []

var MainItem = function(name,type){
    this.type=type
    this.name = name
    this.origin = ""
    this.description = null
    this.container_id = 'div_genre_'+this.name
    this.popup_id = 'popup_genre_'+this.name
    this.sub_genres = []
    this.fus_genres = []
    this.artists = []
    this.groups = []
}
MainItem.prototype.draw = function(){
    /*
    /*  html code for a genre container (rounded container with
    /*  name and year)
    */
    var container =     '<div class="item_genre_container" id="div_genre_'+this.name+'" name='+this.name+'>\
                            <p class="genre_title">'+this.name.replace(/_/g," ")+'</p>'
    if(this.type=="genre") container = container += '<p class="genre_origin">'+this.origin+'</p>'
    container +='</div>'
    /*
    /*  html code for the popup menu of the genre item 
    */
    var popup = '       <ul class=popup_genre id="popup_genre_'+this.name+'">\
                            <li class="genre_inf" id=popup_genre_'+this.name+'_inf><p>More Info</p></li>\
                            <li class="genre_sub" id=popup_genre_'+this.name+'_sub><p>Subgenres</p></li>\
                            <li class="genre_fus" id=popup_genre_'+this.name+'_fus><p>Fusion Genres</p></li>\
                            <li class="genre_art" id=popup_genre_'+this.name+'_art><p>Artists</p></li>\
                            <li class="genre_gro" id=popup_genre_'+this.name+'_gro><p>Groups</p></li>\
                        </ul>'
    /*
    /* attach new items to the html page
    */
    document.getElementById('main_container').innerHTML += container + popup
}

var SubItem = function(name,type){
    this.name = name
    this.type = type
    this.container_id = 'subitem_container'+this.name
}
SubItem.prototype.draw = function(){
    /*
    /*  html code for a genre container (rounded container with
    /*  name and year)
    */
    var container =     '<div class="subitem_container" id="subitem_container'+this.name+'" name='+this.name+'>\
                            <p class="subitem_title">'+this.name.replace(/_/g," ")+'</p>\
                        </div>'
    /*
    /* attach new items to the html page
    */
    document.getElementById('main_container').innerHTML += container
}

function clickListeners(e){
        /*
        /*  click listener on the genre container
        /*  the listner shows the corresponding 
        /*  popup menu 
        */
       if(e.target && e.target.className=="item_genre_container"){
        var popup = document.getElementById("popup_genre_"+e.target.getAttribute("name"))
        if(popup.style.display=="flex")
            fadeOutElement(popup,afterCallBack = function(e){
                e.style.display="none"
            })
        else
            fadeInElement(popup,beforeCallBack = function(e){
                if(e.className=="popup_genre")
                    e.style.display="flex"
                else
                    e.style.display=""
            })
    }
    /*
    /*  listeners for the items of the popup menu:
    /*  -> INF: display the long description of the genre
    /*          and the image
    /*  -> SUB: display all the subgenres of the
    /*          current genre
    /*  -> FUS: display all the fusion genres
    /*          with the current genre
    /*  -> ART: display all the artists of the
    /*          current genre
    /*  -> GRO: display all the groups of the current genre
    */
   /* INF */
    if(e.target && (e.target.className=="genre_inf" || e.target.parentElement.className=="genre_inf")){
        console.log("genre_inf")

        var genreContainer = document.getElementById(current_item[current_item.length-1].container_id)
        var genrePopup = document.getElementById(current_item[current_item.length-1].popup_id)
        fadeOutElement(genreContainer,afterCallBack = function(e){
            e.style.display="none"
        })
        fadeOutElement(genrePopup,afterCallBack= function(e){
            e.style.display="none"
        })

        var genreContainer = document.getElementById(current_item[current_item.length-1].container_id)
        var genrePopup = document.getElementById(current_item[current_item.length-1].popup_id)
        var infoContainer = document.getElementById("item_abstract_container")
        var infoTitle = document.getElementById("item_abstract_title")
        var infoDesc = document.getElementById("item_abstract_description")
    
        infoTitle.innerText = current_item[current_item.length-1].name.replace(/_/g," ")
        infoDesc.innerText = current_item[current_item.length-1].description
        fadeInElement(infoContainer,beforeCallBack = function(e){
            e.style.display="block"
        })
        
    }
    /* SUB */
    if(e.target && (e.target.className=="genre_sub" || e.target.parentElement.className=="genre_sub")){
        console.log("genre_sub")
        var oReq = new XMLHttpRequest()
        oReq.addEventListener("load", subgenresResponseListener)
        oReq.open("GET", document.location.origin + "/query/genre/subgenres"+"?"+"genre="+current_item[current_item.length-1].name)
        oReq.send()
        var genreContainer = document.getElementById(current_item[current_item.length-1].container_id)
        var genrePopup = document.getElementById(current_item[current_item.length-1].popup_id)
        fadeOutElement(genreContainer,afterCallBack = function(e){
            e.style.display="none"
        })
        fadeOutElement(genrePopup,afterCallBack=function(e){
            e.style.display="none"
        })
    }
    /* FUS */
    if(e.target && (e.target.className=="genre_fus" || e.target.parentElement.className=="genre_fus")){
        console.log("genre_fus")
        var oReq = new XMLHttpRequest()
        oReq.addEventListener("load", fusiongenresResponseListener)
        oReq.open("GET", document.location.origin + "/query/genre/fusiongenres"+"?"+"genre="+current_item[current_item.length-1].name)
        oReq.send()
        var genreContainer = document.getElementById(current_item[current_item.length-1].container_id)
        var genrePopup = document.getElementById(current_item[current_item.length-1].popup_id)
        fadeOutElement(genreContainer,afterCallBack = function(e){
            e.style.display="none"
        })
        fadeOutElement(genrePopup,afterCallBack=function(e){
            e.style.display="none"
        })
    }
    /* ART */
    if(e.target && (e.target.className=="genre_art" || e.target.parentElement.className=="genre_art")){
        console.log("genre_art")
    }
    /* GRO */
    if(e.target && (e.target.className=="genre_gro" || e.target.parentElement.className=="genre_gro")){
        console.log("genre_gro")
    }

    /*
    /*  Listener for the click event on a subitem. where a subitem can be either:
    /*      -> a subgenre
    /*      -> a fusion genre
    /*      -> an artist
    /*      -> a band
    */
   if(e.target && (e.target.className=="subitem_container" || e.target.parentElement.className=="subitem_container")){
       console.log("click on subgenre")
       var target = null
       if(e.target.className=="subitem_container")target = e.target
       else target = e.target.parentElement

       var c = current_item[current_item.length-1]
        var to_remove = c.sub_genres.concat(c.fus_genres.concat(c.artists.concat(c.groups)))

       for(var i=0;i<to_remove.length;i++){
           var s = to_remove[i]
           var e = document.getElementById("subitem_container"+s)
           if(e!=null){
            fadeOutElement(e,afterCallBack=function(e){
                removeElementAndChild(e)
            })
           }
       }
       var name = target.getAttribute("name")
       current_item.push(new MainItem(name,"genre"))
       getCurrentGenreInfo()
   }

   /*
   /* Listener for the back button, to
   /* navigate back to the previous
   /* current_item
   */
   if(e.target && e.target.id=="back"){
       console.log("back pressed")
       if(current_item.length>1){
        // remove current item
        var current = document.getElementById(
            current_item[current_item.length-1].container_id
        )
        fadeOutElement(current,afterCallBack = function(e){
            while(e.firstChild)
                e.removeChild(e.firstChild)
            e.remove()
        })
        current_item.pop()
        var prev = document.getElementById(
            current_item[current_item.length-1].container_id
        )
        fadeInElement(prev,beforeCallBack = function(e){
            e.style.display=""
        })
       }
   }

}

function getCurrentGenreInfo(){
    var oReq = new XMLHttpRequest()
    oReq.addEventListener("load", infoResponseListener)
    oReq.open("GET", document.location.origin + "/query/genre/info"+"?"+"genre="+current_item[current_item.length-1].name)
    oReq.send()
}


/*
/*  Listeners for the responses for the
/*  asynchronous http requests
*/
function infoResponseListener(e){
    console.log(this.response)
    var data = JSON.parse(this.responseText)
    var c = current_item[current_item.length-1]
    if(c.type=="genre")c.origin = data["data"]["origin"].toString().replace("-","")        
    current_item[current_item.length-1].description = data["data"]["abstract"]
    current_item[current_item.length-1].draw()
}

function subgenresResponseListener(e){
    console.log(this.response)
    var data = JSON.parse(this.responseText)
    var subgenres = data["data"]
    current_item[current_item.length-1].sub_genres = subgenres
    for(var i=0;i<subgenres.length;i++){
        var subgenre = subgenres[i]
        var subItem = new SubItem(subgenre,"subgenre")
        subItem.draw()
        var elem = document.getElementById(subItem.container_id)
        fadeInElement(elem)
    }
}

function fusiongenresResponseListener(e){
    console.log(this.response)
    var data = JSON.parse(this.responseText)
    var fusiongenres = data["data"]
    current_item[current_item.length-1].fus_genres = fusiongenres
    for(var i=0;i<fusiongenres.length;i++){
        var fusiongenre = fusiongenres[i]
        var subItem = new SubItem(fusiongenre,"fusiongenre")
        subItem.draw()
        var elem = document.getElementById(subItem.container_id)
        fadeInElement(elem)
    }
}

/*
/* Helper functions to perform
/* animations
*/
function fadeOutElement(element,beforeCallBack=null,afterCallBack=null){
    if(beforeCallBack!=null)beforeCallBack(element)
    element.style.animation = "fadeOut 5s"
    element.style.animationFillMode="forwards"
    if(afterCallBack!=null)element.addEventListener("animationend",afterCallBack)
    for(var i=0;i<element.children.length;i++){
        if(beforeCallBack!=null)beforeCallBack(element.children[i])
        element.children[i].style.animation = "fadeOut 5s"
        element.children[i].style.animationFillMode="forwards"
        if(afterCallBack!=null)element.children[i].addEventListener("animationend",afterCallBack)
    }
}

function fadeInElement(element,beforeCallBack=null,afterCallBack=null){
    if(beforeCallBack!=null)beforeCallBack(element)
    element.style.animation = "fadeIn 5s"
    element.style.animationFillMode="forwards"
    if(afterCallBack!=null)element.addEventListener("animationend",afterCallBack)
    for(var i=0;i<element.children.length;i++){
        if(beforeCallBack!=null)beforeCallBack(element.children[i])
        element.children[i].style.animation = "fadeIn 5s"
        element.children[i].style.animationFillMode="forwards"
        if(afterCallBack!=null)element.children[i].addEventListener("animationend",afterCallBack)
    }
}

/* 
/* Helper functions to manipulate DOM
*/
function removeElementAndChild(e){
    while(e.firstChild)
        e.removeChild(e.firstChild)
    e.remove()
}


document.body.onload = function(){
    current_item.push(new MainItem("Rock_music","genre"))
    getCurrentGenreInfo()
    document.addEventListener('click',clickListeners)
}

