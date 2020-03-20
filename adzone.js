/* Adzone RM (C) Adzone SRL - All Rights Reserved - latest*/

(function(t) {

t.s=t.s || {};
t.styles = t.styles||{};
t.values = t.values||{};
t.helpers = {};

t.formats = {
    100:{n:"html5"},
    101:{n:"push"},
    102:{n:"push"},
    103:{n:"itt"},
    104:{n:"itt"},
    105:{n:"video_banner"},
    108:{n:"footer"},
    109:{n:"footer_expand"},
    112:{n:"itt_video"},
    115:{n:"double_top_sticky"},
    117:{n:"push_on_click"},
    119:{n:"footer_to_itt"},
    120:{n:"header_push"},
    201:{n:"flipbook"},
    202:{n:"parallax"},
    203:{n:"panorama"},
    217:{n:"scroller"},
};

t.slotRendered = function(event) {
  t.adEvents = t.adEvents || [];
  t.adEvents.push(event);
  var d = event.slot.getSlotElementId();
  var slot = document.getElementById(d);
  var parent = slot.parentElement;
  parent.id = parent.id || d + "_parent";
  t.s[d] = new t.instanceAd();
  t.s[d].slot = slot;
  t.s[d].parentSlot = parent;
  t.s[d].parentId = parent.id;
  t.s[d].divId = d;
  t.s[d].event = event;
  if(event.isEmpty) {
    t.s[d].width = 0;
    t.s[d].height = 0;
  } else {
    t.s[d].width = event.size[0];
    t.s[d].height = event.size[1];
  }
};

t.instanceAd = function(format) {
  "use strict";
  this.values = {};
  this.set = function(name, value) {
    this.values[name] = value;
    return this;
  };
  this.get = function(name) {
    return(this.values[name] !== null ? this.values[name] : null);
  };
};

t.r=function(e) {
  "use strict";
  var c = t.c;
  //console.log("c.length",c.length,t.c);
  t.c = [];
  for (var i = 0; i < c.length; i++) {
    //console.log(c[i].m.data,c[i]);
    if(c[i].m) { // creative msg
      t.readFormatMessage(c[i].m);
    } else if(c[i].r) { // creative rendered
      t.slotRendered(c[i].r);
    }
  };
}

t.readFormatMessage = function(e) {
  "use strict";
  var msg = (e.data && e.data.m) ? e.data.m : "";
  var action = e.data.a || false;
  if(msg == "adzone" && action) {
    var format_id = e.data.f || false;
    if(t.formats[format_id]) {
      var adId = e.data.div_id || t.getIdFromMsg(e);
      console.log(adId);
      console.log(t.s[adId]);
      if(action=="print" && t.s[adId].printed) {
        console.log("ignore dual print in "+adId);
        return;
      } else if(action=="print") {
        t.s[adId].printed = true;
      }

      var format_name = t.formats[format_id].n;
      var params = e.data.p || {};
      var creative_name = e.data.n || "";
      if(!t.s[adId].format_id) { 
        t.helpers[format_name](t.s[adId]);
        t.s[adId].format_id=format_id; 
        params.type&&(t.s[adId].type=params.type); 
        t.s[adId].set("window", e.source);
        params.events&&(t.s[adId].events=params.events); 
      }
      if(creative_name && !t.s[adId].c_name) { t.s[adId].creative_name=creative_name; }
      t.s[adId]["_"+action]&&t.s[adId]["_"+action](t.s[adId], params);
      !e.data.nt && t.p(adId, action);
    }
  }
};


t.getIdFromMsg = function(e) {
  "use strict";
  var i =  null;
  try {
      var messageOrigin = e.source;
      var sourceWin = null;
      var sourceFrame = null;
      for (i = 0; i < window.frames.length; ++i) {
        if (messageOrigin.parent.parent.parent == window.frames[i] ||
            messageOrigin.parent.parent == window.frames[i] ||
            messageOrigin.parent == window.frames[i] ||
            messageOrigin == window.frames[i]) {
          sourceWin = window.frames[i];
          break;
        }
      }
    if (sourceWin) {
      var iframes = document.getElementsByTagName('iframe');
      for (i = 0; i < iframes.length; ++i) {
        if (iframes[i].contentWindow == sourceWin) {
          sourceFrame = iframes[i];
          break;
        }
      }
      var id = sourceFrame.parentElement.parentElement.id;
      if(id in t.s) { return id; }
      id = sourceFrame.parentElement.id;
      if(id in t.s) { return id; }
    }
  } catch (ex) {
  }
  return false;
};


t.enableScroll = function() {
  "use strict";

  t.set("scrollEnabled", true);
  window.addEventListener("scroll", function() {
    if(t.scrollTimeout) {
      t.scroll();
    }
  });
  t.scroll();
};

t.scroll = function() {
  console.log("adzone_scroll");
  "use strict";
  t.scrollTimeout = false;
  setTimeout(function() {
    t.scrollTimeout = true;
  }, 100);

  Object.keys(t.s).forEach(function(i, index) {
    if(t.s[i].onScroll) {
      t.s[i].onScroll();
    }
    if(t.lazy) {
      var d = t.s[i];
      if(t.elementInViewport(d.slot) && !t.printedSlots[d.divId]) {
        t.printedSlots[d.divId] = true;

        t.refresh(d.divId, {
          changeCorrelator: false
        });
      }
    }
  });
};

t.elementInViewport = function(el) {
  "use strict";

  var rect = el.getBoundingClientRect();

  var tooLeft = (rect.left < 0);
  var tooBottom = (rect.top - 300) > (t.device.isMobile ? screen.height : (
    window.innerHeight || document.documentElement.clientHeight));
  var tooTop = (rect.bottom < 0);

  var viewable = !tooLeft && !tooBottom && !tooTop;
  console.log("viewable", viewable);
  return viewable;
};

t.set = function(k, v) {
  // set a an adzone scope variable
  "use strict";
  t.values[k] = v;
};
t.get = function(k) {
  // get a an adzone scope value
  "use strict";
  return t.values[k] || null;
};

t.send_click = function(id) {
  t.p(id, "click");
  if(t.s[id]) {
    t.s[id].get("window").postMessage({click:true}, "*");
  }
}


window.addEventListener("resize", t.resize_window);
t.resize_window = function() {
  t.set("window_height", window.innerHeight);
  t.set("window_width", window.innerWidth);
}
t.resize_window();

t.p = function(ad_id, action) {
  var ad = t.s[ad_id];
  console.log("log",ad_id,action,ad);
  var p = {  
    w: ad.width,
    h: ad.height,
    hx: Math.round(t.get("window_height")/100),
    wx: Math.round(t.get("window_width")/100),
    f: ad.format_id,
    n: ad.creative_name,
    s: ad_id,
    a: action,
    t: document.location.host,
    p: document.location.pathname,
    y: ad.type || ""
  }
  d = "";
  for(var i in p) {
    d += (d==""?"":"&")+i+"="+encodeURIComponent(p[i]);
  }
  var im = new Image();
  var cb = Date.now()+""+Math.ceil(Math.random()*1000)
  im.src = 'https://lb.adzone.io/p.gif?' + d+"&cb="+cb;    
  if(ad.events) {
    for(var i in ad.events){
      var e=ad.events[i];
      if(e.u&&e.a&&e.a==action){
        var im = new Image();
        var amp = (e.u.indexOf("?")>0?"&":"?");
        im.src = e.u+amp+cb;
      }
    }
  }
}

t.device = {
  isMobile: (/Mobi/.test(navigator.userAgent)),
  isTablet: (screen.width < 800 || screen.height < 800),
  isDesktop: !(/Mobi/.test(navigator.userAgent))
};

t.set_debug_button = function() {
  "use strict";

  var d = document.createElement("link");
  d.href = "https://fonts.googleapis.com/css?family=Roboto%20Mono";
  d.rel = "stylesheet";
  d.type = "text/css";
  document.head.appendChild(d);

  d = document.createElement("div");
  d.style.cssText="float:right;margin:0 0 0 0";
  d.innerHTML = "<meta name='viewport' content='width=device-width, " +
    "initial-scale=1.0'>" +
    "<style>.adzone-button button {font-weight:bold;border-width:0;" +
    "  outline: none;border-radius: 2px;box-shadow: 0 1px 4px rgba(0, 0, 0, .6);" +
    "  background-color: #00A2EA;color: white;transition: background-color .3s;" +
    "  padding:0;}" +
    ".adzone-button button:hover, .adsbtn:focus { background-color: #2980b9; }" +
    ".adzone-button span { display: block;padding:4px 10px 4px 10px}" +
    "</style>" +
    "<a href='javascript:adzone.debug()' class='adzone-button' style='z-index:10000000'><button id='adzone-button-button'>" +
    "<span id='adzone-button-text' style='font-size:13px'></span></button></a>";
  t.get_adzone_tools().appendChild(d);
}
t.check_debug = function() {
  "use strict";

  //if(document.location.href.indexOf("ads.debug=false") > 0) {
  //  localStorage.removeItem("ads.debug");
  //  localStorage.removeItem("adzone-debug-mode");
  //} else 
  t.force_debug && t.force_debug();

  if((document.location.href.indexOf("ads.debug") > 0) && !localStorage.getItem("ads.debug")) {
    localStorage.setItem("ads.debug", true);
    localStorage.setItem("adzone-debug-mode", 1);
  }

  if(localStorage.getItem("ads.debug")) {
    t.set_debug_button();
    if(localStorage.getItem("adzone-debug-mode") * 1 == 2) {
      document.getElementById("adzone-button-text").innerHTML = "overlay";
      localStorage.setItem("adzone-debug-mode", 1);
      t.debug();
    } else {
      localStorage.removeItem("adzone-debug-mode");
      document.getElementById("adzone-button-text").innerHTML = "debug";
    }
  }
};
t.debug = function() {
  "use strict";
  if(t.d && t.d.clickButton) {
    t.d.clickButton();
  } else {
    var s = document.createElement("script");
    s.src = "https://adzone.io/dev-only/debug.js?" +
      Math.random();
    document.head.appendChild(s);
  }
};
t.get_adzone_tools = function() {
  var at=document.getElementById("adzone_tools");
  if(!at) {
    var d = document.createElement("div");
    d.id='adzone_tools';
    d.style.cssText="position:fixed;bottom:0;right:0;z-index:10000000;opacity:0.7";
    document.body.appendChild(d);
    at=document.getElementById("adzone_tools");
  }
  return at;  
}

t.set_adstest = function() {
  var adstest=localStorage.getItem("adzone-adstest");
  try {
    var url = new URL(document.location.href);
    adstest = url.searchParams.get("ads.test");
  } catch(ex) {}
  if(adstest == "false"||adstest == "none"||adstest == "") {
    localStorage.removeItem("adzone-adstest");
  } else if(adstest !== "") {
    localStorage.setItem("adzone-adstest", adstest);
  }
  t.adstest = adstest;
}

t.set_adstest_button = function() {
  var adstest=localStorage.getItem("adzone-adstest");

  d = document.createElement("div");
  d.style.cssText = "border-radius: 2px;cursor:pointer;float:right;background-color:" +
    "#00A2EA;color:white;font-weight:bold;font-family:Helvetica,Arial;" +
    "font-size:13px;padding:4px 10px 4px 10px;z-index:10000000";
  d.innerHTML = "adstest: " + adstest;
  t.get_adzone_tools().appendChild(d);
  t.blue_button=true;
}

t.set_adstest();

t.check_debug();
t.r();

})(adzone);

