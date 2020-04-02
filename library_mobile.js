w.library = function(t) {
  t.metrics = function(params) {
    w.select_top_menu("library");
    $("#page_select_div").html("Reloading...")
  
    w.get_json("/bq",{}, function(d) { 
      t.run();
    });
  }

  t.run = function(params) {
    w.select_top_menu("library");
    w.get_json("/library/get_data",{}, function(d) { 
      
      t.set("formats", d.formats)
      t.set("sizes", d.sizes)
      t.set("agencies", d.agencies)
      t.set("advertisers", d.advertisers)
      t.set("quarters", d.quarters)
      t.set("users", d.users)
      t.run2();
    });
  }
  t.run2 = function(params) {
    var formats = t.get("formats");
    var sizes = t.get("sizes");
    var quarters = t.get("quarters");
    var agencies = t.get("agencies");
    var advertisers = t.get("advertisers");
    var users = t.get("users");
    var selected = "";

    var out = `
      <table id='library_filters'>
        <tr>
          <td>
            <select multiple id='format_id' onchange='w.library.load()'>`;
    selected = (w.get("last_format_id")<1?"selected":"");
    out += "<option value='all' "+selected+">&nbsp;&nbsp;&nbsp;All Formats</option>";
    for(var id in formats) {
      out += "<option value='"+id+"'>"+formats[id].title+"</option>";
    }
    out += `
            </select>
          </td>

          <td>
            <select multiple id='sizes' onchange='w.library.load()'>`;
    selected = (!w.get("last_sizes_id")?"selected":"");
    out += "<option value='all' "+selected+">&nbsp;&nbsp;&nbsp;All Sizes</option>";
    for(var id in sizes) {
      out += "<option>"+sizes[id].size+"</option>";
    }
    out += `
            </select>
          </td>

          <td>
            <select multiple id='agency_id' onchange='w.library.load()'>`;
    selected = (w.get("last_agency_id")<1?"selected":"");
    out += "<option value='all' "+selected+">&nbsp;&nbsp;&nbsp;All Agencies</option>";
    for(var id in agencies) {
      selected = (w.get("last_agency_id")==id?"selected":"");
      out += "<option value='"+id+"' "+selected+">"+agencies[id].name+"</option>";
    }
    out += `
            </select>
          </td>

          <td>
            <select multiple id='advertiser_id' onchange='w.library.load()'>`;
    selected = (w.get("last_advertiser_id")<1?"selected":"");
    out += "<option value='all' "+selected+">&nbsp;&nbsp;&nbsp;All Advertisers</option>";
    for(var id in advertisers) {
      selected = (w.get("last_advertiser_id")==id?"selected":"");
      out += "<option value='"+id+"' "+selected+">"+advertisers[id].name+"</option>";
    }
    out += `
            </select>
          </td>

          <td>
            <select multiple id='user_id' onchange='w.library.load()'>`;
    selected = (w.get("last_user_id")<1?"selected":"");
    out += "<option value='all' "+selected+">&nbsp;&nbsp;&nbsp;All Users</option>";
    for(var id in users) {
      selected = (w.get("last_user_id")==id?"selected":"");
      out += "<option value='"+id+"' "+selected+">"+users[id].nickname+"</option>";
    }
    out += `
            </select>
          </td>

          <td>
            <select multiple id='status' onchange='w.library.load()'>
              <option value='1' selected>Status Active</option>
              <option value='0'>Status Hidden</option>
            </select>
          </td>

          <td>
            <select multiple id='quarters' onchange='w.library.load()'>`;
    selected = (!w.get("last_quarters")?"selected":"");
    out += "<option value='all' "+selected+">&nbsp;&nbsp;&nbsp;All Dates</option>";
    for(var id in quarters) {
      out += "<option>"+quarters[id].q+"</option>";
    }
    out += `
            </select>
          </td>

          <td>
            <button onclick="w.library.load()" style='color:white;height:37px;padding-top:6px' class="btn btn-primary"><i class="material-icons">search</i></button>
          </td>

          <td id='page_select_div'></td>

        </tr>
      </table>
      <div id='library_content'></div>
      <style>.filter_field{min-width:0}.filter_box{overflow:hidden}</style>
      `;    
    w.draw(out);

    $('select').jarvan_select_multiple({width:180});


    t.resize();
    window.onresize = function(){w.library.resize()};

    t.load();
  }
  t.resize = function() {
    var width = ($("#main_container").width()-270)/8;
    $(".filter_field").css("width",width);
  }

  t.load = function() {
    var data = {
      format_id: $("#format_id").val(),
      sizes: $("#sizes").val(),
      agency_id: $("#agency_id").val(),
      advertiser_id: $("#advertiser_id").val(),
      user_id: $("#user_id").val(),
      status: $("#status").val(),
      page: $("#page_select").val()
    }
    w.post_json("/library/get",data, function(d) { 

      t.set("page", d.page);
      t.set("pages", d.pages);
      t.set("creatives", d.creatives)
      t.load2();
    });
  }

  t.load2 = function () {
    var creatives = t.get("creatives");
    var formats = t.get("formats");
    var page = t.get("page");
    var pages = t.get("pages");
    var out = `
      <div id='table_container' style='overflow:auto;height:0;width:1000px;float:left'>
      <table class='sortable' style='width:calc(100% - 20px)'>
        <thead>
          <tr>
            <td style='width:40px' id='sortable_index'>Id</td>
            <td style='width:300px'>Agency / Advertiser</td>
            <td nowrap>Format</td>
            <td>Size</td>
            <td>Created</td>
            <td>By</td>
            <td>Impressions</td>
            <td>Clicks</td>
            <td>Status</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>`;
    if(Object.keys(creatives).length==0) {
      out += "<tr><td>&nbsp;<td></tr><tr><td></td><td colspan=4><b>No Creatives to show. Please check Filters.</b></td></tr>";
    }
    for(var id in creatives) {
      var c = creatives[id];
      out += `
        <tr class='`+(c.status==1?"":"hidden")+`'>
          <td>`+c.file_id+`</td>
          <td>`+c.agency_name+(c.agency_name!='-'&&c.advertiser_name!='-'?` / `:"")+c.advertiser_name+`</td>
          <td nowrap>`+formats[c.format_id].name+`</td>
          <td>`+c.size+`</td>
          <td>`+c.created_date+`</td>
          <td>`+c.nickname+`</td>
          <td>`+c.print_qty+`</td>
          <td>`+c.click_qty+`</td>
          <td nowrap class='last_column'><div>`+(c.status==1?"Active":"Hidden")+`</div></td>
          <td>
           <a href='javascript:w.library.toggle(`+id+`)'>`+(c.status==1?"Hide":"Show")+`</a>&nbsp;<a href='`+c.url+`'>DL</a>&nbsp;<a href="https://adzone.io/d/`+w.publisher_id + "_" + c.filename +`" target=_preview>PR</a></td>
        </tr>`;
    }

    out +=`</tbody></table></div>`;

    $("#library_content").html(out);
    $("#table_container").css("height", $(window).height()-150);
    w.sort_tables();
    $("#sortable_index").click().click();

    var page_select = "<select id='page_select' onchange='w.library.load()' style='width:130px'>";
    for(var i=1; i<=pages; i++) {
      var selected = (i-1==page?"selected":"");
      page_select +="<option value='"+(i-1)+"' "+selected+">"+(i==1?"Page ":"")+i+" of "+pages+"</option>";  
    }
    page_select +="</select>";

    //$("#page_select_div").html(page_select)
//    $("#page_select_div").html("<a href='javascript:w.library.metrics()'>Reload Metrics</a>")

  }

  t.toggle = function(id) {
    var creatives = t.get("creatives");
    var c = creatives[id];

    var data = {
      id: id,
      status: (c.status==1?0:1),
    }
    w.post_json("/library/set_status",data, function(d) { 
      t.load();
    });
   
  }

}
