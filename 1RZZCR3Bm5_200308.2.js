/* 1RZZCR3Bm5 - Sitios en Argentina */

var adzone = adzone||{};
var googletag = googletag||{};
googletag.cmd = googletag.cmd||[];


(function(t) {

t.styles = t.styles || {};

t.styles.footer_close=`aa`;
t.styles.footer_expand_close=`bb`;
t.styles.footer_open=`vv`;
t.styles.prestitial_close=``;
t.styles.push_expand=``;
t.styles.push_collapse=``;
t.styles.push_expanded_height=``;
t.styles.push_collapsed_height=`..`;
t.styles.video_paused=``;
t.styles.video_sound_on=``;
t.styles.video_sound_off=``;
t.styles.video_playing=`<div style='position:absolute;right:50px;bottom:20px'><img src='video_playing.png' ><div>`;
t.styles.video_ended=``;


t.c=[];
t.m=function(e) { if(e.data && e.data.m =="adzone") { adzone.c.push({ m: e }); adzone.r && adzone.r(); } }
window.addEventListener ? window.addEventListener("message", adzone.m, !1) : window.attachEvent && window.attachEvent("message", adzone.m);
var s = document.createElement("script");
s.async = true;
s.src = 'https://cdn.jsdelivr.net/gh/adzone-io/rm@/adzone.js';
document.head.appendChild(s);

googletag.cmd.push(function() { googletag.pubads().addEventListener("slotRenderEnded", function(e) { adzone.c.push({r: e}), adzone.r && adzone.r() })});


t.cs = {};
t.start_time = new Date().getTime();
t.tagcmd = t.tagcmd || [];
t.adtypes={};
t.event_history = [];
t.slotRenderedCallback={};
t.slotRenderedCallbackAll=null;
t.ad_events=[];

if(document.location.href.indexOf("old=1")>0) {
  var src = "https://www.primiciasya.com/static/adcase-config-test.js?11";
  var s = document.createElement("script");
  s.async="async";
  s.src = src;
  document.head.appendChild(s);
  return;
}

if(true) {
//  window.setInterval(function(){window.hbeplpbChunk=null;},100); // epl disabler
}

/* Legacy Adcase message converter - Delete by Dic/2020 */
/*
t.legacy_message = function(m) {
  if(m.data && m.data.msg && m.data.msg=="adcase") {
    m.data.m="adzone";
    m.data.a="print";
    if(m.data.format=="footerFixed") {
      m.data.f="108";
      adzone.readFormatMessage(m);
    }
  }
}
window.addEventListener("message", t.legacy_message, false);
*/

/* Legacy Adcase message converter - Delete by Dic/2020 */

t.slotRenderedCallbackAll = function(e) {
  console.log(e.slot.getSlotElementId() + " is " + (e.isEmpty?"empty":"filled"));
}

t.slotRenderedCallback["www.primiciasya.com/Home/Home_Zocalos_Display"] = function(e) {
  if(!e.isEmpty && e.size && e.size[0] && e.size[0]>10) {
    var m = { data: {m:"adzone", a:"print", f:"108", div_id: e.slot.getSlotElementId() }};
    adzone.readFormatMessage(m);
  }
}
t.slotRenderedCallback["www.primiciasya.com/Home/Home_FullContent"] = function(e) {
  if(!e.isEmpty && e.size && e.size[0] && e.size[0]>10) {
    var m = { data: {m:"adzone", a:"print", f:"120", div_id: e.slot.getSlotElementId() }};
    adzone.readFormatMessage(m);
  }
}

// move fullcontent:
document.querySelector(".full-content-container").innerHTML="";
var d = document.createElement("div");
d.className = "ad-slot";
d.id="www.primiciasya.com/Home/Home_FullContent";
d.dataset.adtype="fullcontent";
document.body.prepend(d);
document.querySelector(".full-content-container").style.cssText="display:none"; 

var gads = document.createElement('script');
gads.async = true;
gads.type = 'text/javascript';
gads.src = 'https://www.googletagservices.com/tag/js/gpt.js';
document.head.appendChild(gads);


t.network_code = 40327789;
t.page_path = (function() { return "/" })();
t.is_single_request = false;
t.disable_initial_load = false;
t.kv = (function() { var section = "";
try { section=document.location.href.split("/")[2] } catch(e) {}
return { key1:"value1", key2:[1,2,3,4], section:section }; })();
t.size_mapping=[{"device": "all_devices", "adtype": "fluid", "min_width": 0, "sizes": ["fluid", [300, 250]]}, {"device": "mobile", "adtype": "box600", "min_width": 0, "sizes": [[300, 250]]}, {"device": "desktop", "adtype": "box600", "min_width": 0, "sizes": [[300, 600], [300, 250]]}, {"device": "mobile", "adtype": "bigbox", "min_width": 0, "sizes": [[300, 250], [300, 100], [300, 50], [300, 600]]}, {"device": "desktop", "adtype": "bigbox", "min_width": 0, "sizes": [[300, 600], [300, 250]]}, {"device": "desktop", "adtype": "push", "min_width": 0, "sizes": [[728, 90], [950, 50], [950, 200], [950, 250], [970, 90], [970, 250], "[970", "250]]"]}, {"device": "mobile", "adtype": "push", "min_width": 0, "sizes": [[300, 250], [300, 100], [320, 50], [320, 100]]}, {"device": "desktop", "adtype": "firstpush", "min_width": 0, "sizes": [[728, 90], [950, 50], [950, 200], [950, 250], [970, 90], [970, 250], "[970", "250]]"]}, {"device": "mobile", "adtype": "firstpush", "min_width": 0, "sizes": [[300, 100], [320, 50]]}, {"device": "mobile", "adtype": "underHeader", "min_width": 0, "sizes": [[300, 100], [320, 50]]}, {"device": "desktop", "adtype": "fullcontent", "min_width": 0, "sizes": [[1, 1], [1000, 480], [1000, 540]]}, {"device": "mobile", "adtype": "fullcontent", "min_width": 0, "sizes": [[1, 1], [320, 480]]}, {"device": "mobile", "adtype": "fullcontent", "min_width": 480, "sizes": [[1, 1], [480, 320]]}, {"device": "desktop", "adtype": "topbanner", "min_width": 0, "sizes": [[950, 50], [970, 90]]}, {"device": "mobile", "adtype": "topbanner", "min_width": 0, "sizes": [[300, 50], [320, 50]]}, {"device": "desktop", "adtype": "floating", "min_width": 0, "sizes": [[260, 650], [260, 600]]}, {"device": "mobile", "adtype": "zocalo", "min_width": 0, "sizes": [[300, 51], [300, 50], [320, 51], [320, 50]]}, {"device": "desktop", "adtype": "zocalo", "min_width": 0, "sizes": [[728, 91], [728, 90], [950, 90], [950, 50]]}, {"device": "all_devices", "adtype": "box", "min_width": 0, "sizes": [[300, 250]]}];

(function() { var section = "";
try { section=document.location.href.split("/")[2] } catch(e) {}
return { key1:"value1", key2:[1,2,3,4], section:section }; })();

t.find_all = function(d) { return document.querySelectorAll(d); }
t.find = function(d) { return document.getElementById(d); }

t.run = function(p){
  p=p||{}
  t.tagcmd.push({a:"run",p:p});

  var cmd = t.tagcmd;
  t.tagcmd = [];

  Object.keys(cmd).forEach(function(c, index) {
    if(cmd[c].a == "run" && cmd[c].p) {
      if(cmd[c].p.refresh) {
        t.refresh();
      } else if (cmd[c].p.divs) {
        t.run_divs(cmd[c].p.divs);
      } else {
        t.run_new();
      }
    }
  });  
} //t.run

t.refresh = function() {
  googletag.cmd.push(function() {
    t.cs={};
    t.s && (t.s={});
    googletag.destroySlots();
    t.run_new();
  });
}
t.run_divs = function(div_id_list) {
  var prepare=[];
  Object.keys(div_id_list).forEach(function(c, index) {
    var div_id=div_id_list[c];
    if(div_id in t.cs) {
      t.cs[div_id].start_time = new Date().getTime();
      googletag.cmd.push(function() {
        googletag.pubads().refresh(t.cs[div_id]);
      });
    } else {
      prepare.push(div_id);
    }
  });
  if(prepare.length==0) {
    return;
  }
  googletag.cmd.push(function() {
    t.is_single_request && googletag.pubads().enableSingleRequest(); 
    t.disable_initial_load && googletag.pubads().disableInitialLoad();
    Object.keys(prepare).forEach(function(c, index) {
      var div_id = prepare[c];
      var div = document.getElementById(div_id);
      if(div.id+"_parent"!=div.parentElement.id) {
         var new_div = document.createElement("div");
         new_div.id = div.id;
         div.id += "_parent";
         new_div.dataset.adtype = div.dataset.adtype;
         new_div.dataset.kv = div.dataset.kv;
         new_div.classList.add("ad-slot");
         div.classList.remove("ad-slot");
         div.appendChild(new_div);
      }

      t.cs[div_id] = t.new_slot(div_id);

      var path = t.network_code + t.page_path + div_id;
      t.cs[div_id].path = path;
      t.cs[div_id].sizes = t.get_sizes(div_id);
      t.cs[div_id].slot=googletag.defineSlot(path, t.cs[div_id].sizes, div_id).addService(googletag.pubads());
      t.set_slot_kv(div_id);
    });
    t.set_page_kv();    

    if(!t.slot_rendered_added) {
      t.slot_rendered_added = true;
      googletag.pubads().addEventListener('slotRenderEnded', function(e) {
        t.slot_rendered(e);
      });
    }
    googletag.enableServices();
    Object.keys(prepare).forEach(function(c, index) {
      googletag.display(prepare[c]); 
    });
  });
  if(!t.adstest_button && t.adstest) {
    t.set_adstest_button();
  }
}
t.set_slot_kv = function(div_id) {
  t.cs[div_id].kv && Object.keys(t.cs[div_id].kv).forEach(function(j, index) {
    t.cs[div_id].slot.setTargeting(j, t.cs[div_id].kv[j]);
  });
}
t.set_page_kv = function(){
  adzone.kv && Object.keys(adzone.kv).forEach(function(k, index) {
    var v = adzone.kv[k];
    googletag.pubads().setTargeting(k, v);
  });
  var adstest = localStorage.getItem("adzone-adstest");
  adstest && googletag.pubads().setTargeting("adstest", adstest);
}
t.run_new = function() {
  var divs = t.find_all(".ad-slot");
  var div_id_list = [];
  Object.keys(divs).forEach(function(c, index) {
    if(!(divs[c].id in t.cs) && divs[c].id) {
      div_id_list.push(divs[c].id)
      t.adtypes[divs[c].id]=(divs[c].dataset.adtype||"default");
    }
  });
  t.run_divs(div_id_list);
}
t.new_slot = function(div_id) {
  var n={
    set:function(k,v){ t.values[k]=v; },
    get:function(k){ return t.values[k]||null; },
    id:div_id,
    adtype:t.adtypes[div_id],
    kv:{},
    start_time: new Date().getTime()
  }
  if(div_id.split("#")[1]) {
    n.id=div_id.split("#")[0];
    n.kv.divposition=div_id.split("#")[1];
  }
  return n;
}

t.get_sizes = function(div_id) {
  var min_width=0;
  var adtype = t.cs[div_id].adtype;
  var sizes=[1,1];
  Object.keys(t.size_mapping).forEach(function(c, index) {
    var k = t.size_mapping[c];
    k.min_width=k.min_width||0;
    if((t.device.isMobile && k.device.indexOf("mobile")>=0) || (t.device.isDesktop && k.device.indexOf("desktop")>=0)) {
      if(adtype==k.adtype && k.min_width>=min_width && k.min_width<=window.innerWidth) {
        sizes=k.sizes;
      }
    }
  });
  return sizes;

}

t.slot_rendered = function(e) {
  t.c.push({r: e});
  t.r && t.r()

  t.ad_events.push(e);
  var div_id=e.slot.getSlotElementId();
  var event_data={
    ad_unit_path:e.slot.getAdUnitPath(),
    size: e.slot.size,
    advertiser_id: e.slot.advertiserId,
    campaign_id: e.slot.campaignId,
    creative_id: e.slot.creativeId,
    lineitem_id: e.slot.lineItemId,
    advertiser_id: e.slot.advertiserId,
    is_empty: e.slot.isEmpty
  }

  t.cs[div_id].event_data=event_data;
  t.cs[div_id].end_time=new Date().getTime();
  t.cs[div_id].rendered_time = t.cs[div_id].end_time - t.cs[div_id].start_time;

  t.event_history.push(event_data);
  t.slotRenderedCallback[div_id]&&t.slotRenderedCallback[div_id](e);
  t.slotRenderedCallbackAll&&t.slotRenderedCallbackAll(e);
};

t.device = {
  isMobile: (/Mobi/.test(navigator.userAgent)),
  isTablet: (screen.width < 800 || screen.height < 800),
  isDesktop: !(/Mobi/.test(navigator.userAgent))
};

})(adzone);