adzone.helpers.html5 = function(t) {
  "use strict";
  
  t._print = function(t,p) {
    console.log("print html5 ad");
  }
};

// 101, 102
adzone.helpers.push = function(t) {
  "use strict";
  t._print = function(t,p) { 
    if(t.get("window") && !t.get("stylesSet")) {
      t.set("stylesSet", true);
      var msg = {
        iconsStyle: adzone.styles.push_style,
        openIconHTML: adzone.styles.push_expand,
        closeIconHTML: adzone.styles.push_collapse,
      }
      t.get("window").postMessage(msg, "*");
    }

    if(!p.expandedHeight && adzone.styles.push && adzone.styles.push.expandedHeight) {
      p.expandedHeight = adzone.styles.push.expandedHeight;
    }
    if(!p.collapsedHeight && adzone.styles.push && adzone.styles.push.collapsedHeight) {
      p.collapsedHeight = adzone.styles.push.collapsedHeight;
    }

    t.set("expandedHeight", p.expandedHeight);
    t.set("collapsedHeight", p.collapsedHeight);

    t.parentSlot.style.overflow = "hidden";
    if(p.transition) {
      t.parentSlot.style.transition = "height " + (p.transition / 1000) +
        "s ease-in";
    }
  }
  
  t._collapse = function(t,p) {
    t.parentSlot.style.height = t.get("collapsedHeight") + "px";
  }

  t._expand = function(t,p) {
    t.parentSlot.style.height = t.get("expandedHeight") + "px";
  }
};

// 103,104
adzone.helpers.itt = function(t) {
  "use strict";
  t._print = function(t, params) { 
    adzone.helpers.itt_run(t, params);
  }
};
adzone.helpers.ittHide = function(containerId) { 
  adzone.log("ittHide", containerId);
  document.body.style.overflow = adzone.old_body_overflow || "";
  document.body.style.height = adzone.old_body_height || "";
  document.getElementById("adzone_prestitial_cover") && (document.getElementById("adzone_prestitial_cover").style.display="none");
  var t = adzone.s[containerId];
  
  "use strict";
  var c = document.getElementById(containerId);
  c.style.display="none";
  c.style.height = 0;
  c.style.width = 0;
  c.style.marginTop = 0;
  c.style.marginLeft = 0;
  c.style.left = 0;

  window.clearTimeout(adzone.s[containerId].closeTimeout);
  window.setTimeout(function() {
    c.parentElement.style.display = "none";
    document.getElementById('adzone_ittIcon_c_' + containerId).style.display="none";

    if(t.close_callback) {    
      t.close_callback(t);
    } else {
      adzone.p(containerId,"close");
    }

  }, c.dataset.transition);

};

adzone.helpers.ittShow = function(containerId) {
"use strict";
  var c = document.getElementById(containerId);
  window.setTimeout(function() {
    /*
    if(c.parentElement.parentElement && c.parentElement.parentElement.parentElement &&
       c.parentElement.parentElement.parentElement.style.display=="none") {
      c.parentElement.parentElement.parentElement.style.display=a;
    }
    */
    c.parentElement.parentElement.style.display = "";
    c.parentElement.style.display="";
    c.style.left = "50%";
    c.style.marginTop = c.dataset.marginTop;
    c.style.marginLeft = c.dataset.marginLeft;
    c.style.width = c.dataset.expandedWidth + "px";
    c.style.height = c.dataset.expandedHeight + "px";
  }, 50);
  adzone.old_body_overflow = document.body.style.overflow;
  adzone.old_body_height = document.body.style.height;
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";
};

adzone.helpers.itt_run = function(t, params) {
  params.show = true;
    params.height = params.height || t.height;
    params.width = params.width || t.width;
    params.transition = (params.transition ? params.transition * 1 : 0);

    var div = params.div || t.slot;
    var parent = div.parentElement;
    var parentId = parent.id;

    div.style.position = "fixed";
    div.style.left = "0px";
    div.style.top = "0px";
    if(!params.backgroundColor || params.backgroundColor === "") {
      params.backgroundColor = "white";
    }
    div.style.backgroundColor = params.backgroundColor;
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.zIndex = "1000000";

    var marginLeft = -(params.width / 2) + "px";
    var marginTop = -(params.height / 2) + "px";
    var iconRight = (params.width / 2 - 53);
    var iconTop = -(params.height / 2);

    var iframe = params.iframe || div.getElementsByTagName("iframe")[0];
    if(document.getElementById('adzone_ittIcon_c_' + div.id)) {
      document.getElementById('adzone_ittIcon_c_' + div.id).style.display="";
    } else {
      var iconDiv = document.createElement("div");

      iframe.style.maxHeight = params.height + "px";
      iframe.style.maxWidth = params.width + "px";

      iconDiv.id='adzone_ittIcon_c_' + div.id;
      iconDiv.style.height = "0px";
      iconDiv.style.width = params.width + "px";
      iconDiv.style.left = "50%";
      iconDiv.style.top = "50%";
      iconDiv.style.position = "absolute";
      iconDiv.style.marginLeft = "-55px";
      iconDiv.style.marginTop = "5px";

      iconDiv.innerHTML = "<div id='adzone_ittIcon_" + div.id +
        "' style='position:absolute;display:;" +
        "right:" + iconRight + "px; top:" + iconTop +
        "px;z-index:1000001;cursor:pointer' onclick='adzone.helpers.ittHide(\""+div.id+"\");'>" +
        adzone.styles.prestitial_close + "</div>";
      div.appendChild(iconDiv);
    }
    iframe.style.top = "50%";
    iframe.style.position = "absolute";
    iframe.dataset.marginTop = marginTop;
    iframe.dataset.marginLeft = marginLeft;
    iframe.dataset.expandedWidth = params.width;
    iframe.dataset.expandedHeight = params.height;
    iframe.parentElement.parentElement.style.display = "none";
    iframe.dataset.transition = params.transition;

    if(params.show) {
      adzone.helpers.ittShow(iframe.id);
    } else {
      adzone.helpers.ittHide(iframe.id);
    }
    if(params.transition) {
      iframe.style.transition = "all 0.25s ease-in";
    }

    if(params.autoclose && params.autoclose>0) {
      t.closeTimeout = window.setTimeout(function() {
        adzone.helpers.ittHide(div.id);
      }, params.autoclose * 1000);
    }

    var screenWidth =
      (adzone.device.isMobile ? screen.width : window.innerWidth);
    var screenHeight =
      (adzone.device.isMobile ? screen.height : window.innerHeight);
    if(params.width > (screenWidth - 20) || params.height > (screenHeight - 20)) {
      adzone.helpers.ittFixButtonTopRight("adzone_ittIcon_" + parentId);
    }
}

