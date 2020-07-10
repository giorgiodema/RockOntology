var MusicGenre = function(name,origin){
    this.name = name
    this.origin = origin
}
MusicGenre.prototype.draw = function(){
    var container =     '<div class="item_genre_container" id="div_genre_'+this.name+'" name='+this.name+'>\
                            <p class="genre_title">'+this.name.replace("_"," ")+'</p>\
                            <p class="genre_origin">'+this.origin+'</p>\
                        </div>'
    var popup = '       <ul class=popup_genre id="popup_genre_'+this.name+'">\
                            <li><p>More Info</p></li>\
                            <li><p>Subgenres</p></li>\
                            <li><p>Fusion Genres</p></li>\
                            <li><p>Artists</p></li>\
                            <li><p>Groups</p></li>\
                        </ul>'
    document.getElementById('main_container').innerHTML += container + popup
    document.addEventListener('click',function(e){
        if(e.target && e.target.className=="item_genre_container"){
            var popup = document.getElementById("popup_genre_"+e.target.getAttribute("name"))
            if(popup.style.visibility=="collapse")
                popup.style.visibility="visible"
            else
                popup.style.visibility="collapse"
        }
    })
}


document.body.onload = function(){
    var rock_music = new MusicGenre("Rock_music","1960")
    rock_music.draw()
}

