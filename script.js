var searchbox = $("input#searchbox");
var button = $("button#search");
var more = $("#more");
var radio = "";
var resultName = $("h2");
var nextUrl = "";
var pic = "default.png";
var link = "";
var title = "";

button.on("click", function() {
    $(".results").html("");
    if ($("#album").is(":checked")) {
        radio = "album";
    } else {
        radio = "artist";
    }

    $.ajax({
        url: "https://elegant-croissant.glitch.me/spotify",
        data: {
            q: searchbox.val().toLowerCase(),
            type: radio
        },
        success: function(data) {
            data = data.artists || data.albums;
            //console.log(data);
            //console.log(data.items.length);

            resultName.html(
                "Here the results for <span>" +
                    searchbox.val() +
                    "</span> in the category <span>" +
                    radio +
                    "</span>"
            );
            for (var i = 0; i < data.items.length; i++) {
                if (data.items[i].images[0]) {
                    pic = data.items[i].images[0].url;
                } else {
                    pic = "default.png";
                }
                link = data.items[i].uri;
                title = data.items[i].name;
                //console.log("I'm in the for ", data.items[i]);
                $(".results").append(
                    '<div class="item"><img src="' +
                        pic +
                        '" alt="' +
                        name +
                        '" /><a href="' +
                        link +
                        '" target="blank">' +
                        title +
                        "</a></div>"
                );
            }

            if (data.next) {
                nextUrl = data.next;
                nextUrl = nextUrl.replace(
                    "https://api.spotify.com/v1/search",
                    "https://elegant-croissant.glitch.me/spotify"
                );
                console.log(nextUrl);

                timeToScroll();
            }
        }
    });
});

function timeToScroll() {
    var winH = $(window).height();
    var docH = $(document).height();
    var scrolled = $(window).scrollTop();
    console.log(docH);
    if (scrolled + winH == docH) {
        nextData();
    } else {
        var timing = setTimeout(timeToScroll, 250);
    }
}

function nextData() {
    console.log("I'm in");
    $.ajax({
        url: nextUrl,
        success: function(data) {
            data = data.artists || data.albums;
            //console.log(data);
            //console.log(data.items.length);

            for (var i = 0; i < data.items.length; i++) {
                if (data.items[i].images[0]) {
                    pic = data.items[i].images[0].url;
                } else {
                    pic = "default.png";
                }
                link = data.items[i].uri;
                title = data.items[i].name;
                $(".results").append(
                    '<div class="item"><img src="' +
                        pic +
                        '" alt="' +
                        name +
                        '" /><a href="' +
                        link +
                        '" target="blank">' +
                        title +
                        "</a></div>"
                );
            }
            if (data.next && timeToScroll) {
                nextUrl = data.next;
                console.log("again!");
                nextUrl = nextUrl.replace(
                    "https://api.spotify.com/v1/search",
                    "https://elegant-croissant.glitch.me/spotify"
                );
                timeToScroll();
            } else {
                clearTimeout(timing);
            }
        }
    });
}