adzone.helpers.video_banner = function(t) {
  //console.log("Run FLIPBOOK",t);
  "use strict";
  t._print = function(t, params) { 

    params.video = params.local_dir + params.video;
    params.end_image = params.local_dir + params.end_image;
    t.set("params", params);
    t.set("video_url", params.video);
    t.set("end_image", params.end_image);

    var tag = "<div class='adzone_obs' style='width:1px;height:1px;position:absolute'></div>"
        +"<video crossOrigin autoplay muted playsinline style='cursor:pointer;display:;width:"+t.width+"px;height:"+t.height+"px;'>"
          +"<source src='"+params.video+"' type='video/mp4'>"
        +"</video>"
        +"<img class='end_image' style='cursor:pointer;display:none;width:"+t.width+"px;height:"+t.height+"px;' src='"+params.end_image+"'>"
      +"<div class='controls' style='display:;position:absolute;bottom:10px;right:10px;cursor:pointer;z-index:6000002'>"
        +"<img class='reload' onclick='adzone.s."+t.divId+".reload()' style='display:none;width:24px;height:24px;float:left;margin:0 10px' src='https://cdn.jsdelivr.net/gh/adzone-io/rm@1.0.0/icon/round_sync_white_48dp.png'>"
        +"<img class='sound' onclick='adzone.s."+t.divId+".sound(this)' style='width:24px;height:24px;float:left' src='https://cdn.jsdelivr.net/gh/adzone-io/rm@1.0.0/icon/round_volume_off_white_48dp.png'>"
        +"</div>"
      +"</div>";

    
    t.slot.querySelector("iframe").style.display="none";
    var d =document.createElement("div");
    d.id = "new_slot";
    d.innerHTML = tag;
    t.slot.appendChild(d);
    t.slot = t.slot.querySelector("#new_slot");

    t.obs = t.slot.querySelector(".adzone_obs");
    t.slot.style.height=t.height+"px";
    t.slot.style.width=t.width+"px";
    t.slot.style.display="block";
    t.slot.style.position="relative";

    t.video = t.slot.querySelector("video");
    t.video.addEventListener('click', function(){ adzone.send_click(t.divId); }, false);
    t.video.onended = function() { 
      t.video_ended = true;
      adzone.p(t.divId,"video_end"); 
      t.reload_img.style.display=""; 
      if(t.end_image) {
        t.end_image.style.display="";
        t.video.style.display="none";
      }
    };
    t.controls = t.slot.querySelector(".controls");
    t.sound_img = t.controls.querySelector(".sound");
    t.reload_img = t.controls.querySelector(".reload");
    t.end_image = t.slot.querySelector(".end_image");
    t.end_image && t.end_image.addEventListener('click', function(){ adzone.send_click(t.divId); }, false);
    t.video.volume = 0;
    t.muted=true;
//    t.video.play();

    if(t.get("end_image")!="") {
      t.end_image.src = t.get("end_image");
    } else {
      t.end_image = false;
    }

    var wh = (window.innerHeight || document.documentElement.clientHeight);
    var options = {
      root: null,
      rootMargin: "0px 0px -"+(t.height)+"px 0px",
      threshold: 1.0
    }
    var observer = new IntersectionObserver(t.observer_callback, options);
    observer.observe(t.obs);

  }

  t.sound = function() {
    if(t.muted) {
      t.sound_on();
    } else {
      t.sound_off();
    }
  }

  t.sound_off = function() {
    window.clearTimeout(t.sound_timeout);
    t.sound_img.src='https://cdn.jsdelivr.net/gh/adzone-io/rm@1.0.0/icon/round_volume_off_white_48dp.png';
    t.muted=true;
    if(!t.video.muted && t.video.volume >= 0.1) {
      t.video.volume = Math.round((t.video.volume - 0.1)*10)/10;
      t.sound_timeout = window.setTimeout(t.sound_off,50);
    } else {
      t.video.muted=true;
    }
    window.setTimeout(function(){ t.video.muted=true; },500);
  }
  t.sound_on = function() {
    window.clearTimeout(t.sound_timeout);
    t.sound_img.src='https://cdn.jsdelivr.net/gh/adzone-io/rm@1.0.0/icon/round_volume_up_white_48dp.png';
    t.muted=false;
    t.video.muted=false;
    if(t.video.volume <= 0.9) {
      t.video.volume = Math.round((t.video.volume + 0.1)*10)/10;
      t.sound_timeout = window.setTimeout(t.sound_on,50);
    } else {
      adzone.p(t.divId,"sound_on");
    }
  }

  t.reload = function() {
    t.video_ended=false;
    t.end_image && (t.end_image.style.display="none");
    adzone.p(t.divId,"reload"); 
    t.video.style.display="";
    t.currentTime=0;
    t.video.play();
    t.reload_img.style.display="none";

  }

  t.create_observer = function(rootMargin) {
    //console.log(rootMargin);
  }

  t.observer_callback = (entries, observer) => {
    entries.forEach(entry => {
      //console.log(entry);
      if(!t.video_ended) {
        if(entry.isIntersecting) { 
          t.video.play(); 
        } else {
          t.video.pause(); 
        }
      }
    });
  };

}

// 108
adzone.helpers.footer = function(t) {
  "use strict";
  t._print = function(t, p) { 
    adzone.helpers.footer_run(t,p);
  }
};

adzone.helpers.footer_run = function(t,p){
    if(p.height) {
      t.height=p.height;
    }
    var div = t.slot;
    div.style.position="relative";
    var containerDiv = t.parentSlot;
    containerDiv.style.display = "";
    containerDiv.style.zIndex = 9000;
    containerDiv.style.background = "none repeat scroll 0 0 transparent";
    containerDiv.style.position = "fixed";
    containerDiv.style.textAlign = "center";
    containerDiv.style.bottom = "0px";
    containerDiv.style.left = "0px";
    containerDiv.style.width = "100%";
    containerDiv.style.height = t.height+"px";
    containerDiv.style.minHeight = "0px";
    containerDiv.style.minWidth = "0px";

    var iframe = containerDiv.getElementsByTagName("iframe")[0];
    iframe.style.background = "none repeat scroll 0 0 white";
    iframe.style.margin = "auto";

    var iconMarginRight = -(t.width / 2);
    if(!document.getElementById("adzone_footer_text_c_" + div.id)) {
        var newDiv = document.createElement("div");
        newDiv.id = "adzone_footer_text_c_" + div.id;
        newDiv.style.position="absolute";
        newDiv.style.right="0px";
        newDiv.style.top="0px";
        newDiv.style.cursor="pointer";
        newDiv.innerHTML = "<div id='adzone_footer_text_" + div.id +
          "' onclick=\"adzone.p('"+t.divId+"','close');document.getElementById('" + div.id +
          "').parentElement.style.display = 'none'\">" +
          adzone.styles.footer_close + "</div>";
        div.appendChild(newDiv);
    }
//    div.style.marginTop = adzone.styles.footerFixed.iconMarginTop + "px";
    div.style.display = "inline-block";    
}

//109
adzone.helpers.footer_expand = function(t, p) {
  "use strict";
  t._print = function(t, p) { 
    adzone.helpers.footer_run(t, p);

    if(p.transition) {
      t.parentSlot.style.transition = "height " + (p.transition / 1000) +
        "s ease-in";
    }

    if(p.expandedHeight) { t.set("expandedHeight", p.expandedHeight); }
    if(p.collapsedHeight) { t.set("collapsedHeight", p.collapsedHeight); }
    if(p.transition) { t.set("transition", p.transition); }
    if(p.expandOn) { t.set("expandOn", p.expandOn); }
    if(p.expandMS) { t.set("expandMS", p.expandMS); }
    if(t.get("expandOn") == "mouseover") {
      adzone.helpers.footerExpandMouseOver(t, p);
    } else { // expand on click
      adzone.helpers.footerExpandClick(t, p);
    }
    adzone.helpers.footerExpandClickCollapse(t.slot.id);
    t.parentSlot.style.display = "";
    t.is_expanded = false;
  }
};
adzone.helpers.footerExpandMouseOver = function(t, p) {
  "use strict";
  var div = t.slot;
  var containerDiv = t.parentSlot;

  if(p.expand) {
    if(document.getElementById("adzone_footer_text_" + div.id)) {
      document.getElementById("adzone_footer_text_" + div.id).style.display = "none";
    }
    containerDiv.style.height = t.get("expandedHeight") + "px";
  } else {
    containerDiv.style.height = t.get("collapsedHeight") + "px";
    if(document.getElementById("adzone_footer_text_" + div.id)) {
      document.getElementById("adzone_footer_text_" + div.id).style.display = ""; }
  }
};

adzone.helpers.footerExpandClick = function(t, p) {
  "use strict";
  var div = t.slot;
  var containerDiv = t.parentSlot;
  //var iconMarginRight = -(t.width / 2);
/*
  var html = "<div id='adzone_footer_text_" + div.id +
    "' style='position:absolute;display:inline-block;right:0px;top:0px;cursor:pointer;width:200px' >" +
    "<div id='adzone_footer_text_close_" + div.id +
    "' style='float:right' " +
    "onclick='adzone.helpers.footerExpandClickCollapse(\"" +
    div.id + "\")'>" + adzone.styles.footerFixed.closeImg + "</div>" +
    "<div id='adzone_footer_text_open_" + div.id +
    "' style='float:right' " +
    " onclick='adzone.helpers.footerExpandClickExpand(\"" +
    div.id + "\")'>" + adzone.styles.footerFixed.openImg + "</div>" +
    "</div>";
*/

  var html = `
      <div id='adzone_footer_text_close_` + div.id + `' style='display:inline-block' onclick='adzone.helpers.footerExpandClickCollapse("` + div.id + `")'>
        ` + adzone.styles.footer_expand_close + `</div>
      <div id='adzone_footer_text_open_` + div.id + `' style='display:inline-block' onclick='adzone.helpers.footerExpandClickExpand("` + div.id + `")'>
        ` + adzone.styles.footer_expand_open + `</div>
    `;
  
  document.getElementById("adzone_footer_text_c_" + div.id).innerHTML = html;

  containerDiv.style.height = ((t.get("collapsedHeight") * 1) ); //+ (adzone.styles.footerFixed.iconMarginTop * 1)) + "px";
  containerDiv.style.display = "block";
};

