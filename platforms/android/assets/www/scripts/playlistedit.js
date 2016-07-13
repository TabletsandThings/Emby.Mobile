define(["appStorage","jQuery"],function(e,t){function r(){var e=a(),t=u[e];return t||(t=u[e]={query:{Fields:"PrimaryImageAspectRatio,SyncInfo",EnableImageTypes:"Primary,Backdrop,Banner,Thumb",StartIndex:0,Limit:200},view:LibraryBrowser.getSavedView(e)||LibraryBrowser.getDefaultItemsView("List","List")},t.query.ParentId=LibraryMenu.getTopParentId(),LibraryBrowser.loadSavedQueryValues(e,t.query)),t}function i(){return r().query}function a(){return LibraryBrowser.getSavedQueryKey()}function n(e,a){Dashboard.showLoadingMsg();var s=i();s.UserId=Dashboard.getCurrentUserId(),ApiClient.getJSON(ApiClient.getUrl("Playlists/"+a.Id+"/Items",s)).then(function(i){window.scrollTo(0,0);var l="";l+=LibraryBrowser.getQueryPagingHtml({startIndex:s.StartIndex,limit:s.Limit,totalRecordCount:i.TotalRecordCount,showLimit:!1,updatePageSizeSetting:!1});var d=r().view;"List"==d&&(l=LibraryBrowser.getListViewHtml({items:i.Items,sortBy:s.SortBy,showIndex:!1,showRemoveFromPlaylist:!0,playFromHere:!0,defaultAction:"playallfromhere",smallIcon:!0}));var u=e.querySelector("#childrenContent .itemsContainer");u.innerHTML=l;for(var y=[],g=u.querySelectorAll(".listItem"),c=0,m=g.length;m>c;c++)y.push(g[c]);var p=u.querySelector(".paperList");AppInfo.isTouchPreferred||require(["sortable"],function(t){new t(p,{draggable:".listItem",onEnd:function(t){o(t,e,a)}})}),ImageLoader.lazyChildren(u),LibraryBrowser.createCardMenus(u),t(".btnNextPage",u).on("click",function(){s.StartIndex+=s.Limit,n(e,a)}),t(".btnPreviousPage",u).on("click",function(){s.StartIndex-=s.Limit,n(e,a)}),Dashboard.hideLoadingMsg()})}function o(e,t,r){var i=e.item,a=e.newIndex,o=i.getAttribute("data-playlistitemid");Dashboard.showLoadingMsg(),ApiClient.ajax({url:ApiClient.getUrl("Playlists/"+r.Id+"/Items/"+o+"/Move/"+a),type:"POST"}).then(function(){i.setAttribute("data-index",a),Dashboard.hideLoadingMsg()},function(){Dashboard.hideLoadingMsg(),n(t,r)})}function s(e,t,r){ApiClient.ajax({url:ApiClient.getUrl("Playlists/"+t.Id+"/Items",{EntryIds:r.join(",")}),type:"DELETE"}).then(function(){n(e,t)})}function l(){if(!AppInfo.isTouchPreferred){var t="7";e.getItem("playlistitemdragdrophelp")!=t&&(e.setItem("playlistitemdragdrophelp",t),Dashboard.alert({message:Globalize.translate("TryDragAndDropMessage"),title:Globalize.translate("HeaderTryDragAndDrop")}))}}function d(e,t){var r=e.querySelector("#childrenContent .itemsContainer");r.addEventListener("removefromplaylist",function(r){var i=r.detail.playlistItemId;s(e,t,[i])}),r.addEventListener("needsrefresh",function(){n(e,t)})}var u={};window.PlaylistViewer={render:function(e,t){e.playlistInit||(e.playlistInit=!0,d(e,t)),n(e,t),l()}}});