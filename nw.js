/* 
* Adzone Rich Media v2.1.93
* Copyright (C) 2020 Adzone SRL 
* https://adzone.io
* All rights reserved
* Copying or commercial use of this copyrighted material without permission of the copyright owner is prohibited by law.
*/


adzone = adzone || {};
adzone.run_nw = {};

adzone.run_nw.smart = function(p, is_init) {
  if(is_init) {
    window.sas = window.sas || {cmd: []};
    adzone.get_script("https://ced.sascdn.com/tag/3821/smart.js");
    return;
  } 

  adzone.get_slot("sas_" + p.formatId);

  var param1 = { siteId: p.siteId, pageId: p.pageId, formatId: p.formatId, tagId: "sas_"+p.formatId };
  var param2 = { networkId: p.networkId, domain: "https://prg.smartadserver.com" , onNoad: function() { 
    p.next_network && adzone.next_network(p.next_network) 
    adzone.register_unfilled(p.next_network||"collapse");
    }  };
  console.log("Call SAS", param1, param2)
  sas.cmd.push( function () { sas.call(param1, param2); });
};

adzone.run_nw.google = function(p, is_init) {
  
  if(is_init) {
    window.googletag = window.googletag || {cmd: []};
    adzone.get_script("https://securepubads.g.doubleclick.net/tag/js/gpt.js");
    return;
  } 

  adzone.get_slot("google_slot");
  googletag.cmd.push(function() {
    googletag.defineSlot(p.ad_unit_path, p.size, 'google_slot').addService(googletag.pubads());
    googletag.enableServices();
    googletag.display("google_slot");
    googletag.pubads().addEventListener('slotRenderEnded', function(e) {
      if(e.isEmpty) {
        p.next_network && adzone.next_network(p.next_network);
        adzone.register_unfilled(p.next_network||"collapse");
      };
    });
  });
}

adzone.get_script = function(src) {
  adzone.scripts_created = adzone.scripts_created || {};
  // avoid repeated script load
  if(adzone.scripts_created[src]) {
    return;
  }

  adzone.scripts_created[src] = true;
  var d = document.createElement("script");
  d.async="async";
  d.src=src;
  document.head.appendChild(d);
}

adzone.get_slot = function(div_id) {
  var d = null;
  if(document.getElementById(div_id)) {
    d = document.getElementById(div_id);
  } else {
    d = document.createElement("div");
    d.id = "google_slot";
    document.body.appendChild(d);
  }
}

adzone.nwm = function(e) { // onMessage
  if(e.data && e.data.msg && e.data.msg=="adzone" && e.data.network_name) {
    if(e.data.network_name=="smart") {
      adzone.run_nw.smart(e.data.p);
    } else if(e.data.network_name=="harrenmedia") {
      adzone.run_nw.google(e.data.p);
    }
  }
};

adzone.register_unfilled = function(next_network) {
  if(next_network == "collapse") {
    window.top.postMessage({ m: "adzone", a:"collapse", f:'network', p:{ name: (adzone.nw.network_name) } } , "*");
  } else {
    window.top.postMessage({ m: "adzone", a:"unfilled", f:'network', p:{ name: (adzone.nw.network_name) } } , "*");
  }
};

adzone.next_network = function(network_name) {
  adzone.nw.network_name = network_name;

  adzone.networks_run = adzone.networks_run || {};
  // prevent infinite cycle
  if(adzone.networks_run[network_name]) {
    return;
  }
  adzone.networks_run[network_name] = true;

  var ok = false;
  if(network_name) {
    // init
    if(network_name=="smart") { 
      adzone.run_nw.smart(null, true);
      ok = true;
    } else if(network_name=="harrenmedia") { 
      adzone.run_nw.google(null, true);
      ok = true;
    } else if(network_name=="collapse") { 
      window.top.postMessage({ m: "adzone", a:"collapse", f:'network', p:{} } , "*");
    } else {
      console.log("ERROR in tag definition", t)
      return;
    }

    ok && window.top.postMessage({ m: "adzone", a:"print", f:'network', p:{ name: (adzone.nw.network_name||11) } } , "*");
  }
}

if(adzone.nw && adzone.nw.network_name) {
  window.addEventListener ? window.addEventListener("message", adzone.nwm, !1) : window.attachEvent && window.attachEvent("message", adzone.nwm);
  adzone.next_network(adzone.nw.network_name);
}