adzone.helpers.footerExpandClickExpand = function(adId) {
  "use strict";
  var t = adzone.s[adId];
  t.is_expanded = true;
  adzone.p(adId,"expand")
  var div = t.slot;
  window.setTimeout(function() {
    t.parentSlot.style.height = t.get("expandedHeight") + "px";
  }, 50);
  t.get("window").postMessage({ expand: true }, "*");
  document.getElementById("adzone_footer_text_open_" + div.id).style.display = "none";
};

adzone.helpers.footerExpandClickCollapse = function(adId) {
  "use strict";
  var t = adzone.s[adId];
  var div = t.slot;

  if(t.is_expanded) {
    adzone.p(adId,"collapse")
  } else {
    t.parentSlot.style.display = "none";
    adzone.p(adId,"close")
  }
  t.is_expanded = false;
  t.parentSlot.style.height = t.get("collapsedHeight") + "px";
  

  if(t.get("transition")>0) {
    window.setTimeout(function() {
      t.get("window").postMessage({ collapse: true }, "*");
    }, t.get("transition"));
  } else {
    t.get("window").postMessage({ collapse: true }, "*");
  }

  document.getElementById("adzone_footer_text_open_" + div.id).style.display =
    "";
};

adzone.helpers.itt_video = function(t) {
  "use strict";
  t._print = function(t, params) { 
    var div = t.slot;
    div.getElementsByTagName("iframe")[0].style.display = "none";

    var v = document.createElement("video");
    v.muted = "true";
    v.src = params.local_dir + params.videoURL;
    v.style.width = "100%";
    v.style.height = "100%";
    v.style.cursor = "pointer";
    v.id = "adzone_ittvideo_" + div.id;
    v.onclick = function() {
      adzone.send_click(div.id);
    };
    v.onended = function() { 
      adzone.p(t.divId,"video_end"); 
    }

    div.appendChild(v);
    params.iframe = document.getElementById(v.id);

    adzone.helpers.itt_run(t, params);
    params.iframe.play();
  }
};

adzone.helpers.double_top_sticky = function(t) {
  "use strict";

  t._print = function(t, p) { 

    console.log("adzone.helpers.doubletopsticky");
    if(p.width && p.width > 0) {
      t.set("transition", p.transitionTimeMs);
      t.set("inlineHeight", p.inlineHeight);
      t.set("stickyHeight", p.stickyHeight);
      t.set("maxHeight", Math.max(p.inlineHeight, p.stickyHeight));
      t.set("width", p.width);
      t.set("topMargin", (typeof(p.topMargin) == "undefined" ? 45 : p.topMargin));
      t.slot.parentElement.style.height = t.get("inlineHeight") + "px";
    }

    t.lastScrollTop = 0;
  }

  window.addEventListener("scroll", function() {
    t.doScroll();
  }, false);

  t.doScroll = function() {
    console.log("doScroll");
    var offsets =
      document.getElementById(t.parentSlot.id).getBoundingClientRect();
    var inlineBottom = offsets.top + (t.get("inlineHeight") * 1);

    var st = window.pageYOffset || document.documentElement.scrollTop;
    if(st > t.lastScrollTop) {
      if(inlineBottom < 0) {
        if(t.get("window") && !t.get("stickyOn")) { t.showSticky(true); }
      } else {
        if(t.get("window") && t.get("stickyOn")) { t.showSticky(false); }
      }
    } else if(st <= t.lastScrollTop) {
      if(t.get("window") && t.get("stickyOn")) { t.showSticky(false); }
    }
    t.lastScrollTop = st;
  };

  t.showSticky = function(stickyOn) {
    if(stickyOn) {
      t.slot.style.transition = "top 0s ease-in-out";
      t.slot.style.position = "fixed";
      t.slot.style.left = "50%";
      t.slot.style.marginLeft = "-" + (t.get("width") / 2) + "px";
      t.slot.style.height = t.get("stickyHeight") + "px";
      t.slot.style.top = '-' + (t.get("stickyHeight") * 2) + 'px';
      window.setTimeout(function() {
        t.slot.style.zIndex = 1200;
        t.slot.style.transition = "top " + (t.get("transition") / 1000) +
          "s ease-in-out";
        t.slot.style.top = t.get("topMargin") + 'px';
      }, 10);
      t.get("window").postMessage({
        sticky: "on"
      }, "*");
    } else {
      t.slot.style.top = '-' + (t.get("stickyHeight") * 2) + 'px';
      window.setTimeout(function() {
        t.slot.style.position = "";
        t.slot.style.left = "";
        t.slot.style.marginLeft = "";
        t.slot.style.height = t.get("inlineHeight") + "px";

        t.slot.style.top = "";
        t.get("window").postMessage({
          sticky: "off"
        }, "*");
      }, t.get("transition"));

    }

    t.set("stickyOn", stickyOn);
  };
  t.fn = function() {
    t.slot.classList.remove("adzone-doubletopsticky");
    t.get("window").postMessage({
      sticky: "off"
    }, "*");
    t.slot.style.display = "block";
    t.slot.style.position = "relative";
    t.slot.style.top = "";
    t.slot.innerHTML = "";
  };
};


adzone.helpers.push_on_click = function(t) {
  "use strict";

  t._print = function(t, p) { 

    if(p.expandedHeight) { t.set("expandedHeight", p.expandedHeight); }
    if(p.collapsedHeight) { t.set("collapsedHeight", p.collapsedHeight); }
    p.animatedTransition=p.animatedTransition||0;
    t.parentSlot.style.transition="height "+p.animatedTransition+"ms ease-in";
    t.parentSlot.style.overflow="hidden";
    t.parentSlot.style.height = t.get("collapsedHeight") + "px";
    t.parentSlot.style.display = adzone.startDisplay;
  }
  t._expand = function(t,p) {
    t.parentSlot.style.height = t.get("expandedHeight") + "px";
    adzone.p(t.divId,"expand"); 
  }
  t._collapse = function(t,p) {
    t.parentSlot.style.height = t.get("collapsedHeight") + "px";
  }
};


// 119
adzone.helpers.footer_to_itt = function(t) {
  "use strict";
  t._print = function(t, p) { 

    p.width = p.footer_width;
    p.height = p.footer_height;
    adzone.helpers.footer_run(t, p);

    if(p.expandMS) { t.set("expandMS", p.expandMS); }
    if(p.expand_action) { t.set("expand_action", p.expand_action); }
    if(p.footer_width) { t.set("footer_width", p.footer_width); }
    if(p.footer_height) { t.set("footer_height", p.footer_height); }
    if(p.itt_width) { t.set("itt_width", p.itt_width); }
    if(p.itt_height) { t.set("itt_height", p.itt_height); }

    t.expandTimeout = null;

    if(t.get("expand_action")=="mouseover") {
      t.set_mouseover();
    } 
  }
  t.set_mouseover = function() {
    t.slot.firstChild.onmouseover = function() {
      t.expandTimeout = window.setTimeout(function() {
        adzone.helpers.footerToITTExpand(t.slot.id);
      }, t.get("expandMS")*1);
    };
    t.slot.firstChild.onmouseout = function() {
      window.clearTimeout(t.expandTimeout);
    };
  }
  t.close_callback = function(t) {
    console.log("close_callback");
    adzone.p(t.slot.id, "close_itt");
    t.get("window").postMessage({m:"adzone", a:"collapse"}, "*");

    var p={};
    p.width = t.get("footer_width");
    p.height = t.get("footer_height");
    t.width = t.get("footer_width");
    t.height = t.get("footer_height");
    
    t.slot.style.cssText = "position:relative;display:inline-block;margin-top:0px";
    t.slot.querySelector("iframe").style.cssText = "width:"+t.width+"px;height:"+t.height+"px;overflow:hidden;border:0;margin:auto";
    adzone.helpers.footer_run(t, p);
    t.parentSlot.style.display = "";
    t.set_mouseover();
  }
  t._expand=function(){
    adzone.helpers.footerToITTExpand(t.slot.id);
    adzone.p(t.divId,"expand"); 
  }
};

adzone.helpers.footerToITTExpand = function(adId) {
  "use strict";
  var t = adzone.s[adId];
  adzone.p(t.slot.id, "expand");
  t.slot.firstChild.onmouseover="";
  console.log("footerToITTExpand", adId);
  t.get("window").postMessage({m:"adzone", a:"expand"}, "*");

  window.clearTimeout(t.expandTimeout);
  t.width = t.get("itt_width");
  t.height = t.get("itt_height");
  adzone.helpers.itt_run(t, {});

};

