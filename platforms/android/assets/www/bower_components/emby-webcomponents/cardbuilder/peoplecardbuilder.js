define(["imageLoader","itemShortcuts","connectionManager"],function(a,e,r){function d(a,e){var d="card "+(e.shape||"portrait")+"Card personCard";(e.block||e.rows)&&(d+=" block");for(var i="",n=0,s=e.serverId,o=r.getApiClient(s),c=0,l=a.length;l>c;c++){e.rows&&0==n&&(i+='<div class="cardColumn">');var v=a[c];i+=t(v,o,s,e,d),n++,e.rows&&n>=e.rows&&(n=0,i+="</div>")}return i}function i(a,e,r){return a.PrimaryImageTag?r.getScaledImageUrl(a.Id,{maxWidth:e,tag:a.PrimaryImageTag,type:"Primary"}):null}function t(a,e,r,d,t){t+=" itemAction scalableCard";var n=i(a,d.width,e),s="cardImageContainer";d.coverImage&&(s+=" coveredImage");var o=n?'<div class="'+s+' lazy" data-src="'+n+'">':'<div class="'+s+'">';n||(o+='<i class="md-icon cardImageIcon">person</i>');var c="";c+='<div class="cardText">'+a.Name+"</div>",c+=a.Role?'<div class="cardText cardText-secondary">as '+a.Role+"</div>":a.Type?'<div class="cardText cardText-secondary">'+Globalize.translate("core#"+a.Type)+"</div>":'<div class="cardText cardText-secondary">&nbsp;</div>';var l='<button type="button" data-isfolder="'+a.IsFolder+'" data-type="'+a.Type+'" data-action="link" data-id="'+a.Id+'" data-serverid="'+r+'" raised class="'+t+'"> <div class="visualCardBox cardBox"><div class="cardScalable"><div class="cardPadder"></div><div class="cardContent">'+o+'</div></div></div><div class="cardFooter">'+c+"</div></div></button>";return l}function n(r,i){if(i.parentContainer){if(!document.body.contains(i.parentContainer))return;if(!r.length)return void i.parentContainer.classList.add("hide");i.parentContainer.classList.remove("hide")}var t=d(r,i);i.itemsContainer.innerHTML=t,a.lazyChildren(i.itemsContainer),e.off(i.itemsContainer),e.on(i.itemsContainer)}return{buildPeopleCards:n}});