// 120
adzone.helpers.header_push = function(t) {
  "use strict";
  t._print = function(t, params) { 
    //adzone.helpers.itt_run(t, params);
    //window.scrollTo(0,0);
    document.getElementById("adzone_prestitial_cover") && (document.getElementById("adzone_prestitial_cover").style.display="none");

    t.slot.style.cssText=" height: 100vh; position: absolute; z-index: 10000000; background-color: #f5f5f5; width: 100%;"

    var d = document.createElement("div");
    d.style.cssText=" height: 100vh; background-color: transparent; width: 100%;";
    t.parentSlot.appendChild(d);
    t.parentSlot.classList.add("adzone_header_push");

    var i = t.slot.querySelector("iframe");
    i.style.cssText="width:"+t.width+"px;height:"+t.height+"px;border: 0pt none;left:50%;top:50%;position:absolute;margin-top:-"+(t.height/2)+"px;margin-left:-"+(t.width/2)+"px"

    var icon = document.createElement("img");
    icon.src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0MXB4IiBoZWlnaHQ9IjQxcHgiIHZpZXdCb3g9IjAgMCA0MSA0MSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT42QTA5MTRFMC01MjQyLTREQjgtODYzQy0wN0FFMDFDRDZCNUI8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+ICAgIDxnIGlkPSJIb21lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJCZXR0ZXJBZHNUTiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY0MC4wMDAwMDAsIC02MjcuMDAwMDAwKSI+ICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTEyNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjQwLjAwMDAwMCwgNjI2LjAwMDAwMCkiPiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDIiIGhlaWdodD0iNDIiPjwvcmVjdD4gICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTEyMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDIuMDAwMDAwKSI+ICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBzdHJva2U9IiMwMDhDRjciIHN0cm9rZS13aWR0aD0iMS43NiIgY3g9IjE5LjM0NCIgY3k9IjE5LjM0NCIgcj0iMTkuMzQ0Ij48L2NpcmNsZT4gICAgICAgICAgICAgICAgICAgIDxnIGlkPSJkb3dubG9hZC1hcnJvdy1jb3B5LTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTAuMDAwMDAwKSIgZmlsbD0iIzEzOEJFRiIgZmlsbC1ydWxlPSJub256ZXJvIj4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuMDY5MzMzNywxMS42Mjk4NTIxIEMxMy40OTM5Nzk0LDExLjI0MDI2IDE0LjE2MjUwOTUsMTEuMjQwMjYgMTQuNTg3MTU1MywxMS42Mjk4NTIxIEMxNC45OTc0NTQ5LDEyLjAxOTQ0NDMgMTQuOTk3NDU0OSwxMi42MzI3ODg3IDE0LjU4NzE1NTMsMTMuMDIyMzgwOCBMOC4yMjcwMzMxNywxOC44NTgzNjU5IEM4LjAzMDAxMjg0LDE5LjAzOTEyMjYgNy43NTY0Nzk3NywxOS4xNTA1NiA3LjQ1MzI5ODAxLDE5LjE1MDU2IEM3LjE1MDExNjI1LDE5LjE1MDU2IDYuODc2NTgzMTcsMTkuMDM5MTIyNiA2LjY3ODYwNjQ0LDE4Ljg1ODM2NTkgTDAuMzE4NDg0MzExLDEzLjAyMjM4MDggQy0wLjEwNjE2MTQzNywxMi42MzI3ODg3IC0wLjEwNjE2MTQzNywxMi4wMTk0NDQzIDAuMzE4NDg0MzExLDExLjYyOTg1MjEgQzAuNzQzMTMwMDU5LDExLjI0MDI2IDEuNDExNjYwMTksMTEuMjQwMjYgMS44MzYzMDU5NCwxMS42Mjk4NTIxIEw2LjM3NTQyNDY4LDE1LjgwODMxNTYgTDYuMzc1NDI0NjgsMC45NzQ4NTc4MzEgQzYuMzc0NDY4MjcsMC40MzE3MTAyMTkgNi44NjAzMjQyMSwwIDcuNDUyMzQxNiwwIEM4LjA0NDM1ODk4LDAgOC41MTQ5MTIzOCwwLjQzMTcxMDIxOSA4LjUxNDkxMjM4LDAuOTc0ODU3ODMxIEw4LjUxNDkxMjM4LDE1LjgwNzQzODIgTDEzLjA2OTMzMzcsMTEuNjI5ODUyMSBaIiBpZD0iUGF0aCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgICAgICA8L2c+ICAgICAgICAgICAgPC9nPiAgICAgICAgPC9nPiAgICA8L2c+PC9zdmc+";
    icon.style.cssText="cursor:pointer;width:30px;height:30px;border: 0pt none;left:calc(50% -  15px);top:calc(50% + "+(t.height/2+20)+"px);position:absolute;";
    icon.onclick=function() { adzone.helpers.header_push.scroll() };
    window.setTimeout(function() { t.slot.appendChild(icon); }, 2000 );

    document.getElementById("adzone_push_cover") && (document.getElementById("adzone_push_cover").style.display="none");

    var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var scroll_div = document.createElement("div");
    scroll_div.id="adzone_header_push_scroll_div";
    scroll_div.style.cssText="width:1px;height:1px;background-color:transparent;position:absolute;left:1px;top:"+((vh*2)-1)+"px;";
    document.body.appendChild(scroll_div);
    t.old_overflow = document.body.style.overflow;
    t.old_height = document.body.style.height;
    //document.body.style.overflow="hidden";
    //document.body.style.height="100vh";
    let callback = (entries, observer) => { 
      entries.forEach(entry => {
        let div_id=t.slot.id;
        if(entry.isIntersecting) {
          t.observer.unobserve(document.getElementById("adzone_header_push_scroll_div"));
          adzone.helpers.header_push.destroy();
        }
      });
    };
    t.observer = new IntersectionObserver(callback, {});
    //t.interval = window.setInterval(function() { window.scrollTo(0,0); },50);
    window.requestAnimationFrame(function(){
    window.requestAnimationFrame(function(){
    window.requestAnimationFrame(function(){
      adzone.helpers.scroll_top_top();    
    })
    })
    })
    document.body.onload = function() { adzone.helpers.scroll_top_top() } 

    window.setTimeout(function() {
      window.clearInterval(t.interval);
      document.body.style.overflow=t.old_overflow;
      document.body.style.height=t.old_height;     
      t.observer.observe(document.getElementById("adzone_header_push_scroll_div"));
    
    },3000);
    
  }
};
adzone.helpers.header_push.scroll = function() {
  document.getElementById("adzone_header_push_scroll_div").scrollIntoView({behavior: "smooth", block: "end"});
}

adzone.helpers.header_push.destroy = function() {
  window.clearInterval(t.interval);
  document.querySelector(".adzone_header_push").style.display="none";
  //var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}
adzone.helpers.scroll_top_top = () => {
  window.scrollTo(0,0);return;
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(adzone.helpers.scroll_top_top);
    window.scrollTo(0, c - c / 8);
  }
};


adzone.helpers.flipbook = function(t) {
  //console.log("Run FLIPBOOK",t);
  "use strict";
  t._print = function(t, params) { 

    params.video = params.local_dir + params.video;
    t.set("params", params);
    t.set("video_url", params.video);
    t.set("start", params.start);
    t.set("end", params.end);
    var tag = "<div class='adzone_obs' style='width:1px;height:1px;position:absolute'></div>"
      +"<div class='adzone_container_bg' style='display:none'><img onclick='adzone.s."+t.divId+".close()' style='z-index:6000002;width:30px;position:fixed;right:10px;top:10px' src='close1.png'></div>"
      +"<div class='adzone_container' style='display:none'><div id='vol'></div>"
        +"<video crossOrigin autoplay muted playsinline style='display:none;width:"+t.width+"px;height:"+t.height+"px;'>"
          +"<source src='"+params.video+"' type='video/mp4'>"
        +"</video>"
      +"<div class='controls' style='display:none;position:fixed;bottom:10px;right:10px;cursor:pointer;z-index:6000002'>"
        +"<img class='reload' onclick='adzone.s."+t.divId+".play(1)' style='display:none;width:30px;height:30px;float:left;margin:0 10px' src='/demo/1/reload.png'>"
        +"<img class='sound' onclick='adzone.s."+t.divId+".sound(this)' style='width:30px;height:30px;float:left' src='/demo/1/sound_off.png'>"
        +"</div>"
      +"</div>"
      +"<div class='adzone_imgs' style='cursor:pointer;position:relative;left:0;top:0' onclick='adzone.s."+t.divId+".play(0)'>"
        +"<div class='adzone_cover' style='position:absolute;top:0;left:0;display:block;z-index:1;width:"+t.width+"px;height:"+t.height+"px;background-color:white'></div>"
      +"</div>";

    t.slot.querySelector("iframe").style.display="none";
    var d =document.createElement("div");
    d.id = "new_slot";
    d.innerHTML = tag;
    t.slot.appendChild(d);
    t.slot = t.slot.querySelector("#new_slot");

    t.slot.style.height=t.height+"px";
    t.slot.style.width=t.width+"px";
    t.slot.style.display="block";
    t.video = t.slot.querySelector("video");
    t.imgs = t.slot.querySelector(".adzone_imgs");
    t.cover = t.slot.querySelector(".adzone_cover");
    t.obs = t.slot.querySelector(".adzone_obs");
    t.obs_margins = {};
    t.images = {};
    t.images_visible=null;
    t.container = t.slot.querySelector(".adzone_container");
    t.container_bg = t.slot.querySelector(".adzone_container_bg");
    t.controls = t.slot.querySelector(".controls");
    t.sound_img = t.controls.querySelector(".sound");
    t.reload_img = t.controls.querySelector(".reload");
    t.txt = document.querySelector("#txt");
    t.video.volume = 0;
    t.muted=true;
    t.vol = document.querySelector("#vol");

    t.video.addEventListener('click', function(){ t.video.pause();adzone.send_click(t.divId); }, false);

    t.video.onended = function() { adzone.p(t.divId,"video_end"); t.reload_img.style.display=""; };

    t.capture_time = -0.2;
  //  t.video.pause();
  //t.video.currentTime = Math.max(t.get("start")-1,0)

  window.setInterval(function(){t.txt.innerHTML+=t.video.currentTime+" "+t.video.seeking+" rs:"+t.video.readyState+" / " ;},100);
  t.interval = window.setInterval(
    function(){ 
      if(t.video.readyState==4) {
        if(t.video.paused) { 
          window.clearInterval(t.interval);
          t.video.addEventListener('seeked', t.capture_one_frame);
          t.video.currentTime = t.get("start");
        } else { 
          t.video.pause();
        }
      }
    }
   ,100);
  //window.setTimeout(function(){t.video.currentTime = Math.max(t.get("start")-1,0);},2000);

    
    t.images={};
    t.create_lines();
  
  }

  t.sound = function() {
    if(t.muted) {
      t.sound_on();
    } else {
      t.sound_off();
    }
  }

  t.sound_off = function() {
    window.clearTimeout(t.sound_timeout);
    t.sound_img.src='/demo/1/sound_off.png';
    t.muted=true;
    if(!t.video.muted && t.video.volume >= 0.1) {
      t.video.volume = Math.round((t.video.volume - 0.1)*10)/10;
      t.sound_timeout = window.setTimeout(t.sound_off,50);
    } else {
      t.video.muted=true;
    }
    window.setTimeout(function(){ t.video.muted=true; },500);
  }
  t.sound_on = function() {
    window.clearTimeout(t.sound_timeout);
    t.sound_img.src='/demo/1/sound_on.png';
    t.muted=false;
    t.video.muted=false;
    if(t.video.volume <= 0.9) {
      t.video.volume = Math.round((t.video.volume + 0.1)*10)/10;
      t.sound_timeout = window.setTimeout(t.sound_on,50);
    }
    adzone.p(t.divId,"sound_on");
  }

  t.play = function(reload) {

    var v = t.video;
    if(t.get("expanded_width")!="") { v.style.width = t.get("expanded_width");}
    if(t.get("expanded_height")!="") { v.style.height = t.get("expanded_height");}
    t.container.style.cssText = "top:50px;left:0;right:0;z-index:6000001;display:block;position:fixed;width:100%;height:calc(100% - 100px);";
    t.video.style.cssText = "cursor:pointer;width:100%;height:auto;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;max-width:100%;max-height:100%;overflow:auto;";
    t.container_bg.style.cssText = "display:block;width:100%;height:150%;position:fixed;left:0;top:0;z-index:6000000;background-color:#555;opacity:0.99;cursor:pointer";
    t.controls.style.display="";
   
    v.style.display="";
    var params = t.get("params");
    params.div = t.slot;
    params.iframe = v;
    //adzone.helpers.itt(t, params);
    t.video.currentTime=0;
    t.reload_img.style.display="none";
    v.play();

    adzone.p(t.divId,(reload?"reload":"play"));

  }

  t.close = function() {
    t.container.style.cssText = "";
    t.video.style.cssText = "display:none";
    t.container_bg.style.cssText = "display:none";
    t.controls.style.display="none";
    t.video.pause();
    t.sound_off();
  }

  t.capture_id = -2;
  t.capture_one_frame = function() {
    var rs = t.video.readyState;
    t.txt.innerHTML+="<br>capture_one_frame" + t.capture_id+1 + " rs:" + rs + " currentTime:" + t.video.currentTime

    t.capture_id++;
    var canvas = document.createElement('canvas');
    canvas.width  = t.video.videoWidth;
    canvas.height = t.video.videoHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(t.video, 0, 0, canvas.width, canvas.height);
    
    var img = document.createElement("img");
    img.src = canvas.toDataURL('image/jpeg');
    img.style.width = t.width+"px";
    img.style.height = t.height+"px";
    img.style.display = "";
    img.style.position = "absolute";
    img.style.left="0";
    img.style.top="0";
    img.id = "adzone_flipbook_"+t.divId+"_imgs_"+t.capture_id;
    img.dataset.img_id = t.capture_id;
    t.imgs.appendChild(img);
    t.images[t.capture_id] = document.getElementById(img.id);


    t.capture_time += 0.1;
    t.txt.innerHTML+="ct:"+t.capture_time;
    if(Math.round(t.capture_time*10)<10) {
      var time =t.get("start") + (t.capture_time * (t.get("end") - t.get("start")));
      t.txt.innerHTML+="going to seek";
      t.video.pause();
      t.video.currentTime = time;
      
    } else {
      t.show_image(t.images_visible||1);
      t.video.currentTime = 0;
      t.video.removeEventListener('seeked', t.capture_one_frame);
      for(var i in t.images) {
        if(t.images[i].dataset.img_id!=t.images_visible) {
          t.images[i].style.display="none";
        }
      }
      t.cover.style.display="none";
    }

  }

  t.show_image = function(img_id) {
    if(t.images[img_id] && t.images[img_id].style.display=="none") {
      t.images[img_id].style.display="";
      t.images[img_id].style.zIndex="2";
    }
    if(t.images_visible!=img_id && t.images[t.images_visible]) {
      t.images[t.images_visible].style.display="none";
    }
    t.images_visible = img_id;
  }

  t.observer_callback = (entries, observer) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) { return; }
        t.show_image(t.obs_margins[observer.rootMargin])
      });
    };

  t.create_lines = function() {
    var wh = (window.innerHeight || document.documentElement.clientHeight);
    var i = 50;
    var int = (wh- t.height - 50) / 8;
    var count=1;
    t.create_observer("0px 0px -"+(wh-50)+"px 0px", count);
    while(i<=(wh-t.height-50)) {
      count++;
      var margin = "-"+Math.round(i)+"px 0px -"+Math.round(wh-i-int)+"px 0px";
      t.create_observer(margin, count);
      i=i+int;
    }
    count++;
    margin= "-"+Math.round(i)+"px 0px 0px 0px",
    t.create_observer(margin, count);
  }

  t.create_observer = function(rootMargin, count) {
    let options = {
      root: null,
      rootMargin: rootMargin,
      threshold: 1.0,
      other: "AA"
    }
    let observer = new IntersectionObserver(t.observer_callback, options);
    observer.observe(t.obs);
    t.obs_margins[rootMargin] = count;
  }

};

/*
function capture(video, scaleFactor) {
    var w = parseInt(video.style.width);
    var h = parseInt(video.style.height);
    var canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);


    return canvas;
} 
*/

adzone.helpers.parallax = function(t) {
  "use strict";

  t._print = function(t, params) {

    var tag = "";
    for(var i=1;i<=6;i++) {
      if(params["img_"+i]&&params["img_"+i].src&&params["img_"+i].height>0) {
        tag+="<img class='img_"+i+"' style='display:;transition:none;position:absolute;z-index:"+i+";left:0;top:0' src='"+params.local_dir+params["img_"+i].src+"'>";  
      }
    }
    t.set("params", params)
    t.slot.querySelector("iframe").style.display="none";
    t.slot.style.position="relative";
    t.slot.style.overflow="hidden";
    var d =document.createElement("div");
    d.id = "new_slot";
    d.innerHTML = tag;
    d.style.display="inline-block";
    d.style.cursor="pointer";
    t.slot.appendChild(d);
    t.slot = t.slot.querySelector("#new_slot");
    t.slot.addEventListener('click', function(){ adzone.send_click(t.divId); }, false);

    for(var i=1;i<=5;i++) {
      if(params["img_"+i]&&params["img_"+i].src&&params["img_"+i].height>0) {
        t["img_"+i] = t.slot.querySelector(".img_"+i);
      }
    }
    t.in_view = true;

    window.addEventListener('scroll', function(e) {
      if(t.in_view) {
        if(window.requestAnimationFrame) {
          window.requestAnimationFrame(function(){ t.check_scroll() });
        } else {
          t.check_scroll();
        }
      }
    });

    if(IntersectionObserver) {
      let callback = (entries, observer) => { entries.forEach(entry => { t.in_view = entry.isIntersecting;}); };
      var observer = new IntersectionObserver(callback, {threshold: 1, rootMargin:"0px 0px -"+t.height+"px 0px"});
      observer.observe(t.slot);
    }

    t.check_scroll();      
  }
  
  t.check_scroll = function() {
    var wh = (window.innerHeight || document.documentElement.clientHeight) - 50 - t.height;
    var pos =Math.min(Math.max(t.slot.getBoundingClientRect().top-50,0),wh);
    var perc = pos/wh;
    var params = t.get("params");
    for(var i=1;i<=6;i++) {

      if(t["img_"+i]) {
        var delta = params["img_"+i].height-t.height;
        var margin = delta*(params["img_"+i].reverse?(1-perc):perc);
        t["img_"+i].style.marginTop=(-margin)+"px";

        var delta = params["img_"+i].width-t.width;
        var margin = delta*(params["img_"+i].reverse?(1-perc):perc);
        t["img_"+i].style.marginLeft=(-margin)+"px";

        t["img_"+i].style.display="";
      }
    }
  }


}

adzone.helpers.panorama = function(t, action, params) {
  //console.log("Run FLIPBOOK",t);
  "use strict";
  t._print = function(t, params) {

    t.inifinite = params.infinite;
    t.scroll = Math.max(params.scroll,500);
    t.slot.querySelector("iframe").style.display="none";
    t.slot.style.position="relative";
    t.slot.style.overflow="hidden";

    console.log("print panorama",params);
    if(!adzone.get("Siema")) {
        adzone.set("Siema", true);
        !function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Siema",[],t):"object"==typeof exports?exports.Siema=t():e.Siema=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(r){if(i[r])return i[r].exports;var n=i[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var i={};return t.m=e,t.c=i,t.d=function(e,i,r){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,i){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),l=function(){function e(t){var i=this;if(r(this,e),this.config=e.mergeSettings(t),this.selector="string"==typeof this.config.selector?document.querySelector(this.config.selector):this.config.selector,null===this.selector)throw new Error("Something wrong with your selector 😭");this.resolveSlidesNumber(),this.selectorWidth=this.selector.offsetWidth,this.innerElements=[].slice.call(this.selector.children),this.currentSlide=this.config.loop?this.config.startIndex%this.innerElements.length:Math.max(0,Math.min(this.config.startIndex,this.innerElements.length-this.perPage)),this.transformProperty=e.webkitOrNot(),["resizeHandler","touchstartHandler","touchendHandler","touchmoveHandler","mousedownHandler","mouseupHandler","mouseleaveHandler","mousemoveHandler","clickHandler"].forEach(function(e){i[e]=i[e].bind(i)}),this.init()}return s(e,[{key:"attachEvents",value:function(){window.addEventListener("resize",this.resizeHandler),this.config.draggable&&(this.pointerDown=!1,this.drag={startX:0,endX:0,startY:0,letItGo:null,preventClick:!1},this.selector.addEventListener("touchstart",this.touchstartHandler),this.selector.addEventListener("touchend",this.touchendHandler),this.selector.addEventListener("touchmove",this.touchmoveHandler),this.selector.addEventListener("mousedown",this.mousedownHandler),this.selector.addEventListener("mouseup",this.mouseupHandler),this.selector.addEventListener("mouseleave",this.mouseleaveHandler),this.selector.addEventListener("mousemove",this.mousemoveHandler),this.selector.addEventListener("click",this.clickHandler))}},{key:"detachEvents",value:function(){window.removeEventListener("resize",this.resizeHandler),this.selector.removeEventListener("touchstart",this.touchstartHandler),this.selector.removeEventListener("touchend",this.touchendHandler),this.selector.removeEventListener("touchmove",this.touchmoveHandler),this.selector.removeEventListener("mousedown",this.mousedownHandler),this.selector.removeEventListener("mouseup",this.mouseupHandler),this.selector.removeEventListener("mouseleave",this.mouseleaveHandler),this.selector.removeEventListener("mousemove",this.mousemoveHandler),this.selector.removeEventListener("click",this.clickHandler)}},{key:"init",value:function(){this.attachEvents(),this.selector.style.overflow="hidden",this.selector.style.direction=this.config.rtl?"rtl":"ltr",this.buildSliderFrame(),this.config.onInit.call(this)}},{key:"buildSliderFrame",value:function(){var e=this.selectorWidth/this.perPage,t=this.config.loop?this.innerElements.length+2*this.perPage:this.innerElements.length;this.sliderFrame=document.createElement("div"),this.sliderFrame.style.width=e*t+"px",this.enableTransition(),this.config.draggable&&(this.selector.style.cursor="-webkit-grab");var i=document.createDocumentFragment();if(this.config.loop)for(var r=this.innerElements.length-this.perPage;r<this.innerElements.length;r++){var n=this.buildSliderFrameItem(this.innerElements[r].cloneNode(!0));i.appendChild(n)}for(var s=0;s<this.innerElements.length;s++){var l=this.buildSliderFrameItem(this.innerElements[s]);i.appendChild(l)}if(this.config.loop)for(var o=0;o<this.perPage;o++){var a=this.buildSliderFrameItem(this.innerElements[o].cloneNode(!0));i.appendChild(a)}this.sliderFrame.appendChild(i),this.selector.innerHTML="",this.selector.appendChild(this.sliderFrame),this.slideToCurrent()}},{key:"buildSliderFrameItem",value:function(e){var t=document.createElement("div");return t.style.cssFloat=this.config.rtl?"right":"left",t.style.float=this.config.rtl?"right":"left",t.style.width=(this.config.loop?100/(this.innerElements.length+2*this.perPage):100/this.innerElements.length)+"%",t.appendChild(e),t}},{key:"resolveSlidesNumber",value:function(){if("number"==typeof this.config.perPage)this.perPage=this.config.perPage;else if("object"===n(this.config.perPage)){this.perPage=1;for(var e in this.config.perPage)window.innerWidth>=e&&(this.perPage=this.config.perPage[e])}}},{key:"prev",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;if(this.config.loop){if(this.currentSlide-e<0){this.disableTransition();var r=this.currentSlide+this.innerElements.length,n=this.perPage,s=r+n,l=(this.config.rtl?1:-1)*s*(this.selectorWidth/this.perPage),o=this.config.draggable?this.drag.endX-this.drag.startX:0;this.sliderFrame.style[this.transformProperty]="translate3d("+(l+o)+"px, 0, 0)",this.currentSlide=r-e}else this.currentSlide=this.currentSlide-e}else this.currentSlide=Math.max(this.currentSlide-e,0);i!==this.currentSlide&&(this.slideToCurrent(this.config.loop),this.config.onChange.call(this),t&&t.call(this))}}},{key:"next",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;if(this.config.loop){if(this.currentSlide+e>this.innerElements.length-this.perPage){this.disableTransition();var r=this.currentSlide-this.innerElements.length,n=this.perPage,s=r+n,l=(this.config.rtl?1:-1)*s*(this.selectorWidth/this.perPage),o=this.config.draggable?this.drag.endX-this.drag.startX:0;this.sliderFrame.style[this.transformProperty]="translate3d("+(l+o)+"px, 0, 0)",this.currentSlide=r+e}else this.currentSlide=this.currentSlide+e}else this.currentSlide=Math.min(this.currentSlide+e,this.innerElements.length-this.perPage);i!==this.currentSlide&&(this.slideToCurrent(this.config.loop),this.config.onChange.call(this),t&&t.call(this))}}},{key:"disableTransition",value:function(){this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing}},{key:"enableTransition",value:function(){this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing}},{key:"goTo",value:function(e,t){if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;this.currentSlide=this.config.loop?e%this.innerElements.length:Math.min(Math.max(e,0),this.innerElements.length-this.perPage),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this))}}},{key:"slideToCurrent",value:function(e){var t=this,i=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,r=(this.config.rtl?1:-1)*i*(this.selectorWidth/this.perPage);e?requestAnimationFrame(function(){requestAnimationFrame(function(){t.enableTransition(),t.sliderFrame.style[t.transformProperty]="translate3d("+r+"px, 0, 0)"})}):this.sliderFrame.style[this.transformProperty]="translate3d("+r+"px, 0, 0)"}},{key:"updateAfterDrag",value:function(){var e=(this.config.rtl?-1:1)*(this.drag.endX-this.drag.startX),t=Math.abs(e),i=this.config.multipleDrag?Math.ceil(t/(this.selectorWidth/this.perPage)):1,r=e>0&&this.currentSlide-i<0,n=e<0&&this.currentSlide+i>this.innerElements.length-this.perPage;e>0&&t>this.config.threshold&&this.innerElements.length>this.perPage?this.prev(i):e<0&&t>this.config.threshold&&this.innerElements.length>this.perPage&&this.next(i),this.slideToCurrent(r||n)}},{key:"resizeHandler",value:function(){this.resolveSlidesNumber(),this.currentSlide+this.perPage>this.innerElements.length&&(this.currentSlide=this.innerElements.length<=this.perPage?0:this.innerElements.length-this.perPage),this.selectorWidth=this.selector.offsetWidth,this.buildSliderFrame()}},{key:"clearDrag",value:function(){this.drag={startX:0,endX:0,startY:0,letItGo:null,preventClick:this.drag.preventClick}}},{key:"touchstartHandler",value:function(e){-1!==["TEXTAREA","OPTION","INPUT","SELECT"].indexOf(e.target.nodeName)||(e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.touches[0].pageX,this.drag.startY=e.touches[0].pageY)}},{key:"touchendHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.enableTransition(),this.drag.endX&&this.updateAfterDrag(),this.clearDrag()}},{key:"touchmoveHandler",value:function(e){if(e.stopPropagation(),null===this.drag.letItGo&&(this.drag.letItGo=Math.abs(this.drag.startY-e.touches[0].pageY)<Math.abs(this.drag.startX-e.touches[0].pageX)),this.pointerDown&&this.drag.letItGo){e.preventDefault(),this.drag.endX=e.touches[0].pageX,this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;var t=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,i=t*(this.selectorWidth/this.perPage),r=this.drag.endX-this.drag.startX,n=this.config.rtl?i+r:i-r;this.sliderFrame.style[this.transformProperty]="translate3d("+(this.config.rtl?1:-1)*n+"px, 0, 0)"}}},{key:"mousedownHandler",value:function(e){-1!==["TEXTAREA","OPTION","INPUT","SELECT"].indexOf(e.target.nodeName)||(e.preventDefault(),e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.pageX)}},{key:"mouseupHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.enableTransition(),this.drag.endX&&this.updateAfterDrag(),this.clearDrag()}},{key:"mousemoveHandler",value:function(e){if(e.preventDefault(),this.pointerDown){"A"===e.target.nodeName&&(this.drag.preventClick=!0),this.drag.endX=e.pageX,this.selector.style.cursor="-webkit-grabbing",this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing;var t=this.config.loop?this.currentSlide+this.perPage:this.currentSlide,i=t*(this.selectorWidth/this.perPage),r=this.drag.endX-this.drag.startX,n=this.config.rtl?i+r:i-r;this.sliderFrame.style[this.transformProperty]="translate3d("+(this.config.rtl?1:-1)*n+"px, 0, 0)"}}},{key:"mouseleaveHandler",value:function(e){this.pointerDown&&(this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.drag.endX=e.pageX,this.drag.preventClick=!1,this.enableTransition(),this.updateAfterDrag(),this.clearDrag())}},{key:"clickHandler",value:function(e){this.drag.preventClick&&e.preventDefault(),this.drag.preventClick=!1}},{key:"remove",value:function(e,t){if(e<0||e>=this.innerElements.length)throw new Error("Item to remove doesn't exist 😭");var i=e<this.currentSlide,r=this.currentSlide+this.perPage-1===e;(i||r)&&this.currentSlide--,this.innerElements.splice(e,1),this.buildSliderFrame(),t&&t.call(this)}},{key:"insert",value:function(e,t,i){if(t<0||t>this.innerElements.length+1)throw new Error("Unable to inset it at this index 😭");if(-1!==this.innerElements.indexOf(e))throw new Error("The same item in a carousel? Really? Nope 😭");var r=t<=this.currentSlide>0&&this.innerElements.length;this.currentSlide=r?this.currentSlide+1:this.currentSlide,this.innerElements.splice(t,0,e),this.buildSliderFrame(),i&&i.call(this)}},{key:"prepend",value:function(e,t){this.insert(e,0),t&&t.call(this)}},{key:"append",value:function(e,t){this.insert(e,this.innerElements.length+1),t&&t.call(this)}},{key:"destroy",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments[1];if(this.detachEvents(),this.selector.style.cursor="auto",e){for(var i=document.createDocumentFragment(),r=0;r<this.innerElements.length;r++)i.appendChild(this.innerElements[r]);this.selector.innerHTML="",this.selector.appendChild(i),this.selector.removeAttribute("style")}t&&t.call(this)}}],[{key:"mergeSettings",value:function(e){var t={selector:".siema",duration:200,easing:"ease-out",perPage:1,startIndex:0,draggable:!0,multipleDrag:!0,threshold:20,loop:!1,rtl:!1,onInit:function(){},onChange:function(){}},i=e;for(var r in i)t[r]=i[r];return t}},{key:"webkitOrNot",value:function(){return"string"==typeof document.documentElement.style.transform?"transform":"WebkitTransform"}}]),e}();t.default=l,e.exports=t.default}])});
    }

    var html="<div class='siema' style='background-color:transparent;width:300px;position:absolute;z-index:2'>";
    for(var i=0;i<=9;i++) {
      if(params["img_"+i]&&params["img_"+i].src&&params["img_"+i].height>0) {
        html+="<div style='z-index:2;overflow:hidden;width:"+t.width+",height:"+t.height+"' ><img style='width:"+params["img_"+i].width+"px;height:"+params["img_"+i].height+"px' src='"+params.local_dir+params["img_"+i].src+"'' /></div>";
      }
    }
  html += `</div>`;
  if(params["img_bg"]&&params["img_bg"].src&&params["img_bg"].height>0) {
    html+="<div style='overflow:hidden;position:absolute;top:0;left:0;z-index:0;width:"+params["img_bg"].width+"px;height:"+params["img_bg"].height+"px'><img src='"+params.local_dir+params["img_bg"].src+"' /></div>";
  }
  if(params["img_fg"]&&params["img_fg"].src&&params["img_fg"].height>0) {
    html+="<div style='overflow:hidden;position:absolute;top:0;left:0;z-index:10;width:"+params["img_fg"].width+"px;max-height:80px;height:"+params["img_fg"].height+"px'><img src='"+params.local_dir+params["img_fg"].src+"' /></div>";
  }
  html +=`
  <img class='l' src='left1.png' style='display:;position:absolute;top:`+(t.height/2-10)+`px;left:10px;z-index:20;width:16px;opacity:0.2'>
  <img class='r' src='right1.png' style='display:;position:absolute;top:`+(t.height/2-10)+`px;right:10px;z-index:20;width:16px;opacity:0.2'>
    <div class="buttons">`;
    for(var i=0;i<=9;i++) {
      if(params["img_"+i]&&params["img_"+i].src&&params["img_"+i].height>0) {
        html+="<button class='adzone_b"+i+"'></button>";
      }
    }
  html +=`
    </div>
<style>
.buttons { z-index:11;width:100%;position:absolute;top:`+(t.height-24)+`px;height:24px}
.buttons button { border-radius:50%;background-color:white;border:0;width:10px;height:12px;margin:0 4px;opacity:0.5}
</style>      
`;
    var d =document.createElement("div");
    d.id = "new_slot";
    d.innerHTML = html;
    //d.style.display="inline-block";
    d.style.cursor="pointer";
    t.slot.appendChild(d);
    t.slot = t.slot.querySelector("#new_slot");
//    t.slot.addEventListener('click', function(){ adzone.send_click(t.divId); }, false);

t.slot.style.width=t.width;
t.slot.style.height=t.height;

t.slot.querySelector(".l").addEventListener('click', () => t.mySiema.prev());
t.slot.querySelector(".r").addEventListener('click', () => t.mySiema.next());
  for(var i=0;i<=9;i++) {
    t["button"+i]=t.slot.querySelector(".adzone_b"+i);
    if(t["button"+i]) {
      t["button"+i].style.opacity=0.1;
      t["button"+i].dataset.img=i
      t["button"+i].addEventListener("click", function(e){ t.slide(e.target.dataset.img)});
    }
  }
  //t.slot.addEventListener("mousedown",function() { window.clearInterval(t.next_interval)})

  t.slided = function() {
    t.slide(t.mySiema.currentSlide);
    if(!t.is_auto) {
window.clearInterval(t.next_interval);
    }
  }
  t.slide=function(c) {
    for(var i=0;i<=6;i++) {
      t["button"+i] && (t["button"+i].style.opacity=0.1);
    }
    t["button"+c].style.opacity=0.5;
    if(t.mySiema.currentSlide!=c) {
      t.mySiema.goTo(c);
    }
  }

    // Siema doesn't come with pagination built in
    // But it is very easy to add one if you want
    t.slot.style.height=t.height;
    t.slot.style.position="relative";
    t.slot.style.backgroundColor="transparent";
    // New siema instance
    t.mySiema = new Siema({duration:500, loop: (t.inifinite==1), onChange: function(){ t.slided() },});
    t.interval_set=false;
    t.slide(0);

    // Add a function that generates pagination to prototype
    Siema.prototype.addPagination = function() {
      for (let i = 0; i < this.innerElements.length; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', () => this.goTo(i));
        this.selector.appendChild(btn);
      }
    }

    // Trigger pagination creator
    //t.mySiema.addPagination();

    if(IntersectionObserver) {
      let callback = (entries, observer) => { entries.forEach(entry => { 
        t.in_view = entry.isIntersecting;
        if(t.in_view && !t.interval_set) {
          t.next_interval=window.setInterval(function(){ t.is_auto=true; t.mySiema.next(); t.is_auto=false;}, t.scroll);
          t.interval_set=true;
        } else if(!t.in_view && t.interval_set){
          window.clearInterval(t.next_interval);
          t.interval_set=false;
        }
      }); };
      var observer = new IntersectionObserver(callback, {threshold: 0.75, rootMargin:"0px 0px 0px 0px"});
      observer.observe(t.slot);
    }

  }

}


// 101, 102
adzone.helpers.scroller = function(t) {
  "use strict";
  t._print = function(t,p) { 

    p.img = p.local_dir + p.img;

    var d = document.createElement("div");
    d.style.cssText = "background-image: url('"+p.img+"');min-height: "+t.height+"px; background-attachment: fixed;background-position: center;background-repeat: no-repeat;background-size: cover;"
    t.parentSlot.appendChild(d);
    t.slot.style.display="none";
    console.log(p);
  }
}

adzone.r();
adzone.onload && adzone.onload();


adzone.run && adzone.run();
